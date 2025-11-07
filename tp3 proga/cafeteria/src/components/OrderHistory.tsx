import type { OrderItem } from '../types';

export interface CompletedOrder {
  id: string;
  items: OrderItem[];
  total: number;
  timestamp: Date;
}

interface OrderHistoryProps {
  orders: CompletedOrder[];
  onDeleteOrder: (orderId: string) => void;
  onClearHistory: () => void;
}

export function OrderHistory({ orders, onDeleteOrder, onClearHistory }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <div>
        <h2>Historial de Pedidos</h2>
        <p style={{ textAlign: 'center', color: '#a0aec0', fontStyle: 'italic' }}>
          No hay pedidos realizados aún
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Historial de Pedidos</h2>
        <button
          onClick={onClearHistory}
          style={{
            background: '#f56565',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
          }}
        >
          Limpiar todo
        </button>
      </div>
      <div style={{ 
        maxHeight: '600px', 
        overflowY: 'auto', 
        overflowX: 'hidden',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem'
      }}>
        {[...orders].reverse().map((order) => (
          <div
            key={order.id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '1rem',
              background: '#f7fafc',
              transition: 'all 0.2s ease',
              position: 'relative',
              fontSize: '0.85rem',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteOrder(order.id);
              }}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: '#f56565',
                border: 'none',
                borderRadius: '4px',
                padding: '0.3rem 0.5rem',
                cursor: 'pointer',
                fontSize: '0.7rem',
                color: 'white',
                fontWeight: '600',
              }}
              title="Eliminar pedido"
            >
              X
            </button>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              fontWeight: 'bold',
              marginRight: '1.5rem',
              fontSize: '0.9rem',
            }}>
              <span style={{ color: '#2d3748' }}>Pedido #{order.id}</span>
              <span style={{ 
                color: '#38a169', 
                background: '#c6f6d5',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.85rem',
              }}>
                ${order.total.toFixed(2)}
              </span>
            </div>
            <div style={{ 
              fontSize: '0.7rem', 
              color: '#718096', 
              marginBottom: '0.5rem',
            }}>
              {new Date(order.timestamp).toLocaleString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0,
              fontSize: '0.8rem'
            }}>
              {order.items.map((item) => (
                <li 
                  key={item.product.id} 
                  style={{ 
                    padding: '0.4rem 0.5rem',
                    marginBottom: '0.3rem',
                    background: 'white',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <span style={{ color: '#2d3748' }}>
                    {item.product.name} <strong>x{item.quantity}</strong>
                  </span>
                  <span style={{ color: '#4a5568', fontWeight: '600', fontSize: '0.75rem' }}>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
