/**
 * Types JSDoc pour meilleure auto-complétion
 * (Peut être converti en TypeScript plus tard si besoin)
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} familyId
 * @property {'parent'|'child'} role
 * @property {string} name
 * @property {string} [email] - Uniquement pour parents
 * @property {number} [age] - Uniquement pour enfants
 * @property {string} [avatar]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Family
 * @property {string} id
 * @property {string} name
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} TaskTemplate
 * @property {string} id
 * @property {string} familyId
 * @property {string} title
 * @property {string} categoryId
 * @property {string} [icon]
 * @property {number} points
 * @property {'daily'|'weekday'|'weekend'|'monday'|'tuesday'|'wednesday'|'thursday'|'friday'|'saturday'|'sunday'|'weekly_days'|'every_n_days'} recurrence
 * @property {number[]} [recurrenceDays] - Pour 'weekly_days': tableau de jours 0-6
 * @property {string} [recurrenceStartDate] - Pour 'every_n_days': date ISO de départ
 * @property {number} [recurrenceInterval] - Pour 'every_n_days': intervalle en jours (ex: 2)
 * @property {string} [description]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} taskTemplateId
 * @property {string} userId - ID de l'enfant
 * @property {Date} date
 * @property {'assigned'|'self_evaluated'|'validated'} status
 * @property {number} [selfScore] - 0-100
 * @property {number} [parentScore] - 0-100
 * @property {string} [parentComment]
 * @property {Date} [lockedAt]
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string|null} familyId - null pour catégories système
 * @property {string} title - identifiant technique (ex: 'study')
 * @property {string} display - label lisible (ex: 'Études')
 * @property {string} [description]
 * @property {string} [icon]
 * @property {boolean} isSystem
 * @property {boolean} isActive
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * @typedef {Object} Reward
 * @property {string} id
 * @property {string} userId
 * @property {string} badgeType
 * @property {Date} earnedAt
 */

export {};


