
import { useState, useEffect } from 'react';
import { adminAPI } from '../../lib/api';
import { Plus, Pencil, Trash2, X, Search, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface City {
    id: string;
    name: string;
    country: string;
    costIndex: number;
    popularity: number;
    imageUrl: string;
}

export default function AdminCitiesPage() {
    const [cities, setCities] = useState<City[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        costIndex: 5,
        popularity: 50,
        imageUrl: '',
    });

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            const data = await adminAPI.getAllCities();
            setCities(data.data);
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCity) {
                await adminAPI.updateCity(editingCity.id, formData);
            } else {
                await adminAPI.createCity(formData);
            }
            fetchCities();
            closeModal();
        } catch (error) {
            console.error('Failed to save city:', error);
            alert('Failed to save city');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this city?')) return;
        try {
            await adminAPI.deleteCity(id);
            fetchCities();
        } catch (error) {
            console.error('Failed to delete city:', error);
            alert('Failed to delete city');
        }
    };

    const openModal = (city?: City) => {
        if (city) {
            setEditingCity(city);
            setFormData({
                name: city.name,
                country: city.country,
                costIndex: city.costIndex,
                popularity: city.popularity,
                imageUrl: city.imageUrl || '',
            });
        } else {
            setEditingCity(null);
            setFormData({
                name: '',
                country: '',
                costIndex: 5,
                popularity: 50,
                imageUrl: '',
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCity(null);
    };

    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.country.toLowerCase().includes(searchQuery.toLowerCase())
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
                        placeholder="Search cities..."
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
                    Add City
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCities.map((city) => (
                    <div key={city.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                src={city.imageUrl || 'https://via.placeholder.com/300'}
                                alt={city.name}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute top-3 right-3 flex gap-2">
                                <button
                                    onClick={() => openModal(city)}
                                    className="bg-white/90 p-1.5 rounded-lg text-indigo-600 hover:bg-white transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(city.id)}
                                    className="bg-white/90 p-1.5 rounded-lg text-red-600 hover:bg-white transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="absolute bottom-3 left-3 text-white">
                                <h3 className="text-lg font-bold">{city.name}</h3>
                                <p className="text-sm text-gray-200">{city.country}</p>
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div>
                                <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                                    <span>Cost Index</span>
                                    <span>{city.costIndex}/10</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(city.costIndex / 10) * 100}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-medium text-gray-500 mb-1">
                                    <span>Popularity</span>
                                    <span>{city.popularity}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${city.popularity}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredCities.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No cities found matching your search.</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingCity ? 'Edit City' : 'Add New City'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                    value={formData.country}
                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cost Index (1-10)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.costIndex}
                                        onChange={(e) => setFormData({ ...formData, costIndex: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Popularity (0-100)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                        value={formData.popularity}
                                        onChange={(e) => setFormData({ ...formData, popularity: parseInt(e.target.value) })}
                                    />
                                </div>
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
                                    {editingCity ? 'Save Changes' : 'Create City'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
