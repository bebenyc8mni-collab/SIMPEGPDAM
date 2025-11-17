
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import DataPegawai from './pages/admin/pegawai/DataPegawai';
import DetailPegawai from './pages/admin/pegawai/DetailPegawai';
import DataUnit from './pages/admin/DataUnit';
import DataJabatan from './pages/admin/DataJabatan';
import DataPangkat from './pages/admin/DataPangkat';
import StrukturOrganisasi from './pages/admin/StrukturOrganisasi';
import UserLogin from './pages/admin/UserLogin';
import PlaceholderPage from './pages/PlaceholderPage';
import UserLayout from './layouts/UserLayout';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import Presensi from './pages/admin/Presensi';

const ProtectedRoute: React.FC<{ allowedRoles: string[] }> = ({ allowedRoles }) => {
  const { user, role } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(role || '')) {
     return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

function App() {
  return (
    <div className="min-h-screen font-sans text-gray-800">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="data-pegawai" element={<DataPegawai />} />
            <Route path="data-pegawai/:id" element={<DetailPegawai />} />
            <Route path="data-jabatan" element={<DataJabatan />} />
            <Route path="data-unit" element={<DataUnit />} />
            <Route path="data-pangkat" element={<DataPangkat />} />
            <Route path="struktur-organisasi" element={<StrukturOrganisasi />} />
            <Route path="presensi" element={<Presensi />} />
            <Route path="cuti" element={<PlaceholderPage title="Cuti" />} />
            <Route path="payroll" element={<PlaceholderPage title="Payroll" />} />
            <Route path="user-login" element={<UserLogin />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Route>
        </Route>

        {/* User Routes */}
         <Route element={<ProtectedRoute allowedRoles={['user']} />}>
          <Route path="/user" element={<UserLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="profil-saya" element={<UserProfile />} />
            <Route path="presensi" element={<PlaceholderPage title="Presensi Saya" />} />
            <Route path="cuti" element={<PlaceholderPage title="Riwayat & Pengajuan Cuti" />} />
            <Route path="slip-gaji" element={<PlaceholderPage title="Slip Gaji" />} />
            <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
