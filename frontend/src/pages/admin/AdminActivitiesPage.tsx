
import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api';
import { Plus, Pencil, Trash2, X, Search, Loader2 } from 'lucide-react';

interface Activity {
    id: string;
    name: string;
    description: string;
    category: string;
    cost: number;
    duration: number;
    imageUrl: string;
}

export default function AdminActivitiesPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'sightseeing',
        cost: 0,
        duration: 60,
        imageUrl: '',
    });

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const data = await adminAPI.getAllActivities();
            setActivities(data.data);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingActivity) {
                await adminAPI.updateActivity(editingActivity.id, formData);
            } else {
                await adminAPI.createActivity(formData);
            }
            fetchActivities();
            closeModal();
        } catch (error) {
            console.error('Failed to save activity:', error);
            alert('Failed to save activity');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this activity?')) return;
        try {
            await adminAPI.deleteActivity(id);
            fetchActivities();
        } catch (error) {
            console.error('Failed to delete activity:', error);
            alert('Failed to delete activity');
        }
    };

    const openModal = (activity?: Activity) => {
        if (activity) {
            setEditingActivity(activity);
            setFormData({
                name: activity.name,
                description: activity.description || '',
                category: activity.category,
                cost: activity.cost,
                duration: activity.duration || 60,
                imageUrl: activity.imageUrl || '',
            });
        } else {
            setEditingActivity(null);
            setFormData({
                name: '',
                description: '',
                category: 'sightseeing',
                cost: 0,
                duration: 60,
                imageUrl: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingActivity(null);
    };

    const filteredActivities = activities.filter(activity =>
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search activities..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Activity
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredActivities.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                src={activity.imageUrl || 'https://via.placeholder.com/300'}
                                alt={activity.name}
                            />
                            <div className="absolute top-3 right-3 flex gap-2 z-10">
                                <button
                                    onClick={() => openModal(activity)}
                                    className="bg-white/90 p-1.5 rounded-lg text-indigo-600 hover:bg-white transition-colors shadow-sm"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(activity.id)}
                                    className="bg-white/90 p-1.5 rounded-lg text-red-600 hover:bg-white transition-colors shadow-sm"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute bottom-3 left-3">
                                <span className="px-2 py-1 text-xs font-bold rounded-lg bg-white/90 text-gray-900 shadow-sm uppercase tracking-wide">
                                    {activity.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{activity.name}</h3>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2 min-h-[2.5rem]">{activity.description}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="text-sm font-semibold text-gray-900">
                                    ${activity.cost}
                                </div>
                                <div className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-md">
                                    {activity.duration} mins
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredActivities.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No activities found matching your search.</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="sightseeing">Sightseeing</option>
                                    <option value="food">Food</option>
                                    <option value="adventure">Adventure</option>
                                    <option value="culture">Culture</option>
                                    <option value="relaxation">Relaxation</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cost ($)</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.cost}
                                    onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                                <input
                                    type="number"
                                    min="0"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    {editingActivity ? 'Save Changes' : 'Create Activity'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
