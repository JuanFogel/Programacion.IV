# ☕ Cafetería - Sistema de Pedidos

## 📋 Descripción del Proyecto

Aplicación React desarrollada con **TDD (Test-Driven Development)** que simula el flujo de pedidos en una cafetería. El proyecto implementa el ciclo **Rojo → Verde → Refactor** utilizando React Testing Library, Vitest y MSW para mocking de APIs.

## 🎯 Objetivo

Aplicar Desarrollo Guiado por Pruebas (TDD) en React para construir una aplicación que permite:
- Visualizar un menú de productos
- Agregar productos a un pedido
- Calcular el total del pedido
- Eliminar ítems del pedido
- Enviar el pedido al servidor (simulado)

## 🧰 Stack Tecnológico

- **React 18.3.1** + **TypeScript**
- **Vite** - Build tool
- **Vitest** - Test runner
- **React Testing Library** - Testing utilities
- **@testing-library/user-event** - Simulación de interacciones de usuario
- **MSW (Mock Service Worker)** - Mocking de APIs
- **Zod** - Validación de esquemas

## 📁 Estructura del Proyecto

```
cafeteria/
├── src/
│   ├── components/
│   │   ├── Menu.tsx          # Componente para mostrar el menú
│   │   ├── Menu.test.tsx     # Tests del componente Menu
│   │   ├── Order.tsx         # Componente para mostrar el pedido
│   │   └── Order.test.tsx    # Tests del componente Order
│   ├── hooks/
│   │   ├── useOrder.ts       # Hook personalizado para gestión del pedido
│   │   └── useOrder.test.tsx # Tests del hook useOrder
│   ├── mocks/
│   │   ├── server.ts         # Servidor MSW para Node.js
│   │   └── handlers.ts       # Handlers de MSW para mockear APIs
│   ├── types/
│   │   └── index.ts          # Tipos TypeScript y esquemas Zod
│   ├── App.tsx               # Componente principal
│   ├── App.test.tsx          # Tests de integración
│   ├── main.tsx              # Punto de entrada
│   ├── setupTests.ts         # Configuración de tests
│   └── index.css             # Estilos globales
├── vite.config.ts            # Configuración de Vite
├── tsconfig.json             # Configuración de TypeScript
└── package.json              # Dependencias del proyecto
```

## ✅ Lo que está Implementado

### Parte I - Configuración del Entorno

- ✅ Proyecto base creado con Vite + React + TypeScript
- ✅ Dependencias de testing instaladas (Vitest, RTL, MSW, Zod)
- ✅ Configuración de `vite.config.ts` con ambiente jsdom
- ✅ Configuración de `setupTests.ts` con MSW
- ✅ Servidor MSW configurado con handlers para `/api/menu` y `/api/orders`

### Parte II - Desarrollo Guiado por Pruebas

#### ✅ Tipado Base
- ✅ `ProductSchema` definido con Zod
- ✅ Tipo `Product` inferido de Zod
- ✅ Tipos `OrderItem` y `Order` definidos

#### ✅ HU1 - Visualización inicial del menú
**Tests implementados:**
- ✅ Muestra productos mockeados por la API
- ✅ Muestra productos en una lista accesible (roles ARIA)
- ✅ Maneja caso de menú vacío
- ✅ Maneja errores de carga del menú

**Implementación:**
- Componente `Menu` que hace fetch a `/api/menu`
- Estados de loading, error y productos
- Manejo de errores con mensajes apropiados

#### ✅ HU2 - Agregar ítem al pedido
**Tests implementados:**
- ✅ Verifica que los ítems aparecen en el área de pedido
- ✅ Simula clicks en botones "Agregar"

**Implementación:**
- Hook `useOrder` con función `addItem`
- Componente `Order` que muestra los ítems agregados
- Integración con botones "Agregar" del menú

#### ✅ HU3 - Calcular total del pedido
**Tests implementados:**
- ✅ Verifica que el total se calcula correctamente
- ✅ Verifica que el total se actualiza dinámicamente

**Implementación:**
- Función `calculateTotal` en hook `useOrder`
- Cálculo dinámico basado en precio × cantidad
- Visualización del total en el componente Order

#### ✅ HU4 - Eliminar ítem del pedido
**Tests implementados:**
- ✅ Verifica que el clic en "Eliminar" remueve solo ese producto
- ✅ Usa `e.stopPropagation()` para evitar eventos anidados

**Implementación:**
- Función `removeItem` en hook `useOrder`
- Botones "Eliminar" en cada ítem del pedido
- Manejo correcto de eventos

#### ✅ HU5 - Enviar pedido (MSW + Contexto)
**Tests implementados:**
- ✅ Envía pedido al servidor mockeado
- ✅ Muestra mensaje de confirmación
- ✅ Limpia el pedido después de enviarlo exitosamente

**Implementación:**
- Función `handleSubmitOrder` en App
- Fetch POST a `/api/orders` con MSW
- Manejo de estados de loading y mensajes
- Limpieza automática del pedido tras éxito

#### ✅ HU6 - Casos límite
**Tests implementados:**
- ✅ Maneja error 500 al cargar menú
- ✅ Maneja error 500 al enviar pedido
- ✅ Maneja caso de menú vacío

