import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { makeApp } from '../../src/app.js';
describe('POST /orders', () => {
    it('creates an order and returns 201 with total price', async () => {
        const app = makeApp();
        const res = await request(app)
            .post('/orders')
            .send({
            address: 'Av. Siempre Viva 742',
            items: [
                { size: 'M', toppings: ['olives', 'mushrooms'] },
                { size: 'S', toppings: [] }
            ]
        });
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject({ status: 'created', address: 'Av. Siempre Viva 742' });
        expect(res.body.totalPriceCents).toBe(1500 + 400 + 1000);
        expect(res.body.items).toHaveLength(2);
    });
    it('returns 422 on invalid body (empty items)', async () => {
        const app = makeApp();
        const res = await request(app)
            .post('/orders')
            .send({ address: 'short', items: [] });
        expect(res.status).toBe(422);
        expect(res.body.errors).toBeDefined();
    });
});
