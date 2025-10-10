import prisma from '../../config/database.js';

/**
 * Modèle d'assignation de tâche à un enfant
 */
export async function createTaskAssignment({
  taskTemplateId,
  childId,
  startDate,
  endDate,
  isActive,
}) {
  const assignment = await prisma.taskAssignment.create({
    data: {
      taskTemplateId,
      childId,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      isActive,
    },
  });

  return assignment;
}

/**
 * Récupérer les assignations d'un enfant
 */
export async function getChildAssignments(childId) {
  const assignments = await prisma.taskAssignment.findMany({
    where: { childId },
    include: {
      taskTemplate: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return assignments;
}

/**
 * Récupérer les assignations d'une famille (pour les parents)
 */
export async function getFamilyAssignments(familyId) {
  const assignments = await prisma.taskAssignment.findMany({
    where: {
      child: {
        familyId,
      },
    },
    include: {
      taskTemplate: true,
      child: {
        select: {
          id: true,
          name: true,
          age: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return assignments;
}

/**
 * Mettre à jour une assignation
 */
export async function updateTaskAssignment(assignmentId, familyId, updates) {
  // Vérifier que l'assignation appartient à la famille
  const assignment = await prisma.taskAssignment.findFirst({
    where: {
      id: assignmentId,
      child: {
        familyId,
      },
    },
  });

  if (!assignment) {
    throw new Error('Assignation non trouvée');
  }

  const updatedAssignment = await prisma.taskAssignment.update({
    where: { id: assignmentId },
    data: {
      ...updates,
      startDate: updates.startDate ? new Date(updates.startDate) : undefined,
      endDate: updates.endDate ? new Date(updates.endDate) : undefined,
    },
    include: {
      taskTemplate: true,
      child: {
        select: {
          id: true,
          name: true,
          age: true,
        },
      },
    },
  });

  return updatedAssignment;
}

/**
 * Supprimer une assignation
 */
export async function deleteTaskAssignment(assignmentId, familyId) {
  const assignment = await prisma.taskAssignment.findFirst({
    where: {
      id: assignmentId,
      child: {
        familyId,
      },
    },
  });

  if (!assignment) {
    throw new Error('Assignation non trouvée');
  }

  await prisma.taskAssignment.delete({
    where: { id: assignmentId },
  });

  return { message: 'Assignation supprimée avec succès' };
}

/**
 * Générer les tâches quotidiennes basées sur les assignations actives
 */
export async function generateDailyTasksFromAssignments(childId, date) {
  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Récupérer les assignations actives pour cet enfant
  const activeAssignments = await prisma.taskAssignment.findMany({
    where: {
      childId,
      isActive: true,
      startDate: {
        lte: targetDate,
      },
      OR: [
        { endDate: null },
        { endDate: { gte: targetDate } },
      ],
    },
    include: {
      taskTemplate: true,
    },
  });

  // Filtrer selon la récurrence et créer les tâches
  const tasks = [];
  for (const assignment of activeAssignments) {
    const template = assignment.taskTemplate;
    let shouldCreate = false;

    // Vérifier la récurrence
    switch (template.recurrence) {
      case 'daily':
        shouldCreate = true;
        break;
      case 'weekday':
        shouldCreate = !isWeekend;
        break;
      case 'weekend':
        shouldCreate = isWeekend;
        break;
      case 'monday':
        shouldCreate = dayOfWeek === 1;
        break;
      case 'tuesday':
        shouldCreate = dayOfWeek === 2;
        break;
      case 'wednesday':
        shouldCreate = dayOfWeek === 3;
        break;
      case 'thursday':
        shouldCreate = dayOfWeek === 4;
        break;
      case 'friday':
        shouldCreate = dayOfWeek === 5;
        break;
      case 'saturday':
        shouldCreate = dayOfWeek === 6;
        break;
      case 'sunday':
        shouldCreate = dayOfWeek === 0;
        break;
    }

    if (shouldCreate) {
      // Vérifier si la tâche n'existe pas déjà
      const existingTask = await prisma.task.findUnique({
        where: {
          userId_taskTemplateId_date: {
            userId: childId,
            taskTemplateId: template.id,
            date: targetDate,
          },
        },
      });

      if (!existingTask) {
        const task = await prisma.task.create({
          data: {
            taskTemplateId: template.id,
            userId: childId,
            date: targetDate,
            status: 'assigned',
          },
        });
        tasks.push(task);
      }
    }
  }

  return tasks;
}
