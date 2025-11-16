
import React, { useState } from 'react';
import { useDatabase } from '../../services/database';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Position, Unit } from '../../types';

// Form Modal Component for Position
const PositionFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (position: Partial<Position>) => void;
  position: Partial<Position> | null;
  allPositions: Position[];
  allUnits: Unit[];
}> = ({ isOpen, onClose, onSave, position, allPositions, allUnits }) => {
  const [formData, setFormData] = useState<Partial<Position>>({});

  React.useEffect(() => {
    setFormData(position || { level: 'Staff' });
  }, [position, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  const requiredFields: (keyof Position)[] = ['name', 'level', 'unitId'];
  const isFormValid = () => requiredFields.every(field => formData[field] && formData[field] !== '');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={position?.id ? 'Edit Data Jabatan' : 'Tambah Jabatan Baru'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" form="position-form" disabled={!isFormValid()}>Simpan</Button>
        </>
      }
    >
      <form id="position-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Jabatan</label>
            <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input type="text" name="level" value={formData.level || ''} onChange={handleChange} className="mt-1 input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jabatan Atasan</label>
            <select name="parentPositionId" value={formData.parentPositionId || ''} onChange={handleChange} className="mt-1 input-field">
              <option value="">Tidak Ada Atasan</option>
              {allPositions.filter(p => p.id !== position?.id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit Kerja</label>
            <select name="unitId" value={formData.unitId || ''} onChange={handleChange} className="mt-1 input-field" required>
              <option value="" disabled>Pilih Unit Kerja</option>
              {allUnits.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi Tugas</label>
          <textarea name="description" rows={4} value={formData.description || ''} onChange={handleChange} className="mt-1 input-field" />
        </div>
        <style>{`.input-field { display: block; width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; }`}</style>
      </form>
    </Modal>
  );
};

const DataJabatan: React.FC = () => {
  const { db, updateDb } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Partial<Position> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState<Position | null>(null);

  const handleOpenAddModal = () => {
    setEditingPosition(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (position: Position) => {
    setEditingPosition(position);
    setIsModalOpen(true);
  };
  
  const handleOpenDeleteModal = (position: Position) => {
    setPositionToDelete(position);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPosition(null);
  };
  
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPositionToDelete(null);
  };

  const handleSavePosition = (positionData: Partial<Position>) => {
    if (editingPosition?.id) {
      const updatedPositions = db.positions.map(p => p.id === editingPosition.id ? { ...p, ...positionData } : p);
      updateDb({ positions: updatedPositions });
    } else {
      const newPosition: Position = {
        id: `p_${new Date().getTime()}`,
        description: '',
        ...positionData,
      } as Position;
      updateDb({ positions: [...db.positions, newPosition] });
    }
    handleCloseModal();
  };

  const handleDeletePosition = () => {
    if (!positionToDelete) return;
    // Note: In a real app, check for dependencies (e.g., if employees have this position) before deleting.
    const newPositions = db.positions.filter(p => p.id !== positionToDelete.id);
    updateDb({ positions: newPositions });
    handleCloseDeleteModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Jabatan</h1>
        <Button onClick={handleOpenAddModal}>
          Tambah Data Jabatan
        </Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Jabatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan Atasan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Kerja</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {db.positions.map(position => {
                const parentPosition = db.positions.find(p => p.id === position.parentPositionId);
                const unit = db.units.find(u => u.id === position.unitId);
                return (
                  <tr key={position.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{position.name}</div>
                        <div className="text-sm text-gray-500">{position.description.substring(0, 40)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{position.level}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parentPosition?.name || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unit?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleOpenEditModal(position)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                      <button onClick={() => handleOpenDeleteModal(position)} className="text-red-600 hover:text-red-900">Hapus</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <PositionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePosition}
        position={editingPosition}
        allPositions={db.positions}
        allUnits={db.units}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Konfirmasi Hapus"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>Batal</Button>
            <Button variant="danger" onClick={handleDeletePosition}>Hapus</Button>
          </>
        }
      >
        <p>Apakah Anda yakin ingin menghapus jabatan <strong className="font-semibold">{positionToDelete?.name}</strong>?</p>
        <p className="mt-2 text-sm text-gray-500">Aksi ini tidak dapat dibatalkan.</p>
      </Modal>
    </div>
  );
};

export default DataJabatan;
