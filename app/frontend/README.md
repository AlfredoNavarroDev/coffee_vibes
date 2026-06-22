# Coffee Vibes — Frontend

Tienda en línea para Coffee Vibes, construida con **Next.js 16 (App Router)**,
**TypeScript**, **Tailwind CSS v4** y **Zustand**. Consume la API REST del
backend (Express + Prisma) que ya está hecha.

## Stack

- **Next.js 16** (App Router, Server + Client Components)
- **TypeScript**
- **Tailwind CSS v4** con paleta de marca personalizada
- **Zustand** — estado de autenticación y carrito (persistidos en `localStorage`)
- **axios** — cliente HTTP con interceptores de JWT
- **react-hook-form + zod** — formularios y validación
- **sonner** — notificaciones (toasts)
- **lucide-react** — iconografía

## Estructura de carpetas

```
src/
├─ app/
│  ├─ (auth)/login, /registro          → páginas de autenticación
│  ├─ (store)/                          → tienda pública (header + footer)
│  │  ├─ page.tsx                       → home
│  │  ├─ tienda/                        → catálogo y detalle de producto
│  │  ├─ carrito/, checkout/            → flujo de compra
│  │  ├─ pedidos/                       → historial y detalle (cliente)
│  │  └─ perfil/                        → datos de cuenta y direcciones
│  ├─ admin/                            → panel OWNER/ADMIN (sidebar propio)
│  │  ├─ pedidos/, productos/, categorias/
│  └─ orders/[id]/success|failure|pending → back_urls de Mercado Pago
├─ components/                          → ui/, layout/, store/, admin/, auth/
├─ services/                            → funciones que llaman a cada módulo de la API
├─ store/                               → auth.store.ts, cart.store.ts (Zustand)
├─ hooks/use-async-data.ts              → fetch con loading/error genérico
├─ lib/                                 → api-client, utils, order-status
└─ types/index.ts                       → tipos calcados del schema.prisma
```

## Cómo correrlo

### 1. Backend primero

El backend **debe** estar corriendo en `http://localhost:3000` (o donde lo
configures) antes de usar el frontend. Sigue el README del backend para:

```bash
cd app/backend
npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

> ⚠️ **Puertos**: este frontend corre en el **puerto 3001** para no chocar con
> el backend (puerto 3000). Ya está configurado en `package.json`
> (`next dev -p 3001`).

### 2. Variables de entorno del backend (importante)

El `.env.example` del backend trae por defecto:

```
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

Como el frontend corre en el puerto **3001**, actualiza el `.env` del backend a:

```
FRONTEND_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:3001
```

Esto es necesario para que:
- CORS permita las llamadas del frontend al backend.
- Las `back_urls` de Mercado Pago (success/failure/pending) redirijan al
  frontend y no a sí mismo.

> 📌 **Nota sobre el webhook de Mercado Pago**: en
> `payment.service.js`, la `notification_url` que se envía a Mercado Pago usa
> `env.frontendUrl` (`${frontendUrl}/api/payments/webhook`). Ese endpoint vive
> en el **backend**, no en el frontend, así que en producción conviene
> apuntarlo a la URL pública del backend (por ejemplo, agregando una variable
> `BACKEND_PUBLIC_URL` separada) para que las notificaciones de pago lleguen
> correctamente. En local con Mercado Pago Sandbox esto normalmente requiere
> además un túnel (ngrok o similar), ya que Mercado Pago no puede llamar a
> `localhost`.

### 3. Frontend

```bash
cd app/frontend
npm install
cp .env.local.example .env.local   # ajusta NEXT_PUBLIC_API_URL si es necesario
npm run dev
```

Abre `http://localhost:3001`.

## Cuentas de prueba (vienen del seed del backend)

| Rol      | Email                     | Password  |
|----------|---------------------------|-----------|
| Cliente  | cliente@test.com          | test123   |
| Owner    | owner@coffeevibes.com     | owner123  |
| Admin    | admin@coffeevibes.com     | admin123  |

Inicia sesión como `owner` o `admin` para ver el enlace **Panel** en el header
y acceder a `/admin`.

## Flujo de pago (Mercado Pago)

1. El cliente arma su carrito y va a `/checkout`.
2. Se crea el pedido (`POST /api/orders`).
3. Se crea la preferencia de pago (`POST /api/payments/create-preference`).
4. Se redirige al `init_point` de Mercado Pago.
5. Mercado Pago redirige de vuelta a `/orders/{id}/success|failure|pending`
   (rutas ya implementadas en este frontend).
6. El estado real del pedido se actualiza vía el webhook que llega al
   **backend** (`POST /api/payments/webhook`), y el cliente puede ver el
   estado actualizado en `/pedidos/{id}`.

Para que el paso 4 funcione necesitas credenciales reales de Mercado Pago
(`MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`) configuradas en el `.env` del backend.

## Diseño

La identidad visual se inspira en las fichas de catación de café de
especialidad: paleta basada en tonos reales de tueste (no terracota genérica),
tipografía `Fraunces` (display) + `Inter` (texto) + `JetBrains Mono` (precios,
códigos de pedido, datos), y un sello circular de origen como elemento gráfico
distintivo de la marca.
