export function calculateItemPriceCents(size, toppingsCount) {
    const base = size === 'S' ? 1000 : size === 'M' ? 1500 : 2000; // $10, $15, $20
    const toppingsPrice = toppingsCount * 200; // $2 each
    return base + toppingsPrice;
}
export function calculateOrderTotalCents(items) {
    return items.reduce((sum, it) => sum + calculateItemPriceCents(it.size, it.toppings.length), 0);
}
export function canCancel(status) {
    return status !== 'delivered';
}
