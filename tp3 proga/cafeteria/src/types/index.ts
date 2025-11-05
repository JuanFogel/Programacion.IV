import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  price: z.number().positive(),
});

export type Product = z.infer<typeof ProductSchema>;

export interface OrderItem {
  product: Product;
  quantity: number;
}

export interface Order {
  items: OrderItem[];
  total: number;
}

