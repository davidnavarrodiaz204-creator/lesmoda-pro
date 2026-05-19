const https = require('https');

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const ENABLED = process.env.TELEGRAM_NOTIFICATIONS_ENABLED === 'true';

console.log('[telegram] TELEGRAM_NOTIFICATIONS_ENABLED:', process.env.TELEGRAM_NOTIFICATIONS_ENABLED);
console.log('[telegram] ENABLED:', ENABLED);
console.log('[telegram] CHAT_ID exists:', !!CHAT_ID);
console.log('[telegram] TOKEN exists:', !!TOKEN);

if (!ENABLED) {
  console.log('[telegram] notifications disabled');
}
if (!TOKEN) {
  console.log('[telegram] missing token');
}
if (!CHAT_ID) {
  console.log('[telegram] missing chat id');
}

exports.sendNotification = async (message) => {
  if (!ENABLED) {
    console.log('[telegram] notifications disabled — skipping');
    return false;
  }
  if (!TOKEN || !CHAT_ID) {
    console.log('[telegram] missing token or chat id — skipping');
    return false;
  }

  const text = encodeURIComponent(message);
  const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${text}&parse_mode=HTML&disable_web_page_preview=true`;

  console.log('[telegram] sending order notification');

  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) {
            console.log('[telegram] notification sent');
            resolve(true);
          } else {
            console.error('[telegram] error:', parsed.description);
            resolve(false);
          }
        } catch (e) {
          console.error('[telegram] error parsing response:', e.message);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.error('[telegram] connection error:', err.message);
      resolve(false);
    });
  });
};
