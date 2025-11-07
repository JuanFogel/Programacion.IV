import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App - HU5: Enviar pedido', () => {
  it('debe enviar el pedido y mostrar mensaje de confirmación', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que se cargue el menú
    await waitFor(() => {
      expect(screen.getByText(/Café/i)).toBeInTheDocument();
    });

    // Agregar productos
    const addButtons = screen.getAllByText('Agregar');
    await user.click(addButtons[0]);

    // Enviar pedido
    const submitButton = screen.getByText('Enviar pedido');
    await user.click(submitButton);

    // Verificar mensaje de confirmación
    await waitFor(() => {
      expect(screen.getByText(/Pedido confirmado/i)).toBeInTheDocument();
    });
  });

  it('debe limpiar el pedido después de enviarlo exitosamente', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Café/i)).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText('Agregar');
    await user.click(addButtons[0]);

    const submitButton = screen.getByText('Enviar pedido');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('No hay ítems en el pedido')).toBeInTheDocument();
    });
  });
});

describe('App - HU6: Casos límite', () => {
  it('debe manejar error al enviar pedido', async () => {
    const { server } = await import('./mocks/server');
    const { http, HttpResponse } = await import('msw');

    server.use(
      http.post('/api/orders', () => {
        return HttpResponse.json({ error: 'Error del servidor' }, { status: 500 });
      })
    );

    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Café/i)).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText('Agregar');
    await user.click(addButtons[0]);

    const submitButton = screen.getByText('Enviar pedido');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Error al enviar pedido')).toBeInTheDocument();
    });
  });
});

describe('App - Integración Completa', () => {
  it('debe completar el flujo completo: cargar menú, agregar ítems, calcular total, enviar pedido', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Esperar a que se cargue el menú
    await waitFor(() => {
      expect(screen.getByText(/Café/i)).toBeInTheDocument();
    });

    // Agregar productos
    const addButtons = screen.getAllByText('Agregar');
    await user.click(addButtons[0]); // Café
    await user.click(addButtons[1]); // Té

    // Verificar que aparecen en el pedido
    await waitFor(() => {
      expect(screen.getByText(/Café x1/)).toBeInTheDocument();
      expect(screen.getByText(/Té x1/)).toBeInTheDocument();
    });

    // Verificar total
    const totalRegex = /Total: \$\d+\.\d+/i;
    expect(screen.getByText(totalRegex)).toBeInTheDocument();

    // Enviar pedido
    const submitButton = screen.getByText('Enviar pedido');
    await user.click(submitButton);

    // Verificar mensaje de confirmación
    await waitFor(() => {
      expect(screen.getByText(/Pedido confirmado/i)).toBeInTheDocument();
    });

    // Verificar que el pedido se limpió
    await waitFor(() => {
      expect(screen.getByText('No hay ítems en el pedido')).toBeInTheDocument();
    });
  });
});
