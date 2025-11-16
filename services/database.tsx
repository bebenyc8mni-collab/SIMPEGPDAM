import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Employee, Position, Unit, Pangkat, Admin, User, CutiRequest, Presence } from '../types';

interface Database {
  employees: Employee[];
  positions: Position[];
  units: Unit[];
  pangkats: Pangkat[];
  admins: Admin[];
  users: User[];
  cutiRequests: CutiRequest[];
  presences: Presence[];
}

interface DatabaseContextType {
  db: Database;
  updateDb: (newDb: Partial<Database>) => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const DB_KEY = 'simpegdam_db';

const getInitialData = (): Database => {
  // Sample Data
  const units: Unit[] = [
    { id: 'u1', name: 'Teknik', code: 'TEK', description: 'Divisi yang menangani operasional teknis.', headId: 'e1', phone: '081234567890', email: 'teknik@pdam.com', address: 'Jl. Teknik No. 1, Banggai', status: 'Aktif' },
    { id: 'u2', name: 'Administrasi & Keuangan', code: 'ADK', description: 'Divisi yang menangani administrasi dan keuangan perusahaan.', headId: 'e2', phone: '087654321098', email: 'adminkeu@pdam.com', address: 'Jl. Administrasi No. 2, Banggai', status: 'Aktif' },
    { id: 'u3', name: 'Hubungan Langganan', code: 'HUBLA', description: 'Divisi yang menangani keluhan dan hubungan dengan pelanggan.', headId: 'e1', phone: '08111222333', email: 'hubla@pdam.com', address: 'Jl. Pelanggan No. 3, Banggai', status: 'Non Aktif' },
  ];

  const positions: Position[] = [
    { id: 'p1', name: 'Direktur Utama', level: 'Eselon I', unitId: 'u2', description: 'Memimpin seluruh operasional perusahaan.' },
    { id: 'p2', name: 'Manajer Teknik', level: 'Eselon II', parentPositionId: 'p1', unitId: 'u1', description: 'Mengelola semua aspek teknis.' },
    { id: 'p3', name: 'Staff IT', level: 'Staff', parentPositionId: 'p2', unitId: 'u1', description: 'Mendukung infrastruktur teknologi informasi.' },
    { id: 'p4', name: 'Staff Keuangan', level: 'Staff', parentPositionId: 'p1', unitId: 'u2', description: 'Mengelola keuangan dan akuntansi.' },
    { id: 'p5', name: 'Staff HRD', level: 'Staff', parentPositionId: 'p1', unitId: 'u2', description: 'Mengelola sumber daya manusia.' },
  ];
  
  const pangkats: Pangkat[] = [
    { id: 'g1', name: 'Golongan I/a' },
    { id: 'g2', name: 'Golongan II/a' },
    { id: 'g3', name: 'Golongan III/a' },
  ];

  const employees: Employee[] = [
    {
      id: 'e1',
      nik: '1234567890123456',
      name: 'Budi Santoso',
      photoUrl: 'https://picsum.photos/id/1005/200/200',
      positionId: 'p2',
      unitId: 'u1',
      employmentStatus: 'Tetap',
      status: 'Aktif',
      birthPlace: 'Jakarta',
      birthDate: '1985-05-15',
      gender: 'Laki-laki',
      lastEducation: 'S1 Teknik Informatika',
      email: 'budi.santoso@example.com',
      address: 'Jl. Merdeka No. 10, Jakarta',
      phone: '081234567890',
      tmt: '2010-01-10',
      pensionDate: '2050-05-15',
      educationHistory: [
          {id: 'edu1', level: 'S1', institution: 'Universitas Indonesia', major: 'Teknik Informatika', year: '2008', ijazahUrl: ''},
          {id: 'edu2', level: 'SMA', institution: 'SMA Negeri 1 Jakarta', major: 'IPA', year: '2004', ijazahUrl: ''},
      ],
      workHistory: [{id: 'work1', company: 'PT. Cipta Solusi', position: 'Software Engineer', startDate: '2008', endDate: '2010'}],
      rankHistory: [{id: 'rank1', rank: 'Penata Muda / IIIa', tmt: '2015-04-01', skNumber: 'SK/001/2015', skDocumentUrl: ''}],
      careerHistory: [{id: 'career1', position: 'Manajer Teknik', unit: 'Teknik', tmt: '2018-01-01', skDocument: 'SK/DIR/2018/01', skDocumentUrl: ''}],
      documents: [{id: 'doc1', name: 'Ijazah S1', fileUrl: '', notes: 'Fotokopi ijazah legalisir.'}],
    },
    {
      id: 'e2',
      nik: '6543210987654321',
      name: 'Citra Lestari',
      photoUrl: 'https://picsum.photos/id/1011/200/200',
      positionId: 'p4',
      unitId: 'u2',
      employmentStatus: 'Tetap',
      status: 'Aktif',
      birthPlace: 'Bandung',
      birthDate: '1990-08-20',
      gender: 'Perempuan',
      lastEducation: 'S1 Akuntansi',
      email: 'citra.lestari@example.com',
      address: 'Jl. Asia Afrika No. 5, Bandung',
      phone: '087654321098',
      tmt: '2015-03-12',
      pensionDate: '2055-08-20',
       educationHistory: [], workHistory: [], rankHistory: [], careerHistory: [], documents: [],
    },
  ];

  const admins: Admin[] = [{ id: 'a1', username: 'admin', role: 'admin' }];
  const users: User[] = [
    { id: 'usr1', employeeId: 'e1', email: 'budi.santoso@example.com', role: 'user' },
    { id: 'usr2', employeeId: 'e2', email: 'citra.lestari@example.com', role: 'user' },
  ];
  
  const presences: Presence[] = [
      { id: 'pr1', employeeId: 'e1', date: new Date().toISOString().split('T')[0], status: 'Hadir' },
      { id: 'pr2', employeeId: 'e2', date: new Date().toISOString().split('T')[0], status: 'Hadir' },
  ];

  return { employees, positions, units, pangkats, admins, users, cutiRequests: [], presences };
};

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<Database>(() => {
    // This initializer function now only *loads* data, it doesn't save.
    try {
      const savedDb = localStorage.getItem(DB_KEY);
      if (savedDb) {
        return JSON.parse(savedDb);
      }
    } catch (error) {
      console.error("Failed to initialize database from localStorage", error);
      // If parsing fails, it's better to remove the corrupted data.
      localStorage.removeItem(DB_KEY);
    }
    // Return initial data if nothing is saved or if data was corrupted.
    return getInitialData();
  });

  // Use a useEffect hook to persist the 'db' state to localStorage whenever it changes.
  // This is a cleaner way to handle side effects like writing to localStorage.
  useEffect(() => {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (error) {
       console.error("Failed to save database to localStorage", error);
    }
  }, [db]);


  const updateDb = (newDbPart: Partial<Database>) => {
    // This function now only updates the state. The useEffect hook above will handle saving.
    setDb(prevDb => ({ ...prevDb, ...newDbPart }));
  };

  return (
    <DatabaseContext.Provider value={{ db, updateDb }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
