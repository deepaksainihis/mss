const express = require('express');
const auth = require('../middleware/auth');
const NotificationController = require('../controllers/NotificationController');

const router = express.Router();

router.get('/notifications/templates', auth, NotificationController.templates);
router.post('/notifications/templates', auth, NotificationController.storeTemplate);
router.get('/notifications/templates/:id/edit', auth, NotificationController.editTemplate);
router.post('/notifications/templates/:id', auth, NotificationController.updateTemplate);
router.post('/notifications/templates/:id/default-cron', auth, NotificationController.setCronDefault);
router.post('/notifications/templates/:id/delete', auth, NotificationController.deleteTemplate);
router.get('/notifications/bulk-send', auth, NotificationController.bulkSendForm);
router.post('/notifications/bulk-send', auth, NotificationController.bulkSend);
router.get('/notifications/logs', auth, NotificationController.logs);

module.exports = router;
