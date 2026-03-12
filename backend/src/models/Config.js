// backend/src/models/Config.js
// Configuración global de la tienda (singleton)
const mongoose = require('mongoose');

const configSchema = new mongoose.Schema(
  {
    key:        { type: String, unique: true, required: true },
    value:      { type: mongoose.Schema.Types.Mixed },
    description:{ type: String },
  },
  { timestamps: true }
);

// Helper estático para leer/escribir config
configSchema.statics.get = async function (key) {
  const doc = await this.findOne({ key });
  return doc ? doc.value : null;
};

configSchema.statics.set = async function (key, value, description = '') {
  return this.findOneAndUpdate(
    { key },
    { key, value, description },
    { upsert: true, new: true }
  );
};

module.exports = mongoose.model('Config', configSchema);
