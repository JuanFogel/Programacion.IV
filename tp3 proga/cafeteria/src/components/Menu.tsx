import { useEffect, useState } from 'react';
import type { Product } from '../types';

interface MenuProps {
  onAddItem: (product: Product) => void;
}

export function Menu({ onAddItem }: MenuProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/menu');
        
        if (!response.ok) {
          throw new Error('Error al cargar menú');
        }
        
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar menú');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return <div>Cargando menú...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (products.length === 0) {
    return <div>No hay productos disponibles</div>;
  }

  return (
    <div>
      <h2>Menú</h2>
      <ul role="list">
        {products.map((product) => (
          <li key={product.id} role="listitem">
            <span>{product.name} - ${product.price.toFixed(2)}</span>
            <button onClick={() => onAddItem(product)}>Agregar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

