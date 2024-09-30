
//rls from env
const API_URL = process.env.REACT_APP_API_URL;
const LM_STUDIO_URL = process.env.REACT_APP_LM_STUDIO_URL;



const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const fetchModels = async () => {
  const response = await fetch(`${LM_STUDIO_URL}/v1/models`);
  if (!response.ok) {
    throw new Error('Failed to fetch models');
  }
  const data = await response.json();
  return data.data;
};

export const fetchChats = async () => {
  const response = await fetch(`${API_URL}/chats`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch chats');
  }
  const data = await response.json();
  return data.chats;
};

export const fetchMessagesForChat = async (chatId) => {
  const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  const data = await response.json();
  return data.messages;
};

export const createNewChat = async () => {
  const response = await fetch(`${API_URL}/chats`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title: 'New Chat' }),
  });
  if (!response.ok) {
    throw new Error('Failed to create new chat');
  }
  const data = await response.json();
  return data.chatId;
};

export const deleteChat = async (chatId) => {
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error('Failed to delete chat');
  }
};

export const updateChatTitle = async (chatId, title) => {
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });
  if (!response.ok) {
    throw new Error('Failed to update chat title');
  }
};

export const saveUserMessage = async (chatId, message) => {
  const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(message),
  });
  if (!response.ok) {
    throw new Error('Failed to save user message');
  }
};

export const saveBotMessage = async (chatId, message) => {
  const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(message),
  });
  if (!response.ok) {
    throw new Error('Failed to save bot message');
  }
};

export const sendMessageToLMStudio = async (payload) => {
  // Adjust messages to match API requirements for images
  const adjustedMessages = payload.messages.map((message) => {
    if (message.image) {
      // Structure the message content as an array of content objects
      return {
        role: message.role,
        content: [
          {
            type: 'text',
            text: message.content || '',
          },
          {
            type: 'image_url',
            image_url: { url: message.image }, 
          },
        ],
      };
    } else {
      return {
        role: message.role,
        content: message.content,
      };
    }
  });

  const adjustedPayload = {
    ...payload,
    messages: adjustedMessages,
  };

  const response = await fetch(`${LM_STUDIO_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(adjustedPayload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response;
};
