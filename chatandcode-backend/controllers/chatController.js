const db = require('../config/database');

// get chats controller
exports.getChats = (req, res) => {
  const userId = req.user.id;
  db.all(
    `SELECT id, title, created_at FROM chats WHERE user_id = ? ORDER BY created_at DESC`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      res.json({ chats: rows });
    }
  );
};


// create chats controller
exports.createChat = (req, res) => {
  const userId = req.user.id;
  const { title } = req.body;
  db.run(
    `INSERT INTO chats (user_id, title) VALUES (?, ?)`,
    [userId, title || 'New Chat'],
    function (err) {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      res.status(201).json({ chatId: this.lastID });
    }
  );
};

// get msgs controller
exports.getMessages = (req, res) => {
  const userId = req.user.id;
  const chatId = req.params.chatId;

  db.get(
    `SELECT * FROM chats WHERE id = ? AND user_id = ?`,
    [chatId, userId],
    (err, chat) => {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      if (!chat) return res.status(404).json({ error: 'Chat not found' });

      db.all(
        `SELECT id, role, content, image, created_at FROM messages WHERE chat_id = ? ORDER BY created_at ASC`,
        [chatId],
        (err, rows) => {
          if (err)
            return res.status(500).json({ error: 'Internal server error' });
          res.json({ messages: rows });
        }
      );
    }
  );
};

// save msgs controller
exports.saveMessage = (req, res) => {
  const userId = req.user.id;
  const chatId = req.params.chatId;
  const { role, content, image } = req.body; 

  db.get(
    `SELECT * FROM chats WHERE id = ? AND user_id = ?`,
    [chatId, userId],
    (err, chat) => {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      if (!chat) return res.status(404).json({ error: 'Chat not found' });

      db.run(
        `INSERT INTO messages (chat_id, role, content, image) VALUES (?, ?, ?, ?)`,
        [chatId, role, content, image || null],
        function (err) {
          if (err)
            return res.status(500).json({ error: 'Internal server error' });
          res.status(201).json({ messageId: this.lastID });
        }
      );
    }
  );
};

// delete msgs controller
exports.deleteChat = (req, res) => {
  const userId = req.user.id;
  const chatId = req.params.chatId;

  db.get(
    `SELECT * FROM chats WHERE id = ? AND user_id = ?`,
    [chatId, userId],
    (err, chat) => {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      if (!chat) return res.status(404).json({ error: 'Chat not found' });

      db.run(`DELETE FROM messages WHERE chat_id = ?`, [chatId], function (err) {
        if (err) return res.status(500).json({ error: 'Internal server error' });

        db.run(`DELETE FROM chats WHERE id = ?`, [chatId], function (err) {
          if (err) return res.status(500).json({ error: 'Internal server error' });
          res.status(200).json({ message: 'Chat deleted successfully' });
        });
      });
    }
  );
};

// update chat title controller
exports.updateChatTitle = (req, res) => {
  const userId = req.user.id;
  const chatId = req.params.chatId;
  const { title } = req.body;

  db.get(
    `SELECT * FROM chats WHERE id = ? AND user_id = ?`,
    [chatId, userId],
    (err, chat) => {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      if (!chat) return res.status(404).json({ error: 'Chat not found' });

      db.run(`UPDATE chats SET title = ? WHERE id = ?`, [title, chatId], function (err) {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        res.status(200).json({ message: 'Chat title updated successfully' });
      });
    }
  );
};
