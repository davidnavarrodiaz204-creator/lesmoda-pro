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
npm run dev



## 📄 Licencia
MIT
