import { useState, useEffect, useRef } from 'react';
import { Menu } from './components/Menu';
import { Order } from './components/Order';
import { OrderHistory, type CompletedOrder } from './components/OrderHistory';
import { useOrder } from './hooks/useOrder';
import type { Product } from './types';

function App() {
  const { order, addItem, removeItem, clearOrder, calculateTotal } = useOrder();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [orderHistory, setOrderHistory] = useState<CompletedOrder[]>([]);
  const [nextOrderId, setNextOrderId] = useState(1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentTimeout = timeoutRef.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []);

  const handleAddItem = (product: Product) => {
    addItem(product);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrderHistory(prev => prev.filter(order => order.id !== orderId));
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todo el historial de pedidos?')) {
      setOrderHistory([]);
    }
  };

  const handleSubmitOrder = async () => {
    if (order.items.length === 0) return;
    
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: order.items }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar pedido');
      }

      const data = await response.json();
      
      const completedOrder: CompletedOrder = {
        id: nextOrderId.toString(),
        items: [...order.items],
        total: calculateTotal(),
        timestamp: new Date(),
      };
      
      setOrderHistory(prev => [completedOrder, ...prev]);
      setNextOrderId(prev => prev + 1);
      clearOrder();
      setMessage(data.message || 'Pedido confirmado');
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch {
      setMessage('Error al enviar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Cafetería - Sistema de Pedidos</h1>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Menu onAddItem={handleAddItem} />
        <Order
          order={order}
          total={calculateTotal()}
          onRemoveItem={handleRemoveItem}
          onSubmitOrder={handleSubmitOrder}
          isLoading={isLoading}
          message={message}
        />
        <OrderHistory 
          orders={orderHistory} 
          onDeleteOrder={handleDeleteOrder}
          onClearHistory={handleClearHistory}
        />
      </div>
    </div>
  );
}

export default App;


