
import React, { useState, useMemo } from 'react';
import { useDatabase } from '../../services/database';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Unit, Employee } from '../../types';

// Form Modal Component for Unit
const UnitFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (unit: Partial<Unit>) => void;
  unit: Partial<Unit> | null;
  employees: Employee[];
}> = ({ isOpen, onClose, onSave, unit, employees }) => {
  const [formData, setFormData] = useState<Partial<Unit>>({});

  React.useEffect(() => {
    setFormData(unit || { status: 'Aktif' });
  }, [unit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const requiredFields: (keyof Unit)[] = ['name', 'code', 'headId', 'status'];
  const isFormValid = () => requiredFields.every(field => formData[field] && formData[field] !== '');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={unit?.id ? 'Edit Data Bagian/Unit' : 'Tambah Bagian/Unit Baru'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" form="unit-form" disabled={!isFormValid()}>Simpan</Button>
        </>
      }
    >
      <form id="unit-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Bagian/Unit</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kode Bagian/Unit</label>
            <input type="text" name="code" value={formData.code || ''} onChange={handleChange} className="mt-1 input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Kabag/Kanit</label>
            <select name="headId" value={formData.headId || ''} onChange={handleChange} className="mt-1 input-field" required>
              <option value="" disabled>Pilih Pegawai</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nomor Telepon (WA)</label>
            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select name="status" value={formData.status || ''} onChange={handleChange} className="mt-1 input-field" required>
              <option value="Aktif">Aktif</option>
              <option value="Non Aktif">Non Aktif</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea name="description" rows={3} value={formData.description || ''} onChange={handleChange} className="mt-1 input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Alamat Lokasi Kantor (MAP, GPS)</label>
          <input type="text" name="address" value={formData.address || ''} onChange={handleChange} className="mt-1 input-field" />
        </div>
        <style>{`.input-field { display: block; width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; }`}</style>
      </form>
    </Modal>
  );
};

const DataUnit: React.FC = () => {
  const { db, updateDb } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Partial<Unit> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<Unit | null>(null);

  const handleOpenAddModal = () => {
    setEditingUnit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (unit: Unit) => {
    setEditingUnit(unit);
    setIsModalOpen(true);
  };
  
  const handleOpenDeleteModal = (unit: Unit) => {
    setUnitToDelete(unit);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
  };
  
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUnitToDelete(null);
  };

  const handleSaveUnit = (unitData: Partial<Unit>) => {
    if (editingUnit?.id) {
      const updatedUnits = db.units.map(u => u.id === editingUnit.id ? { ...u, ...unitData } : u);
      updateDb({ units: updatedUnits });
    } else {
      const newUnit: Unit = {
        id: `u_${new Date().getTime()}`,
        ...unitData,
      } as Unit;
      updateDb({ units: [...db.units, newUnit] });
    }
    handleCloseModal();
  };

  const handleDeleteUnit = () => {
    if (!unitToDelete) return;
    // Note: In a real app, check for dependencies (e.g., if employees are in this unit) before deleting.
    const newUnits = db.units.filter(u => u.id !== unitToDelete.id);
    updateDb({ units: newUnits });
    handleCloseDeleteModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Bagian/Unit</h1>
        <Button onClick={handleOpenAddModal}>
          Tambah Data
        </Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Bagian/Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kabag/Kanit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {db.units.map(unit => {
                const head = db.employees.find(e => e.id === unit.headId);
                return (
                  <tr key={unit.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{unit.name}</div>
                        <div className="text-sm text-gray-500">{unit.description.substring(0, 30)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unit.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{head?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{unit.phone}</div>
                        <div className="text-sm text-gray-500">{unit.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        unit.status === 'Aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {unit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleOpenEditModal(unit)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                      <button onClick={() => handleOpenDeleteModal(unit)} className="text-red-600 hover:text-red-900">Hapus</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <UnitFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUnit}
        unit={editingUnit}
        employees={db.employees}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Konfirmasi Hapus"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>Batal</Button>
            <Button variant="danger" onClick={handleDeleteUnit}>Hapus</Button>
          </>
        }
      >
        <p>Apakah Anda yakin ingin menghapus data <strong className="font-semibold">{unitToDelete?.name}</strong>?</p>
        <p className="mt-2 text-sm text-gray-500">Aksi ini tidak dapat dibatalkan.</p>
      </Modal>
    </div>
  );
};

export default DataUnit;
