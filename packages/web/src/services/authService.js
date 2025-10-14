import { apiClient } from '../lib/api-client';

export const authService = {
  // Authentification complète (Parent/Enseignant)
  async loginWithCredentials(email, password) {
    try {
      console.log('🌐 Making API call to /auth/login');
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      
      console.log('📡 API response:', response);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('🚨 API error:', error);
      console.error('🚨 Error response:', error.response);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur de connexion'
      };
    }
  },

  // Authentification simplifiée (Enfant/Élève)
  async loginWithPin(childId, pin) {
    try {
      const response = await apiClient.post('/auth/login-child', {
        childId,
        pin
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Code PIN incorrect'
      };
    }
  },

  // Vérifier un code de groupe
  async checkGroupCode(code) {
    try {
      const response = await apiClient.post('/groups/check-code', {
        code
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Code de groupe invalide'
      };
    }
  },

  // Récupérer les informations d'un groupe par code
  async getGroupByCode(code) {
    try {
      const response = await apiClient.get(`/groups/code/${code}`);
      return response; // Retourne directement les données du groupe
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Groupe non trouvé');
    }
  },

  // Créer un nouveau groupe
  async createGroup(type, name, language = 'fr') {
    try {
      const response = await apiClient.post('/groups', {
        type,
        name,
        language
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la création du groupe'
      };
    }
  },

  // Récupérer les enfants/élèves d'un groupe
  async getGroupChildren(groupId, type) {
    try {
      const response = await apiClient.get(`/groups/${groupId}/children?type=${type}`);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la récupération des membres'
      };
    }
  },

  // Inscription d'un nouveau parent/enseignant
  async registerParent(email, password, name, groupId = null, language = 'fr', country = 'CA', grade = null) {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        name,
        groupId,
        role: 'parent',
        language,
        country,
        grade
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de l\'inscription'
      };
    }
  },

  // Inscription d'un nouvel enseignant
  async registerTeacher(email, password, name, groupId = null, language = 'fr', country = 'CA', grade = null) {
    try {
      const response = await apiClient.post('/auth/register', {
        email,
        password,
        name,
        groupId,
        role: 'teacher',
        language,
        country,
        grade
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de l\'inscription'
      };
    }
  },

  // Inscription d'un nouvel enfant/élève
  async registerChild(name, age, pin, groupId, theme = 'default') {
    try {
      const response = await apiClient.post('/auth/register-child', {
        name,
        age,
        pin,
        groupId,
        theme,
        role: 'child'
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de l\'inscription'
      };
    }
  }
};
