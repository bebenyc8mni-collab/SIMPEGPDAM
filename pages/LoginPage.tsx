
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'admin' | 'user'>('user');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const success = await login(identifier, password, activeTab);
        if (!success) {
            setError('Login gagal. Periksa kembali username/email dan password Anda.');
        }
        setLoading(false);
    };

    const renderForm = () => {
        const isUser = activeTab === 'user';
        return (
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor={isUser ? "email" : "username"} className="block text-sm font-medium text-gray-700">
                        {isUser ? 'ID Pegawai / Email' : 'Username Admin'}
                    </label>
                    <input
                        id={isUser ? "email" : "username"}
                        type={isUser ? "text" : "text"}
                        autoComplete={isUser ? "email" : "username"}
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-blue-500 focus:border-brand-blue-500 sm:text-sm"
                    />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex items-center justify-between">
                    <a href="#" className="text-sm text-brand-blue-600 hover:text-brand-blue-500">Lupa password?</a>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Memproses...' : 'Login'}
                    </button>
                </div>
            </form>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 bg-water-pattern">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                 <Link to="/" className="text-3xl font-bold text-brand-blue-800 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 mr-3 text-brand-blue-600">
                        <path d="M12 21.75c-4.28 0-8.22-3.44-8.22-7.72C3.78 9.75 12 2.25 12 2.25s8.22 7.5 8.22 11.78c0 4.28-3.94 7.72-8.22 7.72z" />
                    </svg>
                    SIMPEGPDAM
                </Link>
                <h2 className="mt-6 text-2xl font-bold text-gray-900">
                    Masuk ke akun Anda
                </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
                    <div className="mb-6">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('user')}
                                className={`flex-1 py-2 text-sm font-medium text-center ${activeTab === 'user' ? 'text-brand-blue-600 border-b-2 border-brand-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                User / Pegawai
                            </button>
                            <button
                                onClick={() => setActiveTab('admin')}
                                className={`flex-1 py-2 text-sm font-medium text-center ${activeTab === 'admin' ? 'text-brand-blue-600 border-b-2 border-brand-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                Admin
                            </button>
                        </div>
                    </div>
                    {renderForm()}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
