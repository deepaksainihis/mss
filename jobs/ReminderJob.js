const cron = require('node-cron');
const { Op } = require('sequelize');
const { Member, NotificationTemplate } = require('../models');
const WhatsAppService = require('../services/WhatsAppService');
const ReminderDateService = require('../services/ReminderDateService');

async function runReminderJob() {
  const today = new Date().toISOString().slice(0, 10);
  let template = await NotificationTemplate.findOne({
    where: { type: 'reminder', is_active: true, is_default_cron: true },
    order: [['updated_at', 'DESC']]
  });

  if (!template) {
    template = await NotificationTemplate.findOne({
      where: { type: 'reminder', is_active: true },
      order: [['created_at', 'DESC']]
    });
  }

  if (!template) return;

  const members = await Member.findAll({
    where: {
      is_active: true,
      whatsapp_subscribed: true,
      next_reminder_date: {
        [Op.ne]: null
      }
    }
  });

  for (const member of members) {
    if (!ReminderDateService.isNotificationDue(
      member.next_reminder_date,
      member.reminder_days_before,
      today
    )) {
      continue;
    }

    const message = WhatsAppService.renderMessage(template.message, member);
    await WhatsAppService.sendMessage({
      mobile: member.mobile,
      message,
      memberId: member.id,
      templateId: template.id
    });
    await member.update({
      next_reminder_date: ReminderDateService.nextAfterDate(
        member.next_reminder_date || today,
        member.donation_frequency,
        new Date()
      )
    });
  }
}

function scheduleReminderJob() {
  const expression = process.env.REMINDER_CRON || '0 9 * * *';
  cron.schedule(expression, runReminderJob, { timezone: 'Asia/Kolkata' });
}

module.exports = {
  runReminderJob,
  scheduleReminderJob
};
