import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore';

// Pages
import WelcomeScreen from './pages/WelcomeScreen';
import LoginScreen from './pages/LoginScreen';
import RegisterScreen from './pages/RegisterScreen';
import ChildLoginScreen from './pages/ChildLoginScreen';
import ParentDashboard from './pages/parent/Dashboard';
import ChildRouter from './pages/child/Router';

// Pages de test
import { OnboardingTestPage, TestsIndexPage, OnboardingTestPageV2 } from './pages/tests';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Écran de bienvenue */}
          <Route path="/" element={<WelcomeScreen />} />
          
          {/* Authentification Parent/Enseignant */}
          <Route path="/auth/login" element={<LoginScreen />} />
          <Route path="/auth/register" element={<RegisterScreen />} />
          
          {/* Authentification Enfant/Élève */}
          <Route path="/auth/child" element={<ChildLoginScreen />} />

          {/* Pages de test */}
        <Route path="/tests" element={<TestsIndexPage />} />
        <Route path="/tests/onboarding" element={<OnboardingTestPage />} />
        <Route path="/tests/onboarding-v2" element={<OnboardingTestPageV2 />} />

          {/* Routes protégées - Parent/Enseignant */}
          <Route
            path="/parent/*"
            element={
              isAuthenticated && (user?.role === 'parent' || user?.role === 'teacher') ? (
                <ParentDashboard />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Routes protégées - Enfant/Élève */}
          <Route
            path="/child/*"
            element={
              isAuthenticated && (user?.role === 'child' || user?.role === 'student') ? (
                <ChildRouter />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          {/* Redirection par défaut */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
