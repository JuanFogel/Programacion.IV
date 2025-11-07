import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Menu } from './Menu';

describe('Menu - HU1: Visualización inicial del menú', () => {
  it('debe mostrar productos mockeados por la API', async () => {
    render(<Menu onAddItem={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/Café/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Té/i)).toBeInTheDocument();
    expect(screen.getByText(/Sandwich/i)).toBeInTheDocument();
    expect(screen.getByText(/Torta/i)).toBeInTheDocument();
  });

  it('debe mostrar los productos en una lista', async () => {
    render(<Menu onAddItem={() => {}} />);

    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems.length).toBeGreaterThan(0);
    });
  });

  it('debe mostrar "No hay productos disponibles" cuando el menú está vacío', async () => {
    const { server } = await import('../mocks/server');
    const { http, HttpResponse } = await import('msw');

    server.use(
      http.get('/api/menu', () => {
        return HttpResponse.json([]);
      })
    );

    render(<Menu onAddItem={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText('No hay productos disponibles')).toBeInTheDocument();
    });
  });

  it('debe mostrar error cuando falla la carga del menú', async () => {
    const { server } = await import('../mocks/server');
    const { http, HttpResponse } = await import('msw');

    server.use(
      http.get('/api/menu', () => {
        return HttpResponse.json({ error: 'Error del servidor' }, { status: 500 });
      })
    );

    render(<Menu onAddItem={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText(/Error al cargar menú/i)).toBeInTheDocument();
    });
  });
});

