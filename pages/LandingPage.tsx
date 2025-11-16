
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const officeLocations = [
  {
    id: 1,
    name: 'Kantor Pusat PDAM Banggai',
    address: 'Jl. Imam Bonjol No.23, Luwuk, Kabupaten Banggai, Sulawesi Tengah',
    phone: '(0461) 21234',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.133748255531!2d122.78801531526715!3d-0.9575826355408827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d86a100593361eb%3A0xb6906a2a22e841e3!2sKantor%20PDAM%20Kabupaten%20Banggai!5e0!3m2!1sen!2sid!4v1678886543210!5m2!1sen!2sid'
  },
  {
    id: 2,
    name: 'Unit Pelayanan Luwuk Utara',
    address: 'Jl. Trans Sulawesi, Tontouan, Luwuk, Kabupaten Banggai',
    phone: '(0461) 21235',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.133748255531!2d122.78801531526715!3d-0.9575826355408827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d86a100593361eb%3A0xb6906a2a22e841e3!2sKantor%20PDAM%20Kabupaten%20Banggai!5e0!3m2!1sen!2sid!4v1678886543210!5m2!1sen!2sid'
  },
   {
    id: 3,
    name: 'Unit Pelayanan Luwuk Selatan',
    address: 'Jl. Sam Ratulangi, Hanga-hanga, Luwuk Selatan, Kabupaten Banggai',
    phone: '(0461) 21236',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.133748255531!2d122.78801531526715!3d-0.9575826355408827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d86a100593361eb%3A0xb6906a2a22e841e3!2sKantor%20PDAM%20Kabupaten%20Banggai!5e0!3m2!1sen!2sid!4v1678886543210!5m2!1sen!2sid'
  },
   {
    id: 4,
    name: 'Kantor Cabang Pagimana',
    address: 'Jl. Pelabuhan, Pagimana, Kabupaten Banggai',
    phone: '(0461) 31121',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.133748255531!2d122.78801531526715!3d-0.9575826355408827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d86a100593361eb%3A0xb6906a2a22e841e3!2sKantor%20PDAM%20Kabupaten%20Banggai!5e0!3m2!1sen!2sid!4v1678886543210!5m2!1sen!2sid'
  },
   {
    id: 5,
    name: 'Kantor Cabang Batui',
    address: 'Jl. Jenderal Sudirman, Batui, Kabupaten Banggai',
    phone: '(0461) 42113',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.133748255531!2d122.78801531526715!3d-0.9575826355408827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d86a100593361eb%3A0xb6906a2a22e841e3!2sKantor%20PDAM%20Kabupaten%20Banggai!5e0!3m2!1sen!2sid!4v1678886543210!5m2!1sen!2sid'
  },
   {
    id: 6,
    name: 'Unit Pelayanan Toili',
    address: 'Jl. Poros Toili, Cendana Pura, Toili, Kabupaten Banggai',
    phone: '(0461) 51007',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.133748255531!2d122.78801531526715!3d-0.9575826355408827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d86a100593361eb%3A0xb6906a2a22e841e3!2sKantor%20PDAM%20Kabupaten%20Banggai!5e0!3m2!1sen!2sid!4v1678886543210!5m2!1sen!2sid'
  },
   {
    id: 7,
    name: 'Kantor Cabang Bunta',
    address: 'Jl. Kihajar Dewantara, Bunta, Kabupaten Banggai',
    phone: '(0461) 61124',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.133748255531!2d122.78801531526715!3d-0.9575826355408827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d86a100593361eb%3A0xb6906a2a22e841e3!2sKantor%20PDAM%20Kabupaten%20Banggai!5e0!3m2!1sen!2sid!4v1678886543210!5m2!1sen!2sid'
  },
   {
    id: 8,
    name: 'Unit Pelayanan Nuhon',
    address: 'Jl. Raya Nuhon, Nuhon, Kabupaten Banggai',
    phone: '(0461) 61125',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.133748255531!2d122.78801531526715!3d-0.9575826355408827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d86a100593361eb%3A0xb6906a2a22e841e3!2sKantor%20PDAM%20Kabupaten%20Banggai!5e0!3m2!1sen!2sid!4v1678886543210!5m2!1sen!2sid'
  },
   {
    id: 9,
    name: 'Kantor Cabang Kintom',
    address: 'Jl. Kintom-Luwuk, Kintom, Kabupaten Banggai',
    phone: '(0461) 71008',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.133748255531!2d122.78801531526715!3d-0.9575826355408827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d86a100593361eb%3A0xb6906a2a22e841e3!2sKantor%20PDAM%20Kabupaten%20Banggai!5e0!3m2!1sen!2sid!4v1678886543210!5m2!1sen!2sid'
  },
   {
    id: 10,
    name: 'Unit Pelayanan Masama',
    address: 'Jl. Cokroaminoto, Masama, Kabupaten Banggai',
    phone: '(0461) 71009',
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.133748255531!2d122.78801531526715!3d-0.9575826355408827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d86a100593361eb%3A0xb6906a2a22e841e3!2sKantor%20PDAM%20Kabupaten%20Banggai!5e0!3m2!1sen!2sid!4v1678886543210!5m2!1sen!2sid'
  },
];


