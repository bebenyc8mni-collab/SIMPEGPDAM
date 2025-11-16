
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

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
            <header className="absolute top-0 left-0 right-0 z-10 fade-in">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-brand-blue-800 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                        </svg>
                        SIMPEGPDAM
                    </div>
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-gray-600 hover:text-brand-blue-600">Beranda</a>
                        <a href="#" className="text-gray-600 hover:text-brand-blue-600">Profil</a>
                        <a href="#" className="text-gray-600 hover:text-brand-blue-600">Layanan</a>
                        <a href="#" className="text-gray-600 hover:text-brand-blue-600">Kontak</a>
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
                <section className="relative min-h-screen flex items-center bg-brand-blue-50 bg-water-pattern">
                    <div className="container mx-auto px-6 text-center">
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
