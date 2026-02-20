import { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div className="min-h-screen bg-slate-100 py-8 px-4 md:px-8 font-sans text-slate-800">
            <div className="max-w-[1400px] mx-auto">
                {/* Header Section */}
                <header className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2 tracking-tight">
                        🎬 K-Drama & Movie Tracker
                    </h1>
                    <p className="text-slate-500 font-medium text-sm">
                        Currently watching as: <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{USER_ID}</span>
                    </p>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    {/* 1. Catalog Section */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-t-blue-500 border-x border-b border-slate-200">
                        <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                            <span className="text-blue-500">📺</span> Available Catalog
                        </h2>
                        <div className="flex flex-col gap-3">
                            {catalog.map((item) => (
                                <div key={item.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-blue-200 transition-all flex flex-col gap-3">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800 leading-tight">{item.title} <span className="text-xs font-normal text-slate-500">({item.releaseYear})</span></h3>
                                        <p className="text-xs text-slate-600 mt-1">
                                            <span className="font-semibold">{item.category}</span> • ⭐ {item.rating}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => addToWatchlist(item.id, item.rating)}
                                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-95"
                                    >
                                        + Add to Watchlist
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 2. Watchlist Section */}
                    <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-t-emerald-500 border-x border-b border-slate-200">
                        <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                            <span className="text-emerald-500">✅</span> My Watchlist
                        </h2>
                        <div className="flex flex-col gap-3">
                            {watchlist.length === 0 ? (
                                <div className="text-center py-10 px-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                    <p className="text-slate-500 text-sm font-medium">Your watchlist is empty.</p>
                                </div>
                            ) : (
                                watchlist.map((item, index) => {
                                    const catalogDetails = catalog.find(c => c.id === item.catalogId);
                                    return (
                                        <div key={index} className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex flex-col gap-3">
                                            <div>
                                                <h4 className="text-base font-bold text-slate-800 leading-tight">{catalogDetails?.title || `Item ID: ${item.catalogId}`}</h4>
                                                <p className="text-xs text-emerald-700 font-medium mt-1">Rating: ⭐ {item.rating}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromWatchlist(item.catalogId)}
                                                className="w-full py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-sm font-semibold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                                            >
                                                🗑️ Remove
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* 3. AI Recommendations Section */}
                    <div className="bg-gradient-to-b from-indigo-50/50 to-white p-5 rounded-2xl shadow-sm border-t-4 border-t-indigo-500 border-x border-b border-slate-200">
                        <h2 className="text-xl font-bold mb-4 text-indigo-900 flex items-center gap-2">
                            ✨ AI Recommended
                        </h2>

                        <div className="flex flex-col gap-3">
                            {recommendations.length === 0 ? (
                                <div className="text-center py-10 px-4 bg-white rounded-xl border border-dashed border-indigo-200">
                                    <p className="text-indigo-400 text-sm font-medium">Add movies to your watchlist to get AI recommendations!</p>
                                </div>
                            ) : (
                                recommendations.map((item) => (
                                    <div key={`rec-${item.id}`} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all flex items-start gap-3">
                                        <div className="w-10 h-10 shrink-0 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-lg">
                                            🍿
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-indigo-950 leading-tight">{item.title}</h3>
                                            <p className="text-xs text-indigo-700/80 mt-1">Year: {item.releaseYear}</p>
                                            <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded border border-indigo-100">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default App;