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
