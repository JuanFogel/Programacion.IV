# TP2 Pizzería - API de Pedidos

API REST para sistema de pedidos de pizzería desarrollada con TypeScript, Express, Zod y Vitest.

## Tecnologías

- **Node.js 18+**
- **TypeScript**
- **Express**
- **Zod** (validaciones)
- **Vitest** + **Supertest** (testing)

## Instalación

```bash
npm install
```

## Scripts

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Tests
npm test
```

## Endpoints

### 1. Crear Pedido
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "address": "Av. Siempre Viva 742",
    "items": [
      {
        "size": "M",
        "toppings": ["olives", "mushrooms"]
      },
      {
        "size": "S",
        "toppings": []
      }
    ]
  }'
```

### 2. Obtener Pedido por ID
```bash
curl http://localhost:3000/order/1
```

### 3. Cancelar Pedido
```bash
curl -X POST http://localhost:3000/orders/1/cancel
```

### 4. Listar Pedidos (con filtro opcional)
```bash
# Todos los pedidos
curl http://localhost:3000/orders

# Filtrar por estado
curl http://localhost:3000/orders?status=created
curl http://localhost:3000/orders?status=delivered
curl http://localhost:3000/orders?status=cancelled
```

## Reglas de Negocio

- **Tamaños de pizza**: S, M, L
- **Máximo 5 toppings por pizza**
- **Precios**: S=$10, M=$15, L=$20 + $2 por topping
- **No se puede cancelar pedidos entregados** (status='delivered')

## Validaciones

- **items[]**: Array no vacío requerido
- **address**: Mínimo 10 caracteres
- **toppings**: Máximo 5 por pizza

## Códigos de Error

- **422**: Validación fallida (items vacío, address corto)
- **404**: Pedido no encontrado
- **409**: No se puede cancelar pedido entregado

## Arquitectura

- **Separación app/server**: `makeApp()` sin `listen()` para tests
- **Validaciones Zod**: Edge validation + business rules
- **Tests**: Unit tests para reglas de dominio, integration tests para HTTP contract

| ID | Caso / Descripción | Precondición | Input | Acción | Resultado esperado | Test |
|---|---|---|---|---|---|---|
| CA1 | Health check retorna estado OK | Servidor funcionando | - | GET /health | Status 200, { status: 'ok' } | `health.test.ts → "GET /health returns ok"` |
| CA2 | Crear pedido válido con múltiples items | - | `{ address: "Av. Siempre Viva 742", items: [{size: "M", toppings: ["olives", "mushrooms"]}, {size: "S", toppings: []}] }` | POST /orders | Status 201, order creado con precio total 2900 cents y 2 items | `orders.post.test.ts → "creates an order and returns 201 with total price"` |
| ER1 | Validación falla con array de items vacío | - | `{ address: "short", items: [] }` | POST /orders | Status 422, errors definidos | `orders.post.test.ts → "returns 422 on invalid body (empty items)"` |
| CA3 | Cálculo precio ítem pequeño sin toppings | - | size: "S", toppings: 0 | calculateItemPriceCents | 1000 cents | `order.test.ts → "calculates item price by size and toppings"` |
| CA4 | Cálculo precio ítem mediano con 2 toppings | - | size: "M", toppings: 2 | calculateItemPriceCents | 1900 cents | `order.test.ts → "calculates item price by size and toppings"` |
| CA5 | Cálculo precio ítem grande con 5 toppings | - | size: "L", toppings: 5 | calculateItemPriceCents | 3000 cents | `order.test.ts → "calculates item price by size and toppings"` |
| CA6 | Suma total pedido con múltiples ítems | - | `[{size: "M", toppings: ["olives"]}, {size: "S", toppings: []}]` | calculateOrderTotalCents | 2700 cents | `order.test.ts → "sums total order price"` |
| CA7 | Cancelación permitida para estado "created" | status: "created" | - | canCancel | true | `order.test.ts → "cannot cancel when delivered"` |
| ER2 | Cancelación denegada para estado "delivered" | status: "delivered" | - | canCancel | false | `order.test.ts → "cannot cancel when delivered"` |
