import express from 'express';
import { ordersRouter } from './routes/orders.js';
export function makeApp() {
    const app = express();
    app.use(express.json());
    app.use(ordersRouter());
    app.get('/health', (_req, res) => {
        res.status(200).json({ status: 'ok' });
    });
    return app;
}
