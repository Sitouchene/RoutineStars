import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const categoriesService = {
  // Récupérer toutes les catégories disponibles pour un groupe (actives et inactives)
  async getCategoriesByGroup(groupId) {
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { isSystem: true }, // Catégories système
          { groupId: groupId, isSystem: false } // Catégories personnalisées du groupe
        ]
        // Suppression du filtre isActive: true pour récupérer toutes les catégories
      },
      orderBy: [
        { isSystem: 'desc' }, // Catégories système en premier
        { isActive: 'desc' }, // Catégories actives en premier
        { display: 'asc' }
      ]
    });

    return categories;
  },

  // Récupérer uniquement les catégories système (actives et inactives)
  async getSystemCategories() {
    return await prisma.category.findMany({
      where: {
        isSystem: true
        // Suppression du filtre isActive: true
      },
      orderBy: [
        { isActive: 'desc' }, // Catégories actives en premier
        { display: 'asc' }
      ]
    });
  },

  // Récupérer uniquement les catégories personnalisées d'un groupe (actives et inactives)
  async getGroupCategories(groupId) {
    return await prisma.category.findMany({
      where: {
        groupId: groupId,
        isSystem: false
        // Suppression du filtre isActive: true
      },
      orderBy: [
        { isActive: 'desc' }, // Catégories actives en premier
        { display: 'asc' }
      ]
    });
  },

  // Créer une nouvelle catégorie
  async createCategory(groupId, categoryData) {
    // Vérifier que le titre n'existe pas déjà dans ce groupe
    const existingCategory = await prisma.category.findFirst({
      where: {
        groupId: groupId,
        title: categoryData.title
      }
    });

    if (existingCategory) {
      throw new Error('Une catégorie avec ce titre existe déjà dans ce groupe');
    }

    return await prisma.category.create({
      data: {
        ...categoryData,
        groupId: groupId, // Obligatoire pour les catégories personnalisées
        isSystem: false // Toujours false pour les catégories créées par les groupes
      }
    });
  },

  // Mettre à jour une catégorie
  async updateCategory(categoryId, groupId, updateData) {
    // Vérifier que la catégorie appartient à la famille et n'est pas système
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        groupId: groupId,
        isSystem: false // Seules les catégories personnalisées peuvent être modifiées
      }
    });

    if (!category) {
      throw new Error('Catégorie non trouvée ou non autorisée (catégories système protégées)');
    }

    // Si on change le titre, vérifier qu'il n'existe pas déjà dans ce groupe
    if (updateData.title && updateData.title !== category.title) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          groupId: groupId,
          title: updateData.title,
          id: { not: categoryId }
        }
      });

      if (existingCategory) {
        throw new Error('Une catégorie avec ce titre existe déjà dans ce groupe');
      }
    }

    return await prisma.category.update({
      where: { id: categoryId },
      data: updateData
    });
  },

  // Supprimer une catégorie
  async deleteCategory(categoryId, groupId) {
    // Vérifier que la catégorie appartient à la famille et n'est pas système
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        groupId: groupId,
        isSystem: false // Seules les catégories personnalisées peuvent être supprimées
      }
    });

    if (!category) {
      throw new Error('Catégorie non trouvée ou non autorisée (catégories système protégées)');
    }

    // Vérifier qu'aucune tâche n'utilise cette catégorie
    const taskTemplatesCount = await prisma.taskTemplate.count({
      where: { categoryId: categoryId }
    });

    if (taskTemplatesCount > 0) {
      throw new Error('Impossible de supprimer cette catégorie car elle est utilisée par des tâches');
    }

    return await prisma.category.delete({
      where: { id: categoryId }
    });
  },

  // Vérifier si une catégorie peut être désactivée (pas de tâches actives)
  async canDeactivateCategory(categoryId, groupId) {
    // Vérifier que la catégorie appartient à la famille ou est une catégorie système
    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        OR: [
          { isSystem: true }, // Catégories système
          { groupId: groupId, isSystem: false } // Catégories personnalisées de la famille
        ]
      }
    });

    if (!category) {
      throw new Error('Catégorie non trouvée ou non autorisée');
    }

    // Compter les tâches actives dans cette catégorie
    const activeTasksCount = await prisma.taskTemplate.count({
      where: {
        categoryId: categoryId,
        groupId: groupId
      }
    });

    return {
      canDeactivate: activeTasksCount === 0,
      activeTasksCount,
      categoryName: category.display
    };
  },

  // Désactiver/Activer une catégorie
  async toggleCategoryStatus(categoryId, groupId, isActive) {
    console.log('Toggle category request:', {
      categoryId,
      groupId,
      body: { isActive }
    });

    // Si on essaie de désactiver, vérifier qu'il n'y a pas de tâches actives
    if (!isActive) {
      const canDeactivate = await this.canDeactivateCategory(categoryId, groupId);
      if (!canDeactivate.canDeactivate) {
        throw new Error(`Impossible de désactiver la catégorie "${canDeactivate.categoryName}" car elle contient ${canDeactivate.activeTasksCount} tâche(s) active(s). Supprimez d'abord les tâches ou désactivez-les.`);
      }
    }

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        groupId: groupId,
        isSystem: false // Seules les catégories personnalisées peuvent être modifiées
      }
    });

    if (!category) {
      throw new Error('Catégorie non trouvée ou non autorisée (catégories système protégées)');
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { isActive: isActive }
    });

    console.log('Toggle category result:', updatedCategory);
    return updatedCategory;
  }
};
