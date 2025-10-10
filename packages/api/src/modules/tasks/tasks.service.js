import prisma from '../../config/database.js';
import { TASK_CATEGORIES } from 'shared/constants';

/**
 * Créer un template de tâche
 */
export async function createTaskTemplate({ familyId, title, category, icon, points, recurrence, description }) {
  const taskTemplate = await prisma.taskTemplate.create({
    data: {
      familyId,
      title,
      category,
      icon,
      points,
      recurrence,
      description,
    },
  });

  return taskTemplate;
}

/**
 * Récupérer tous les templates de tâches d'une famille
 */
export async function getTaskTemplates(familyId) {
  const templates = await prisma.taskTemplate.findMany({
    where: { familyId },
    orderBy: { createdAt: 'desc' },
  });

  return templates;
}

/**
 * Mettre à jour un template de tâche
 */
export async function updateTaskTemplate(templateId, familyId, updates) {
  // Vérifier que le template appartient à la famille
  const template = await prisma.taskTemplate.findFirst({
    where: {
      id: templateId,
      familyId,
    },
  });

  if (!template) {
    throw new Error('Template de tâche non trouvé');
  }

  const updatedTemplate = await prisma.taskTemplate.update({
    where: { id: templateId },
    data: updates,
  });

  return updatedTemplate;
}

/**
 * Supprimer un template de tâche
 */
export async function deleteTaskTemplate(templateId, familyId) {
  const template = await prisma.taskTemplate.findFirst({
    where: {
      id: templateId,
      familyId,
    },
  });

  if (!template) {
    throw new Error('Template de tâche non trouvé');
  }

  await prisma.taskTemplate.delete({
    where: { id: templateId },
  });

  return { message: 'Template supprimé avec succès' };
}

/**
 * Générer les tâches quotidiennes pour un enfant
 */
export async function generateDailyTasks(childId, date) {
  const child = await prisma.user.findUnique({
    where: { id: childId },
    include: {
      family: {
        include: {
          taskTemplates: true,
        },
      },
    },
  });

  if (!child) {
    throw new Error('Enfant non trouvé');
  }

  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getDay(); // 0 = dimanche, 1 = lundi, etc.
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  // Filtrer les templates selon la récurrence
  const applicableTemplates = child.family.taskTemplates.filter(template => {
    switch (template.recurrence) {
      case 'daily':
        return true;
      case 'weekday':
        return !isWeekend;
      case 'weekend':
        return isWeekend;
      case 'monday':
        return dayOfWeek === 1;
      case 'tuesday':
        return dayOfWeek === 2;
      case 'wednesday':
        return dayOfWeek === 3;
      case 'thursday':
        return dayOfWeek === 4;
      case 'friday':
        return dayOfWeek === 5;
      case 'saturday':
        return dayOfWeek === 6;
      case 'sunday':
        return dayOfWeek === 0;
      default:
        return false;
    }
  });

  // Créer les tâches pour ce jour
  const tasks = [];
  for (const template of applicableTemplates) {
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

  return tasks;
}

/**
 * Récupérer les tâches d'un enfant pour une date
 */
export async function getChildTasks(childId, date) {
  const targetDate = new Date(date);
  
  // D'abord, vérifier s'il y a des tâches existantes
  let tasks = await prisma.task.findMany({
    where: {
      userId: childId,
      date: {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      },
    },
    include: {
      taskTemplate: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // Si aucune tâche n'existe, générer les tâches depuis les assignations
  if (tasks.length === 0) {
    // Importer la fonction depuis assignments
    const { generateDailyTasksFromAssignments } = await import('../assignments/assignments.service.js');
    const generatedTasks = await generateDailyTasksFromAssignments(childId, date);
    
    // Récupérer les tâches générées avec leurs templates
    tasks = await prisma.task.findMany({
      where: {
        userId: childId,
        date: {
          gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          lt: new Date(targetDate.setHours(23, 59, 59, 999)),
        },
      },
      include: {
        taskTemplate: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  return tasks;
}

/**
 * Autoévaluation d'une tâche par l'enfant
 */
export async function selfEvaluateTask(taskId, childId, score) {
  // Vérifier fenêtre horaire
  const { getWindow, isWithinWindow } = await import('../evalWindow/evalWindow.service.js');
  const child = await prisma.user.findUnique({ where: { id: childId } });
  const window = await getWindow(child.familyId, childId);
  if (!isWithinWindow(window)) {
    throw new Error("Autoévaluation indisponible en dehors de la fenêtre autorisée");
  }
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: childId,
    },
    include: {
      taskTemplate: true,
    },
  });

  if (!task) {
    throw new Error('Tâche non trouvée');
  }

  if (task.status === 'validated') {
    throw new Error('Cette tâche a déjà été validée par un parent');
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      selfScore: score,
      status: 'self_evaluated',
    },
    include: {
      taskTemplate: true,
    },
  });

  return updatedTask;
}

/**
 * Validation d'une tâche par un parent
 */
export async function validateTask(taskId, parentFamilyId, score, comment) {
  const task = await prisma.task.findFirst({
    where: { id: taskId },
    include: {
      taskTemplate: true,
      user: true,
    },
  });

  if (!task) {
    throw new Error('Tâche non trouvée');
  }

  // Vérifier que le parent appartient à la même famille
  if (task.user.familyId !== parentFamilyId) {
    throw new Error('Accès non autorisé');
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      parentScore: score,
      parentComment: comment,
      status: 'validated',
      lockedAt: new Date(),
    },
    include: {
      taskTemplate: true,
      user: true,
    },
  });

  return updatedTask;
}
