import prisma from '../../config/database.js';
import { generateUniqueGroupCode } from '../../../scripts/generate-group-code.js';

/**
 * Créer un nouveau groupe (famille ou classe)
 */
export async function createGroup({ type, name, language = 'fr' }) {
  const code = await generateUniqueGroupCode(prisma);
  
  const group = await prisma.group.create({
    data: {
      type,
      name,
      code,
      language,
    },
  });

  return group;
}

/**
 * Récupérer un groupe par son ID
 */
export async function getGroupById(groupId) {
  const group = await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      users: {
        where: { role: { in: ['parent', 'teacher'] } },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  return group;
}

/**
 * Récupérer un groupe par son code (pour la connexion enfant/élève)
 */
export async function getGroupByCode(code) {
  const group = await prisma.group.findUnique({
    where: { code },
    select: {
      id: true,
      type: true,
      name: true,
      language: true,
    },
  });

  return group;
}

/**
 * Récupérer les enfants/élèves d'un groupe (endpoint public pour la connexion)
 */
export async function getGroupChildren(groupId, groupType = 'family') {
  const childRole = groupType === 'classroom' ? 'student' : 'child';
  
  const children = await prisma.user.findMany({
    where: {
      groupId,
      role: childRole,
    },
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
      theme: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return children;
}

/**
 * Mettre à jour un groupe
 */
export async function updateGroup(groupId, updates) {
  const group = await prisma.group.update({
    where: { id: groupId },
    data: updates,
  });

  return group;
}

/**
 * Supprimer un groupe
 */
export async function deleteGroup(groupId) {
  await prisma.group.delete({
    where: { id: groupId },
  });

  return { message: 'Groupe supprimé avec succès' };
}

/**
 * Générer un nouveau code pour un groupe
 */
export async function regenerateGroupCode(groupId) {
  const newCode = await generateUniqueGroupCode(prisma);
  
  const group = await prisma.group.update({
    where: { id: groupId },
    data: { code: newCode },
  });

  return group;
}

/**
 * Vérifier si un code de groupe est disponible
 */
export async function isGroupCodeAvailable(code) {
  const existingGroup = await prisma.group.findUnique({
    where: { code },
  });
  
  return !existingGroup;
}
