# Importacion Masiva de Productos — LesModa v1.0

Permite cargar hasta 300 productos rapidamente desde un archivo CSV.

## Endpoints

### POST /api/products/import/preview

Sube un archivo CSV y devuelve vista previa con validaciones.

**Request:** `multipart/form-data` con campo `file` (archivo .csv, max 2 MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 10,
    "validCount": 8,
    "invalidCount": 2,
    "valid": [
      { "name": "Blusa cruzada", "price": 16, "category": "Mujer", ... }
    ],
    "invalid": [
      { "index": 3, "errors": ["price debe ser un numero valido"] }
    ]
  }
}
```

### POST /api/products/import/confirm

Ejecuta la importacion de los productos previamente validados.

**Request:**
```json
{
  "rows": [
    { "name": "Blusa cruzada", "category": "Mujer", "price": 16, ... }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 8,
    "created": 7,
    "skipped": 1,
    "errors": 0,
    "createdDetails": [
      { "index": 0, "name": "Blusa cruzada", "_id": "..." }
    ],
    "skippedDetails": [
      { "index": 2, "name": "Polo basico", "reason": "Ya existe un producto con este nombre" }
    ]
  }
}
```

## Formato CSV

### Columnas

| Columna | Tipo | Requerido | Default | Descripcion |
|---------|------|-----------|---------|-------------|
| name | string | Si | - | Nombre del producto |
| category | string | No | General | Mujer, Hombre, Accesorios, General |
| price | number | Si | - | Precio en soles |
| oldPrice | number | No | vacio | Precio anterior (para mostrar descuento) |
| stock | number | No | 0 | Cantidad en stock |
| badge | string | No | vacio | new, sale, hot, last, featured |
| sizes | string | No | vacio | Separados por coma o pipe: S,M,L o S\|M\|L |
| colors | string | No | vacio | Separados por coma o pipe: Rojo,Negro,Blanco |
| description | string | No | vacio | Descripcion del producto |
| imageUrl | string | No | vacio | URL publica de la imagen principal |
| isActive | boolean | No | true | true o false |
| featured | boolean | No | false | true o false |

### Ejemplo

```csv
name,category,price,oldPrice,stock,badge,sizes,colors,description,imageUrl,isActive,featured
Blusa cruzada,Mujer,16,20,5,sale,S|M|L,Negro|Blanco,Blusa elegante para dama,https://ejemplo.com/blusa.jpg,true,false
Polo basico,Hombre,12,,10,,S|M|L|XL,Azul|Gris,Polo clasico de algodon,,true,false
Vestido floral,Mujer,22,28,3,new,M|L,Rojo|Verde,Vestido estampado,https://ejemplo.com/vestido.jpg,true,true
```

## Errores comunes

- **name es obligatorio**: la celda name esta vacia
- **price debe ser un numero valido**: la celda contiene texto no numerico
- **badge "x" no es valido**: usar solo: new, sale, hot, last, featured
- **Archivo vacio**: el CSV no tiene filas de datos
- **Maximo 300 filas**: el archivo excede el limite
- **Ya existe un producto con este nombre**: el nombre coincide con uno existente (ignora mayusculas)

## Flujo recomendado

1. Descargar plantilla desde el boton "Descargar plantilla" en el modal de importacion
2. Llenar los datos en Excel o Google Sheets
3. Exportar como CSV (UTF-8)
4. Subir el archivo en Admin > Productos > Importar
5. Revisar la vista previa con los productos validos y errores
6. Confirmar la importacion
7. Verificar los productos en el catalogo

## Seguridad

- Endpoint protegido por JWT (requiere sesion admin)
- Maximo 300 filas por importacion
- Maximo 2 MB por archivo
- Solo archivos .csv
- No se ejecutan formulas de Excel
- No se aceptan scripts en los campos
- No se procesan campos que no esten en el esquema

## Notas

- Los productos se crean como activos por defecto
- Si `imageUrl` se proporciona, se guarda como imagen principal
- Si no hay `imageUrl`, el producto se crea sin imagen
- Los duplicados se detectan por nombre (case-insensitive)
- El badge `hot` (Trending) esta disponible pero se recomienda usarlo con moderacion
