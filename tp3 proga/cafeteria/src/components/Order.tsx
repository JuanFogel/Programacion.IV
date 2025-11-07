import type { Order, OrderItem } from '../types';

interface OrderProps {
  order: Order;
  total: number;
  onRemoveItem: (productId: string) => void;
  onSubmitOrder: () => void;
  isLoading: boolean;
  message: string | null;
}

export function Order({ order, total, onRemoveItem, onSubmitOrder, isLoading, message }: OrderProps) {
  const handleRemove = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    onRemoveItem(productId);
  };

  return (
    <div>
      <h2>Mi Pedido</h2>
      {order.items.length === 0 ? (
        <p>No hay ítems en el pedido</p>
      ) : (
        <>
          <ul role="list">
            {order.items.map((item: OrderItem) => (
              <li key={item.product.id} role="listitem">
                <span>
                  {item.product.name} x{item.quantity} - ${(item.product.price * item.quantity).toFixed(2)}
                </span>
                <button onClick={(e) => handleRemove(e, item.product.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <p>Total: ${total.toFixed(2)}</p>
          <button onClick={onSubmitOrder} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar pedido'}
          </button>
          {message && <p>{message}</p>}
        </>
      )}
    </div>
  );
}

