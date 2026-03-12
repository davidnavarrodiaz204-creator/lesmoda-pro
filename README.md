# 👗 LesModa PRO — Full Stack

**Node.js + Express + MongoDB + React + Cloudinary**

Tienda de ropa online escalable con panel de administración, imágenes en la nube y ventas por WhatsApp.

---

## 🗂️ Estructura del proyecto

```
lesmoda-pro/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js           ← Conexión MongoDB
│   │   │   ├── cloudinary.js   ← Subida de imágenes
│   │   │   └── seed.js         ← Datos iniciales
│   │   ├── models/
│   │   │   ├── Product.js      ← Modelo de producto
│   │   │   ├── User.js         ← Modelo de usuario/admin
│   │   │   └── Config.js       ← Configuración de la tienda
│   │   ├── controllers/
│   │   │   ├── productController.js
│   │   │   └── authController.js
│   │   ├── routes/
│   │   │   ├── products.js
│   │   │   ├── auth.js
│   │   │   └── config.js
│   │   ├── middleware/
│   │   │   ├── auth.js         ← JWT protect
│   │   │   └── errorHandler.js
│   │   └── index.js            ← Servidor Express
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx  ← Login state global
    │   ├── hooks/
    │   │   └── useProducts.js   ← Fetch de productos
    │   ├── services/
    │   │   └── api.js           ← Axios + endpoints
    │   ├── pages/
    │   │   ├── StorePage.jsx    ← Tienda pública
    │   │   ├── AdminPage.jsx    ← Panel admin
    │   │   └── LoginPage.jsx    ← Login admin
    │   ├── components/
    │   │   └── ProductCard.jsx
    │   ├── App.jsx              ← Rutas React Router
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## ⚙️ Instalación local

### 1. Requisitos previos
- Node.js v18+
- MongoDB local o cuenta en [MongoDB Atlas](https://cloud.mongodb.com) (gratis)
- Cuenta en [Cloudinary](https://cloudinary.com) (gratis) para imágenes

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edita .env con tu MONGODB_URI, JWT_SECRET y Cloudinary keys
npm install
npm run seed     # Crea admin + config inicial
npm run dev      # Corre en http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_URL=/api
npm install
npm run dev            # Corre en http://localhost:5173
```

---

## 🌐 API — Endpoints

| Método | Ruta                          | Auth | Descripción               |
|--------|-------------------------------|------|---------------------------|
| GET    | /api/products                 | No   | Listar productos (filtros)|
| GET    | /api/products/:slug           | No   | Detalle de producto       |
| POST   | /api/products                 | ✅   | Crear producto            |
| PUT    | /api/products/:id             | ✅   | Editar producto           |
| DELETE | /api/products/:id             | ✅   | Eliminar producto         |
| POST   | /api/products/:id/click       | No   | Registrar click WA        |
| POST   | /api/auth/login               | No   | Login admin               |
| GET    | /api/auth/me                  | ✅   | Perfil actual             |
| GET    | /api/config                   | No   | Config de la tienda       |
| PUT    | /api/config                   | ✅   | Guardar config            |

### Filtros disponibles en GET /api/products:
```
?category=Mujer
?badge=sale
?featured=true
?search=vestido
?page=1&limit=20
?sort=-createdAt
```

---

## 🚀 Deploy en Railway (backend + MongoDB)

1. Crea cuenta en [railway.app](https://railway.app)
2. **New Project → Deploy from GitHub Repo**
3. Selecciona tu repo, elige la carpeta `backend`
4. Agrega un plugin **MongoDB** dentro del proyecto
5. Railway autocompleta `MONGODB_URI`
6. Agrega el resto de variables en **Variables**:
   ```
   JWT_SECRET=tu_clave_secreta
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   CLIENT_URL=https://tu-frontend.netlify.app
   NODE_ENV=production
   ```

---

## 🚀 Deploy del frontend en Netlify

1. Ve a [netlify.com](https://netlify.com)
2. Conecta el repo → elige carpeta `frontend`
3. Build command: `npm run build`
4. Publish dir: `dist`
5. Agrega variable de entorno:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   ```

---

## 🔐 Acceso admin

URL: `/admin`
- Email: `admin@lesmoda.com`
- Password: `admin1234`
- **⚠️ Cámbiala desde MongoDB o agrega ruta de cambio de password**

---

## 📊 Escalabilidad futura

- [ ] Múltiples imágenes por producto
- [ ] Gestión de pedidos / historial
- [ ] Integración con n8n para WhatsApp automático
- [ ] Analytics de ventas
- [ ] Cupones de descuento
- [ ] Sistema de inventario con alertas

---

## 📄 Licencia
MIT
