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
        <p style={{ textAlign: 'center', color: '#a0aec0', fontStyle: 'italic', padding: '2rem 0' }}>
          No hay ítems en el pedido
        </p>
      ) : (
        <>
          <ul role="list">
            {order.items.map((item: OrderItem) => (
              <li key={item.product.id} role="listitem">
                <span>
                  <strong>{item.product.name}</strong> <span style={{ color: '#5a67d8' }}>x{item.quantity}</span>
                  <div style={{ fontSize: '0.9rem', color: '#4a5568', fontWeight: '600' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </span>
                <button className="btn-remove" onClick={(e) => handleRemove(e, item.product.id)}>Eliminar</button>
              </li>
            ))}
          </ul>
          <div style={{ 
            padding: '1rem',
            background: '#f7fafc',
            borderRadius: '8px',
            marginTop: '1rem',
            marginBottom: '1rem',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ 
              margin: 0, 
              fontSize: '1.3rem', 
              fontWeight: 'bold', 
              color: '#2d3748',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>Total:</span>
              <span style={{ color: '#38a169' }}>${total.toFixed(2)}</span>
            </p>
          </div>
          <button onClick={onSubmitOrder} disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar pedido'}
          </button>
        </>
      )}
      {message && (
        <div style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: message.includes('Error') ? '#fff5f5' : '#f0fff4',
          border: `1px solid ${message.includes('Error') ? '#fc8181' : '#68d391'}`,
          borderRadius: '8px',
          color: message.includes('Error') ? '#c53030' : '#2f855a',
          fontWeight: '600',
          textAlign: 'center',
          animation: 'slideIn 0.3s ease',
          fontSize: '0.95rem',
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

