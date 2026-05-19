# Release v1.0 — LesModa Pro

Catalogo digital administrable para ventas por WhatsApp con panel administrativo.

## Funcionalidades

### Catalogo Publico
- Grid responsivo con imagenes, precios, stock y badges
- Filtros combinables (categoria + badge)
- Busqueda por texto en tiempo real
- Modal de producto con galeria, tallas, colores
- Carrito persistente (localStorage)
- Checkout integrado con WhatsApp
- PWA instalable con offline support

### Panel Administrativo
- Dashboard con metricas (pedidos hoy/ayer/semana, revenue, top productos)
- Estado del sistema (API, MongoDB, Cloudinary, Telegram)
- CRUD completo de productos con subida de imagenes a Cloudinary
- Gestion de pedidos con filtros (pendientes, no vistos, hoy, semana)
- Badge "Nuevo" en pedidos no vistos con contador en sidebar
- Polling cada 30s para deteccion de nuevos pedidos
- Notificaciones toast al recibir nuevo pedido
- Acciones rapidas: contactar por WhatsApp, confirmar, entregar
- Configuracion completa (general, branding, social, WhatsApp, marketing, apariencia, avanzado)
- Sonido de notificacion, intervalo de polling configurable

### Automatizaciones
- Notificaciones de pedidos via Telegram
- Mensaje de WhatsApp con codigo de pedido y detalle de productos
- Marca de agua automatica en imagenes subidas

## Stack Tecnico

| Capa | Tecnologia |
|------|------------|
| Frontend | React 18 + Vite + React Router 6 |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Imagenes | Cloudinary |
| Notificaciones | Telegram Bot API |
| Hosting | Netlify (frontend) + Render (backend) |
| PWA | Vite PWA Plugin + Service Worker |

## Estructura del Proyecto

```
lesmoda-pro/
├── backend/
│   └── src/
│       ├── config/        # DB, Cloudinary
│       ├── controllers/    # Products, Orders, Auth, Config
│       ├── middleware/     # Auth, Error handler
│       ├── models/        # Product, Order, Config
│       ├── routes/        # Express routers
│       ├── services/      # Telegram, Image processor
│       └── index.js       # Entry point
├── frontend/
│   └── src/
│       ├── components/    # UI components
│       ├── pages/         # Page components
│       ├── services/      # API client
│       └── ...
└── docs/                  # Documentacion
```

## Variables de Entorno Requeridas

Ver [DEPLOY_PRODUCCION.md](./DEPLOY_PRODUCCION.md).

## Notas de la Version

- La tienda esta configurada para negocio local en Paita, Peru
- Los precios se muestran en soles peruanos (S/)
- El numero de WhatsApp se configura desde el panel admin
- Los pedidos no requieren pasarela de pago — todo es contraentrega via WhatsApp
