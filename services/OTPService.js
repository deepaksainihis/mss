const bcrypt = require('bcrypt');
const { OtpVerification } = require('../models');
const WhatsAppService = require('./WhatsAppService');

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

async function sendOtp(mobile, purpose = 'subscription') {
  const otp = generateOtp();
  console.log(otp);
  const otpHash = await bcrypt.hash(otp, 10);
  const expiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES || 10);

  await OtpVerification.create({
    mobile,
    otp_hash: otpHash,
    purpose,
    expires_at: new Date(Date.now() + expiryMinutes * 60 * 1000)
  });

  await WhatsAppService.sendMessage({
    mobile,
    message: `Your Gaushala subscription OTP is ${otp}. It expires in ${expiryMinutes} minutes.`
  });

  return true;
}

async function verifyOtp(mobile, otp, purpose = 'subscription') {
  const record = await OtpVerification.findOne({
    where: {
      mobile,
      purpose,
      verified_at: null
    },
    order: [['created_at', 'DESC']]
  });

  if (!record || record.expires_at < new Date() || record.attempts >= 5) {
    return false;
  }

  await record.increment('attempts');
  const valid = await bcrypt.compare(otp, record.otp_hash);
  if (!valid) return false;

  await record.update({ verified_at: new Date() });
  return true;
}

module.exports = {
  sendOtp,
  verifyOtp
};
