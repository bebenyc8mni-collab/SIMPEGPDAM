
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDatabase } from '../../../services/database';
import Card from '../../../components/ui/Card';
import { Employee, Education, WorkHistory, RankHistory, CareerHistory, Document } from '../../../types';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

// Fix: Define component props to accept an optional employeeId for reusability.
interface DetailPegawaiProps {
    employeeId?: string;
}

const DetailPegawai: React.FC<DetailPegawaiProps> = ({ employeeId }) => {
    const params = useParams<{ id: string }>();
    const { db, updateDb } = useDatabase();
    const [activeTab, setActiveTab] = useState('profil');
    
    // State for CRUD operations on Education History
    const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
    const [editingEducation, setEditingEducation] = useState<Education | null>(null);
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [educationToDelete, setEducationToDelete] = useState<Education | null>(null);

    // State for CRUD operations on Work History
    const [isWorkHistoryModalOpen, setIsWorkHistoryModalOpen] = useState(false);
    const [editingWorkHistory, setEditingWorkHistory] = useState<WorkHistory | null>(null);
    const [isConfirmDeleteWorkHistoryModalOpen, setIsConfirmDeleteWorkHistoryModalOpen] = useState(false);
    const [workHistoryToDelete, setWorkHistoryToDelete] = useState<WorkHistory | null>(null);

    // State for CRUD operations on Rank History
    const [isRankHistoryModalOpen, setIsRankHistoryModalOpen] = useState(false);
    const [editingRankHistory, setEditingRankHistory] = useState<RankHistory | null>(null);
    const [isConfirmDeleteRankHistoryModalOpen, setIsConfirmDeleteRankHistoryModalOpen] = useState(false);
    const [rankHistoryToDelete, setRankHistoryToDelete] = useState<RankHistory | null>(null);

    // State for CRUD operations on Career History
    const [isCareerHistoryModalOpen, setIsCareerHistoryModalOpen] = useState(false);
    const [editingCareerHistory, setEditingCareerHistory] = useState<CareerHistory | null>(null);
    const [isConfirmDeleteCareerHistoryModalOpen, setIsConfirmDeleteCareerHistoryModalOpen] = useState(false);
    const [careerHistoryToDelete, setCareerHistoryToDelete] = useState<CareerHistory | null>(null);

    // State for CRUD operations on Documents
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [isConfirmDeleteDocumentModalOpen, setIsConfirmDeleteDocumentModalOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

    // Fix: Prioritize employeeId from props, falling back to URL parameter.
    const id = employeeId || params.id;
    
    const employee = db.employees.find(e => e.id === id);
    const position = db.positions.find(p => p.id === employee?.positionId)?.name || 'N/A';
    const unit = db.units.find(u => u.id === employee?.unitId)?.name || 'N/A';
    
    if (!employee) {
        return <div>Pegawai tidak ditemukan.</div>;
    }

    const calculateMasaKerja = (tmt: string): string => {
        const startDate = new Date(tmt);
        const endDate = new Date();
        let years = endDate.getFullYear() - startDate.getFullYear();
        let months = endDate.getMonth() - startDate.getMonth();
        if (months < 0) {
            years--;
            months += 12;
        }
        return `${years} tahun, ${months} bulan`;
    };
    
    // Handlers for Education Modals
    const handleOpenAddEducationModal = () => {
        setEditingEducation(null);
        setIsEducationModalOpen(true);
    };

    const handleOpenEditEducationModal = (education: Education) => {
        setEditingEducation(education);
        setIsEducationModalOpen(true);
    };

    const handleOpenDeleteConfirm = (education: Education) => {
        setEducationToDelete(education);
        setIsConfirmDeleteModalOpen(true);
    };

    // CRUD Logic for Education History
    const handleSaveEducation = (educationData: Omit<Education, 'id'> & { id?: string }) => {
        if (!employee) return;

        let updatedHistory;
        if (educationData.id) { // Editing existing record
            updatedHistory = employee.educationHistory.map(edu => 
                edu.id === educationData.id ? { ...edu, ...educationData } : edu
            );
        } else { // Adding new record
            const newRecord: Education = {
                id: `edu_${new Date().getTime()}`,
                ...educationData
            } as Education;
            updatedHistory = [...employee.educationHistory, newRecord];
        }

        const updatedEmployees = db.employees.map(emp => {
            if (emp.id === employee.id) {
                return { ...emp, educationHistory: updatedHistory };
            }
            return emp;
        });

        updateDb({ employees: updatedEmployees });
        setIsEducationModalOpen(false);
        setEditingEducation(null);
    };

    const handleDeleteEducation = () => {
        if (!employee || !educationToDelete) return;

        const updatedHistory = employee.educationHistory.filter(edu => edu.id !== educationToDelete.id);
        const updatedEmployees = db.employees.map(emp => 
            emp.id === employee.id ? { ...emp, educationHistory: updatedHistory } : emp
        );
        
        updateDb({ employees: updatedEmployees });
        setIsConfirmDeleteModalOpen(false);
        setEducationToDelete(null);
    };

    // Handlers for Work History Modals
    const handleOpenAddWorkHistoryModal = () => {
        setEditingWorkHistory(null);
        setIsWorkHistoryModalOpen(true);
    };

    const handleOpenEditWorkHistoryModal = (workHistory: WorkHistory) => {
        setEditingWorkHistory(workHistory);
        setIsWorkHistoryModalOpen(true);
    };

    const handleOpenDeleteWorkHistoryConfirm = (workHistory: WorkHistory) => {
        setWorkHistoryToDelete(workHistory);
        setIsConfirmDeleteWorkHistoryModalOpen(true);
    };

    // CRUD Logic for Work History
    const handleSaveWorkHistory = (workHistoryData: Omit<WorkHistory, 'id'> & { id?: string }) => {
        if (!employee) return;

        let updatedHistory;
        if (workHistoryData.id) { // Editing existing record
            updatedHistory = employee.workHistory.map(work => 
                work.id === workHistoryData.id ? { ...work, ...workHistoryData } : work
            );
        } else { // Adding new record
            const newRecord: WorkHistory = {
                id: `work_${new Date().getTime()}`,
                ...workHistoryData
            } as WorkHistory;
            updatedHistory = [...employee.workHistory, newRecord];
        }

        const updatedEmployees = db.employees.map(emp => {
            if (emp.id === employee.id) {
                return { ...emp, workHistory: updatedHistory };
            }
            return emp;
        });

        updateDb({ employees: updatedEmployees });
        setIsWorkHistoryModalOpen(false);
        setEditingWorkHistory(null);
    };

    const handleDeleteWorkHistory = () => {
        if (!employee || !workHistoryToDelete) return;

        const updatedHistory = employee.workHistory.filter(work => work.id !== workHistoryToDelete.id);
        const updatedEmployees = db.employees.map(emp => 
            emp.id === employee.id ? { ...emp, workHistory: updatedHistory } : emp
        );
        
        updateDb({ employees: updatedEmployees });
        setIsConfirmDeleteWorkHistoryModalOpen(false);
        setWorkHistoryToDelete(null);
    };

    // Handlers for Rank History Modals
    const handleOpenAddRankHistoryModal = () => {
        setEditingRankHistory(null);
        setIsRankHistoryModalOpen(true);
    };

    const handleOpenEditRankHistoryModal = (rankHistory: RankHistory) => {
        setEditingRankHistory(rankHistory);
        setIsRankHistoryModalOpen(true);
    };

    const handleOpenDeleteRankHistoryConfirm = (rankHistory: RankHistory) => {
        setRankHistoryToDelete(rankHistory);
        setIsConfirmDeleteRankHistoryModalOpen(true);
    };

    // CRUD Logic for Rank History
    const handleSaveRankHistory = (rankHistoryData: Omit<RankHistory, 'id'> & { id?: string }) => {
        if (!employee) return;

        let updatedHistory;
        if (rankHistoryData.id) { // Editing existing record
            updatedHistory = employee.rankHistory.map(rank => 
                rank.id === rankHistoryData.id ? { ...rank, ...rankHistoryData } : rank
            );
        } else { // Adding new record
            const newRecord: RankHistory = {
                id: `rank_${new Date().getTime()}`,
                ...rankHistoryData
            } as RankHistory;
            updatedHistory = [...employee.rankHistory, newRecord];
        }

        const updatedEmployees = db.employees.map(emp => {
            if (emp.id === employee.id) {
                return { ...emp, rankHistory: updatedHistory };
            }
            return emp;
        });

        updateDb({ employees: updatedEmployees });
        setIsRankHistoryModalOpen(false);
        setEditingRankHistory(null);
    };

    const handleDeleteRankHistory = () => {
        if (!employee || !rankHistoryToDelete) return;

        const updatedHistory = employee.rankHistory.filter(rank => rank.id !== rankHistoryToDelete.id);
        const updatedEmployees = db.employees.map(emp => 
            emp.id === employee.id ? { ...emp, rankHistory: updatedHistory } : emp
        );
        
        updateDb({ employees: updatedEmployees });
        setIsConfirmDeleteRankHistoryModalOpen(false);
        setRankHistoryToDelete(null);
    };

    // Handlers for Career History Modals
    const handleOpenAddCareerHistoryModal = () => {
        setEditingCareerHistory(null);
        setIsCareerHistoryModalOpen(true);
    };

    const handleOpenEditCareerHistoryModal = (careerHistory: CareerHistory) => {
        setEditingCareerHistory(careerHistory);
        setIsCareerHistoryModalOpen(true);
    };

    const handleOpenDeleteCareerHistoryConfirm = (careerHistory: CareerHistory) => {
        setCareerHistoryToDelete(careerHistory);
        setIsConfirmDeleteCareerHistoryModalOpen(true);
    };

    // CRUD Logic for Career History
    const handleSaveCareerHistory = (careerHistoryData: Omit<CareerHistory, 'id'> & { id?: string }) => {
        if (!employee) return;

        let updatedHistory;
        if (careerHistoryData.id) { // Editing existing record
            updatedHistory = employee.careerHistory.map(career => 
                career.id === careerHistoryData.id ? { ...career, ...careerHistoryData } : career
            );
        } else { // Adding new record
            const newRecord: CareerHistory = {
                id: `career_${new Date().getTime()}`,
                ...careerHistoryData
            } as CareerHistory;
            updatedHistory = [...employee.careerHistory, newRecord];
        }

        const updatedEmployees = db.employees.map(emp => {
            if (emp.id === employee.id) {
                return { ...emp, careerHistory: updatedHistory };
            }
            return emp;
        });

        updateDb({ employees: updatedEmployees });
        setIsCareerHistoryModalOpen(false);
        setEditingCareerHistory(null);
    };

    const handleDeleteCareerHistory = () => {
        if (!employee || !careerHistoryToDelete) return;

        const updatedHistory = employee.careerHistory.filter(career => career.id !== careerHistoryToDelete.id);
        const updatedEmployees = db.employees.map(emp => 
            emp.id === employee.id ? { ...emp, careerHistory: updatedHistory } : emp
        );
        
        updateDb({ employees: updatedEmployees });
        setIsConfirmDeleteCareerHistoryModalOpen(false);
        setCareerHistoryToDelete(null);
    };

    // Handlers for Document Modals
    const handleOpenAddDocumentModal = () => {
        setIsDocumentModalOpen(true);
    };

    const handleOpenDeleteDocumentConfirm = (doc: Document) => {
        setDocumentToDelete(doc);
        setIsConfirmDeleteDocumentModalOpen(true);
    };

    // CRUD Logic for Documents
    const handleSaveDocument = (documentData: Omit<Document, 'id'>) => {
        if (!employee) return;

        const newDocument: Document = {
            id: `doc_${new Date().getTime()}`,
            ...documentData
        };
        
        const updatedDocuments = [...employee.documents, newDocument];

        const updatedEmployees = db.employees.map(emp => {
            if (emp.id === employee.id) {
                return { ...emp, documents: updatedDocuments };
            }
            return emp;
        });

        updateDb({ employees: updatedEmployees });
        setIsDocumentModalOpen(false);
    };
    
    const handleDeleteDocument = () => {
        if (!employee || !documentToDelete) return;

        const updatedDocuments = employee.documents.filter(doc => doc.id !== documentToDelete.id);
        const updatedEmployees = db.employees.map(emp => 
            emp.id === employee.id ? { ...emp, documents: updatedDocuments } : emp
        );
        
        updateDb({ employees: updatedEmployees });
        setIsConfirmDeleteDocumentModalOpen(false);
        setDocumentToDelete(null);
    };



    const renderTabContent = () => {
        switch (activeTab) {
            case 'profil': return <ProfilTab employee={employee} position={position} unit={unit} masaKerja={calculateMasaKerja(employee.tmt)} />;
            case 'pendidikan': return <HistoryTab 
                                        title="Riwayat Pendidikan" 
                                        data={employee.educationHistory} 
                                        columns={['Jenjang Pendidikan', 'Nama Sekolah/Universitas', 'Jurusan Program Studi', 'Tahun Lulus', 'Dok. Ijazah']} 
                                        dataKeys={['level', 'institution', 'major', 'year', 'ijazahUrl']}
                                        onAdd={handleOpenAddEducationModal}
                                        onEdit={handleOpenEditEducationModal}
                                        onDelete={handleOpenDeleteConfirm}
                                      />;
            case 'pekerjaan': return <HistoryTab 
                                        title="Riwayat Pekerjaan" 
                                        data={employee.workHistory} 
                                        columns={['Perusahaan', 'Posisi', 'Mulai', 'Selesai']}
                                        dataKeys={['company', 'position', 'startDate', 'endDate']}
                                        onAdd={handleOpenAddWorkHistoryModal}
                                        onEdit={handleOpenEditWorkHistoryModal}
                                        onDelete={handleOpenDeleteWorkHistoryConfirm}
                                      />;
            case 'kepangkatan': return <HistoryTab 
                                        title="Riwayat Kepangkatan" 
                                        data={employee.rankHistory} 
                                        columns={['Pangkat/Gol', 'TMT', 'No. SK', 'Dok. SK']}
                                        dataKeys={['rank', 'tmt', 'skNumber', 'skDocumentUrl']}
                                        onAdd={handleOpenAddRankHistoryModal}
                                        onEdit={handleOpenEditRankHistoryModal}
                                        onDelete={handleOpenDeleteRankHistoryConfirm}
                                      />;
            case 'karir': return <HistoryTab 
                                    title="Riwayat Karir" 
                                    data={employee.careerHistory} 
                                    columns={['Jabatan', 'Bagian/Unit', 'TMT', 'Dok. SK']} 
                                    dataKeys={['position', 'unit', 'tmt', 'skDocument']}
                                    onAdd={handleOpenAddCareerHistoryModal}
                                    onEdit={handleOpenEditCareerHistoryModal}
                                    onDelete={handleOpenDeleteCareerHistoryConfirm}
                                  />;
            case 'dokumen': return <HistoryTab 
                                        title="Dokumen" 
                                        data={employee.documents} 
                                        columns={['Nama Dokumen', 'Catatan']} 
                                        dataKeys={['name', 'notes']}
                                        onAdd={handleOpenAddDocumentModal}
                                        onDelete={handleOpenDeleteDocumentConfirm}
                                     />;
            default: return null;
        }
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
                <img src={employee.photoUrl} alt={employee.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"/>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{employee.name}</h1>
                    <p className="text-lg text-gray-600">{position}</p>
                    <span className={`mt-2 px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                        employee.employmentStatus === 'Tetap' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {employee.employmentStatus}
                    </span>
                </div>
            </div>
            
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <TabButton name="profil" label="Profil" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="pendidikan" label="Pendidikan" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="pekerjaan" label="Pekerjaan" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="kepangkatan" label="Kepangkatan" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="karir" label="Karir" activeTab={activeTab} setActiveTab={setActiveTab} />
                    <TabButton name="dokumen" label="Dokumen" activeTab={activeTab} setActiveTab={setActiveTab} />
                </nav>
            </div>
            
            {renderTabContent()}

            <EducationFormModal
              isOpen={isEducationModalOpen}
              onClose={() => setIsEducationModalOpen(false)}
              onSave={handleSaveEducation}
              educationRecord={editingEducation}
            />

            <Modal
                isOpen={isConfirmDeleteModalOpen}
                onClose={() => setIsConfirmDeleteModalOpen(false)}
                title="Konfirmasi Hapus"
                footer={<>
                    <Button variant="secondary" onClick={() => setIsConfirmDeleteModalOpen(false)}>Batal</Button>
                    <Button variant="danger" onClick={handleDeleteEducation}>Hapus</Button>
                </>}
            >
                <p>Apakah Anda yakin ingin menghapus data riwayat pendidikan ini?</p>
            </Modal>

            <WorkHistoryFormModal
              isOpen={isWorkHistoryModalOpen}
              onClose={() => setIsWorkHistoryModalOpen(false)}
              onSave={handleSaveWorkHistory}
              workHistoryRecord={editingWorkHistory}
            />
            
            <Modal
                isOpen={isConfirmDeleteWorkHistoryModalOpen}
                onClose={() => setIsConfirmDeleteWorkHistoryModalOpen(false)}
                title="Konfirmasi Hapus"
                footer={<>
                    <Button variant="secondary" onClick={() => setIsConfirmDeleteWorkHistoryModalOpen(false)}>Batal</Button>
                    <Button variant="danger" onClick={handleDeleteWorkHistory}>Hapus</Button>
                </>}
            >
                <p>Apakah Anda yakin ingin menghapus data riwayat pekerjaan ini?</p>
            </Modal>

            <RankHistoryFormModal
                isOpen={isRankHistoryModalOpen}
                onClose={() => setIsRankHistoryModalOpen(false)}
                onSave={handleSaveRankHistory}
                rankHistoryRecord={editingRankHistory}
            />

            <Modal
                isOpen={isConfirmDeleteRankHistoryModalOpen}
                onClose={() => setIsConfirmDeleteRankHistoryModalOpen(false)}
                title="Konfirmasi Hapus"
                footer={<>
                    <Button variant="secondary" onClick={() => setIsConfirmDeleteRankHistoryModalOpen(false)}>Batal</Button>
                    <Button variant="danger" onClick={handleDeleteRankHistory}>Hapus</Button>
                </>}
            >
                <p>Apakah Anda yakin ingin menghapus data riwayat kepangkatan ini?</p>
            </Modal>
            
            <CareerHistoryFormModal
                isOpen={isCareerHistoryModalOpen}
                onClose={() => setIsCareerHistoryModalOpen(false)}
                onSave={handleSaveCareerHistory}
                careerHistoryRecord={editingCareerHistory}
            />

            <Modal
                isOpen={isConfirmDeleteCareerHistoryModalOpen}
                onClose={() => setIsConfirmDeleteCareerHistoryModalOpen(false)}
                title="Konfirmasi Hapus"
                footer={<>
                    <Button variant="secondary" onClick={() => setIsConfirmDeleteCareerHistoryModalOpen(false)}>Batal</Button>
                    <Button variant="danger" onClick={handleDeleteCareerHistory}>Hapus</Button>
                </>}
            >
                <p>Apakah Anda yakin ingin menghapus data riwayat karir ini?</p>
            </Modal>

            <DocumentFormModal
                isOpen={isDocumentModalOpen}
                onClose={() => setIsDocumentModalOpen(false)}
                onSave={handleSaveDocument}
            />

            <Modal
                isOpen={isConfirmDeleteDocumentModalOpen}
                onClose={() => setIsConfirmDeleteDocumentModalOpen(false)}
                title="Konfirmasi Hapus"
                footer={<>
                    <Button variant="secondary" onClick={() => setIsConfirmDeleteDocumentModalOpen(false)}>Batal</Button>
                    <Button variant="danger" onClick={handleDeleteDocument}>Hapus</Button>
                </>}
            >
                <p>Apakah Anda yakin ingin menghapus dokumen <strong className="font-semibold">{documentToDelete?.name}</strong>?</p>
            </Modal>
        </div>
    );
};

const TabButton: React.FC<{name: string, label: string, activeTab: string, setActiveTab: (name: string) => void}> = ({name, label, activeTab, setActiveTab}) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`${
        activeTab === name
          ? 'border-brand-blue-500 text-brand-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
    >
      {label}
    </button>
)

const ProfilTab: React.FC<{employee: Employee, position: string, unit: string, masaKerja: string}> = ({employee, position, unit, masaKerja}) => (
    <Card>
        <div className="space-y-8">
             <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Data Pribadi</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 pt-4">
                    <p className="text-sm font-medium text-gray-500">NIK</p>
                    <p className="text-md text-gray-800">{employee.nik}</p>
                    
                    <p className="text-sm font-medium text-gray-500">Tempat, Tanggal Lahir</p>
                    <p className="text-md text-gray-800">{`${employee.birthPlace}, ${new Date(employee.birthDate).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}`}</p>
                    
                    <p className="text-sm font-medium text-gray-500">Jenis Kelamin</p>
                    <p className="text-md text-gray-800">{employee.gender}</p>
                    
                    <p className="text-sm font-medium text-gray-500">Pendidikan Terakhir</p>
                    <p className="text-md text-gray-800">{employee.lastEducation}</p>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Kontak</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 pt-4">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-md text-gray-800">{employee.email}</p>
                    
                    <p className="text-sm font-medium text-gray-500">No. Whatsapp</p>
                    <p className="text-md text-gray-800">{employee.phone}</p>
                    
                    <p className="text-sm font-medium text-gray-500 md:col-span-1">Alamat</p>
                    <p className="text-md text-gray-800 md:col-span-3">{employee.address}</p>
                </div>
            </div>
             <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Informasi Kepegawaian</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 pt-4">
                    <p className="text-sm font-medium text-gray-500">Bagian/Unit</p>
                    <p className="text-md text-gray-800">{unit}</p>
                    
                    <p className="text-sm font-medium text-gray-500">Jabatan</p>
                    <p className="text-md text-gray-800">{position}</p>
                    
                    <p className="text-sm font-medium text-gray-500">TMT</p>
                    <p className="text-md text-gray-800">{new Date(employee.tmt).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
                    
                    <p className="text-sm font-medium text-gray-500">Masa Kerja</p>
                    <p className="text-md text-gray-800">{masaKerja}</p>
                    
                    <p className="text-sm font-medium text-gray-500">Status Pensiun</p>
                    <p className="text-md text-gray-800">{new Date(employee.pensionDate).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'})}</p>
                </div>
            </div>
        </div>
    </Card>
);


const HistoryTab: React.FC<{
    title: string; 
    data: any[]; 
    columns: string[];
    dataKeys: string[];
    onAdd?: () => void;
    onEdit?: (item: any) => void;
    onDelete?: (item: any) => void;
}> = ({title, data, columns, dataKeys, onAdd, onEdit, onDelete}) => {
    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{title}</h2>
                {onAdd && <Button onClick={onAdd}>+ Tambah Data</Button>}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map(col => <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{col}</th>)}
                            {(onAdd || onEdit || onDelete) && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.length > 0 ? data.map((item, index) => (
                            <tr key={item.id || index}>
                                {dataKeys.map((key, i) => {
                                    let value = item[key];
                                    if (key === 'tmt' && typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
                                         value = new Date(value).toLocaleDateString('id-ID', {day: '2-digit', month: 'long', year: 'numeric'});
                                    }
                                     if (key === 'skDocument') {
                                        return (
                                            <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div>{value}</div>
                                                {item.skDocumentUrl && (
                                                    <a href={item.skDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-blue-600 hover:underline">
                                                        Lihat Dokumen
                                                    </a>
                                                )}
                                            </td>
                                        );
                                    }
                                    if (key === 'ijazahUrl' || key === 'skDocumentUrl') {
                                        return (
                                            <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item[key] ? (
                                                    <a href={item[key]} target="_blank" rel="noopener noreferrer" className="text-brand-blue-600 hover:underline">
                                                        Lihat Dokumen
                                                    </a>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </td>
                                        );
                                    }
                                    return (<td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>);
                                })}
                                {(onAdd || onEdit || onDelete) && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {title === 'Dokumen' ? (
                                            <>
                                                <a href={item.fileUrl} target="_blank" rel="noopener noreferrer" className="text-brand-blue-600 hover:text-brand-blue-900 mr-3">Lihat</a>
                                                {onDelete && <button onClick={() => onDelete(item)} className="text-red-600 hover:text-red-900">Hapus</button>}
                                            </>
                                        ) : (
                                            <>
                                                {onEdit && <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>}
                                                {onDelete && <button onClick={() => onDelete(item)} className="text-red-600 hover:text-red-900">Hapus</button>}
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        )) : (
                            <tr><td colSpan={columns.length + ((onAdd || onEdit || onDelete) ? 1 : 0)} className="text-center py-10 text-gray-500">Tidak ada data.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const EducationFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (education: Omit<Education, 'id'> & { id?: string }) => void;
    educationRecord: Education | null;
}> = ({ isOpen, onClose, onSave, educationRecord }) => {
    const [formData, setFormData] = useState<Omit<Education, 'id'> & { id?: string }>({ level: '', institution: '', major: '', year: '', ijazahUrl: '' });
    const [fileName, setFileName] = useState<string>('');

    useEffect(() => {
        if (educationRecord) {
            setFormData(educationRecord);
            setFileName(educationRecord.ijazahUrl ? 'Dokumen terlampir' : '');
        } else {
            setFormData({ level: '', institution: '', major: '', year: '', ijazahUrl: '' });
            setFileName('');
        }
    }, [educationRecord, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, ijazahUrl: reader.result as string }));
                setFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.level || !formData.institution || !formData.major || !formData.year) {
            alert('Semua field harus diisi.');
            return;
        }
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={educationRecord ? "Edit Riwayat Pendidikan" : "Tambah Riwayat Pendidikan"}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button type="submit" form="education-form">Simpan</Button>
                </>
            }
        >
            <form id="education-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jenjang Pendidikan</label>
                    <input type="text" name="level" placeholder="Contoh: S1" value={formData.level || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Sekolah/Universitas</label>
                    <input type="text" name="institution" placeholder="Contoh: Universitas Gadjah Mada" value={formData.institution || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Jurusan Program Studi</label>
                    <input type="text" name="major" placeholder="Contoh: Teknik Sipil" value={formData.major || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tahun Lulus</label>
                    <input type="text" name="year" placeholder="Contoh: 2010" value={formData.year || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Dok. Ijazah (JPG, PNG, PDF)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="ijazah-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue-600 hover:text-brand-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue-500">
                                    <span>Upload file</span>
                                    <input id="ijazah-upload" name="ijazah-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
                                </label>
                                <p className="pl-1">atau tarik dan lepas</p>
                            </div>
                            <p className="text-xs text-gray-500">{fileName ? fileName : 'PNG, JPG, PDF hingga 10MB'}</p>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

const WorkHistoryFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (workHistory: Omit<WorkHistory, 'id'> & { id?: string }) => void;
    workHistoryRecord: WorkHistory | null;
}> = ({ isOpen, onClose, onSave, workHistoryRecord }) => {
    const [formData, setFormData] = useState<Omit<WorkHistory, 'id'> & { id?: string }>({ company: '', position: '', startDate: '', endDate: '' });

    useEffect(() => {
        if (workHistoryRecord) {
            setFormData(workHistoryRecord);
        } else {
            setFormData({ company: '', position: '', startDate: '', endDate: '' });
        }
    }, [workHistoryRecord, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.company || !formData.position || !formData.startDate || !formData.endDate) {
            alert('Semua field harus diisi.');
            return;
        }
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={workHistoryRecord ? "Edit Riwayat Pekerjaan" : "Tambah Riwayat Pekerjaan"}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button type="submit" form="work-history-form">Simpan</Button>
                </>
            }
        >
            <form id="work-history-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Perusahaan</label>
                    <input type="text" name="company" placeholder="Contoh: PT. Cipta Solusi" value={formData.company || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Posisi/Jabatan</label>
                    <input type="text" name="position" placeholder="Contoh: Software Engineer" value={formData.position || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tahun Mulai</label>
                    <input type="text" name="startDate" placeholder="Contoh: 2008" value={formData.startDate || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tahun Selesai</label>
                    <input type="text" name="endDate" placeholder="Contoh: 2010" value={formData.endDate || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
            </form>
        </Modal>
    );
};

const RankHistoryFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (rankHistory: Omit<RankHistory, 'id'> & { id?: string }) => void;
    rankHistoryRecord: RankHistory | null;
}> = ({ isOpen, onClose, onSave, rankHistoryRecord }) => {
    const [formData, setFormData] = useState<Omit<RankHistory, 'id'> & { id?: string }>({ rank: '', tmt: '', skNumber: '', skDocumentUrl: '' });
    const [fileName, setFileName] = useState<string>('');

    useEffect(() => {
        if (rankHistoryRecord) {
            setFormData(rankHistoryRecord);
            setFileName(rankHistoryRecord.skDocumentUrl ? 'Dokumen terlampir' : '');
        } else {
            setFormData({ rank: '', tmt: '', skNumber: '', skDocumentUrl: '' });
            setFileName('');
        }
    }, [rankHistoryRecord, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, skDocumentUrl: reader.result as string }));
                setFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.rank || !formData.tmt || !formData.skNumber) {
            alert('Semua field harus diisi.');
            return;
        }
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={rankHistoryRecord ? "Edit Riwayat Kepangkatan" : "Tambah Riwayat Kepangkatan"}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button type="submit" form="rank-history-form">Simpan</Button>
                </>
            }
        >
            <form id="rank-history-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Pangkat/Golongan</label>
                    <input type="text" name="rank" placeholder="Contoh: Penata Muda / IIIa" value={formData.rank || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">TMT (Tanggal Mulai Tugas)</label>
                    <input type="date" name="tmt" value={formData.tmt || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nomor SK</label>
                    <input type="text" name="skNumber" placeholder="Contoh: SK/001/2015" value={formData.skNumber || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Dokumen SK (JPG, PNG, PDF)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="sk-rank-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue-600 hover:text-brand-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue-500">
                                    <span>Upload file</span>
                                    <input id="sk-rank-upload" name="sk-rank-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
                                </label>
                                <p className="pl-1">atau tarik dan lepas</p>
                            </div>
                            <p className="text-xs text-gray-500">{fileName ? fileName : 'PNG, JPG, PDF hingga 10MB'}</p>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

const CareerHistoryFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (careerHistory: Omit<CareerHistory, 'id'> & { id?: string }) => void;
    careerHistoryRecord: CareerHistory | null;
}> = ({ isOpen, onClose, onSave, careerHistoryRecord }) => {
    const [formData, setFormData] = useState<Omit<CareerHistory, 'id'> & { id?: string }>({ position: '', unit: '', tmt: '', skDocument: '', skDocumentUrl: '' });
    const [fileName, setFileName] = useState<string>('');

    useEffect(() => {
        if (careerHistoryRecord) {
            setFormData(careerHistoryRecord);
            setFileName(careerHistoryRecord.skDocumentUrl ? 'Dokumen terlampir' : '');
        } else {
            setFormData({ position: '', unit: '', tmt: '', skDocument: '', skDocumentUrl: '' });
            setFileName('');
        }
    }, [careerHistoryRecord, isOpen]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, skDocumentUrl: reader.result as string }));
                setFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.position || !formData.unit || !formData.tmt || !formData.skDocument) {
            alert('Semua field harus diisi.');
            return;
        }
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={careerHistoryRecord ? "Edit Riwayat Karir" : "Tambah Riwayat Karir"}
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button type="submit" form="career-history-form">Simpan</Button>
                </>
            }
        >
            <form id="career-history-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jabatan</label>
                        <input type="text" name="position" placeholder="Contoh: Manajer Teknik" value={formData.position || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Bagian/Unit</label>
                        <input type="text" name="unit" placeholder="Contoh: Teknik" value={formData.unit || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">TMT (Tanggal Mulai Tugas)</label>
                        <input type="date" name="tmt" value={formData.tmt || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nomor Dok. SK</label>
                        <input type="text" name="skDocument" placeholder="Contoh: SK/DIR/2018/01" value={formData.skDocument || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required/>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Dokumen SK (JPG, PNG, PDF)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue-600 hover:text-brand-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue-500">
                                    <span>Upload file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
                                </label>
                                <p className="pl-1">atau tarik dan lepas</p>
                            </div>
                            <p className="text-xs text-gray-500">{fileName ? fileName : 'PNG, JPG, PDF hingga 10MB'}</p>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

const DocumentFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (document: Omit<Document, 'id'>) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<Document, 'id'>>({ name: '', fileUrl: '', notes: '' });
    const [fileName, setFileName] = useState<string>('');

    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: '', fileUrl: '', notes: '' });
            setFileName('');
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, fileUrl: reader.result as string, name: prev.name || file.name }));
                setFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fileUrl || !formData.name) {
            alert('Nama dokumen dan file harus diisi.');
            return;
        }
        onSave(formData);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Tambah Dokumen Baru"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button type="submit" form="document-form">Simpan</Button>
                </>
            }
        >
            <form id="document-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nama Dokumen</label>
                    <input type="text" name="name" placeholder="Contoh: KTP, Ijazah, CV" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" required />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Dokumen (JPG, PNG, PDF)</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="document-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-blue-600 hover:text-brand-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-blue-500">
                                    <span>Upload file</span>
                                    <input id="document-upload" name="document-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" required/>
                                </label>
                                <p className="pl-1">atau tarik dan lepas</p>
                            </div>
                            <p className="text-xs text-gray-500">{fileName ? fileName : 'PNG, JPG, PDF hingga 10MB'}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Catatan</label>
                    <textarea name="notes" rows={3} placeholder="Tambahkan catatan singkat mengenai dokumen ini..." value={formData.notes} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500" />
                </div>
            </form>
        </Modal>
    );
};


export default DetailPegawai;
