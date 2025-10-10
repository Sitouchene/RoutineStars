import prisma from '../../config/database.js';

/**
 * Récupérer les enfants d'une famille (endpoint public pour la connexion enfant)
 */
export async function getFamilyChildren(familyId) {
  const children = await prisma.user.findMany({
    where: {
      familyId,
      role: 'child',
    },
    select: {
      id: true,
      name: true,
      age: true,
      avatar: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return children;
}
