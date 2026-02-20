import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

// Data Types
interface CatalogItem {
    id: string;
    title: string;
    category: string;
    releaseYear: number;
    rating: number;
}

interface WatchlistItem {
    userId: string;
    catalogId: string;
    rating: number;
}

function App() {
    const [catalog, setCatalog] = useState<CatalogItem[]>([]);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [recommendations, setRecommendations] = useState<CatalogItem[]>([]);

    const USER_ID = "user_01";

    const fetchCatalog = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/catalog');
            setCatalog(response.data);
        } catch (error) {
            console.error("Error fetching catalog:", error);
        }
    };

    const fetchWatchlist = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/watchlist/${USER_ID}`);
            setWatchlist(response.data);
        } catch (error) {
            console.error("Error fetching watchlist:", error);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/recommendations/${USER_ID}`);
            setRecommendations(response.data);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        }
    };

    useEffect(() => {
        (async () => {
            await fetchCatalog();
            await fetchWatchlist();
            await fetchRecommendations();
        })();
    }, []);

    const addToWatchlist = async (catalogId: string, rating: number) => {
        try {
            await axios.post('http://localhost:3001/api/watchlist', {
                userId: USER_ID,
                catalogId: catalogId,
                rating: rating
            });
            await fetchWatchlist();
            await fetchRecommendations();
        } catch (error) {
            console.error("Error adding to watchlist:", error);
        }
    };

    const removeFromWatchlist = async (catalogId: string) => {
        try {
            await axios.delete(`http://localhost:3001/api/watchlist/${USER_ID}/${catalogId}`);
            await fetchWatchlist();
            await fetchRecommendations();
        } catch (error) {
            console.error("Error removing from watchlist:", error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 font-sans text-slate-800">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3 tracking-tight">
                        🎬 K-Drama & Movie Tracker
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Currently watching as: <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{USER_ID}</span>
                    </p>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Catalog Section */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                            <span className="text-blue-500">📺</span> Available Catalog
                        </h2>
                        <div className="flex flex-col gap-4">
                            {catalog.map((item) => (
                                <div key={item.id} className="group p-5 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800">{item.title} <span className="text-sm font-normal text-slate-500">({item.releaseYear})</span></h3>
                                        <p className="text-sm text-slate-600 mt-1">
                                            <span className="font-semibold text-slate-700">{item.category}</span> • ⭐ {item.rating}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => addToWatchlist(item.id, item.rating)}
                                        className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all active:scale-95"
                                    >
                                        + Add
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Watchlist Section */}
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100">
                        <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                            <span className="text-emerald-500">✅</span> My Watchlist
                        </h2>
                        <div className="flex flex-col gap-4">
                            {watchlist.length === 0 ? (
                                <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-slate-500 font-medium">Your watchlist is empty.</p>
                                </div>
                            ) : (
                                watchlist.map((item, index) => {
                                    const catalogDetails = catalog.find(c => c.id === item.catalogId);
                                    return (
                                        <div key={index} className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h4 className="text-lg font-bold text-slate-800">{catalogDetails?.title || `Item ID: ${item.catalogId}`}</h4>
                                                <p className="text-sm text-emerald-700 font-medium mt-1">Given Rating: ⭐ {item.rating}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromWatchlist(item.catalogId)}
                                                className="w-full sm:w-auto px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 text-sm font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                <span>🗑️</span> Remove
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

                {/* AI Recommendations Section */}
                <div className="mt-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-fuchsia-50 p-8 md:p-10 rounded-3xl border border-indigo-100 shadow-sm">
                    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-indigo-900 flex items-center gap-2">
                        ✨ AI Recommended for You
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {recommendations.length === 0 ? (
                            <div className="col-span-full text-center py-8">
                                <p className="text-indigo-400 font-medium">No new recommendations at the moment.</p>
                            </div>
                        ) : (
                            recommendations.map((item) => (
                                <div key={`rec-${item.id}`} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                                        🍿
                                    </div>
                                    <h3 className="text-lg font-bold text-indigo-950 mb-1 leading-tight">{item.title}</h3>
                                    <p className="text-sm text-indigo-700/80 mb-3">{item.releaseYear}</p>
                                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-lg border border-indigo-100">
                                        {item.category}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default App;