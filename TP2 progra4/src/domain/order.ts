export type PizzaSize = 'S' | 'M' | 'L';

export type OrderStatus = 'created' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  size: PizzaSize;
  toppings: string[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  address: string;
  status: OrderStatus;
  totalPriceCents: number;
}

export function calculateItemPriceCents(size: PizzaSize, toppingsCount: number): number {
  const base = size === 'S' ? 1000 : size === 'M' ? 1500 : 2000; // $10, $15, $20
  const toppingsPrice = toppingsCount * 200; // $2 each
  return base + toppingsPrice;
}

export function calculateOrderTotalCents(items: OrderItem[]): number {
  return items.reduce((sum, it) => sum + calculateItemPriceCents(it.size, it.toppings.length), 0);
}

export function canCancel(status: OrderStatus): boolean {
  return status !== 'delivered';
}


