const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Client API générique
 */
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
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
  delete: (id, headers) => apiClient.delete(`/children/${id}`, { headers }),
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
  getFamilySubmissions: headers => apiClient.get('/submissions/family', { headers }),
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


