const express = require('express');
const SubscriptionController = require('../controllers/SubscriptionController');

const router = express.Router();

router.get('/subscribe', SubscriptionController.mobile);
router.post('/subscribe/send-otp', SubscriptionController.sendOtp);
router.get('/subscribe/otp', SubscriptionController.otp);
router.post('/subscribe/verify-otp', SubscriptionController.verifyOtp);
router.get('/subscribe/preferences', SubscriptionController.preferences);
router.post('/subscribe/preferences', SubscriptionController.savePreferences);

module.exports = router;
