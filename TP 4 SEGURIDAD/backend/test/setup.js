// Mock de la base de datos para los tests
const mockDb = {
  query: jest.fn((query, params, callback) => {
    if (typeof params === 'function') {
      callback = params;
      params = [];
    }
    
    // Función auxiliar para ejecutar callback (respeta delays asíncronos)
    const executeCallback = (err, results) => {
      // Usar setImmediate para simular comportamiento asíncrono real de la BD
      setImmediate(() => callback(err, results));
    };
    
    // Simular respuestas según la query
    if (query.includes('SELECT * FROM users')) {
      // Para el test de brute force - simular usuario que no existe para generar delays
      if (params && params.length > 0 && params[0] === 'admin') {
        // Usuario existe pero password será incorrecto (para activar delays)
        executeCallback(null, [{
          id: 1,
          username: 'admin',
          password: '$2a$10$OPJ7MpjW4oVxXmZHlnRLhuxCDnw3cnWElm2Yl4qM3Mz5aAXDBVERu', // admin123
          email: 'admin@example.com'
        }]);
      } else {
        executeCallback(null, [{
          id: 1,
          username: 'testuser',
          password: '$2a$10$YourHashedPasswordHere',
          email: 'test@example.com'
        }]);
      }
    } else if (query.includes('SELECT COUNT(*)')) {
      executeCallback(null, [{ count: 1 }]);
    } else if (query.includes('SELECT * FROM products')) {
      // Si se usan parámetros, verificar que coincidan
      if (params && params.length > 0) {
        const category = params[0];
        // Solo devolver productos si la categoría existe (simulando BD real)
        if (category === 'Electronics' || category === 'Furniture') {
          executeCallback(null, [
            { id: 1, name: 'Test Product', category: category, price: 10, stock: 100 }
          ]);
        } else {
          // Categorías no existen o son intentos de inyección
          executeCallback(null, []);
        }
      } else {
        // Sin parámetros, devolver un producto (vulnerable)
        executeCallback(null, [
          { id: 1, name: 'Test Product', category: 'Test', price: 10, stock: 100 }
        ]);
      }
    } else {
      executeCallback(null, []);
    }
  }),
  connect: jest.fn((callback) => callback(null))
};

// Mock del módulo de database
jest.mock('../src/config/database', () => ({
  db: mockDb,
  connectWithRetry: jest.fn()
}));

// Variables de entorno para tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.DB_HOST = 'localhost';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'test_db';

// Limpiar mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});
