import prisma from '../../config/database.js';

/**
 * Soumettre la journée d'un enfant
 */
export async function submitDay(childId, date) {
  const targetDate = new Date(date);
  // Vérifier fenêtre horaire
  const { getWindow, isWithinWindow } = await import('../evalWindow/evalWindow.service.js');
  const child = await prisma.user.findUnique({ where: { id: childId } });
  const window = await getWindow(child.groupId, childId);
  if (!isWithinWindow(window)) {
    throw new Error('Soumission indisponible en dehors de la fenêtre autorisée');
  }
  
  // Vérifier que toutes les tâches sont autoévaluées
  const tasks = await prisma.task.findMany({
    where: {
      userId: childId,
      date: {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      },
    },
  });

  if (tasks.length === 0) {
    throw new Error('Aucune tâche trouvée pour cette date');
  }

  const unevaluatedTasks = tasks.filter(task => !task.selfScore && task.selfScore !== 0);
  if (unevaluatedTasks.length > 0) {
    throw new Error(`Vous devez vous autoévaluer sur ${unevaluatedTasks.length} tâche(s) avant de soumettre`);
  }

  // Vérifier si déjà soumis
  const existingSubmission = await prisma.daySubmission.findUnique({
    where: {
      childId_date: {
        childId,
        date: targetDate,
      },
    },
  });

  if (existingSubmission) {
    throw new Error('Cette journée a déjà été soumise');
  }

  // Créer la soumission
  const submission = await prisma.daySubmission.create({
    data: {
      childId,
      date: targetDate,
    },
    include: {
      child: {
        select: {
          id: true,
          name: true,
          age: true,
        },
      },
    },
  });

  // Verrouiller toutes les tâches de la journée (mettre lockedAt et changer le statut)
  await prisma.task.updateMany({
    where: {
      userId: childId,
      date: {
        gte: new Date(targetDate.setHours(0, 0, 0, 0)),
        lt: new Date(targetDate.setHours(23, 59, 59, 999)),
      },
    },
    data: {
      status: 'submitted',
      lockedAt: new Date(),
    },
  });

  return submission;
}

/**
 * Récupérer les soumissions d'un enfant
 */
export async function getChildSubmissions(childId, limit = 30) {
  const submissions = await prisma.daySubmission.findMany({
    where: { childId },
    orderBy: { date: 'desc' },
    take: limit,
    include: {
      child: {
        select: {
          id: true,
          name: true,
          age: true,
        },
      },
    },
  });

  return submissions;
}

/**
 * Récupérer les soumissions d'une famille (pour les parents)
 */
export async function getGroupSubmissions(groupId, limit = 30) {
  const submissions = await prisma.daySubmission.findMany({
    where: {
      child: {
        groupId,
      },
    },
    orderBy: { date: 'desc' },
    take: limit,
    include: {
      child: {
        select: {
          id: true,
          name: true,
          age: true,
        },
      },
    },
  });

  return submissions;
}

/**
 * Valider une soumission par un parent
 */
export async function validateSubmission(submissionId, groupId, parentComment) {
  // Vérifier que la soumission appartient à la famille
  const submission = await prisma.daySubmission.findFirst({
    where: {
      id: submissionId,
      child: {
        groupId,
      },
    },
  });

  if (!submission) {
    throw new Error('Soumission non trouvée');
  }

  if (submission.validatedAt) {
    throw new Error('Cette soumission a déjà été validée');
  }

  // Mettre à jour la soumission
  const updatedSubmission = await prisma.daySubmission.update({
    where: { id: submissionId },
    data: {
      validatedAt: new Date(),
      parentComment,
    },
    include: {
      child: {
        select: {
          id: true,
          name: true,
          age: true,
        },
      },
    },
  });

  return updatedSubmission;
}

/**
 * Récupérer les détails d'une soumission avec les tâches
 */
export async function getSubmissionDetails(submissionId, groupId) {
  const submission = await prisma.daySubmission.findFirst({
    where: {
      id: submissionId,
      child: {
        groupId,
      },
    },
    include: {
      child: {
        select: {
          id: true,
          name: true,
          age: true,
        },
      },
    },
  });

  if (!submission) {
    throw new Error('Soumission non trouvée');
  }

  // Récupérer les tâches de cette journée
  const tasks = await prisma.task.findMany({
    where: {
      userId: submission.childId,
      date: {
        gte: new Date(submission.date.setHours(0, 0, 0, 0)),
        lt: new Date(submission.date.setHours(23, 59, 59, 999)),
      },
    },
    include: {
      taskTemplate: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return {
    ...submission,
    tasks,
  };
}
