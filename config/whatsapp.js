require('dotenv').config();

module.exports = {
  enabled: String(process.env.WHATSAPP_ENABLED || 'false') === 'true',
  apiUrl: process.env.WHATSAPP_API_URL,
  token: process.env.WHATSAPP_TOKEN,
  fromNumber: process.env.WHATSAPP_FROM_NUMBER
};
