import bcrypt from 'bcryptjs';
import prisma from '../../config/database.js';
import { generateToken } from '../../config/jwt.js';
import { USER_ROLES } from 'shared/constants';

/**
 * Inscription d'un parent (crée aussi une famille)
 */
export async function registerParent({ email, password, name }) {
  // Vérifier si l'email existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Cet email est déjà utilisé');
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Créer la famille et le parent en une transaction
  const result = await prisma.$transaction(async tx => {
    const family = await tx.family.create({
      data: { name: `Famille de ${name}` },
    });

    const parent = await tx.user.create({
      data: {
        familyId: family.id,
        role: USER_ROLES.PARENT,
        name,
        email,
        password: hashedPassword,
      },
    });

    return { family, parent };
  });

  // Générer le token
  const token = generateToken({
    userId: result.parent.id,
    familyId: result.family.id,
    role: USER_ROLES.PARENT,
  });

  return {
    token,
    user: {
      id: result.parent.id,
      name: result.parent.name,
      email: result.parent.email,
      role: result.parent.role,
      familyId: result.family.id,
    },
  };
}

/**
 * Connexion parent
 */
export async function loginParent({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.role !== USER_ROLES.PARENT) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const token = generateToken({
    userId: user.id,
    familyId: user.familyId,
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      familyId: user.familyId,
    },
  };
}

/**
 * Connexion enfant avec PIN
 */
export async function loginChild({ childId, pin }) {
  const child = await prisma.user.findUnique({
    where: { id: childId },
  });

  if (!child || child.role !== USER_ROLES.CHILD) {
    throw new Error('Enfant non trouvé');
  }

  const isValidPin = await bcrypt.compare(pin, child.pin);

  if (!isValidPin) {
    throw new Error('Code PIN incorrect');
  }

  const token = generateToken({
    userId: child.id,
    familyId: child.familyId,
    role: child.role,
  });

  return {
    token,
    user: {
      id: child.id,
      name: child.name,
      age: child.age,
      avatar: child.avatar,
      role: child.role,
      familyId: child.familyId,
    },
  };
}


