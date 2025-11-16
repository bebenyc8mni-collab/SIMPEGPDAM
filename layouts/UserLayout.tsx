
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useDatabase } from '../services/database';
import { User, Employee } from '../types';

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-brand-blue-700 text-white' : 'text-gray-300 hover:bg-brand-blue-800 hover:text-white'
            }`
        }
    >
        {icon}
        <span className="ml-3">{text}</span>
    </NavLink>
);

const UserLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const { db } = useDatabase();
    
    const currentUser = user as User;
    const employeeData = db.employees.find(e => e.id === currentUser?.employeeId);

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-brand-blue-900 text-white flex flex-col p-4">
                <div className="text-2xl font-bold mb-4 text-center border-b border-brand-blue-700 pb-4">
                    SIMPEGPDAM
                </div>
                 {employeeData && (
                    <div className="flex flex-col items-center mb-6 text-center">
                        <img src={employeeData.photoUrl} alt={employeeData.name} className="w-24 h-24 rounded-full border-4 border-brand-blue-700 object-cover" />
                        <h2 className="mt-2 text-lg font-semibold">{employeeData.name}</h2>
                        <p className="text-sm text-gray-400">{employeeData.email}</p>
                    </div>
                )}
                <nav className="flex-1">
                    <SidebarLink to="/user/dashboard" icon={<Icon name="chart-pie" />} text="Dashboard" />
                    <SidebarLink to="/user/profil-saya" icon={<Icon name="user-circle" />} text="Profil Saya" />
                    <SidebarLink to="/user/presensi" icon={<Icon name="clipboard-document-check" />} text="Presensi" />
                    <SidebarLink to="/user/cuti" icon={<Icon name="calendar-days" />} text="Pengajuan Cuti" />
                    <SidebarLink to="/user/slip-gaji" icon={<Icon name="banknotes" />} text="Slip Gaji" />
                </nav>
                 <button
                    onClick={logout}
                    className="flex items-center p-3 my-1 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white transition-colors duration-200"
                >
                    <Icon name="arrow-left-on-rectangle" />
                    <span className="ml-3">Logout</span>
                </button>
            </aside>
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-md p-4 flex justify-between items-center">
                    <h1 className="text-xl font-semibold">Selamat Datang, {employeeData?.name}</h1>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const Icon: React.FC<{name: string}> = ({name}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d={getIconPath(name)} />
    </svg>
)

const iconPaths: { [key: string]: string } = {
    'chart-pie': 'M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z',
    'user-circle': 'M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z',
    'clipboard-document-check': 'M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25V3.375c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125V2.25m-7.5 9.75h2.25m-2.25 3h2.25m-2.25 3h2.25m1.5-1.5L15 18l3-3',
    'calendar-days': 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M9.75 12.75h.008v.008H9.75v-.008zM9.75 15.75h.008v.008H9.75v-.008zm3-3h.008v.008H12.75v-.008zm3 0h.008v.008H15.75v-.008zm-3 3h.008v.008H12.75v-.008zm3 0h.008v.008H15.75v-.008z',
    'banknotes': 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21m-9 6h9m-9 6h9m-9-6l-3-3m3 3l3 3m-3-3l-3 3m3-3l3-3',
    'arrow-left-on-rectangle': 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9',
};

const getIconPath = (name: string) => iconPaths[name] || '';

export default UserLayout;
