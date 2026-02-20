import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory Array (Database)
// { userId: string, catalogId: string, rating: number }
const watchlist: any[] = [];

// 1. User Watchlist API
app.get('/api/watchlist/:userId', (req: Request, res: Response) => {
    const userWatchlist = watchlist.filter(item => item.userId === req.params.userId);
    res.json(userWatchlist);
});

// 2. Add K-Drama Watchlist API
app.post('/api/watchlist', (req: Request, res: Response) => {
    const { userId, catalogId, rating } = req.body;
    watchlist.push({ userId, catalogId, rating });
    res.status(201).json({ message: 'Added to watchlist successfully', item: { userId, catalogId, rating } });
});

app.listen(PORT, () => {
    console.log(`Watchlist service is running on http://localhost:${PORT}`);
});