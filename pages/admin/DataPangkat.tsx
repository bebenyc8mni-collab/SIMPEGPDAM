
import React, { useState } from 'react';
import { useDatabase } from '../../services/database';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { Pangkat } from '../../types';

// Form Modal Component for Pangkat
const PangkatFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (pangkat: Partial<Pangkat>) => void;
  pangkat: Partial<Pangkat> | null;
}> = ({ isOpen, onClose, onSave, pangkat }) => {
  const [formData, setFormData] = useState<Partial<Pangkat>>({});

  React.useEffect(() => {
    setFormData(pangkat || {});
  }, [pangkat, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isFormValid = () => formData.name && formData.name.trim() !== '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pangkat?.id ? 'Edit Data Pangkat/Golongan' : 'Tambah Pangkat/Golongan Baru'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button type="submit" form="pangkat-form" disabled={!isFormValid()}>Simpan</Button>
        </>
      }
    >
      <form id="pangkat-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Pangkat/Golongan</label>
          <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="mt-1 input-field" required />
        </div>
        <style>{`.input-field { display: block; width: 100%; padding: 0.5rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; }`}</style>
      </form>
    </Modal>
  );
};

const DataPangkat: React.FC = () => {
  const { db, updateDb } = useDatabase();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPangkat, setEditingPangkat] = useState<Partial<Pangkat> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pangkatToDelete, setPangkatToDelete] = useState<Pangkat | null>(null);

  const handleOpenAddModal = () => {
    setEditingPangkat(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pangkat: Pangkat) => {
    setEditingPangkat(pangkat);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (pangkat: Pangkat) => {
    setPangkatToDelete(pangkat);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPangkat(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setPangkatToDelete(null);
  };

  const handleSavePangkat = (pangkatData: Partial<Pangkat>) => {
    if (editingPangkat?.id) {
      const updatedPangkats = db.pangkats.map(p => p.id === editingPangkat.id ? { ...p, ...pangkatData } : p);
      updateDb({ pangkats: updatedPangkats });
    } else {
      const newPangkat: Pangkat = {
        id: `g_${new Date().getTime()}`,
        name: pangkatData.name || '',
      };
      updateDb({ pangkats: [...db.pangkats, newPangkat] });
    }
    handleCloseModal();
  };

  const handleDeletePangkat = () => {
    if (!pangkatToDelete) return;
    // Note: In a real app, check for dependencies before deleting.
    const newPangkats = db.pangkats.filter(p => p.id !== pangkatToDelete.id);
    updateDb({ pangkats: newPangkats });
    handleCloseDeleteModal();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Data Pangkat/Golongan</h1>
        <Button onClick={handleOpenAddModal}>
          Tambah Data
        </Button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pangkat/Golongan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {db.pangkats.map(pangkat => (
                <tr key={pangkat.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{pangkat.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleOpenEditModal(pangkat)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button onClick={() => handleOpenDeleteModal(pangkat)} className="text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <PangkatFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePangkat}
        pangkat={editingPangkat}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Konfirmasi Hapus"
        footer={
          <>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>Batal</Button>
            <Button variant="danger" onClick={handleDeletePangkat}>Hapus</Button>
          </>
        }
      >
        <p>Apakah Anda yakin ingin menghapus pangkat/golongan <strong className="font-semibold">{pangkatToDelete?.name}</strong>?</p>
        <p className="mt-2 text-sm text-gray-500">Aksi ini tidak dapat dibatalkan.</p>
      </Modal>
    </div>
  );
};

export default DataPangkat;
