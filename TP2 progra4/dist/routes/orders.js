import { Router } from 'express';
import { z } from 'zod';
import { calculateOrderTotalCents } from '../domain/order.js';
const createItemSchema = z.object({
    size: z.enum(['S', 'M', 'L']),
    toppings: z.array(z.string()).max(5)
});
const createOrderSchema = z.object({
    items: z.array(createItemSchema).min(1),
    address: z.string().min(10)
});
let nextId = 1;
const orders = new Map();
export function ordersRouter() {
    const router = Router();
    router.post('/orders', (req, res) => {
        const parsed = createOrderSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(422).json({ errors: parsed.error.flatten() });
        }
        const { items, address } = parsed.data;
        const id = String(nextId++);
        const totalPriceCents = calculateOrderTotalCents(items.map((it, idx) => ({ id: `${id}-${idx}`, size: it.size, toppings: it.toppings })));
        const order = { id, items: items.map((it, idx) => ({ id: `${id}-${idx}`, ...it })), address, status: 'created', totalPriceCents };
        orders.set(id, order);
        return res.status(201).json(order);
    });
    router.get('/order/:id', (req, res) => {
        const { id } = req.params;
        const order = orders.get(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        return res.json(order);
    });
    router.post('/orders/:id/cancel', (req, res) => {
        const { id } = req.params;
        const order = orders.get(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        if (order.status === 'delivered') {
            return res.status(409).json({ error: 'Cannot cancel delivered order' });
        }
        order.status = 'cancelled';
        orders.set(id, order);
        return res.json(order);
    });
    router.get('/orders', (req, res) => {
        const { status } = req.query;
        let filteredOrders = Array.from(orders.values());
        if (status) {
            filteredOrders = filteredOrders.filter(order => order.status === status);
        }
        return res.json(filteredOrders);
    });
    return router;
}
export const _ordersStore = { orders };
