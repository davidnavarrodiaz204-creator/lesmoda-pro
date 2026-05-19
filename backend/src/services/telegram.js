const https = require('https');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ENABLED = process.env.TELEGRAM_NOTIFICATIONS_ENABLED === 'true';

exports.sendNotification = async (message) => {
  if (!ENABLED || !TOKEN || !CHAT_ID) {
    console.log('[Telegram] Notificaciones desactivadas o mal configuradas');
    return false;
  }

  const text = encodeURIComponent(message);
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${text}&parse_mode=HTML&disable_web_page_preview=true`;

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) {
            console.log('[Telegram] Notificacion enviada');
            resolve(true);
          } else {
            console.error('[Telegram] Error:', parsed.description);
            resolve(false);
          }
        } catch (e) {
          console.error('[Telegram] Error parseando respuesta:', e.message);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.error('[Telegram] Error de conexion:', err.message);
      resolve(false);
    });
  });
};
