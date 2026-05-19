# Backups y Exportacion — LesModa v1.0

Sistema simple de respaldo y recuperacion de datos.

## Exportacion de productos

Descarga todos los productos como archivo CSV.

**Endpoint:** `GET /api/products/export/csv` (protegido)

Incluye:
- name, category, price, oldPrice, stock, badge
- sizes, colors (separados por pipe |)
- description, imageUrl, isActive, featured, createdAt

## Exportacion de pedidos

Descarga todos los pedidos como archivo CSV.

**Endpoint:** `GET /api/orders/export/csv` (protegido)

Incluye:
- orderId, customerName, customerPhone, customerAddress
- total, status, itemsCount, products concatenados, source, createdAt, isViewed

## Backup completo JSON

Descarga toda la informacion del negocio en un solo archivo JSON.

**Endpoint:** `GET /api/system/backup` (protegido)

Incluye:
- products (todos los productos)
- orders (todos los pedidos)
- config (configuracion de la tienda)
- exportedAt (fecha de exportacion)
- stats (resumen de cantidades)

## Restauracion

Restaura datos desde un archivo JSON de backup.

**Endpoint:** `POST /api/system/restore` (protegido)

**Request:**
```json
{
  "backup": { "products": [...], "orders": [...], "config": {...} },
  "merge": true
}
```

**Reglas:**
- merge=true: actualiza productos existentes por nombre
- merge=false: salta productos existentes
- No duplica pedidos (verifica por _id)
- No borra datos existentes nunca
- Maximo 1000 productos y 1000 pedidos por restauracion

**Response:**
```json
{
  "success": true,
  "data": {
    "imported": { "products": 5, "orders": 3, "config": true },
    "errors": 0,
    "errorDetails": [],
    "merge": false
  }
}
```

## Como exportar desde el admin

1. Ir a Admin > Config > Backups
2. Elegir accion:
   - Exportar productos CSV
   - Exportar pedidos CSV
   - Descargar backup completo
3. El archivo se descarga automaticamente

## Como restaurar desde el admin

1. Ir a Admin > Config > Backups
2. Clic en "Restaurar backup"
3. Seleccionar archivo JSON previamente descargado
4. Revisar el resumen de datos encontrados
5. Opcional: marcar "Actualizar productos existentes"
6. Clic en "Confirmar restauracion"

## Limitaciones

- No se restauran imagenes de Cloudinary (solo URLs guardadas en BD)
- Los slugs se regeneran al crear productos (pueden diferir del original)
- Las contrasenas de usuarios no se incluyen en el backup
- Las estadisticas de whatsappClicks se restauran con los productos

## Recomendaciones

- Realizar backup semanal como minimo
- Siempre descargar backup antes de hacer cambios masivos
- Guardar los archivos de backup en un lugar seguro (Google Drive, Dropbox, etc.)
- Al restaurar, probar primero en un entorno de desarrollo
- No compartir el archivo de backup con terceros (contiene datos de clientes)

## Seguridad

- Todos los endpoints requieren autenticacion JWT (admin)
- Validacion de estructura JSON antes de insertar
- No se ejecuta codigo externo ni formulas
- Los datos existentes nunca se borran automaticamente
- Tamaño maximo: 1000 registros por coleccion
