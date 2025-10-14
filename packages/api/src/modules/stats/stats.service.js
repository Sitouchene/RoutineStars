import prisma from '../../config/database.js';

/**
 * Récupérer les statistiques d'un enfant pour une date donnée
 */
function formatUTCDate(d) {
  const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  return utc.toISOString().split('T')[0];
}

export async function getChildDailyStats(childId, date) {
  const targetDate = new Date(date);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const tasks = await prisma.task.findMany({
    where: {
      userId: childId,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: 'validated', // Seulement les tâches validées par le parent
    },
    include: {
      taskTemplate: true,
    },
  });

  // Calculer les statistiques
  const totalPoints = tasks.reduce((sum, task) => sum + (task.taskTemplate?.points || task.points || 0), 0);
  const earnedPoints = tasks.reduce((sum, task) => {
    const points = task.taskTemplate?.points || task.points || 0;
    const score = task.parentScore !== null ? task.parentScore : task.selfScore;
    return sum + (points * (score || 0) / 100);
  }, 0);

  const completionRate = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return {
    date: formatUTCDate(new Date(startOfDay)),
    totalTasks: tasks.length,
    totalPoints,
    earnedPoints: Math.round(earnedPoints * 100) / 100, // Arrondir à 2 décimales
    completionRate,
    tasks: tasks.map(task => ({
      id: task.id,
      title: task.taskTemplate?.title || task.title,
      category: task.taskTemplate?.category || task.category,
      points: task.taskTemplate?.points || task.points,
      score: task.parentScore !== null ? task.parentScore : task.selfScore,
      earnedPoints: Math.round(((task.taskTemplate?.points || task.points || 0) * (task.parentScore !== null ? task.parentScore : task.selfScore || 0) / 100) * 100) / 100,
    })),
  };
}

/**
 * Récupérer les statistiques hebdomadaires d'un enfant
 */
export async function getChildWeeklyStats(childId, startDate) {
  // Parser le startDate (YYYY-MM-DD) en UTC pour éviter les décalages
  const [sy, sm, sd] = startDate.split('-').map(Number);
  const startOfWeek = new Date(Date.UTC(sy, sm - 1, sd));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const dailyStats = [];
  let totalWeekPoints = 0;
  let totalWeekEarnedPoints = 0;

  // Récupérer les stats pour chaque jour de la semaine
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startOfWeek);
    currentDate.setUTCDate(startOfWeek.getUTCDate() + i);
    
    const dayStats = await getChildDailyStats(childId, formatUTCDate(currentDate));
    dailyStats.push(dayStats);
    
    totalWeekPoints += dayStats.totalPoints;
    totalWeekEarnedPoints += dayStats.earnedPoints;
  }

  const weeklyCompletionRate = totalWeekPoints > 0 ? Math.round((totalWeekEarnedPoints / totalWeekPoints) * 100) : 0;

  return {
    startDate: formatUTCDate(startOfWeek),
    endDate: formatUTCDate(endOfWeek),
    totalWeekPoints: Math.round(totalWeekPoints * 100) / 100,
    totalWeekEarnedPoints: Math.round(totalWeekEarnedPoints * 100) / 100,
    weeklyCompletionRate,
    dailyStats,
  };
}

/**
 * Récupérer les statistiques mensuelles d'un enfant
 */
export async function getChildMonthlyStats(childId, year, month) {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const tasks = await prisma.task.findMany({
    where: {
      userId: childId,
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 'validated', // Seulement les tâches validées par le parent
    },
    include: {
      taskTemplate: true,
    },
  });

  // Grouper par jour
  const dailyStats = {};
  tasks.forEach(task => {
    const dateKey = new Date(task.date).toISOString().split('T')[0];
    if (!dailyStats[dateKey]) {
      dailyStats[dateKey] = {
        date: dateKey,
        totalPoints: 0,
        earnedPoints: 0,
        tasks: [],
      };
    }

    const points = task.taskTemplate?.points || task.points || 0;
    const score = task.parentScore !== null ? task.parentScore : task.selfScore;
    const earnedPoints = points * (score || 0) / 100;

    dailyStats[dateKey].totalPoints += points;
    dailyStats[dateKey].earnedPoints += earnedPoints;
    dailyStats[dateKey].tasks.push({
      id: task.id,
      title: task.taskTemplate?.title || task.title,
      points,
      score,
      earnedPoints: Math.round(earnedPoints * 100) / 100,
    });
  });

  // Calculer les taux de completion pour chaque jour
  Object.values(dailyStats).forEach(day => {
    day.completionRate = day.totalPoints > 0 ? Math.round((day.earnedPoints / day.totalPoints) * 100) : 0;
    day.earnedPoints = Math.round(day.earnedPoints * 100) / 100;
  });

  // Calculer les totaux mensuels
  const totalMonthPoints = Object.values(dailyStats).reduce((sum, day) => sum + day.totalPoints, 0);
  const totalMonthEarnedPoints = Object.values(dailyStats).reduce((sum, day) => sum + day.earnedPoints, 0);
  const monthlyCompletionRate = totalMonthPoints > 0 ? Math.round((totalMonthEarnedPoints / totalMonthPoints) * 100) : 0;

  return {
    year,
    month,
    totalMonthPoints: Math.round(totalMonthPoints * 100) / 100,
    totalMonthEarnedPoints: Math.round(totalMonthEarnedPoints * 100) / 100,
    monthlyCompletionRate,
    dailyStats,
  };
}

/**
 * Récupérer les statistiques de tous les enfants d'une famille pour une période
 */
export async function getGroupStats(groupId, startDate, endDate) {
  const children = await prisma.user.findMany({
    where: {
      groupId,
      role: 'child',
    },
    select: {
      id: true,
      name: true,
      age: true,
    },
  });

  const familyStats = await Promise.all(
    children.map(async child => {
      const tasks = await prisma.task.findMany({
        where: {
          userId: child.id,
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
          status: 'validated', // Seulement les tâches validées par le parent
        },
        include: {
          taskTemplate: true,
        },
      });

      const totalPoints = tasks.reduce((sum, task) => sum + (task.taskTemplate?.points || task.points || 0), 0);
      const earnedPoints = tasks.reduce((sum, task) => {
        const points = task.taskTemplate?.points || task.points || 0;
        const score = task.parentScore !== null ? task.parentScore : task.selfScore;
        return sum + (points * (score || 0) / 100);
      }, 0);

      const completionRate = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

      return {
        childId: child.id,
        childName: child.name,
        childAge: child.age,
        totalTasks: tasks.length,
        totalPoints: Math.round(totalPoints * 100) / 100,
        earnedPoints: Math.round(earnedPoints * 100) / 100,
        completionRate,
      };
    })
  );

  return familyStats;
}
