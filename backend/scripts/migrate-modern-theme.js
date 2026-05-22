#!/usr/bin/env node
require('dotenv').config();
const mongoose = require('mongoose');
const Config = require('../src/models/Config');

const LEGACY_COLORS = new Set([
  '#c9a96e', '#d4b574', '#b8955a', '#e8d5b0',
  '#faf7f2', '#f5f1eb', '#1a1612', '#8a7968', '#e0d8ce',
]);

const MODERN_THEME = {
  primaryColor: '#111827',
  secondaryColor: '#111827',
  bgColor: '#F6F7FB',
  surfaceColor: '#FFFFFF',
  textColor: '#111827',
  mutedColor: '#6B7280',
  borderColor: '#E5E7EB',
  visualMode: 'modern-fashion',
};

function isLegacy(value) {
  if (typeof value !== 'string') return false;
  return LEGACY_COLORS.has(value.trim().toLowerCase());
}

async function run() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI no está definido');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const keys = Object.keys(MODERN_THEME);
  const docs = await Config.find({ key: { $in: keys } }).lean();
  const current = Object.fromEntries(docs.map(d => [d.key, d.value]));

  const hasLegacy = keys.some(k => isLegacy(current[k]));
  const needsVisualMode = current.visualMode !== MODERN_THEME.visualMode;

  let migrated = 0;
  let alreadyModern = 0;
  let errors = 0;

  try {
    if (hasLegacy || needsVisualMode) {
      for (const [key, value] of Object.entries(MODERN_THEME)) {
        await Config.updateOne({ key }, { $set: { value } }, { upsert: true });
      }
      migrated = 1;
      console.log('✅ Config de tema migrada a modern-fashion.');
    } else {
      alreadyModern = 1;
      console.log('ℹ️ La config de tema ya estaba correcta.');
    }
  } catch (err) {
    errors += 1;
    console.error('❌ Error migrando config de tema:', err.message);
  } finally {
    console.log('\nResumen migración tema moderno');
    console.log(`- configs migradas: ${migrated}`);
    console.log(`- configs ya correctas: ${alreadyModern}`);
    console.log(`- errores: ${errors}`);
    await mongoose.disconnect();
  }

  if (errors > 0) process.exit(1);
}

run().catch(async (err) => {
  console.error('❌ Error fatal en migración:', err.message);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
