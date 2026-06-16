const axios = require('axios');
const whatsappConfig = require('../config/whatsapp');
const { NotificationLog } = require('../models');

function renderMessage(template, member = {}) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const value = member[key] ?? member[`dataValues`]?.[key];
    return value === undefined || value === null ? '' : String(value);
  });
}

async function sendMessage({ mobile, message, memberId = null, templateId = null }) {
  const log = await NotificationLog.create({
    member_id: memberId,
    template_id: templateId,
    mobile,
    message,
    status: 'queued'
  });

  try {
    if (!whatsappConfig.enabled) {
      await log.update({
        status: 'sent',
        response: 'WhatsApp disabled; simulated send in local mode.',
        sent_at: new Date()
      });
      return log;
    }

    const response = await axios.post(
      whatsappConfig.apiUrl,
      {
        messaging_product: 'whatsapp',
        to: mobile,
        type: 'text',
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${whatsappConfig.token}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    await log.update({
      status: 'sent',
      response: JSON.stringify(response.data),
      sent_at: new Date()
    });
    return log;
  } catch (error) {
    await log.update({
      status: 'failed',
      response: error.response ? JSON.stringify(error.response.data) : error.message,
      sent_at: new Date()
    });
    return log;
  }
}

module.exports = {
  renderMessage,
  sendMessage
};
