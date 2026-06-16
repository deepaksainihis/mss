const { Member, NotificationTemplate, NotificationLog } = require('../models');
const WhatsAppService = require('../services/WhatsAppService');

function templatePayload(body) {
  const isReminder = body.type === 'reminder';
  return {
    name: body.name,
    type: body.type,
    message: body.message,
    is_active: Boolean(body.is_active),
    is_default_cron: isReminder && Boolean(body.is_default_cron)
  };
}

async function clearCronDefaultIfNeeded(payload) {
  if (payload.is_default_cron) {
    await NotificationTemplate.update({ is_default_cron: false }, { where: { type: 'reminder' } });
  }
}

exports.templates = async (req, res) => {
  const templates = await NotificationTemplate.findAll({ order: [['created_at', 'DESC']] });
  res.render('notifications/templates', { title: 'Notification Templates', templates });
};

exports.storeTemplate = async (req, res) => {
  const payload = templatePayload(req.body);

  await clearCronDefaultIfNeeded(payload);
  await NotificationTemplate.create(payload);
  req.session.success = 'Template saved successfully.';
  res.redirect('/notifications/templates');
};

exports.editTemplate = async (req, res) => {
  const template = await NotificationTemplate.findByPk(req.params.id);

  if (!template) {
    req.session.error = 'Template not found.';
    return res.redirect('/notifications/templates');
  }

  res.render('notifications/edit-template', { title: 'Edit Template', template });
};

exports.updateTemplate = async (req, res) => {
  const template = await NotificationTemplate.findByPk(req.params.id);

  if (!template) {
    req.session.error = 'Template not found.';
    return res.redirect('/notifications/templates');
  }

  const payload = templatePayload(req.body);
  await clearCronDefaultIfNeeded(payload);
  await template.update(payload);

  req.session.success = 'Template updated successfully.';
  res.redirect('/notifications/templates');
};

exports.setCronDefault = async (req, res) => {
  const template = await NotificationTemplate.findByPk(req.params.id);

  if (!template || template.type !== 'reminder') {
    req.session.error = 'Only reminder templates can be used as the cron default.';
    return res.redirect('/notifications/templates');
  }

  await NotificationTemplate.update({ is_default_cron: false }, { where: { type: 'reminder' } });
  await template.update({ is_default_cron: true, is_active: true });

  req.session.success = 'Default cron reminder template updated.';
  res.redirect('/notifications/templates');
};

exports.deleteTemplate = async (req, res) => {
  await NotificationTemplate.destroy({ where: { id: req.params.id } });
  req.session.success = 'Template deleted.';
  res.redirect('/notifications/templates');
};

exports.bulkSendForm = async (req, res) => {
  const templates = await NotificationTemplate.findAll({ where: { is_active: true } });
  res.render('notifications/bulk-send', { title: 'Bulk Send', templates });
};

exports.bulkSend = async (req, res) => {
  const template = await NotificationTemplate.findByPk(req.body.template_id);
  if (!template) {
    req.session.error = 'Please select a valid template.';
    return res.redirect('/notifications/bulk-send');
  }

  const members = await Member.findAll({ where: { is_active: true, whatsapp_subscribed: true } });
  for (const member of members) {
    const message = WhatsAppService.renderMessage(template.message, member);
    await WhatsAppService.sendMessage({
      mobile: member.mobile,
      message,
      memberId: member.id,
      templateId: template.id
    });
  }

  req.session.success = `Bulk notification queued for ${members.length} members.`;
  res.redirect('/notifications/logs');
};

exports.logs = async (req, res) => {
  const logs = await NotificationLog.findAll({
    include: [Member, NotificationTemplate],
    order: [['created_at', 'DESC']],
    limit: 100
  });
  res.render('notifications/logs', { title: 'Notification Logs', logs });
};