**Implementación:**
- Uso de `server.use()` para sobrescribir handlers en tests
- Mensajes de error apropiados en la UI
- Manejo de estados de error

### Parte III - Integración Completa

- ✅ Test de integración completo que cubre:
  - Cargar menú (mock)
  - Agregar múltiples ítems
  - Calcular total
  - Enviar pedido (mock POST)
  - Resetear interfaz

## 🧪 Tests Implementados

### Resumen de Tests

- **Menu.test.tsx**: 4 tests (HU1 + casos límite)
- **Order.test.tsx**: 4 tests (HU2, HU3, HU4)
- **useOrder.test.tsx**: 6 tests (lógica del hook)
- **App.test.tsx**: 4 tests (HU5, HU6, integración completa)

**Total: 18 tests** cubriendo todas las historias de usuario

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm test -- --watch

# Ejecutar tests con UI
npm run test:ui

# Ejecutar tests una vez y salir
npm test -- --run
```

## 🚀 Cómo Ejecutar el Proyecto

### Instalación

```bash
# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build

```bash
# Compilar para producción
npm run build
```

## 📝 Funcionalidades Implementadas

1. **Visualización de Menú**
   - Carga productos desde API mockeada
   - Muestra nombre y precio de cada producto
   - Estados de carga y error

2. **Gestión de Pedido**
   - Agregar productos al pedido
   - Incrementar cantidad si el producto ya existe
   - Eliminar productos individuales
   - Calcular total dinámicamente

3. **Envío de Pedido**
   - Enviar pedido al servidor (mockeado)
   - Mostrar mensaje de confirmación
   - Limpiar pedido después de envío exitoso
   - Manejo de errores

4. **Manejo de Errores**
   - Errores al cargar menú
   - Errores al enviar pedido
   - Casos de datos vacíos

## ⚠️ Lo que Falta por Hacer

### Mejoras de UI/UX

- [ ] **Estilos CSS más elaborados**: Actualmente tiene estilos básicos. Se podría mejorar con:
  - Diseño responsive
  - Mejor organización visual de los componentes
  - Animaciones para transiciones
  - Mejor feedback visual en interacciones

- [ ] **Mejora de accesibilidad**: 
  - Agregar más atributos ARIA donde sea necesario
  - Mejorar navegación por teclado
  - Agregar labels descriptivos

### Funcionalidades Adicionales

- [ ] **Modificar cantidad de ítems**: Actualmente solo se puede agregar o eliminar. Sería útil:
  - Botones + / - para incrementar/decrementar cantidad
  - Input numérico para cambiar cantidad directamente

- [ ] **Validaciones adicionales**:
  - Validar que el pedido no esté vacío antes de enviar
  - Validar que los productos existan antes de agregar
  - Validar formato de precios

- [ ] **Persistencia local**:
  - Guardar pedido en localStorage
  - Recuperar pedido al recargar la página

- [ ] **Mejoras en el manejo de estado**:
  - Considerar usar Context API para estado global (actualmente usa hook personalizado)
  - Implementar un reducer para estado más complejo

### Tests Adicionales

- [ ] **Tests de edge cases**:
  - Testear con productos con precios muy altos
  - Testear con muchos productos (performance)
  - Testear comportamiento con múltiples usuarios simultáneos

- [ ] **Tests de accesibilidad**:
  - Verificar que todos los elementos son accesibles
  - Verificar navegación por teclado

- [ ] **Tests de integración más complejos**:
  - Flujos de error más elaborados
  - Tests de performance

### Mejoras Técnicas

- [ ] **Configuración de ESLint completa**:
  - Reglas personalizadas
  - Prettier para formato
  - Husky para pre-commit hooks

- [ ] **Optimizaciones**:
  - Code splitting
  - Lazy loading de componentes
  - Memoización donde sea necesario

- [ ] **Documentación**:
  - JSDoc en funciones y componentes
  - Documentación de API
  - Guía de contribución

### Configuración Adicional

- [ ] **Variables de entorno**:
  - Configurar URLs de API mediante variables de entorno
  - Configuración para diferentes ambientes (dev, staging, prod)

- [ ] **CI/CD**:
  - Configurar GitHub Actions para ejecutar tests
  - Configurar deployment automático

## 🔧 Comandos Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Compilar para producción
npm run preview      # Preview de build de producción
npm test             # Ejecutar tests
npm run test:ui      # Ejecutar tests con UI
npm run lint         # Ejecutar linter
```

## 📚 Recursos y Referencias

- [React Testing Library](https://testing-library.com/react)
- [Vitest](https://vitest.dev/)
- [MSW](https://mswjs.io/)
- [Zod](https://zod.dev/)
- [Vite](https://vitejs.dev/)

## 👥 Contribuidores

Este proyecto está siendo desarrollado por un equipo de estudiantes como parte de un trabajo práctico.

## 📄 Licencia

Este proyecto es parte de un trabajo práctico académico.

---

**Nota**: Este README documenta el estado actual del proyecto. Algunas funcionalidades pueden estar en desarrollo o pendientes de implementación según se indica en la sección "Lo que Falta por Hacer".

