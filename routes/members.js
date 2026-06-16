const express = require('express');
const auth = require('../middleware/auth');
const MemberController = require('../controllers/MemberController');

const router = express.Router();

router.get('/members', auth, MemberController.index);
router.get('/members/create', auth, MemberController.create);
router.post('/members', auth, MemberController.store);
router.get('/members/:id', auth, MemberController.show);
router.get('/members/:id/edit', auth, MemberController.edit);
router.post('/members/:id', auth, MemberController.update);
router.post('/members/:id/delete', auth, MemberController.destroy);

module.exports = router;
