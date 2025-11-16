
import React, { useEffect, useRef } from 'react';
import Card from '../../components/ui/Card';
import { useDatabase } from '../../services/database';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-6">
        <div className="p-3 rounded-full bg-brand-blue-100 text-brand-blue-600 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </Card>
);

const AdminDashboard: React.FC = () => {
    const { db } = useDatabase();
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartRef.current && window.echarts) {
            const chart = window.echarts.init(chartRef.current);
            const option = {
                title: {
                    text: 'Statistik Kehadiran Bulan Ini',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                },
                series: [
                    {
                        name: 'Kehadiran',
                        type: 'pie',
                        radius: '50%',
                        data: [
                            { value: 104, name: 'Hadir' },
                            { value: 5, name: 'Sakit' },
                            { value: 8, name: 'Izin' },
                            { value: 2, name: 'Alpha' },
                        ],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            chart.setOption(option);
            
            const resizeHandler = () => chart.resize();
            window.addEventListener('resize', resizeHandler);
            
            return () => {
                window.removeEventListener('resize', resizeHandler);
                chart.dispose();
            };
        }
    }, []);


    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Admin</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Pegawai" value={db.employees.length} icon={<Icon name="users" />} />
                <StatCard title="Total Jabatan" value={db.positions.length} icon={<Icon name="briefcase" />} />
                <StatCard title="Total Bagian/Unit" value={db.units.length} icon={<Icon name="building-office" />} />
                <StatCard title="Pengajuan Cuti" value={db.cutiRequests.filter(c => c.status === 'Pending').length} icon={<Icon name="calendar-days" />} />
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
                </Card>
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
                    <ul className="space-y-4">
                        <li className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                                <Icon name="user-plus"/>
                            </div>
                            <p className="text-gray-600">Pegawai baru <span className="font-semibold">Andi Wijaya</span> ditambahkan.</p>
                        </li>
                        <li className="flex items-center">
                             <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                <Icon name="calendar-days"/>
                            </div>
                            <p className="text-gray-600"><span className="font-semibold">Citra Lestari</span> mengajukan cuti.</p>
                        </li>
                         <li className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-3">
                                <Icon name="pencil-square"/>
                            </div>
                            <p className="text-gray-600">Data <span className="font-semibold">Budi Santoso</span> diperbarui.</p>
                        </li>
                    </ul>
                </Card>
            </div>
        </div>
    );
};

const Icon: React.FC<{name: string}> = ({name}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d={getIconPath(name)} />
    </svg>
)

const iconPaths: { [key: string]: string } = {
    'users': 'M15 19.128a9.38 9.38 0 002.625.375m-10.5-.375a9.38 9.38 0 012.625.375m-1.5-12.375a3.375 3.375 0 013.375-3.375h1.5a3.375 3.375 0 013.375 3.375m-7.5 0j-4.5 5.25A2.25 2.25 0 006.75 15h10.5a2.25 2.25 0 002.25-2.25V6.75m-7.5 0h-1.5M6 6.75v.008m12 0v.008',
    'briefcase': 'M20.25 14.15v4.075a3.375 3.375 0 01-3.375 3.375H7.125a3.375 3.375 0 01-3.375-3.375v-4.075M16.125 12.75h-8.25M12 15.75h.008v.008H12v-.008z M12 3v8.25',
    'building-office': 'M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6M9 11.25h6m-6 4.5h6M6.75 21v-2.25a2.25 2.25 0 012.25-2.25h6a2.25 2.25 0 012.25 2.25V21',
    'calendar-days': 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M9.75 12.75h.008v.008H9.75v-.008zM9.75 15.75h.008v.008H9.75v-.008zm3-3h.008v.008H12.75v-.008zm3 0h.008v.008H15.75v-.008zm-3 3h.008v.008H12.75v-.008zm3 0h.008v.008H15.75v-.008z',
    'user-plus': 'M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z',
    'pencil-square': 'M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10',
};

const getIconPath = (name: string) => iconPaths[name] || '';

export default AdminDashboard;
