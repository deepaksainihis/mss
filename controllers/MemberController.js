const { Member } = require('../models');

function memberPayload(body, memberType = 'manual') {
  return {
    ...body,
    member_type: body.member_type || memberType,
    reminder_days_before: Math.max(0, Number(body.reminder_days_before || 3)),
    next_reminder_date: body.next_reminder_date || null,
    is_active: Boolean(body.is_active),
    whatsapp_subscribed: Boolean(body.whatsapp_subscribed)
  };
}

exports.index = async (req, res) => {
  const members = await Member.findAll({ order: [['created_at', 'DESC']] });
  res.render('members/index', { title: 'Members', members });
};

exports.create = (req, res) => {
  res.render('members/create', { title: 'Add Member', member: {} });
};

exports.store = async (req, res) => {
  await Member.create(memberPayload(req.body, 'manual'));
  req.session.success = 'Member added successfully.';
  res.redirect('/members');
};

exports.show = async (req, res) => {
  const member = await Member.findByPk(req.params.id);
  if (!member) return res.redirect('/members');
  res.render('members/show', { title: member.name, member });
};

exports.edit = async (req, res) => {
  const member = await Member.findByPk(req.params.id);
  if (!member) return res.redirect('/members');
  res.render('members/edit', { title: 'Edit Member', member });
};

exports.update = async (req, res) => {
  const member = await Member.findByPk(req.params.id);
  if (!member) return res.redirect('/members');
  await member.update(memberPayload(req.body, member.member_type));
  req.session.success = 'Member updated successfully.';
  res.redirect('/members');
};

exports.destroy = async (req, res) => {
  const member = await Member.findByPk(req.params.id);
  if (member) await member.destroy();
  req.session.success = 'Member deleted successfully.';
  res.redirect('/members');
};
