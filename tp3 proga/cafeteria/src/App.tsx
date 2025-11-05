import { useState } from 'react';
import { Menu } from './components/Menu';
import { Order } from './components/Order';
import { useOrder } from './hooks/useOrder';
import type { Product } from './types';

function App() {
  const { order, addItem, removeItem, clearOrder, calculateTotal } = useOrder();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleAddItem = (product: Product) => {
    addItem(product);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
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
      setMessage(data.message || 'Pedido confirmado');
      clearOrder();
    } catch (error) {
      setMessage('Error al enviar pedido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>☕ Cafetería - Sistema de Pedidos</h1>
      <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
        <Menu onAddItem={handleAddItem} />
        <Order
          order={order}
          total={calculateTotal()}
          onRemoveItem={handleRemoveItem}
          onSubmitOrder={handleSubmitOrder}
          isLoading={isLoading}
          message={message}
        />
      </div>
    </div>
  );
}

export default App;

