import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-2xl font-bold text-blue-600">Auth System</h1>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="hidden md:ml-4 md:flex md:items-center md:space-x-4">
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Sign out
                                </button>
                            </div>
                            {/* Mobile menu button */}
                            <div className="md:hidden flex items-center">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                                >
                                    <span className="sr-only">Open main menu</span>
                                    {!isMenuOpen ? (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        </svg>
                                    ) : (
                                        <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome!</h2>
                            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                                <p className="text-blue-700">
                                    You are logged in as: <span className="font-semibold">{currentUser?.email}</span>
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Sample cards */}
                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                                                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5">
                                                <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                                                <p className="text-sm text-gray-500">Manage your account settings</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-5 py-3">
                                        <button className="text-sm text-blue-600 hover:text-blue-500">Update profile →</button>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                                                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5">
                                                <h3 className="text-lg font-medium text-gray-900">Security</h3>
                                                <p className="text-sm text-gray-500">Configure security settings</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-5 py-3">
                                        <button className="text-sm text-blue-600 hover:text-blue-500">View settings →</button>
                                    </div>
                                </div>

                                <div className="bg-white overflow-hidden shadow rounded-lg">
                                    <div className="p-5">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                                                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div className="ml-5">
                                                <h3 className="text-lg font-medium text-gray-900">Activity</h3>
                                                <p className="text-sm text-gray-500">View recent account activity</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-5 py-3">
                                        <button className="text-sm text-blue-600 hover:text-blue-500">View activity →</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
