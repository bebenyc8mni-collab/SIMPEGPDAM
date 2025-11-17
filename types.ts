
export interface User {
  id: string;
  employeeId: string;
  email: string;
  role: 'user';
}

export interface Admin {
  id: string;
  username: string;
  role: 'admin';
}

export interface Position {
  id: string;
  name: string;
  level: string;
  parentPositionId?: string; // ID of the parent position
  unitId: string; // ID of the Unit/Bagian
  description: string;
}

export interface Unit {
  id: string;
  name: string;
  code: string;
  description: string;
  headId: string; // Employee ID of the unit head
  phone: string;
  email: string;
  address: string;
  status: 'Aktif' | 'Non Aktif';
}

export interface Pangkat {
    id: string;
    name: string;
}

export interface Education {
  id: string;
  level: string;
  institution: string;
  major: string;
  year: string;
  ijazahUrl?: string;
}

export interface WorkHistory {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
}

export interface RankHistory {
    id: string;
    rank: string;
    tmt: string;
    skNumber: string;
    skDocumentUrl?: string;
}

export interface CareerHistory {
    id: string;
    position: string;
    unit: string;
    tmt: string;
    skDocument: string;
    skDocumentUrl?: string;
}

export interface Document {
    id: string;
    name: string;
    fileUrl: string;
    notes: string;
}

export interface Employee {
  id: string;
  nik: string;
  name: string;
  photoUrl: string;
  positionId: string;
  unitId: string;
  employmentStatus: 'Tetap' | 'Kontrak' | 'Harian';
  status: 'Aktif' | 'Tidak Aktif' | 'Pensiun';
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  lastEducation: string;
  email: string;
  address: string;
  phone: string;
  tmt: string; // Tanggal Mulai Tugas
  pensionDate: string;
  educationHistory: Education[];
  workHistory: WorkHistory[];
  rankHistory: RankHistory[];
  careerHistory: CareerHistory[];
  documents: Document[];
}

export interface CutiRequest {
    id: string;
    employeeId: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export type PresenceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alpha' | 'Cuti';

export interface Presence {
    id: string;
    employeeId: string;
    date: string; // YYYY-MM-DD
    status: PresenceStatus;
}

// Global window declarations
declare global {
  interface Window {
    anime: any;
    echarts: any;
  }
}
