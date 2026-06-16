const { Member, NotificationTemplate, Subscription } = require('../models');
const OTPService = require('../services/OTPService');
const WhatsAppService = require('../services/WhatsAppService');

async function sendSubscriptionConfirmation(member) {
  const template = await NotificationTemplate.findOne({
    where: { type: 'subscription_confirmation', is_active: true },
    order: [['updated_at', 'DESC']]
  });

  if (!template) return;

  await WhatsAppService.sendMessage({
    mobile: member.mobile,
    message: WhatsAppService.renderMessage(template.message, member),
    memberId: member.id,
    templateId: template.id
  });
}

exports.mobile = (req, res) => {
  res.render('subscription/mobile', { title: 'Subscribe' });
};

exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;
  await OTPService.sendOtp(mobile);
  req.session.subscriptionMobile = mobile;
  req.session.success = 'OTP sent on WhatsApp.';
  res.redirect('/subscribe/otp');
};

exports.otp = (req, res) => {
  if (!req.session.subscriptionMobile) return res.redirect('/subscribe');
  res.render('subscription/otp', { title: 'Verify OTP', mobile: req.session.subscriptionMobile });
};

exports.verifyOtp = async (req, res) => {
  const mobile = req.session.subscriptionMobile;
  const verified = await OTPService.verifyOtp(mobile, req.body.otp);
  if (!verified) {
    req.session.error = 'Invalid or expired OTP.';
    return res.redirect('/subscribe/otp');
  }
  req.session.subscriptionVerified = true;
  res.redirect('/subscribe/preferences');
};

exports.preferences = async (req, res) => {
  if (!req.session.subscriptionVerified) return res.redirect('/subscribe');
  const member = await Member.findOne({ where: { mobile: req.session.subscriptionMobile } });
  res.render('subscription/preferences', { title: 'Preferences', member });
};

exports.savePreferences = async (req, res) => {
  if (!req.session.subscriptionVerified) return res.redirect('/subscribe');
  const mobile = req.session.subscriptionMobile;
  let member = await Member.findOne({ where: { mobile } });
  const submittedName = req.body.name && req.body.name.trim() ? req.body.name.trim() : null;
  const name = submittedName || (member && member.name) || `Subscriber ${mobile}`;
  const donationAmount = req.body.donation_amount || null;
  const donationFrequency = req.body.donation_frequency || 'monthly';
  const nextReminderDate = req.body.next_reminder_date || null;

  if (!member) {
    member = await Member.create({
      name,
      mobile,
      donation_amount: donationAmount,
      donation_frequency: donationFrequency,
      next_reminder_date: nextReminderDate,
      member_type: 'subscribed',
      is_active: true,
      whatsapp_subscribed: true,
      reminder_days_before: 3
    });
  } else {
    await member.update({
      name,
      donation_amount: donationAmount,
      donation_frequency: donationFrequency,
      next_reminder_date: nextReminderDate,
      whatsapp_subscribed: true,
      is_active: true
    });
  }

  await Subscription.upsert({
    member_id: member.id,
    mobile,
    name,
    reminder_enabled: Boolean(req.body.reminder_enabled),
    festival_enabled: Boolean(req.body.festival_enabled),
    general_enabled: Boolean(req.body.general_enabled),
    is_verified: true
  });

  await sendSubscriptionConfirmation(member);

  req.session.subscriptionMobile = null;
  req.session.subscriptionVerified = null;
  res.render('subscription/success', { title: 'Subscribed' });
};
