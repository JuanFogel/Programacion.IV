import { describe, it, expect } from 'vitest';
import { calculateItemPriceCents, calculateOrderTotalCents, canCancel } from '../../src/domain/order.js';
describe('order domain rules', () => {
    it('calculates item price by size and toppings', () => {
        expect(calculateItemPriceCents('S', 0)).toBe(1000);
        expect(calculateItemPriceCents('M', 2)).toBe(1500 + 400);
        expect(calculateItemPriceCents('L', 5)).toBe(2000 + 1000);
    });
    it('sums total order price', () => {
        const total = calculateOrderTotalCents([
            { id: 'a', size: 'M', toppings: ['olives'] },
            { id: 'b', size: 'S', toppings: [] }
        ]);
        expect(total).toBe(1500 + 200 + 1000);
    });
    it('cannot cancel when delivered', () => {
        expect(canCancel('created')).toBe(true);
        expect(canCancel('delivered')).toBe(false);
    });
});
