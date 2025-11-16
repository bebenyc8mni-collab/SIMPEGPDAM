
import React from 'react';
import Card from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { useDatabase } from '../../services/database';
import { User } from '../../types';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { db } = useDatabase();
  const currentUser = user as User;
  const employeeData = db.employees.find(e => e.id === currentUser?.employeeId);
  const position = db.positions.find(p => p.id === employeeData?.positionId)?.name || 'N/A';
  const unit = db.units.find(u => u.id === employeeData?.unitId)?.name || 'N/A';
  
  const todayPresence = db.presences.find(p => p.employeeId === employeeData?.id && p.date === new Date().toISOString().split('T')[0]);

  if (!employeeData) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Pegawai</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <h2 className="text-xl font-semibold mb-4">Informasi Pribadi</h2>
                <div className="flex items-center gap-6">
                    <img src={employeeData.photoUrl} alt={employeeData.name} className="w-24 h-24 rounded-full object-cover" />
                    <div>
                        <p className="text-2xl font-bold">{employeeData.name}</p>
                        <p className="text-gray-600">{position}</p>
                        <p className="text-gray-500 text-sm">{unit}</p>
                    </div>
                </div>
            </Card>
        </div>
        <Card className="flex flex-col justify-center items-center text-center">
            <h2 className="text-xl font-semibold mb-2">Status Kehadiran Hari Ini</h2>
            <p className="text-lg text-gray-500 mb-4">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            {todayPresence ? (
                 <span className={`px-4 py-2 text-lg font-semibold rounded-full ${
                    todayPresence.status === 'Hadir' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {todayPresence.status}
                </span>
            ) : (
                 <span className="px-4 py-2 text-lg font-semibold rounded-full bg-gray-100 text-gray-800">
                    Belum ada data
                </span>
            )}
        </Card>
        <Card className="lg:col-span-3">
             <h2 className="text-xl font-semibold mb-4">Informasi Cuti</h2>
             <div className="flex justify-around text-center">
                <div>
                    <p className="text-3xl font-bold text-brand-blue-600">12</p>
                    <p className="text-gray-500">Sisa Cuti Tahunan</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold text-gray-700">2</p>
                    <p className="text-gray-500">Cuti Terpakai</p>
                </div>
                 <div>
                    <p className="text-3xl font-bold text-yellow-600">1</p>
                    <p className="text-gray-500">Pengajuan Diproses</p>
                </div>
             </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
