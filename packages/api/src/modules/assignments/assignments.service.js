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
  recurrence,
  recurrenceDays,
  recurrenceStartDate,
  recurrenceInterval,
}) {
  const assignment = await prisma.taskAssignment.create({
    data: {
      taskTemplateId,
      childId,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      isActive,
      recurrence: recurrence || null,
      recurrenceDays: Array.isArray(recurrenceDays)
        ? recurrenceDays.join(',')
        : recurrenceDays || null,
      recurrenceStartDate: recurrenceStartDate
        ? new Date(recurrenceStartDate)
        : null,
      recurrenceInterval: recurrenceInterval || null,
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
export async function getGroupAssignments(groupId) {
  const assignments = await prisma.taskAssignment.findMany({
    where: {
      child: {
        groupId,
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
export async function updateTaskAssignment(assignmentId, groupId, updates) {
  // Vérifier que l'assignation appartient à la famille
  const assignment = await prisma.taskAssignment.findFirst({
    where: {
      id: assignmentId,
      child: {
        groupId,
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
      recurrence: updates.recurrence ?? undefined,
      recurrenceDays: Array.isArray(updates.recurrenceDays)
        ? updates.recurrenceDays.join(',')
        : updates.recurrenceDays ?? undefined,
      recurrenceStartDate: updates.recurrenceStartDate
        ? new Date(updates.recurrenceStartDate)
        : undefined,
      recurrenceInterval: updates.recurrenceInterval ?? undefined,
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
export async function deleteTaskAssignment(assignmentId, groupId) {
  const assignment = await prisma.taskAssignment.findFirst({
    where: {
      id: assignmentId,
      child: {
        groupId,
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

    // Récurrence effective: récurrence de l'assignation si définie, sinon celle du template
    const effectiveRecurrence = assignment.recurrence || template.recurrence;
    switch (effectiveRecurrence) {
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
      case 'weekly_days': {
        const daysCsv = assignment.recurrenceDays || '';
        const days = daysCsv
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
          .map((n) => parseInt(n, 10));
        shouldCreate = days.includes(dayOfWeek);
        break;
      }
      case 'every_n_days': {
        if (assignment.recurrenceStartDate && assignment.recurrenceInterval) {
          const start = new Date(assignment.recurrenceStartDate);
          const diffDays = Math.floor(
            (new Date(targetDate.toDateString()).getTime() - new Date(start.toDateString()).getTime()) / (1000 * 60 * 60 * 24)
          );
          shouldCreate = diffDays >= 0 && diffDays % assignment.recurrenceInterval === 0;
        } else {
          shouldCreate = false;
        }
        break;
      }
      default:
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
