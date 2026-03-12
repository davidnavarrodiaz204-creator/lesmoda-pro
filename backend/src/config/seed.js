// backend/src/config/seed.js
// Crea un admin inicial y productos de ejemplo
// Uso: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const User     = require('../models/User');
const Config   = require('../models/Config');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('📦 Conectado a MongoDB...');

  // Crear admin si no existe
  const exists = await User.findOne({ email: 'admin@lesmoda.com' });
  if (!exists) {
    await User.create({
      name:     'Admin LesModa',
      email:    'admin@lesmoda.com',
      password: 'admin1234',       // ← cámbiala después
      role:     'admin',
    });
    console.log('👤 Admin creado: admin@lesmoda.com / admin1234');
  } else {
    console.log('👤 Admin ya existe');
  }

  // Config inicial
  await Config.set('waNumber',   '51999999999', 'Número WhatsApp de la tienda');
  await Config.set('storeName',  'LesModa',     'Nombre de la tienda');
  await Config.set('storeSlogan','Moda que te define', 'Slogan');
  console.log('⚙️  Config inicial guardada');

  await mongoose.disconnect();
  console.log('✅ Seed completado');
}

seed().catch(err => { console.error(err); process.exit(1); });
