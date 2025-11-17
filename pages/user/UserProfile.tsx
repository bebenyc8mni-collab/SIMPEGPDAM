import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDatabase } from '../../services/database';
import { User } from '../../types';
import DetailPegawai from '../admin/pegawai/DetailPegawai'; // Reusing the detail component

const UserProfile: React.FC = () => {
    const { user } = useAuth();
    const { db } = useDatabase();
    const currentUser = user as User;
    const employeeData = db.employees.find(e => e.id === currentUser?.employeeId);

    // This is a simplified approach. We're effectively aliasing the DetailPegawai component
    // under a new route. In a real app, you might create a read-only variant.
    // The DetailPegawai component has been refactored to accept an employeeId prop
    // for exactly this kind of reuse.

    if (!employeeData) return <div>Data tidak ditemukan.</div>

    // Fix: Pass employeeId directly as a prop to the refactored DetailPegawai component,
    // resolving the original type error from React.cloneElement.
    // Pass readOnly prop to prevent users from editing their own profile data.
    return (
        <DetailPegawai employeeId={employeeData.id} readOnly />
    );
};

export default UserProfile;