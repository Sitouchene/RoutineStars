import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      group: null, // Informations du groupe (famille/classe)

      login: (token, user, group = null) => {
        set({ user, token, isAuthenticated: true, group });
      },

      logout: () => {
        // Invalider le cache React Query lors de la déconnexion
        if (typeof window !== 'undefined' && window.queryClient) {
          window.queryClient.clear();
        }
        set({ user: null, token: null, isAuthenticated: false, group: null });
      },

      getAuthHeader: () => {
        const token = get().token;
        return token ? { Authorization: `Bearer ${token}` } : {};
      },

      // Méthodes pour les nouveaux rôles et modes
      isParent: () => {
        const user = get().user;
        return user?.role === 'parent';
      },

      isChild: () => {
        const user = get().user;
        return user?.role === 'child';
      },

      isTeacher: () => {
        const user = get().user;
        return user?.role === 'teacher';
      },

      isStudent: () => {
        const user = get().user;
        return user?.role === 'student';
      },

      isFamilyMode: () => {
        const group = get().group;
        return group?.type === 'family';
      },

      isClassroomMode: () => {
        const group = get().group;
        return group?.type === 'classroom';
      },

      // Obtenir le mode d'utilisation actuel
      getCurrentMode: () => {
        const group = get().group;
        return group?.type || 'family'; // Par défaut family
      },

      // Obtenir le rôle actuel
      getCurrentRole: () => {
        const user = get().user;
        return user?.role;
      },

      // Vérifier si l'utilisateur peut accéder à une route
      canAccessRoute: (requiredRole, requiredMode = null) => {
        const user = get().user;
        const group = get().group;
        
        if (!user) return false;
        
        const roleMatch = user.role === requiredRole;
        const modeMatch = !requiredMode || group?.type === requiredMode;
        
        return roleMatch && modeMatch;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);


