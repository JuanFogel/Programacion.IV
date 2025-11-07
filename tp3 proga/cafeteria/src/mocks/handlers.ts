import { http, HttpResponse } from 'msw';
import type { Product } from '../types';

const mockProducts: Product[] = [
  { id: '1', name: 'Café', price: 2.5 },
  { id: '2', name: 'Té', price: 1.8 },
  { id: '3', name: 'Sandwich', price: 5.0 },
  { id: '4', name: 'Torta', price: 3.5 },
];

export const handlers = [
  http.get('/api/menu', () => {
    return HttpResponse.json(mockProducts);
  }),

  http.post('/api/orders', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ 
      success: true, 
      orderId: '12345',
      message: 'Pedido confirmado'
    }, { status: 201 });
  }),
];

