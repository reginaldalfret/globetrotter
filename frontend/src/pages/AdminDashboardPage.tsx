
import { useEffect, useState } from 'react';
import { adminAPI } from '../lib/api';
import { Users, Map, Activity, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, analyticsData] = await Promise.all([
                    adminAPI.getStats(),
                    adminAPI.getAnalytics()
                ]);
                setStats(statsData.data);
                setAnalytics(analyticsData.data);
            } catch (error) {
                console.error('Failed to fetch admin data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    const statCards = [
        { name: 'Total Users', value: stats?.userCount || 0, icon: Users, color: 'bg-blue-500' },
        { name: 'Active Trips', value: stats?.tripCount || 0, icon: Calendar, color: 'bg-green-500' },
        { name: 'Cities', value: stats?.cityCount || 0, icon: Map, color: 'bg-indigo-500' },
        { name: 'Activities', value: stats?.activityCount || 0, icon: Activity, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
                <p className="text-gray-500 mt-1">Platform analytics and quick management actions</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} bg-opacity-10 p-3 rounded-lg`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm font-medium text-gray-500 mt-1">{stat.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-lg group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <Map className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold">Manage Places</h2>
                        </div>
                        <p className="text-indigo-100 mb-8 max-w-sm">Curate the list of cities and countries. Update images, costs, and popularity scores.</p>
                        <Link
                            to="/admin/cities"
                            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-sm group-hover:translate-x-1"
                        >
                            Go to Cities <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {/* Abstract background pattern/blob */}
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                </div>

                <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-8 text-white shadow-lg group">
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                <Activity className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-xl font-bold">Manage Cool Stuff</h2>
                        </div>
                        <p className="text-rose-100 mb-8 max-w-sm">Organize activities, tours, and experiences. Set categories, costs, and durations.</p>
                        <Link
                            to="/admin/activities"
                            className="inline-flex items-center gap-2 bg-white text-rose-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-rose-50 transition-all shadow-sm group-hover:translate-x-1"
                        >
                            Go to Activities <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mb-16 pointer-events-none"></div>
                </div>
            </div>

            {/* Top Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Cities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            Trending Cities
                        </h3>
                    </div>
                    <div className="p-6 flex-1">
                        <div className="space-y-4">
                            {stats?.topCities?.map((city: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-500 text-sm font-bold shadow-sm border border-gray-100 group-hover:border-indigo-200 group-hover:text-indigo-600">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-900 block">{city.city}</span>
                                            <span className="text-sm text-gray-500">{city.country}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-indigo-600">{city.tripCount}</span>
                                        <span className="text-xs text-gray-400 block uppercase tracking-wide">Trips</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Popular Activities */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-pink-600" />
                            Top Activities
                        </h3>
                    </div>
                    <div className="p-6 flex-1">
                        <div className="space-y-4">
                            {stats?.topActivities?.map((activity: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-pink-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-gray-500 text-sm font-bold shadow-sm border border-gray-100 group-hover:border-pink-200 group-hover:text-pink-600">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <span className="font-semibold text-gray-900 block">{activity.activity}</span>
                                            <span className="text-xs text-gray-500 inline-block px-2 py-0.5 rounded-full bg-gray-200 group-hover:bg-white group-hover:text-pink-600 transition-colors">
                                                {activity.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm font-bold text-pink-600">{activity.usageCount}</span>
                                        <span className="text-xs text-gray-400 block uppercase tracking-wide">Uses</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
