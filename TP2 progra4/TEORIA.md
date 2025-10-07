# Preguntas de Teoría - TP2

## 1. Ciclo Red → Green → Refactor

El ciclo TDD consiste en tres fases: **Red** (escribir test que falle), **Green** (implementar mínimo código para que pase), **Refactor** (mejorar código manteniendo tests verdes). El tamaño del paso es crucial: pasos muy grandes dificultan el debugging, mientras que pasos pequeños permiten identificar rápidamente qué está fallando y mantener el flujo de desarrollo.

## 2. Diferenciación de Tests en APIs

- **Unit tests**: Prueban funciones/reglas de negocio aisladas (ej: cálculo de precios)
- **Integration tests**: Prueban contratos HTTP completos (status, body, headers)
- **E2E tests**: Prueban flujos completos usuario-sistema con datos reales

## 3. Test Doubles

**Test doubles** son objetos que reemplazan dependencias en tests:
- **Mock**: Verifica interacciones específicas (cuántas veces se llamó)
- **Stub**: Proporciona respuestas predefinidas sin verificar comportamiento
- **Spy**: Observa llamadas sin cambiar comportamiento original

## 4. Separación App/Server

Útil para tests de integración sin levantar servidor real:

```typescript
// app.ts
export function makeApp(): Express {
  const app = express();
  app.use(express.json());
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  return app;
}

// server.ts
import { makeApp } from './app.js';
const app = makeApp();
app.listen(3000);

// test
import request from 'supertest';
const app = makeApp();
const res = await request(app).get('/health');
```

## 5. Zod parse vs safeParse

- **parse()**: Lanza excepción si falla la validación
- **safeParse()**: Retorna objeto con success/error, ideal para manejo en Express

```typescript
// En ruta Express
const result = schema.safeParse(req.body);
if (!result.success) {
  return res.status(422).json({ errors: result.error.flatten() });
}
```

## 6. Reglas de Dominio para Unit Tests

Dos ejemplos de reglas de negocio (más allá de validación de entrada):
- **Cálculo de precio**: `calculateOrderTotalCents(items)` - suma precios base + toppings
- **Regla de cancelación**: `canCancel(status)` - no se puede cancelar si status='delivered'

## 7. "Bad Smells" en Test Suites

1. **Nombres poco descriptivos**: `test1`, `should work` → `calculates_price_for_medium_pizza_with_toppings`
2. **Duplicación de setup**: Código repetido en cada test → extraer a `beforeEach` o helpers
3. **Asserts débiles**: `expect(result).toBeTruthy()` → `expect(result.totalPriceCents).toBe(1900)`

## 8. Trazabilidad Criterios de Aceptación ↔ Tests

| Criterio de Aceptación | Test Correspondiente |
|------------------------|---------------------|
| "El precio se calcula como base + toppings" | `calculates_item_price_by_size_and_toppings` |
| "No se puede cancelar pedido entregado" | `cannot_cancel_when_delivered` |

## 9. Por qué no buscar 100% Coverage

Riesgos de perseguir 100% cobertura:
- **Código muerto**: Tests para código que nunca se ejecuta en producción
- **Tests frágiles**: Cobertura forzada genera tests que se rompen fácilmente
- **Falsa sensación**: 100% coverage no garantiza que el código funcione correctamente
- **Tiempo perdido**: Esfuerzo desproporcionado en casos edge irrelevantes

## 10. Test Helper/Builder

Función que facilita la creación de datos de prueba:

```typescript
// Test helper
function createOrder(overrides = {}): Order {
  return {
    id: '1',
    items: [{ id: '1-0', size: 'M', toppings: ['olives'] }],
    address: 'Av. Siempre Viva 742',
    status: 'created',
    totalPriceCents: 1700,
    ...overrides
  };
}

// Uso en test
const deliveredOrder = createOrder({ status: 'delivered' });
```
