// Utilise le proxy Vite en dev pour éviter le CORS, sinon VITE_API_URL
const isDev = typeof window !== 'undefined' && window.location && !import.meta.env.PROD;
const API_URL = isDev ? '/api' : (import.meta.env.VITE_API_URL || '/api');

/**
 * Client API générique
 */
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      headers: options.headers,
      body: options.body
    });
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      console.log('API Response:', {
        url,
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      // Vérifier si la réponse a du contenu
      const contentType = response.headers.get('content-type');
      const hasJsonContent = contentType && contentType.includes('application/json');
      
      let data = null;
      if (hasJsonContent) {
        data = await response.json();
      } else if (response.status === 204) {
        // Pas de contenu pour les réponses 204
        data = { message: 'Opération réussie' };
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('API Error:', {
        url,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  patch(endpoint, body, options) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
}

export const apiClient = new ApiClient(API_URL);

// Services API
export const authApi = {
  registerParent: data => apiClient.post('/auth/parent/register', data),
  loginParent: data => apiClient.post('/auth/parent/login', data),
  loginChild: data => apiClient.post('/auth/child/login', data),
};

export const childrenApi = {
  getAll: headers => apiClient.get('/children', { headers }),
  create: (data, headers) => apiClient.post('/children', data, { headers }),
  update: (id, data, headers) =>
    apiClient.put(`/children/${id}`, data, { headers }),
  updateAvatar: (id, avatar, headers) =>
    apiClient.put(`/children/${id}/avatar`, { avatar }, { headers }),
  delete: (id, headers) => apiClient.delete(`/children/${id}`, { headers }),
  getDashboardStats: (childId, headers) =>
    apiClient.get(`/children/${childId}/dashboard-stats`, { headers }),
};

export const tasksApi = {
  // Templates de tâches
  getTemplates: headers => apiClient.get('/tasks/templates', { headers }),
  createTemplate: (data, headers) => apiClient.post('/tasks/templates', data, { headers }),
  updateTemplate: (id, data, headers) => apiClient.put(`/tasks/templates/${id}`, data, { headers }),
  deleteTemplate: (id, headers) => apiClient.delete(`/tasks/templates/${id}`, { headers }),
  
  // Génération de tâches
  generateDaily: (childId, date, headers) => 
    apiClient.post(`/tasks/generate-daily/${childId}`, { date }, { headers }),
  
  // Tâches d'enfant
  getChildTasks: (childId, date, headers) => 
    apiClient.get(`/tasks/child/${childId}?date=${date}`, { headers }),
  
  // Autoévaluation
  selfEvaluate: (taskId, score, headers) => 
    apiClient.post(`/tasks/${taskId}/self-evaluate`, { score }, { headers }),
  
  // Validation parent
  validate: (taskId, score, comment, headers) => 
    apiClient.post(`/tasks/${taskId}/validate`, { score, comment }, { headers }),
};

export const assignmentsApi = {
  // Assignations
  getAll: headers => apiClient.get('/assignments', { headers }),
  create: (data, headers) => apiClient.post('/assignments', data, { headers }),
  update: (id, data, headers) => apiClient.put(`/assignments/${id}`, data, { headers }),
  delete: (id, headers) => apiClient.delete(`/assignments/${id}`, { headers }),
  
  // Assignations du groupe (famille ou classe)
  getGroupAssignments: headers => apiClient.get('/assignments', { headers }),
  getFamilyAssignments: headers => apiClient.get('/assignments', { headers }), // Alias pour compatibilité
  
  // Assignations d'un enfant
  getChildAssignments: (childId, headers) => 
    apiClient.get(`/assignments/child/${childId}`, { headers }),
  
  // Génération de tâches quotidiennes
  generateDaily: (childId, date, headers) => 
    apiClient.post(`/assignments/generate-daily/${childId}`, { date }, { headers }),
};

export const submissionsApi = {
  // Soumission de journée (enfants)
  submitDay: (date, headers) => apiClient.post('/submissions/submit', { date }, { headers }),
  getChildSubmissions: headers => apiClient.get('/submissions/child', { headers }),
  
  // Validation parentale
  getGroupSubmissions: headers => apiClient.get('/submissions/group', { headers }),
  getFamilySubmissions: headers => apiClient.get('/submissions/group', { headers }), // Alias pour compatibilité
  validateSubmission: (submissionId, parentComment, headers) => 
    apiClient.post(`/submissions/${submissionId}/validate`, { parentComment }, { headers }),
  getSubmissionDetails: (submissionId, headers) => 
    apiClient.get(`/submissions/${submissionId}/details`, { headers }),
};

export const statsApi = {
  // Statistiques quotidiennes
  getChildDailyStats: (childId, date, headers) =>
    apiClient.get(`/stats/child/${childId}/daily/${date}`, { headers }),

  // Statistiques hebdomadaires
  getChildWeeklyStats: (childId, startDate, headers) =>
    apiClient.get(`/stats/child/${childId}/weekly/${startDate}`, { headers }),

  // Statistiques mensuelles
  getChildMonthlyStats: (childId, year, month, headers) =>
    apiClient.get(`/stats/child/${childId}/monthly/${year}/${month}`, { headers }),

  // Statistiques familiales
  getFamilyStats: (startDate, endDate, headers) =>
    apiClient.get(`/stats/family/${startDate}/${endDate}`, { headers }),
};

// Messages du jour
export const messagesApi = {
  list: (headers, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const suffix = qs ? `?${qs}` : '';
    return apiClient.get(`/messages${suffix}`, { headers });
  },
  getByDate: (headers, { childId, date }) => {
    const qs = new URLSearchParams({ childId, date }).toString();
    return apiClient.get(`/messages/by-date?${qs}`, { headers });
  },
  create: (data, headers) => apiClient.post('/messages', data, { headers }),
  update: (id, data, headers) => apiClient.put(`/messages/${id}`, data, { headers }),
  remove: (id, headers) => apiClient.delete(`/messages/${id}`, { headers }),
};

// Fenêtre d'autoévaluation
export const evalWindowApi = {
  get: (headers, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const suffix = qs ? `?${qs}` : '';
    return apiClient.get(`/eval-window${suffix}`, { headers });
  },
  upsert: (data, headers) => apiClient.put('/eval-window', data, { headers }),
};

// Catégories
export const categoriesApi = {
  // Récupérer toutes les catégories disponibles (communes + famille)
  getAll: (headers) => apiClient.get('/categories', { headers }),
  
  // Récupérer uniquement les catégories communes
  getCommon: (headers) => apiClient.get('/categories/common', { headers }),
  
  // Récupérer uniquement les catégories de la famille
  getFamily: (headers) => apiClient.get('/categories/family', { headers }),
  
  // Créer une nouvelle catégorie
  create: (data, headers) => apiClient.post('/categories', data, { headers }),
  
  // Mettre à jour une catégorie
  update: (id, data, headers) => apiClient.put(`/categories/${id}`, data, { headers }),
  
  // Supprimer une catégorie
  delete: (id, headers) => apiClient.delete(`/categories/${id}`, { headers }),
  
  // Activer/Désactiver une catégorie
  toggle: (id, isActive, headers) => apiClient.patch(`/categories/${id}/toggle`, { isActive }, { headers }),
};

// Livres
export const booksApi = {
  getAll: (headers, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const suffix = qs ? `?${qs}` : '';
    return apiClient.get(`/books${suffix}`, { headers });
  },
  getById: (id, headers) => apiClient.get(`/books/${id}`, { headers }),
  create: (data, headers) => apiClient.post('/books', data, { headers }),
  update: (id, data, headers) => apiClient.put(`/books/${id}`, data, { headers }),
  delete: (id, headers) => apiClient.delete(`/books/${id}`, { headers }),
  searchGoogle: (query, langRestrict, headers) => {
    const qs = new URLSearchParams({ q: query, langRestrict: langRestrict || 'fr' }).toString();
    return apiClient.get(`/books/search/google?${qs}`, { headers });
  },
  importGoogle: (googleBookId, groupId, headers) => 
    apiClient.post(`/books/import/google/${googleBookId}`, { groupId }, { headers }),
};

// Templates de livres
export const bookTemplatesApi = {
  getAll: (headers, filters = {}) => {
    const qs = new URLSearchParams(filters).toString();
    return apiClient.get(`/books/templates?${qs}`, { headers });
  },
  import: (templateId, headers) => 
    apiClient.post(`/books/templates/${templateId}/import`, {}, { headers }),
};

// Lectures
export const readingApi = {
  assign: (data, headers) => apiClient.post('/reading/assign', data, { headers }),
  getChildReadings: (childId, headers, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const suffix = qs ? `?${qs}` : '';
    return apiClient.get(`/reading/child/${childId}${suffix}`, { headers });
  },
  updateProgress: (id, currentPage, headers) => 
    apiClient.put(`/reading/${id}/progress`, { currentPage }, { headers }),
  finish: (id, headers) => apiClient.put(`/reading/${id}/finish`, {}, { headers }),
  getStats: (childId, headers) => apiClient.get(`/reading/child/${childId}/stats`, { headers }),
  getById: (id, headers) => apiClient.get(`/reading/${id}`, { headers }),
};

// Avis et likes
export const reviewsApi = {
  create: (data, headers) => apiClient.post('/reading/reviews', data, { headers }),
  update: (id, data, headers) => apiClient.put(`/reading/reviews/${id}`, data, { headers }),
  delete: (id, headers) => apiClient.delete(`/reading/reviews/${id}`, { headers }),
  getBookReviews: (bookId, headers, separate = false) => {
    const qs = new URLSearchParams({ separate }).toString();
    return apiClient.get(`/reading/books/${bookId}/reviews?${qs}`, { headers });
  },
  getBookReviewsWithStats: (bookId, headers) => apiClient.get(`/reading/books/${bookId}/reviews/stats`, { headers }),
  toggleLike: (bookId, headers) => apiClient.post('/reading/likes', { bookId }, { headers }),
};

// Groupes (statistiques dashboard et notifications)
export const groupsApi = {
  getDashboardStats: (groupId, headers) =>
    apiClient.get(`/groups/${groupId}/dashboard-stats`, { headers }),
  getNotifications: (groupId, headers, limit = 10) => {
    const qs = new URLSearchParams({ limit: limit.toString() }).toString();
    return apiClient.get(`/groups/${groupId}/notifications?${qs}`, { headers });
  },
};

// Badges
export const badgesApi = {
  getAllGlobal: () => apiClient.get('/badges/global'),
  getGroup: (groupId, headers) => apiClient.get(`/badges/group/${groupId}`, { headers }),
  importGlobal: (groupId, globalBadgeId, headers) => apiClient.post(`/badges/group/${groupId}/import`, { globalBadgeId }, { headers }),
  createCustom: (groupId, badgeData, headers) => apiClient.post(`/badges/group/${groupId}/custom`, badgeData, { headers }),
  update: (badgeId, updates, headers) => apiClient.put(`/badges/group/${badgeId}`, updates, { headers }),
  toggle: (badgeId, isEnabled, headers) => apiClient.patch(`/badges/group/${badgeId}/toggle`, { isEnabled }, { headers }),
  getUserBadges: (userId, headers) => apiClient.get(`/badges/user/${userId}`, { headers }),
  unlockManually: (userId, badgeId, headers) => apiClient.post(`/badges/user/${userId}/unlock/${badgeId}`, {}, { headers }),
  checkAndUnlock: (userId, headers) => apiClient.post(`/badges/user/${userId}/check-unlock`, {}, { headers }),
  getStats: (userId, headers) => apiClient.get(`/badges/user/${userId}/stats`, { headers }),
};

// Récompenses
export const rewardsApi = {
  getAllGlobal: () => apiClient.get('/rewards/global'),
  getGroup: (groupId, headers) => apiClient.get(`/rewards/group/${groupId}`, { headers }),
  importGlobal: (groupId, globalRewardId, headers) => apiClient.post(`/rewards/group/${groupId}/import`, { globalRewardId }, { headers }),
  createCustom: (groupId, rewardData, headers) => apiClient.post(`/rewards/group/${groupId}/custom`, rewardData, { headers }),
  update: (rewardId, updates, headers) => apiClient.put(`/rewards/group/${rewardId}`, updates, { headers }),
  toggle: (rewardId, isEnabled, headers) => apiClient.patch(`/rewards/group/${rewardId}/toggle`, { isEnabled }, { headers }),
  getUserRedemptions: (userId, headers) => apiClient.get(`/rewards/user/${userId}/redemptions`, { headers }),
  redeemReward: (userId, rewardId, childComment, headers) => 
    apiClient.post(`/rewards/user/${userId}/redeem`, { rewardId, childComment }, { headers }),
  getStats: (userId, headers) => apiClient.get(`/rewards/user/${userId}/stats`, { headers }),
  getPendingRedemptions: (groupId, headers) => apiClient.get(`/rewards/group/${groupId}/pending`, { headers }),
  updateRedemptionStatus: (redemptionId, status, parentComment, headers) =>
    apiClient.put(`/rewards/redemption/${redemptionId}/status`, { status, parentComment }, { headers }),
};

// Points
export const pointsApi = {
  getBalance: (userId, headers) => apiClient.get(`/points/user/${userId}/balance`, { headers }),
  getTransactions: (userId, headers, limit = 50) => {
    const qs = new URLSearchParams({ limit: limit.toString() }).toString();
    return apiClient.get(`/points/user/${userId}/transactions?${qs}`, { headers });
  },
  getStats: (userId, headers) => apiClient.get(`/points/user/${userId}/stats`, { headers }),
  addPoints: (userId, amount, description, source, sourceId, headers) =>
    apiClient.post(`/points/user/${userId}/add`, { amount, description, source, sourceId }, { headers }),
  spendPoints: (userId, amount, description, source, sourceId, headers) =>
    apiClient.post(`/points/user/${userId}/spend`, { amount, description, source, sourceId }, { headers }),
  addBonusPoints: (userId, amount, description, headers) =>
    apiClient.post(`/points/user/${userId}/bonus`, { amount, description }, { headers }),
};

// Quiz
export const quizApi = {
  getBookQuizzes: (bookId, headers) => apiClient.get(`/quiz/book/${bookId}`, { headers }),
  getTriggeredQuiz: (bookId, currentPage, headers) => apiClient.get(`/quiz/book/${bookId}/trigger/${currentPage}`, { headers }),
  submitAttempt: (quizId, score, timeSpent, headers) => apiClient.post(`/quiz/attempt`, { quizId, score, timeSpent }, { headers }),
  getUserAttempts: (userId, quizId, headers) => apiClient.get(`/quiz/user/${userId}/attempts/${quizId || ''}`, { headers }),
  getUserStats: (userId, headers) => apiClient.get(`/quiz/user/${userId}/stats`, { headers }),
  getAvailableQuizzes: (userId, headers) => apiClient.get(`/quiz/user/${userId}/available`, { headers }),
};



