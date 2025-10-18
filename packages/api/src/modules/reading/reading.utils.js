/**
 * Calcul des paliers de points de lecture (0%, 25%, 50%, 75%, 100%)
 * 
 * @param {number} currentPage - Page actuelle
 * @param {number} totalPages - Nombre total de pages
 * @param {number} totalPoints - Points totaux pour le livre
 * @returns {Object} - { milestone, currentPoints, nextMilestone, nextMilestonePoints }
 */
export function calculatePointsByMilestone(currentPage, totalPages, totalPoints) {
  if (totalPages === 0) {
    return {
      milestone: 0,
      currentPoints: 0,
      nextMilestone: 0,
      nextMilestonePoints: 0
    };
  }

  const percentage = (currentPage / totalPages) * 100;
  
  let milestone = 0;
  if (percentage >= 100) milestone = 100;
  else if (percentage >= 75) milestone = 75;
  else if (percentage >= 50) milestone = 50;
  else if (percentage >= 25) milestone = 25;
  
  // 4 paliers de 25% chacun
  const pointsPerMilestone = totalPoints / 4;
  const earnedMilestones = milestone / 25;
  
  return {
    milestone,
    currentPoints: Math.floor(earnedMilestones * pointsPerMilestone),
    nextMilestone: milestone < 100 ? milestone + 25 : 100,
    nextMilestonePoints: milestone < 100 ? Math.floor((earnedMilestones + 1) * pointsPerMilestone) : totalPoints
  };
}

/**
 * Calcule le pourcentage de progression
 * 
 * @param {number} currentPage - Page actuelle
 * @param {number} totalPages - Nombre total de pages
 * @returns {number} - Pourcentage (0-100)
 */
export function calculatePercentage(currentPage, totalPages) {
  if (totalPages === 0) return 0;
  return Math.min(100, Math.round((currentPage / totalPages) * 100));
}

/**
 * Calcule les pages restantes jusqu'au prochain palier
 * 
 * @param {number} currentPage - Page actuelle
 * @param {number} totalPages - Nombre total de pages
 * @param {number} currentMilestone - Palier actuel (0, 25, 50, 75)
 * @returns {number} - Nombre de pages restantes
 */
export function calculatePagesUntilNextMilestone(currentPage, totalPages, currentMilestone) {
  if (currentMilestone >= 100) return 0;
  
  const nextMilestone = currentMilestone + 25;
  const nextMilestonePages = Math.ceil((nextMilestone / 100) * totalPages);
  
  return Math.max(0, nextMilestonePages - currentPage);
}

