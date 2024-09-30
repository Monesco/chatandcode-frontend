const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middleware/authenticateToken');

//get ALL chats
router.get('/chats', authenticateToken, chatController.getChats);

//new chat
router.post('/chats', authenticateToken, chatController.createChat);

//get messages for a chat   
router.get('/chats/:chatId/messages', authenticateToken, chatController.getMessages);

//save message to chat
router.post('/chats/:chatId/messages', authenticateToken, chatController.saveMessage);

//delete chat
router.delete('/chats/:chatId', authenticateToken, chatController.deleteChat);

//chat title on frontend
router.put('/chats/:chatId', authenticateToken, chatController.updateChatTitle);

module.exports = router;
