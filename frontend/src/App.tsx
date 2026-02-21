import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

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
        const res = await axios.get(
            "https://catalog-app.icyhill-d8a50826.southeastasia.azurecontainerapps.io/api/catalog"
        );
        setCatalog(res.data);
    };

    const fetchWatchlist = async () => {
        const res = await axios.get(
            `https://watchlist-app.icyhill-d8a50826.southeastasia.azurecontainerapps.io/api/watchlist/${USER_ID}`
        );
        setWatchlist(res.data);
    };

    const fetchRecommendations = async () => {
        const res = await axios.get(
            `https://recommender-app.icyhill-d8a50826.southeastasia.azurecontainerapps.io/api/recommendations/${USER_ID}`
        );
        setRecommendations(res.data);
    };

    useEffect(() => {
        const fetchData = async () => {
            await fetchCatalog();
            await fetchWatchlist();
            await fetchRecommendations();
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addToWatchlist = async (catalogId: string, rating: number) => {
        await axios.post(
            "https://watchlist-app.icyhill-d8a50826.southeastasia.azurecontainerapps.io/api/watchlist",
            { userId: USER_ID, catalogId, rating }
        );
        fetchWatchlist();
        fetchRecommendations();
    };

    const removeFromWatchlist = async (catalogId: string) => {
        await axios.delete(
            `https://watchlist-app.icyhill-d8a50826.southeastasia.azurecontainerapps.io/api/watchlist/${USER_ID}/${catalogId}`
        );
        fetchWatchlist();
        fetchRecommendations();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-100/40 py-10 px-4 md:px-8 text-slate-800"
        >
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <motion.header
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-3">
                        🎬 K-Drama & Movie Tracker
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Watching as{" "}
                        <span className="ml-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
              {USER_ID}
            </span>
                    </p>
                </motion.header>

                {/* Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Catalog */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/60"
                    >
                        <h2 className="text-xl font-bold mb-4 flex gap-2">
                            📺 Available Catalog
                        </h2>

                        <div className="flex flex-col gap-3">
                            {catalog.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all"
                                >
                                    <h3 className="font-bold">
                                        {item.title}{" "}
                                        <span className="text-xs text-slate-500">
                      ({item.releaseYear})
                    </span>
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1">
                                        {item.category} • ⭐ {item.rating}
                                    </p>

                                    <button
                                        onClick={() => addToWatchlist(item.id, item.rating)}
                                        className="mt-3 w-full py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md active:scale-95 transition-all"
                                    >
                                        + Add to Watchlist
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Watchlist */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/60"
                    >
                        <h2 className="text-xl font-bold mb-4 flex gap-2">
                            ✅ My Watchlist
                        </h2>

                        <div className="flex flex-col gap-3">
                            {watchlist.length === 0 ? (
                                <div className="py-10 text-center text-slate-500 border border-dashed rounded-xl">
                                    Watchlist is empty
                                </div>
                            ) : (
                                watchlist.map((item) => {
                                    const details = catalog.find(
                                        (c) => c.id === item.catalogId
                                    );
                                    return (
                                        <motion.div
                                            key={item.catalogId}
                                            whileHover={{ scale: 1.02 }}
                                            className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200"
                                        >
                                            <h4 className="font-bold">
                                                {details?.title || item.catalogId}
                                            </h4>
                                            <p className="text-xs text-emerald-700">
                                                ⭐ {item.rating}
                                            </p>

                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() =>
                                                    removeFromWatchlist(item.catalogId)
                                                }
                                                className="mt-3 w-full py-2 rounded-lg text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition"
                                            >
                                                🗑️ Remove
                                            </motion.button>
                                        </motion.div>
                                    );
                                })
                            )}
                        </div>
                    </motion.div>

                    {/* Recommendations */}
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white/60"
                    >
                        <h2 className="text-xl font-bold mb-4 flex gap-2">
                            ✨ AI Recommended
                        </h2>

                        <div className="flex flex-col gap-3">
                            <AnimatePresence>
                                {recommendations.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        whileHover={{ scale: 1.03 }}
                                        className="p-4 bg-white rounded-xl border border-indigo-200 shadow-sm hover:shadow-lg flex gap-3"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            🍿
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm">{item.title}</h3>
                                            <p className="text-xs text-indigo-600">
                                                {item.releaseYear}
                                            </p>
                                            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-indigo-50 border border-indigo-200 rounded">
                        {item.category}
                      </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

export default App;