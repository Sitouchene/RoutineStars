import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        // Invalider le cache React Query lors de la déconnexion
        if (typeof window !== 'undefined' && window.queryClient) {
          window.queryClient.clear();
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      getAuthHeader: () => {
        const token = get().token;
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);


