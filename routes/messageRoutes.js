const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isLoggedIn } = require('../middleware/auth');

router.get('/', isLoggedIn, messageController.getConversations);
router.get('/:userId', isLoggedIn, messageController.getMessages);

module.exports = router; 