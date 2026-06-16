const express = require('express');
const auth = require('../middleware/auth');
const DashboardController = require('../controllers/DashboardController');

const router = express.Router();

router.get('/dashboard', auth, DashboardController.index);

module.exports = router;
