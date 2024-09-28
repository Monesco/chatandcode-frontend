const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authenticateToken = require('../middleware/authenticateToken');

// Get all chats
router.get('/chats', authenticateToken, chatController.getChats);

// Create a new chat
router.post('/chats', authenticateToken, chatController.createChat);

// Get messages for a chat
router.get('/chats/:chatId/messages', authenticateToken, chatController.getMessages);

// Save a message to a chat
router.post('/chats/:chatId/messages', authenticateToken, chatController.saveMessage);

// Delete a chat
router.delete('/chats/:chatId', authenticateToken, chatController.deleteChat);

// Update chat title
router.put('/chats/:chatId', authenticateToken, chatController.updateChatTitle);

module.exports = router;
