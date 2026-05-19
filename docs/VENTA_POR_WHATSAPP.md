# Venta por WhatsApp — Flujo actual

## Cómo funciona

1. **Catálogo público** (`/`) — El cliente navega los productos activos.
2. **Carrito** — Agrega productos, elige talla/color, define cantidad.
3. **Checkout** — Completa nombre, celular y dirección opcional.
4. **Confirmar y enviar** — El frontend:
   - Guarda el pedido en la base de datos (`POST /api/orders`).
   - Redirige al cliente a WhatsApp con un mensaje prearmado con el resumen del pedido.
5. **Atención manual** — El vendedor recibe el mensaje en WhatsApp, confirma disponibilidad, coordina pago y entrega.
6. **Admin** — El vendedor puede ver todos los pedidos, actualizar su estado (pendiente, confirmado, enviado, entregado, cancelado) y agregar notas internas.

## Limitaciones actuales

- **No hay pasarela de pago online.** Todo pago se coordina manualmente por WhatsApp (transferencia, Yape, efectivo contraentrega, etc.).
- **No hay OpenWA.** La integración usa el enlace `wa.me` estándar. No hay automatización de mensajes entrantes ni chatbot.

## Por qué este enfoque

- Permite lanzar rápido sin necesidad de integraciones bancarias ni API de WhatsApp Business.
- El pedido queda persistido en la base de datos desde el primer clic, evitando pérdida de información si el cliente no completa el chat.
- El admin tiene trazabilidad de todos los pedidos aunque el cliente haya contactado por WhatsApp.

## A futuro (cuando aplique)

- Integrar **OpenWA** (WhatsApp Business API) para recibir y procesar mensajes automáticamente.
- Agregar **pasarela de pago** (Izipay, Mercado Pago, etc.) para pagos online sin intervención manual.
- Notificaciones automáticas al cliente cuando su pedido cambie de estado.

## Endpoints relacionados

| Método | Ruta | Propósito |
|--------|------|-----------|
| POST   | `/api/orders`        | Crear pedido (público) |
| GET    | `/api/orders`        | Listar pedidos (admin) |
| GET    | `/api/orders/:id`    | Detalle de pedido (admin) |
| PATCH  | `/api/orders/:id/status`  | Cambiar estado (admin) |
| PATCH  | `/api/orders/:id/notes`   | Agregar nota interna (admin) |
