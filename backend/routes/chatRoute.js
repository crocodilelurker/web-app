const express = require ('express')
const messageController = require('../controllers/messageController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');
const { multerMiddleware } = require('../config/cloudinaryConfig.js');
const router =  express.Router();


router.post('/send-message',authMiddleware,messageController.sendMessage)
router.get('/conversations',authMiddleware,messageController.getConversation)
router.get('/conversations/:conversationId/messages',authMiddleware,messageController.getMessages)


router.put('/messages/read',authMiddleware,messageController.markAsRead)
router.delete('/messages/:messageId',authMiddleware,messageController.deleteMessage)

module.exports = router