
import React, { useState, useMemo, useEffect } from 'react';
import { useDatabase } from '../../services/database';
import { Employee, Presence, PresenceStatus } from '../../types';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

const getTodayString = () => new Date().toISOString().split('T')[0];

const statusConfig: Record<PresenceStatus, { label: string; bg: string; text: string; }> = {
    'Hadir': { label: 'Hadir', bg: 'bg-green-100', text: 'text-green-800' },
    'Sakit': { label: 'Sakit', bg: 'bg-yellow-100', text: 'text-yellow-800' },
    'Izin': { label: 'Izin', bg: 'bg-blue-100', text: 'text-blue-800' },
    'Cuti': { label: 'Cuti', bg: 'bg-purple-100', text: 'text-purple-800' },
    'Alpha': { label: 'Alpha', bg: 'bg-red-100', text: 'text-red-800' },
};

const Presensi: React.FC = () => {
    const { db, updateDb } = useDatabase();
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingPresence, setEditingPresence] = useState<{ employee: Employee; presence: Presence | null } | null>(null);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const filteredEmployees = useMemo(() => {
        return db.employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            emp.nik.includes(searchTerm)
        );
    }, [db.employees, searchTerm]);
    
    const presenceMap = useMemo(() => {
        const map = new Map<string, Presence>();
        db.presences
          .filter(p => p.date === selectedDate)
          .forEach(p => map.set(p.employeeId, p));
        return map;
    }, [db.presences, selectedDate]);


    const handleOpenEditModal = (employee: Employee) => {
        const presence = presenceMap.get(employee.id) || null;
        setEditingPresence({ employee, presence });
        setIsEditModalOpen(true);
    };

    const handleSavePresence = (employeeId: string, status: PresenceStatus) => {
        const existingPresenceIndex = db.presences.findIndex(
            p => p.employeeId === employeeId && p.date === selectedDate
        );

        let newPresences = [...db.presences];

        if (existingPresenceIndex > -1) {
            // Update existing presence
            newPresences[existingPresenceIndex] = {
                ...newPresences[existingPresenceIndex],
                status: status,
            };
        } else {
            // Add new presence record
            const newPresence: Presence = {
                id: `pr_${new Date().getTime()}`,
                employeeId: employeeId,
                date: selectedDate,
                status: status,
            };
            newPresences.push(newPresence);
        }

        updateDb({ presences: newPresences });
        setIsEditModalOpen(false);
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Presensi Pegawai</h1>
                <Button onClick={() => setIsReportModalOpen(true)}>
                    Laporan Bulanan
                </Button>
            </div>

            <Card>
                <div className="p-4 flex flex-col md:flex-row gap-4 border-b">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="p-2 border rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Cari berdasarkan NIK atau Nama..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="flex-grow p-2 border rounded-md"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pegawai</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kehadiran</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredEmployees.map(employee => {
                                const presence = presenceMap.get(employee.id);
                                const status = presence?.status || 'Alpha';
                                const { bg, text } = statusConfig[status];
                                const position = db.positions.find(p => p.id === employee.positionId)?.name || 'N/A';
                                
                                return (
                                    <tr key={employee.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <img className="h-10 w-10 rounded-full object-cover" src={employee.photoUrl} alt={employee.name} />
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                                                    <div className="text-sm text-gray-500">{employee.nik}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{position}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bg} ${text}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleOpenEditModal(employee)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isEditModalOpen && (
                <EditAttendanceModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSave={handleSavePresence}
                    data={editingPresence}
                    date={selectedDate}
                />
            )}
            
            {isReportModalOpen && (
                 <ReportModal
                    isOpen={isReportModalOpen}
                    onClose={() => setIsReportModalOpen(false)}
                    db={db}
                />
            )}
        </div>
    );
};

const EditAttendanceModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (employeeId: string, status: PresenceStatus) => void;
    data: { employee: Employee; presence: Presence | null } | null;
    date: string;
}> = ({ isOpen, onClose, onSave, data, date }) => {
    const [selectedStatus, setSelectedStatus] = useState<PresenceStatus>('Alpha');

    useEffect(() => {
        if (data) {
            setSelectedStatus(data.presence?.status || 'Alpha');
        }
    }, [data]);

    const handleSubmit = () => {
        if (data) {
            onSave(data.employee.id, selectedStatus);
        }
    };

    if (!data) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Edit Kehadiran - ${data.employee.name}`}
            footer={<>
                <Button variant="secondary" onClick={onClose}>Batal</Button>
                <Button onClick={handleSubmit}>Simpan</Button>
            </>}
        >
            <p className="mb-4">Mengatur status kehadiran untuk tanggal: <strong>{new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
            <div className="space-y-2">
                {Object.keys(statusConfig).map(key => (
                    <label key={key} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                        <input
                            type="radio"
                            name="status"
                            value={key}
                            checked={selectedStatus === key}
                            onChange={() => setSelectedStatus(key as PresenceStatus)}
                            className="h-4 w-4 text-brand-blue-600 border-gray-300 focus:ring-brand-blue-500"
                        />
                        <span className={`ml-3 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusConfig[key as PresenceStatus].bg} ${statusConfig[key as PresenceStatus].text}`}>
                            {statusConfig[key as PresenceStatus].label}
                        </span>
                    </label>
                ))}
            </div>
        </Modal>
    );
};

const ReportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  db: ReturnType<typeof useDatabase>['db'];
}> = ({ isOpen, onClose, db }) => {
    const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7));

    const reportData = useMemo(() => {
        const [year, month] = reportMonth.split('-').map(Number);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const monthlyPresences = db.presences.filter(p => {
            const pDate = new Date(p.date);
            return pDate >= startDate && pDate <= endDate;
        });

        return db.employees.map(emp => {
            const summary: Record<PresenceStatus, number> & { name: string } = {
                name: emp.name,
                'Hadir': 0, 'Sakit': 0, 'Izin': 0, 'Cuti': 0, 'Alpha': 0
            };
            const empPresences = monthlyPresences.filter(p => p.employeeId === emp.id);
            empPresences.forEach(p => {
                summary[p.status]++;
            });
            // Note: A more complex calculation would be needed for Alpha based on workdays,
            // but for this scope, we'll count recorded presences.
            return summary;
        });
    }, [reportMonth, db.employees, db.presences]);
    
    const handlePrint = () => {
        const printContent = document.getElementById('print-area')?.innerHTML;
        const originalContent = document.body.innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        
        if (printWindow && printContent) {
            printWindow.document.write('<html><head><title>Laporan Presensi</title>');
            printWindow.document.write('<script src="https://cdn.tailwindcss.com"></script>'); // For styling
            printWindow.document.write('<style>body { padding: 2rem; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContent);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };


    return (
         <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Laporan Presensi Bulanan"
            footer={<>
                <Button variant="secondary" onClick={onClose}>Tutup</Button>
                <Button onClick={handlePrint}>Print</Button>
            </>}
        >
            <div className="mb-4">
                <label htmlFor="reportMonth" className="block text-sm font-medium text-gray-700">Pilih Bulan:</label>
                <input
                    type="month"
                    id="reportMonth"
                    value={reportMonth}
                    onChange={e => setReportMonth(e.target.value)}
                    className="mt-1 p-2 border rounded-md"
                />
            </div>
            <div id="print-area">
                <h3 className="text-xl font-bold text-center mb-2">Laporan Kehadiran Karyawan</h3>
                <p className="text-center text-gray-600 mb-4">
                    Bulan: {new Date(reportMonth + '-02').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </p>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pegawai</th>
                                {Object.keys(statusConfig).map(key => (
                                    <th key={key} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{key}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reportData.map((row, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{row.name}</td>
                                    {Object.keys(statusConfig).map(key => (
                                        <td key={key} className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center">{row[key as PresenceStatus]}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
};

export default Presensi;
