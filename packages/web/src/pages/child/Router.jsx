import { Routes, Route, Navigate } from 'react-router-dom';
import ChildDashboard from './Dashboard';
import ChildStatsPage from './StatsPage';

export default function ChildRouter() {
  return (
    <Routes>
      <Route path="/" element={<ChildDashboard />} />
      <Route path="/stats" element={<ChildStatsPage />} />
      <Route path="*" element={<Navigate to="/child" replace />} />
    </Routes>
  );
}
