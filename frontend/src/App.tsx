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

    useEffect(() => {
        (async () => {
            await fetchCatalog();
            await fetchWatchlist();
        })();
    }, []);

    const addToWatchlist = async (catalogId: string, rating: number) => {
        try {
            await axios.post('http://localhost:3001/api/watchlist', {
                userId: USER_ID,
                catalogId: catalogId,
                rating: rating
            });
            fetchWatchlist();
        } catch (error) {
            console.error("Error adding to watchlist:", error);
        }
    };

    // Remove item from watchlist
    const removeFromWatchlist = async (catalogId: string) => {
        try {
            await axios.delete(`http://localhost:3001/api/watchlist/${USER_ID}/${catalogId}`);
            fetchWatchlist();
        } catch (error) {
            console.error("Error removing from watchlist:", error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h1>🎬 K-Drama & Movie Tracker</h1>
            <p>Currently watching as: <b>{USER_ID}</b></p>

            <hr />

            <div style={{ display: 'flex', gap: '40px' }}>
                <div style={{ flex: 1 }}>
                    <h2>Available Catalog</h2>
                    {catalog.map((item) => (
                        <div key={item.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0', borderRadius: '8px' }}>
                            <h3>{item.title} ({item.releaseYear})</h3>
                            <p>Genre: {item.category} | Rating: ⭐ {item.rating}</p>
                            <button
                                onClick={() => addToWatchlist(item.id, item.rating)}
                                style={{ padding: '8px 16px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                            >
                                + Add to Watchlist
                            </button>
                        </div>
                    ))}
                </div>

                <div style={{ flex: 1 }}>
                    <h2>My Watchlist</h2>
                    {watchlist.length === 0 ? (
                        <p>Your watchlist is empty.</p>
                    ) : (
                        watchlist.map((item, index) => {
                            const catalogDetails = catalog.find(c => c.id === item.catalogId);
                            return (
                                <div key={index} style={{ border: '1px solid #28a745', padding: '10px', margin: '10px 0', borderRadius: '8px', backgroundColor: '#f8fff9' }}>
                                    <h4>{catalogDetails?.title || `Item ID: ${item.catalogId}`}</h4>
                                    <p>Given Rating: ⭐ {item.rating}</p>

                                    <button
                                        onClick={() => removeFromWatchlist(item.catalogId)}
                                        style={{ marginTop: '10px', padding: '6px 12px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
                                    >
                                        🗑️ Remove
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;