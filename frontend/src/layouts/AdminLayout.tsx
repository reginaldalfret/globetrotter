
import { useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { Home, Map, Activity, Users, LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminLayout() {
    const { user, logout } = useAuthStore();
    const location = useLocation();

    if (user?.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    const navigation = [
        { name: 'Overview', href: '/admin', icon: LayoutDashboard },
        { name: 'Cities', href: '/admin/cities', icon: Map },
        { name: 'Activities', href: '/admin/activities', icon: Activity },
        { name: 'Users', href: '/admin/users', icon: Users },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 hidden md:flex flex-col z-20 shadow-lg">
                <div className="p-6 flex-1">
                    <div className="flex items-center gap-3 mb-10 px-2">
                        <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                            <span className="text-white font-bold text-xl leading-none">GT</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900 tracking-tight">Globetrotter</span>
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Panel</span>
                        </div>
                    </div>

                    <nav className="space-y-1.5">
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all hover:shadow-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                    <div className="mt-4 px-4 text-xs text-center text-gray-400">
                        v1.0.0 • © 2024 Globetrotter
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">
                        {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
                    </h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                {user.name[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{user.name}</span>
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