const LandingPage: React.FC = () => {
    
    useEffect(() => {
        if (window.anime) {
            window.anime({
                targets: '.fade-in',
                opacity: [0, 1],
                translateY: [20, 0],
                delay: window.anime.stagger(200),
                easing: 'easeOutExpo'
            });
        }
    }, []);

    return (
        <div className="bg-white">
            {/* Header */}
            <header className="absolute top-0 left-0 right-0 z-20 fade-in">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-brand-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mr-3 text-brand-blue-600">
                            <path d="M12 21.75c-4.28 0-8.22-3.44-8.22-7.72C3.78 9.75 12 2.25 12 2.25s8.22 7.5 8.22 11.78c0 4.28-3.94 7.72-8.22 7.72z" />
                        </svg>
                        SIMPEGPDAM
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-gray-600 hover:text-brand-blue-600">Beranda</a>
                        <a href="#" className="text-gray-600 hover:text-brand-blue-600">Profil</a>
                        <a href="#" className="text-gray-600 hover:text-brand-blue-600">Layanan</a>
                        <a href="#kontak" className="text-gray-600 hover:text-brand-blue-600">Kontak</a>
                    </nav>
                    <Link to="/login">
                        <button className="bg-brand-blue-600 text-white px-6 py-2 rounded-full hover:bg-brand-blue-700 transition-colors">
                            Login
                        </button>
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main>
                <section className="relative min-h-screen flex items-center bg-brand-blue-50 bg-water-pattern overflow-hidden">
                    <div className="container mx-auto px-6 text-center z-10">
                        <div className="max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-6xl font-extrabold text-brand-blue-900 leading-tight mb-4 fade-in">
                                Sistem Informasi Kepegawaian Modern
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 fade-in">
                                Mengelola data kepegawaian Perumda Air Minum Kabupaten Banggai menjadi lebih mudah, cepat, dan efisien.
                            </p>
                            <Link to="/login" className="inline-block bg-brand-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-brand-blue-700 transition-transform transform hover:scale-105 fade-in">
                                Masuk ke Sistem
                            </Link>
                        </div>
                    </div>
                     {/* Animated Water Background */}
                    <div className="absolute bottom-0 left-0 w-full h-1/3 z-0">
                        <div className="wave wave1"></div>
                        <div className="wave wave2"></div>
                        <div className="wave wave3"></div>
                    </div>
                    <style>{`
                        @keyframes move_wave {
                            0% {
                                transform: translateX(0) translateZ(0) scaleY(1);
                            }
                            50% {
                                transform: translateX(-25%) translateZ(0) scaleY(0.55);
                            }
                            100% {
                                transform: translateX(-50%) translateZ(0) scaleY(1);
                            }
                        }
                        .wave {
                            background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3e%3cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='%2393c5fd'/%3e%3c/svg%3e");
                            position: absolute;
                            width: 200%;
                            height: 100%;
                            bottom: 0;
                            left: 0;
                            background-repeat: repeat-x;
                            background-size: 50% 120px;
                        }
                        .wave1 {
                            animation: move_wave 15s linear infinite;
                            opacity: 0.2;
                            animation-delay: -3s;
                        }
                        .wave2 {
                            animation: move_wave 20s linear infinite;
                            opacity: 0.3;
                            animation-delay: -4s;
                            background-size: 50% 140px;
                        }
                         .wave3 {
                            animation: move_wave 12s linear infinite;
                            opacity: 0.2;
                             animation-delay: -2s;
                            background-size: 50% 100px;
                        }
                    `}</style>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12 fade-in">
                            <h2 className="text-3xl font-bold text-gray-800">Fitur Unggulan</h2>
                            <p className="text-gray-500 mt-2">Semua yang Anda butuhkan dalam satu platform terintegrasi.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm fade-in">
                                <div className="inline-block p-4 bg-brand-blue-100 text-brand-blue-600 rounded-full mb-4">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.375m-10.5-.375a9.38 9.38 0 012.625.375m-1.5-12.375a3.375 3.375 0 013.375-3.375h1.5a3.375 3.375 0 013.375 3.375m-7.5 0j-4.5 5.25A2.25 2.25 0 006.75 15h10.5a2.25 2.25 0 002.25-2.25V6.75m-7.5 0h-1.5M6 6.75v.008m12 0v.008" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Manajemen Pegawai</h3>
                                <p className="text-gray-600">Kelola data induk pegawai, riwayat karir, pendidikan, dan dokumen secara terpusat.</p>
                            </div>
                             <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm fade-in">
                                <div className="inline-block p-4 bg-brand-blue-100 text-brand-blue-600 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Layanan Mandiri</h3>
                                <p className="text-gray-600">Pegawai dapat melihat data pribadi, mengajukan cuti, dan mengakses slip gaji secara online.</p>
                            </div>
                             <div className="text-center p-8 bg-gray-50 rounded-lg shadow-sm fade-in">
                                <div className="inline-block p-4 bg-brand-blue-100 text-brand-blue-600 rounded-full mb-4">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3m-16.5 0h16.5m-16.5 0v11.25A2.25 2.25 0 005.25 16.5h13.5A2.25 2.25 0 0021 14.25V3M12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Dashboard & Laporan</h3>
                                <p className="text-gray-600">Visualisasi data interaktif dan pembuatan laporan kepegawaian secara otomatis.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Contact Section */}
                <section id="kontak" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12 fade-in">
                            <h2 className="text-3xl font-bold text-gray-800">Lokasi Kantor Kami</h2>
                            <p className="text-gray-500 mt-2">Temukan kantor cabang kami yang terdekat dengan Anda.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {officeLocations.map(office => (
                                <div key={office.id} className="bg-white rounded-lg shadow-md overflow-hidden fade-in">
                                    <iframe
                                        src={office.mapSrc}
                                        width="100%"
                                        height="250"
                                        style={{ border: 0 }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title={`Peta Lokasi ${office.name}`}
                                    ></iframe>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2 text-brand-blue-800">{office.name}</h3>
                                        <p className="text-gray-600 mb-4">{office.address}</p>
                                        <div className="flex items-center text-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-brand-blue-600">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                            </svg>
                                            <span>{office.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-brand-blue-900 text-white py-10">
                <div className="container mx-auto px-6 text-center">
                    <p>&copy; {new Date().getFullYear()} Perumda Air Minum Kabupaten Banggai. All rights reserved.</p>
                    <p className="text-sm text-brand-blue-300 mt-2">Jl. Contoh Alamat No. 123, Banggai, Sulawesi Tengah</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;