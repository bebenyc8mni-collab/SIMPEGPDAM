
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Admin } from '../types';

const SidebarLink: React.FC<{ to: string; icon: React.ReactNode; text: string; isSubmenu?: boolean }> = ({ to, icon, text, isSubmenu = false }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${isSubmenu ? 'pl-10' : ''} ${
                isActive ? 'bg-brand-blue-700 text-white' : 'text-gray-300 hover:bg-brand-blue-800 hover:text-white'
            }`
        }
    >
        {icon}
        <span className="ml-3">{text}</span>
    </NavLink>
);

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const adminUser = user as Admin;
    const location = useLocation();

    // Helper to determine the active menu based on the current path, so it stays open on navigation.
    const getActiveMenu = () => {
        const path = location.pathname;
        if (path.includes('/admin/data-') || path.includes('/admin/struktur-organisasi')) {
            return 'data-master';
        }
        if (path.includes('/admin/presensi') || path.includes('/admin/cuti') || path.includes('/admin/payroll') || path.includes('/admin/user-login')) {
            return 'layanan';
        }
        return null;
    };

    const [openMenu, setOpenMenu] = useState<string | null>(getActiveMenu());

    const toggleMenu = (menu: string) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <aside className="w-64 bg-brand-blue-900 text-white flex flex-col p-4">
                <div className="text-2xl font-bold mb-8 text-center border-b border-brand-blue-700 pb-4">
                    SIMPEGPDAM
                </div>
                <nav className="flex-1">
                    <SidebarLink to="/admin/dashboard" icon={<Icon name="chart-pie" />} text="Dashboard" />
                    
                    {/* Data Master Dropdown */}
                    <div>
                        <button
                            onClick={() => toggleMenu('data-master')}
                            className="w-full flex items-center justify-between p-3 my-1 rounded-lg text-gray-300 hover:bg-brand-blue-800 hover:text-white transition-colors duration-200"
                        >
                            <div className="flex items-center">
                                <Icon name="circle-stack" />
                                <span className="ml-3">Data Master</span>
                            </div>
                            <Icon name="chevron-down" className={`transition-transform duration-300 ${openMenu === 'data-master' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenu === 'data-master' ? 'max-h-96' : 'max-h-0'}`}>
                            <SidebarLink to="/admin/data-pegawai" icon={<Icon name="users" />} text="Data Pegawai" isSubmenu={true} />
                            <SidebarLink to="/admin/data-jabatan" icon={<Icon name="briefcase" />} text="Data Jabatan" isSubmenu={true} />
                            <SidebarLink to="/admin/data-unit" icon={<Icon name="building-office" />} text="Data Bagian/Unit" isSubmenu={true} />
                            <SidebarLink to="/admin/data-pangkat" icon={<Icon name="star" />} text="Data Pangkat/Gol" isSubmenu={true} />
                            <SidebarLink to="/admin/struktur-organisasi" icon={<Icon name="sitemap" />} text="Struktur Organisasi" isSubmenu={true} />
                        </div>
                    </div>

                    {/* Layanan Dropdown */}
                     <div>
                        <button
                            onClick={() => toggleMenu('layanan')}
                            className="w-full flex items-center justify-between p-3 my-1 rounded-lg text-gray-300 hover:bg-brand-blue-800 hover:text-white transition-colors duration-200"
                        >
                            <div className="flex items-center">
                                <Icon name="cog-6-tooth" />
                                <span className="ml-3">Layanan</span>
                            </div>
                            <Icon name="chevron-down" className={`transition-transform duration-300 ${openMenu === 'layanan' ? 'rotate-180' : ''}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openMenu === 'layanan' ? 'max-h-96' : 'max-h-0'}`}>
                            <SidebarLink to="/admin/presensi" icon={<Icon name="clipboard-document-check" />} text="Presensi" isSubmenu={true} />
                            <SidebarLink to="/admin/cuti" icon={<Icon name="calendar-days" />} text="Cuti" isSubmenu={true} />
                            <SidebarLink to="/admin/payroll" icon={<Icon name="banknotes" />} text="Payroll" isSubmenu={true} />
                            <SidebarLink to="/admin/user-login" icon={<Icon name="key" />} text="User Login" isSubmenu={true} />
                        </div>
                    </div>
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
                    <h1 className="text-xl font-semibold">Selamat Datang, {adminUser?.username}</h1>
                    <div>
                        {/* Profile Dropdown can be added here */}
                    </div>
                </header>
                <div className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

const Icon: React.FC<{name: string; className?: string}> = ({name, className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${className || ''}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d={getIconPath(name)} />
    </svg>
)

const iconPaths: { [key: string]: string } = {
    'chart-pie': 'M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z',
    'users': 'M15 19.128a9.38 9.38 0 002.625.375m-10.5-.375a9.38 9.38 0 012.625.375m-1.5-12.375a3.375 3.375 0 013.375-3.375h1.5a3.375 3.375 0 013.375 3.375m-7.5 0j-4.5 5.25A2.25 2.25 0 006.75 15h10.5a2.25 2.25 0 002.25-2.25V6.75m-7.5 0h-1.5M6 6.75v.008m12 0v.008',
    'briefcase': 'M20.25 14.15v4.075a3.375 3.375 0 01-3.375 3.375H7.125a3.375 3.375 0 01-3.375-3.375v-4.075M16.125 12.75h-8.25M12 15.75h.008v.008H12v-.008z M12 3v8.25',
    'building-office': 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6m-6 4.5h6M6.75 21v-2.25a2.25 2.25 0 012.25-2.25h6a2.25 2.25 0 012.25 2.25V21',
    'star': 'M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z',
    'sitemap': 'M12 21v-6m0 0V9m0 6h.01M12 9h.01M12 9V3m0 0h-3m3 0h3m-6 6h-3m3 0h3m-3 6h-3m3 0h3',
    'clipboard-document-check': 'M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25V3.375c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125V2.25m-7.5 9.75h2.25m-2.25 3h2.25m-2.25 3h2.25m1.5-1.5L15 18l3-3',
    'calendar-days': 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M9.75 12.75h.008v.008H9.75v-.008zM9.75 15.75h.008v.008H9.75v-.008zm3-3h.008v.008H12.75v-.008zm3 0h.008v.008H15.75v-.008zm-3 3h.008v.008H12.75v-.008zm3 0h.008v.008H15.75v-.008z',
    'banknotes': 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21m-9 6h9m-9 6h9m-9-6l-3-3m3 3l3 3m-3-3l-3 3m3-3l3-3',
    'arrow-left-on-rectangle': 'M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l3-3m0 0l-3-3m3 3H9',
    'circle-stack': 'M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75',
    'cog-6-tooth': 'M10.343 3.94c.09-.542.56-1.002 1.112-1.112l.083-.021a2.25 2.25 0 012.87 2.87l-.021.083c-.09.542-.56 1.002-1.112 1.112l-.083.021a2.25 2.25 0 01-2.87-2.87l.021-.083zM12 15a3 3 0 100-6 3 3 0 000 6z M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    'chevron-down': 'M19.5 8.25l-7.5 7.5-7.5-7.5',
    'key': 'M15.75 5.25a3 3 0 013 3m3 0a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z'
};

const getIconPath = (name: string) => iconPaths[name] || '';


export default AdminLayout;
