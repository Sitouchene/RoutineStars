import bcrypt from 'bcryptjs';
import prisma from '../../config/database.js';
import { USER_ROLES } from 'shared/constants';

/**
 * Créer un profil enfant (par un parent)
 */
export async function createChild({ familyId, name, age, pin, avatar }) {
  const hashedPin = await bcrypt.hash(pin, 10);

  const child = await prisma.user.create({
    data: {
      familyId,
      role: USER_ROLES.CHILD,
      name,
      age,
      pin: hashedPin,
      avatar,
    },
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
      role: true,
      createdAt: true,
    },
  });

  return child;
}

/**
 * Récupérer tous les enfants d'une famille
 */
export async function getChildren(familyId) {
  const children = await prisma.user.findMany({
    where: {
      familyId,
      role: USER_ROLES.CHILD,
    },
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return children;
}

/**
 * Mettre à jour un enfant
 */
export async function updateChild(childId, familyId, updates) {
  // Vérifier que l'enfant appartient à la famille
  const child = await prisma.user.findFirst({
    where: {
      id: childId,
      familyId,
      role: USER_ROLES.CHILD,
    },
  });

  if (!child) {
    throw new Error('Enfant non trouvé');
  }

  const data = { ...updates };

  // Si le PIN est modifié, le hasher
  if (updates.pin) {
    data.pin = await bcrypt.hash(updates.pin, 10);
  }

  const updatedChild = await prisma.user.update({
    where: { id: childId },
    data,
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
    },
  });

  return updatedChild;
}

/**
 * Supprimer un enfant
 */
export async function deleteChild(childId, familyId) {
  const child = await prisma.user.findFirst({
    where: {
      id: childId,
      familyId,
      role: USER_ROLES.CHILD,
    },
  });

  if (!child) {
    throw new Error('Enfant non trouvé');
  }

  await prisma.user.delete({
    where: { id: childId },
  });

  return { message: 'Enfant supprimé avec succès' };
}

/**
 * Mettre à jour l'avatar d'un enfant
 */
export async function updateChildAvatar(childId, familyId, avatar) {
  const child = await prisma.user.findFirst({
    where: {
      id: childId,
      familyId,
      role: USER_ROLES.CHILD,
    },
  });

  if (!child) {
    throw new Error('Enfant non trouvé');
  }

  const updatedChild = await prisma.user.update({
    where: { id: childId },
    data: { avatar },
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
      role: true,
      updatedAt: true,
    },
  });

  return updatedChild;
}


