import bcrypt from 'bcryptjs';
import prisma from '../../config/database.js';
import { generateToken } from '../../config/jwt.js';
import { USER_ROLES } from 'shared/constants';
import { createGroup } from '../groups/groups.service.js';

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

  // Créer le groupe et le parent en une transaction
  const result = await prisma.$transaction(async tx => {
    const group = await tx.group.create({
      data: { 
        type: 'family',
        name: `Famille de ${name}`,
        language: 'fr'
      },
    });

    const parent = await tx.user.create({
      data: {
        groupId: group.id,
        role: USER_ROLES.PARENT,
        name,
        email,
        password: hashedPassword,
      },
    });

    return { group, parent };
  });

  // Générer le token
  const token = generateToken({
    userId: result.parent.id,
    groupId: result.group.id,
    familyId: result.group.id, // Alias pour compatibilité
    role: USER_ROLES.PARENT,
  });

  return {
    token,
    user: {
      id: result.parent.id,
      name: result.parent.name,
      email: result.parent.email,
      role: result.parent.role,
      groupId: result.group.id,
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
    groupId: user.groupId,
    familyId: user.groupId, // Alias pour compatibilité
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupId: user.groupId,
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
    groupId: child.groupId,
    familyId: child.groupId, // Alias pour compatibilité
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
      groupId: child.groupId,
    },
  };
}

/**
 * Inscription d'un utilisateur (Parent/Enseignant) avec le nouveau modèle Group
 */
export async function registerUser({ email, password, name, groupId, role, language = 'fr', country = 'CA', grade = null }) {
  // Vérifier si l'email existe déjà
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error('Cet email est déjà utilisé');
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  let group;
  
  if (groupId) {
    // Rejoindre un groupe existant
    group = await prisma.group.findUnique({
      where: { id: groupId },
    });
    
    if (!group) {
      throw new Error('Groupe non trouvé');
    }
  } else {
    // Créer un nouveau groupe avec langue et pays
    const groupType = role === 'teacher' ? 'classroom' : 'family';
    const groupName = role === 'teacher' 
      ? (grade ? `Classe de ${name} - ${grade}` : `Classe de ${name}`)
      : `Famille de ${name}`;
      
    group = await createGroup({
      type: groupType,
      name: groupName,
      language,
      country
    });
  }

  // Créer l'utilisateur
  const user = await prisma.user.create({
    data: {
      groupId: group.id,
      role: role === 'teacher' ? 'teacher' : 'parent',
      name,
      email,
      password: hashedPassword,
    },
  });

  // Générer le token
  const token = generateToken({
    userId: user.id,
    groupId: group.id,
    familyId: group.id, // Pour compatibilité
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupId: group.id,
    },
    group: {
      id: group.id,
      type: group.type,
      name: group.name,
      code: group.code,
      language: group.language,
      country: group.country,
    },
  };
}

/**
 * Connexion d'un utilisateur (Parent/Enseignant) avec le nouveau modèle Group
 */
export async function loginUser({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      group: true,
    },
  });

  if (!user || !['parent', 'teacher'].includes(user.role)) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);

  if (!isValidPassword) {
    throw new Error('Email ou mot de passe incorrect');
  }

  const token = generateToken({
    userId: user.id,
    groupId: user.groupId,
    familyId: user.groupId, // Pour compatibilité
    role: user.role,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      groupId: user.groupId,
    },
    group: {
      id: user.group.id,
      type: user.group.type,
      name: user.group.name,
      code: user.group.code,
    },
  };
}


