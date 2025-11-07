import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrder } from './useOrder';
import type { Product } from '../types';

describe('useOrder Hook', () => {
  const mockProduct1: Product = { id: '1', name: 'Café', price: 2.5 };
  const mockProduct2: Product = { id: '2', name: 'Té', price: 1.8 };

  it('debe inicializar con un pedido vacío', () => {
    const { result } = renderHook(() => useOrder());

    expect(result.current.order.items).toHaveLength(0);
    expect(result.current.calculateTotal()).toBe(0);
  });

  it('debe agregar un producto al pedido', () => {
    const { result } = renderHook(() => useOrder());

    act(() => {
      result.current.addItem(mockProduct1);
    });

    expect(result.current.order.items).toHaveLength(1);
    expect(result.current.order.items[0].product).toEqual(mockProduct1);
    expect(result.current.order.items[0].quantity).toBe(1);
  });

  it('debe incrementar la cantidad si el producto ya existe', () => {
    const { result } = renderHook(() => useOrder());

    act(() => {
      result.current.addItem(mockProduct1);
      result.current.addItem(mockProduct1);
    });

    expect(result.current.order.items).toHaveLength(1);
    expect(result.current.order.items[0].quantity).toBe(2);
  });

  it('debe eliminar un ítem del pedido', () => {
    const { result } = renderHook(() => useOrder());

    act(() => {
      result.current.addItem(mockProduct1);
      result.current.addItem(mockProduct2);
      result.current.removeItem(mockProduct1.id);
    });

    expect(result.current.order.items).toHaveLength(1);
    expect(result.current.order.items[0].product.id).toBe(mockProduct2.id);
  });

  it('debe calcular el total correctamente', () => {
    const { result } = renderHook(() => useOrder());

    act(() => {
      result.current.addItem(mockProduct1); // 2.5
      result.current.addItem(mockProduct2); // 1.8
      result.current.addItem(mockProduct1); // +2.5
    });

    expect(result.current.calculateTotal()).toBe(6.8);
  });

  it('debe limpiar el pedido', () => {
    const { result } = renderHook(() => useOrder());

    act(() => {
      result.current.addItem(mockProduct1);
      result.current.addItem(mockProduct2);
      result.current.clearOrder();
    });

    expect(result.current.order.items).toHaveLength(0);
    expect(result.current.calculateTotal()).toBe(0);
  });
});

