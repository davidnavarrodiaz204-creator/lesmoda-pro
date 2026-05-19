# Deploy a Produccion — LesModa v1.0

## Requisitos

- Render account (backend)
- Netlify account (frontend) — ya esta deployado
- MongoDB Atlas (base de datos)
- Cloudinary account (imagenes)
- Telegram Bot Token (opcional pero recomendado)

## Variables de Entorno

### Backend (Render)

| Variable | Descripcion |
|----------|-------------|
| `MONGODB_URI` | Connection string de MongoDB Atlas |
| `JWT_SECRET` | Secreto para JWT (generar con `openssl rand -hex 32`) |
| `CLIENT_URL` | URL del frontend (https://lesmoda.netlify.app) |
| `CLOUDINARY_CLOUD_NAME` | Cloud name de Cloudinary |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |
| `TELEGRAM_BOT_TOKEN` | Token del bot de Telegram (@BotFather) |
| `TELEGRAM_CHAT_ID` | Chat ID donde recibir notificaciones |
| `TELEGRAM_NOTIFICATIONS_ENABLED` | `true` o `false` |
| `NODE_ENV` | `production` |

### Frontend (Netlify)

| Variable | Descripcion |
|----------|-------------|
| `VITE_API_URL` | URL del backend (https://lesmoda-api.onrender.com) |

## Pasos

### 1. Preparar backend

```bash
cd backend
npm install --production
```

### 2. Deploy backend a Render

- Crear nuevo Web Service
- Conectar repo de GitHub
- Build Command: `npm install`
- Start Command: `node src/index.js`
- Agregar todas las variables de entorno
- Health Check Path: `/health`

### 3. Deploy frontend a Netlify

El frontend ya esta configurado en Netlify. Para actualizar:

```bash
cd frontend
npm run build
```

Subir carpeta `dist/` a Netlify (drag & drop o conectar repo).

### 4. Verificar

- Backend: `https://lesmoda-api.onrender.com/health`
- Frontend: `https://lesmoda.netlify.app`
- Hacer un pedido de prueba
- Verificar que llega a Telegram
- Verificar admin: `https://lesmoda.netlify.app/admin`

## Monitoreo

- Render: logs en dashboard
- Netlify: deploy log, function logs
- Telegram: notificaciones de pedidos
- Admin: Estado del sistema en dashboard
