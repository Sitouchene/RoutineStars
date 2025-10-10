import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ParentDashboard from './pages/parent/Dashboard';
import ChildRouter from './pages/child/Router';

function App() {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes protégées */}
        <Route
          path="/parent/*"
          element={
            isAuthenticated && user?.role === 'parent' ? (
              <ParentDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/child/*"
          element={
            isAuthenticated && user?.role === 'child' ? (
              <ChildRouter />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Redirection par défaut */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              user?.role === 'parent' ? (
                <Navigate to="/parent" replace />
              ) : (
                <Navigate to="/child" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


