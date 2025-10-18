import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ChildDashboard from './Dashboard';
import ChildStatsPage from './StatsPage';
import AgendaPage from './AgendaPage';
import ProfilePage from './ProfilePage';
import HomePage from './HomePage';
import BottomNav from '../../components/child/BottomNav';
import SidebarChild from '../../components/child/SidebarChild';
import ReadsPage from './ReadsPage';

function ChildLayout() {
  return (
    <div className="min-h-screen bg-gradient-mootify">
      <SidebarChild />
      <div className="md:ml-56 pb-16 md:pb-0 p-4 md:p-6 lg:p-8">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}

export default function ChildRouter() {
  return (
    <Routes>
      <Route element={<ChildLayout />}> 
        <Route path="/" element={<HomePage />} />
        <Route path="/day" element={<ChildDashboard />} />
        <Route path="/stats" element={<ChildStatsPage />} />
        <Route path="/reads" element={<ReadsPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/child" replace />} />
    </Routes>
  );
}
