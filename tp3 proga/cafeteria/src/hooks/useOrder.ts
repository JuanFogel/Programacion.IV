import { useState, useCallback } from 'react';
import type { Product, OrderItem, Order } from '../types';

export function useOrder() {
  const [order, setOrder] = useState<Order>({ items: [], total: 0 });

  const addItem = useCallback((product: Product) => {
    setOrder((prev) => {
      const existingItem = prev.items.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      return {
        ...prev,
        items: [...prev.items, { product, quantity: 1 }],
      };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setOrder((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.product.id !== productId),
    }));
  }, []);

  const clearOrder = useCallback(() => {
    setOrder({ items: [], total: 0 });
  }, []);

  const calculateTotal = useCallback(() => {
    return order.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [order.items]);

  return {
    order,
    addItem,
    removeItem,
    clearOrder,
    calculateTotal,
  };
}

