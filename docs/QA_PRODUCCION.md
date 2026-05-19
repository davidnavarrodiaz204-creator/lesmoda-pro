# QA Produccion — LesModa v1.0

Checklist de verificacion previa a entrega a cliente.

## Backend

- [ ] Backend arranca sin errores (`node src/index.js`)
- [ ] `GET /health` responde status, mongodb, telegram, cloudinary, uptime
- [ ] `GET /api/products` devuelve productos activos
- [ ] `POST /api/products` protegido (requiere token)
- [ ] `PUT /api/products/:id` actualiza producto
- [ ] `DELETE /api/products/:id` elimina producto
- [ ] `DELETE /api/products/:id/images/:imageId` elimina imagen individual de Cloudinary
- [ ] `PATCH /api/products/:id/images/:imageId/main` marca imagen como principal
- [ ] `POST /api/orders` crea pedido (publico)
- [ ] `GET /api/orders/stats` devuelve todayOrders, weekOrders, unviewedCount, mostOrderedProducts
- [ ] `GET /api/orders/test-telegram` envia mensaje de prueba a Telegram
- [ ] `PATCH /api/orders/:id/viewed` marca pedido como visto
- [ ] `PATCH /api/orders/:id/status` cambia estado
- [ ] `GET /api/config` devuelve configuracion
- [ ] `PUT /api/config` guarda configuracion
- [ ] `POST /api/auth/login` autentica
- [ ] `GET /api/auth/me` devuelve usuario autenticado
- [ ] JWT_SECRET requerido en produccion
- [ ] CORS limitado a CLIENT_URL en produccion
- [ ] Rate limiting activo (100 req / 15 min)
- [ ] Upload limitado a 5MB, solo imagenes (jpg, jpeg, png, webp, svg)

## Frontend

### Catalogo publico
- [ ] Hero section se ve correcta
- [ ] Categorias funcionan (Mujer, Hombre, Accesorios)
- [ ] Filtros combinables (categoria + badge)
- [ ] Busqueda por texto funciona
- [ ] Productos se muestran en grid
- [ ] ProductCard muestra imagen, nombre, precio, badge, stock
- [ ] Hover en desktop muestra overlay con boton Agregar
- [ ] Click en producto abre modal

### ProductModal
- [ ] Galeria con navegacion (anterior/siguiente)
- [ ] Swipe táctil en mobile
- [ ] Thumbnails debajo de la imagen principal
- [ ] Selector de talla funciona
- [ ] Selector de color funciona
- [ ] Cantidad ajustable
- [ ] "Agregar al carrito" cierra modal y agrega item
- [ ] "Comprar ahora" agrega al carrito y abre WhatsApp con mensaje formateado
- [ ] Stock badge se muestra segun configuracion

### Carrito (CartDrawer)
- [ ] Se abre desde bottom nav o header
- [ ] Items se muestran con imagen, nombre, talla, color, cantidad, precio
- [ ] Cantidad ajustable
- [ ] Eliminar item funciona
- [ ] "Vaciar carrito" funciona
- [ ] Checkout: formulario con nombre, celular, direccion
- [ ] Validacion: nombre y celular requeridos
- [ ] Al confirmar: guarda pedido en backend + abre WhatsApp
- [ ] Carrito persistente (se recupera al recargar pagina)

### WhatsApp
- [ ] Mensaje con codigo de pedido (ej: L4A7F)
- [ ] Formato: Nuevo pedido, Cliente, Productos separados por "---", Total, Mensaje
- [ ] Enlace directo a la app en mobile
- [ ] web.whatsapp.com en desktop
- [ ] Numeros peruanos normalizados a 51XXXXXXXXX

### Admin
- [ ] Login funciona
- [ ] Dashboard metricas cargan
- [ ] Dashboard: grafico SVG de pedidos (hoy/ayer/semana)
- [ ] Dashboard: top productos mas consultados
- [ ] Dashboard: productos mas pedidos
- [ ] Dashboard: Estado del sistema (API, DB, Cloudinary, Telegram)
- [ ] Productos: listado con filtros y busqueda
- [ ] Productos: crear producto con imagenes
- [ ] Productos: editar producto, agregar/eliminar imagenes, marcar principal
- [ ] Pedidos: filtros por estado y busqueda
- [ ] Pedidos: badge de "Nuevo" en pedidos no vistos
- [ ] Pedidos: contador rojo en sidebar/nav
- [ ] Pedidos: polling cada 30s para detectar nuevos
- [ ] Pedidos: marcar como visto
- [ ] Pedidos: acciones rapidas (contactar, confirmar, entregar)
- [ ] Pedidos: detalle con productos y mensaje WhatsApp
- [ ] Config: tabs funcionales (General, Branding, Social, WhatsApp, Marketing, Apariencia, Avanzado)
- [ ] Config: guardar correctamente
- [ ] Boton "Probar Telegram" en Estado del sistema

### Telegram
- [ ] Al crear pedido, llega notificacion al chat
- [ ] Mensaje incluye: codigo pedido, cliente, celular, total, productos, link WA
- [ ] No interfiere con la creacion del pedido (no bloqueante)
- [ ] Si falla, el pedido se guarda igual

### PWA
- [ ] Manifest.json cargado
- [ ] Service worker registrado
- [ ] Iconos SVG funcionan
- [ ] Offline page se muestra sin conexion
- [ ] Instalable en Android (prompt add to home screen)

### Mobile
- [ ] Bottom nav funcional (4 tabs)
- [ ] Header responsivo
- [ ] Product grid 2 columnas
- [ ] Modal ocupa pantalla completa
- [ ] Carrito drawer ocupa max 90vw
- [ ] Admin responsivo
- [ ] Touch targets minimo 44px

## Deploy

### Render (backend)
- [ ] Variables configuradas: MONGODB_URI, JWT_SECRET, CLOUDINARY_*, TELEGRAM_*, CLIENT_URL
- [ ] Health check endpoint funciona en produccion
- [ ] Logs muestran inicio correcto

### Netlify (frontend)
- [ ] VITE_API_URL apunta al backend de Render
- [ ] Build pasa sin errores
- [ ] Redirects configurados para SPA
- [ ] Cache headers para assets estaticos
