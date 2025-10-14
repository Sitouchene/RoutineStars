import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useNavigationStore = create(
  persist(
    (set, get) => ({
      // État de navigation
      selectedLanguage: 'fr',
      selectedMode: null, // 'family' | 'classroom'
      selectedRole: null, // 'parent' | 'child' | 'teacher' | 'student'
      
      // Préférences utilisateur
      preferences: {
        language: 'fr',
        country: null,
        theme: 'default'
      },
      
      // Actions
      setLanguage: (language) => {
        set({ 
          selectedLanguage: language,
          preferences: { ...get().preferences, language }
        });
      },
      
      setMode: (mode) => {
        set({ selectedMode: mode });
      },
      
      setRole: (role) => {
        set({ selectedRole: role });
      },
      
      setPreferences: (preferences) => {
        set({ 
          preferences: { ...get().preferences, ...preferences }
        });
      },
      
      // Reset navigation state
      resetNavigation: () => {
        set({
          selectedMode: null,
          selectedRole: null
        });
      },
      
      // Get current context
      getCurrentContext: () => {
        const state = get();
        return {
          language: state.selectedLanguage,
          mode: state.selectedMode,
          role: state.selectedRole,
          preferences: state.preferences
        };
      },
      
      // Check if user can proceed to next step
      canProceedToRoleSelection: () => {
        const { selectedLanguage, selectedMode } = get();
        return selectedLanguage && selectedMode;
      },
      
      canProceedToAuth: () => {
        const { selectedLanguage, selectedMode, selectedRole } = get();
        return selectedLanguage && selectedMode && selectedRole;
      }
    }),
    {
      name: 'navigation-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        selectedLanguage: state.selectedLanguage
      })
    }
  )
);
