import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../../services/database';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import { Employee, Position, Unit, User } from '../../../types';

// Co-located Form Modal Component
const PegawaiFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Partial<Employee>) => void;
  employee: Partial<Employee> | null;
  positions: Position[];
  units: Unit[];
}> = ({ isOpen, onClose, onSave, employee, positions, units }) => {
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    // Set initial form data when modal opens or employee data changes
    setFormData(employee || {});
    setPhotoPreview(employee?.photoUrl || null);
  }, [employee, isOpen]);

  // Automatically calculate pension date
  useEffect(() => {
    if (formData.birthDate) {
      try {
        const birth = new Date(formData.birthDate);
        // Check if the date is valid
        if (!isNaN(birth.getTime())) {
          birth.setFullYear(birth.getFullYear() + 65);
          const pensionDateStr = birth.toISOString().split('T')[0];
          // Update state only if it's a new value to prevent re-renders
          if (formData.pensionDate !== pensionDateStr) {
            setFormData(prev => ({ ...prev, pensionDate: pensionDateStr }));
          }
        }
      } catch (e) {
        console.error("Invalid date for pension calculation", e);
      }
    }
  }, [formData.birthDate]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            setPhotoPreview(base64String);
            setFormData(prev => ({ ...prev, photoUrl: base64String }));
        };
        reader.readAsDataURL(file);
    } else {
        alert('Silakan unggah file gambar (JPG atau PNG).');
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const requiredFields: (keyof Employee)[] = ['name', 'nik', 'email', 'positionId', 'unitId', 'tmt', 'employmentStatus', 'status', 'birthPlace', 'birthDate', 'gender'];
  
  const isFormValid = () => {
      return requiredFields.every(field => formData[field] && String(formData[field]).trim() !== '');
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee?.id ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" form="pegawai-form" disabled={!isFormValid()}>Simpan</Button>
        </>
      }
    >
      <form id="pegawai-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Foto</label>
            <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                    {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                        <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                </span>
                <label htmlFor="file-upload" className="ml-5 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500">
                    <span>Upload Foto</span>
                    <input id="file-upload" name="photo" type="file" className="sr-only" onChange={handlePhotoChange} accept="image/jpeg, image/png" />
                </label>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 input-field" required/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">NIK</label>
                <input type="text" name="nik" value={formData.nik || ''} onChange={handleChange} className="mt-1 input-field" required/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Tempat Lahir</label>
                <input type="text" name="birthPlace" value={formData.birthPlace || ''} onChange={handleChange} className="mt-1 input-field" required/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                <input type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleChange} className="mt-1 input-field" required/>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                <select name="gender" value={formData.gender || ''} onChange={handleChange} className="mt-1 input-field" required>
                    <option value="" disabled>Pilih Jenis Kelamin</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 input-field" required/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">No. Telepon</label>
                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 input-field" />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Jabatan</label>
                <select name="positionId" value={formData.positionId || ''} onChange={handleChange} className="mt-1 input-field" required>
                    <option value="" disabled>Pilih Jabatan</option>
                    {positions.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Bagian/Unit</label>
                <select name="unitId" value={formData.unitId || ''} onChange={handleChange} className="mt-1 input-field" required>
                    <option value="" disabled>Pilih Bagian/Unit</option>
                    {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Mulai Tugas (TMT)</label>
                <input type="date" name="tmt" value={formData.tmt || ''} onChange={handleChange} className="mt-1 input-field" required/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Tanggal Pensiun (Otomatis)</label>
                <input type="date" name="pensionDate" value={formData.pensionDate || ''} className="mt-1 input-field bg-gray-100" readOnly/>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Status Kepegawaian</label>
                <select name="employmentStatus" value={formData.employmentStatus || ''} onChange={handleChange} className="mt-1 input-field" required>
                    <option value="" disabled>Pilih Status</option>
                    <option value="Tetap">Tetap</option>
                    <option value="Kontrak">Kontrak</option>
                    <option value="Harian">Harian</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                 <select name="status" value={formData.status || ''} onChange={handleChange} className="mt-1 input-field" required>
                    <option value="" disabled>Pilih Status</option>
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                    <option value="Pensiun">Pensiun</option>
                </select>
            </div>
        </div>
        <style>{`.input-field { display: block; width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; }`}</style>
      </form>
    </Modal>
  );
};


const DataPegawai: React.FC = () => {
  const { db, updateDb } = useDatabase();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnit, setFilterUnit] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);


  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };
  
  const handleOpenEditModal = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };
  
  const handleOpenDeleteModal = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseDeleteModal = () => {
    setEmployeeToDelete(null);
    setIsDeleteModalOpen(false);
  };


  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };
  
  const handleDeleteEmployee = () => {
      if (!employeeToDelete) return;

      const newEmployees = db.employees.filter(emp => emp.id !== employeeToDelete.id);
      const newUsers = db.users.filter(user => user.employeeId !== employeeToDelete.id);
      updateDb({ employees: newEmployees, users: newUsers });
      handleCloseDeleteModal();
  };

  const handleSaveEmployee = (employeeData: Partial<Employee>) => {
    if (editingEmployee && editingEmployee.id) { // Edit
        const updatedEmployees = db.employees.map(emp =>
            emp.id === editingEmployee.id ? { ...emp, ...employeeData } : emp
        );
        updateDb({ employees: updatedEmployees });
    } else { // Add
        const newEmployee: Employee = {
            id: `e_${new Date().getTime()}`,
            photoUrl: employeeData.photoUrl || `https://picsum.photos/seed/${new Date().getTime()}/200/200`,
            educationHistory: [],
            workHistory: [],
            rankHistory: [],
            careerHistory: [],
            documents: [],
            birthPlace: '',
            birthDate: '',
            gender: 'Laki-laki',
            lastEducation: '',
            address: '',
            ...employeeData
        } as Employee;

        const newUser: User = {
            id: `usr_${new Date().getTime()}`,
            employeeId: newEmployee.id,
            email: newEmployee.email,
            role: 'user'
        };
        
        updateDb({
            employees: [...db.employees, newEmployee],
            users: [...db.users, newUser],
        });
    }
    handleCloseModal();
  };


  const filteredEmployees = useMemo(() => {
    return db.employees
      .filter(emp => {
        const position = db.positions.find(p => p.id === emp.positionId);
        const searchMatch =
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.nik.includes(searchTerm) ||
          (position && position.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return searchMatch;
      })
      .filter(emp => {
        return filterUnit === '' || emp.unitId === filterUnit;
      });
  }, [db.employees, db.positions, searchTerm, filterUnit]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Pegawai</h1>
        <Button onClick={handleOpenAddModal}>
          Tambah Pegawai
        </Button>
      </div>

      <Card>
        <div className="p-4 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Cari berdasarkan NIK, Nama, atau Jabatan..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border rounded-md"
          />
          <select
            value={filterUnit}
            onChange={e => setFilterUnit(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="">Semua Bagian/Unit</option>
            {db.units.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.name}</option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TMT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bagian/Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map(employee => {
                const position = db.positions.find(p => p.id === employee.positionId)?.name || 'N/A';
                const unit = db.units.find(u => u.id === employee.unitId)?.name || 'N/A';
                return (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <img className="h-10 w-10 rounded-full object-cover" src={employee.photoUrl} alt={employee.name} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.nik}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(employee.tmt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            employee.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {employee.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => navigate(`/admin/data-pegawai/${employee.id}`)} className="text-brand-blue-600 hover:text-brand-blue-900 mr-3">View</button>
                      <button onClick={() => handleOpenEditModal(employee)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                      <button onClick={() => handleOpenDeleteModal(employee)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <PegawaiFormModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        employee={editingEmployee}
        positions={db.positions}
        units={db.units}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Konfirmasi Hapus"
        footer={
            <>
                <Button variant="secondary" onClick={handleCloseDeleteModal}>Batal</Button>
                <Button variant="danger" onClick={handleDeleteEmployee}>Hapus</Button>
            </>
        }
      >
        <p>Apakah Anda yakin ingin menghapus data pegawai <strong className="font-semibold">{employeeToDelete?.name}</strong>?</p>
        <p className="mt-2 text-sm text-gray-500">Akun user yang terkait juga akan dihapus. Aksi ini tidak dapat dibatalkan.</p>
      </Modal>

    </div>
  );
};

export default DataPegawai;