import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Order } from './Order';
import type { Order as OrderType } from '../types';

describe('Order - HU2, HU3, HU4: Gestión del pedido', () => {
  const mockOrder: OrderType = {
    items: [
      {
        product: { id: '1', name: 'Café', price: 2.5 },
        quantity: 1,
      },
      {
        product: { id: '2', name: 'Té', price: 1.8 },
        quantity: 2,
      },
    ],
    total: 0,
  };

  it('HU2: debe mostrar ítems agregados al pedido', () => {
    const onRemoveItem = vi.fn();
    const onSubmitOrder = vi.fn();

    render(
      <Order
        order={mockOrder}
        total={6.1}
        onRemoveItem={onRemoveItem}
        onSubmitOrder={onSubmitOrder}
        isLoading={false}
        message={null}
      />
    );

    expect(screen.getByText(/Café x1/)).toBeInTheDocument();
    expect(screen.getByText(/Té x2/)).toBeInTheDocument();
  });

  it('HU3: debe calcular y mostrar el total del pedido', () => {
    const onRemoveItem = vi.fn();
    const onSubmitOrder = vi.fn();

    render(
      <Order
        order={mockOrder}
        total={6.1}
        onRemoveItem={onRemoveItem}
        onSubmitOrder={onSubmitOrder}
        isLoading={false}
        message={null}
      />
    );

    expect(screen.getByText(/Total: \$6\.10/i)).toBeInTheDocument();
  });

  it('HU4: debe eliminar un ítem del pedido al hacer clic en "Eliminar"', async () => {
    const user = userEvent.setup();
    const onRemoveItem = vi.fn();
    const onSubmitOrder = vi.fn();

    render(
      <Order
        order={mockOrder}
        total={6.1}
        onRemoveItem={onRemoveItem}
        onSubmitOrder={onSubmitOrder}
        isLoading={false}
        message={null}
      />
    );

    const removeButtons = screen.getAllByText('Eliminar');
    await user.click(removeButtons[0]);

    expect(onRemoveItem).toHaveBeenCalledWith('1');
    expect(onRemoveItem).toHaveBeenCalledTimes(1);
  });

  it('debe mostrar mensaje cuando no hay ítems', () => {
    const emptyOrder: OrderType = { items: [], total: 0 };
    const onRemoveItem = vi.fn();
    const onSubmitOrder = vi.fn();

    render(
      <Order
        order={emptyOrder}
        total={0}
        onRemoveItem={onRemoveItem}
        onSubmitOrder={onSubmitOrder}
        isLoading={false}
        message={null}
      />
    );

    expect(screen.getByText('No hay ítems en el pedido')).toBeInTheDocument();
  });
});

