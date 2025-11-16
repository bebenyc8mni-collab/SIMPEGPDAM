
import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../services/database';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Admin, User, Employee } from '../../types';

type LoginUser = {
  id: string;
  identifier: string;
  role: 'admin' | 'user';
  employeeName?: string;
};

const UserFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { role: 'admin' | 'user', username?: string, employeeId?: string }) => void;
  employees: Employee[];
  users: User[];
}> = ({ isOpen, onClose, onSave, employees, users }) => {
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [username, setUsername] = useState('');
  const [employeeId, setEmployeeId] = useState('');

  const availableEmployees = useMemo(() => {
    const userEmployeeIds = new Set(users.map(u => u.employeeId));
    return employees.filter(e => !userEmployeeIds.has(e.id));
  }, [employees, users, isOpen]);
  
  React.useEffect(() => {
    // Reset form on open
    if (isOpen) {
      setRole('user');
      setUsername('');
      setEmployeeId('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin' && username.trim()) {
      onSave({ role, username });
    } else if (role === 'user' && employeeId) {
      onSave({ role, employeeId });
    } else {
      alert("Silakan lengkapi data yang diperlukan.");
    }
  };

  const isFormValid = () => {
    if (role === 'admin') return username.trim() !== '';
    if (role === 'user') return employeeId !== '';
    return false;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah User Login Baru"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" form="user-form" disabled={!isFormValid()}>Simpan</Button>
        </>
      }
    >
      <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Level / Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value as 'admin' | 'user')} className="mt-1 input-field">
            <option value="user">User / Pegawai</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {role === 'admin' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">Username Admin</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 input-field" required />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700">Pilih Pegawai</label>
            <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="mt-1 input-field" required>
              <option value="" disabled>Pilih pegawai yang belum memiliki akun</option>
              {availableEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.email})</option>
              ))}
            </select>
            {availableEmployees.length === 0 && <p className="text-xs text-gray-500 mt-1">Semua pegawai sudah memiliki akun.</p>}
          </div>
        )}
        <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="text" value={`Default password is '${role === 'admin' ? 'admin123' : 'user123'}'`} className="mt-1 input-field bg-gray-100" readOnly disabled />
            <p className="text-xs text-gray-500 mt-1">Fitur ganti password akan tersedia di pembaruan selanjutnya.</p>
        </div>
        <style>{`.input-field { display: block; width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; }`}</style>
      </form>
    </Modal>
  );
};

const UserLogin: React.FC = () => {
  const { db, updateDb } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<LoginUser | null>(null);

  const loginUsers: LoginUser[] = useMemo(() => {
    const admins: LoginUser[] = db.admins.map(a => ({
      id: a.id,
      identifier: a.username,
      role: 'admin',
    }));
    const users: LoginUser[] = db.users.map(u => {
      const employee = db.employees.find(e => e.id === u.employeeId);
      return {
        id: u.id,
        identifier: u.email,
        role: 'user',
        employeeName: employee?.name || 'Pegawai Tidak Ditemukan',
      };
    });
    return [...admins, ...users];
  }, [db.admins, db.users, db.employees]);

  const handleOpenDeleteModal = (user: LoginUser) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleSaveUser = (data: { role: 'admin' | 'user', username?: string, employeeId?: string }) => {
    if (data.role === 'admin' && data.username) {
      const newAdmin: Admin = {
        id: `a_${new Date().getTime()}`,
        username: data.username,
        role: 'admin',
      };
      updateDb({ admins: [...db.admins, newAdmin] });
    } else if (data.role === 'user' && data.employeeId) {
      const employee = db.employees.find(e => e.id === data.employeeId);
      if (!employee) {
        alert("Pegawai tidak ditemukan!");
        return;
      }
      const newUser: User = {
        id: `usr_${new Date().getTime()}`,
        employeeId: employee.id,
        email: employee.email,
        role: 'user',
      };
      updateDb({ users: [...db.users, newUser] });
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    if (userToDelete.role === 'admin') {
      const newAdmins = db.admins.filter(a => a.id !== userToDelete.id);
      updateDb({ admins: newAdmins });
    } else {
      const newUsers = db.users.filter(u => u.id !== userToDelete.id);
      updateDb({ users: newUsers });
    }

    handleCloseDeleteModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen User Login</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          Tambah User
        </Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username / Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai Terkait</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loginUsers.map(user => (
                <tr key={`${user.role}-${user.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.identifier}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.employeeName || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleOpenDeleteModal(user)} className="text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveUser}
        employees={db.employees}
        users={db.users}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Konfirmasi Hapus Akun"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>Batal</Button>
            <Button variant="danger" onClick={handleDeleteUser}>Hapus</Button>
          </>
        }
      >
        <p>Apakah Anda yakin ingin menghapus akun login untuk <strong className="font-semibold">{userToDelete?.identifier}</strong>?</p>
        <p className="mt-2 text-sm text-gray-500">Aksi ini akan mencegah user masuk ke sistem, namun tidak menghapus data pegawai terkait.</p>
      </Modal>
    </div>
  );
};

export default UserLogin;
