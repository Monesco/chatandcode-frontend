import React, { useState, useEffect } from 'react';
import { Flex, Divider, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import Message from './Message';
import ChatInput from './ChatInput';
import {
  fetchModels,
  fetchChats,
  fetchMessagesForChat,
  createNewChat,
  deleteChat,
  updateChatTitle,
  saveUserMessage,
  saveBotMessage,
  sendMessageToLMStudio,
} from '../api';
import { estimateTokens } from '../utils';
import {jwtDecode} from 'jwt-decode';

function Chat() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageData, setImageData] = useState(null);
  const navigate = useNavigate();
  const [loadingModels, setLoadingModels] = useState(true);

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);

  // Get username
  const token = localStorage.getItem('token');
  const [username, setUsername] = useState('');

  const MAX_CONTEXT_TOKENS = 4096;
  const MAX_TOTAL_TOKENS = 32768;

  useEffect(() => {
    if (!token) navigate('/login');
    else {
      try {
        const decodedToken = jwtDecode(token);
        setUsername(decodedToken.username);
      } catch (e) {
        console.error('Invalid token');
        navigate('/login');
      }
    }

    const initialize = async () => {
      try {
        // Get available models
        const modelsData = await fetchModels();
        setModels(modelsData);
        setSelectedModel(modelsData[0]?.id || '');
        setLoadingModels(false);

        // Get user's chats
        const chatsData = await fetchChats();
        setChats(chatsData);
        setLoadingChats(false);
        if (chatsData.length > 0) {
          // Load the first chat by default
          selectChat(chatsData[0].id);
        }
      } catch (err) {
        console.error(err);
        setLoadingModels(false);
        setLoadingChats(false);
      }
    };

    initialize();
  }, [navigate, token]);

  const selectChat = async (chatId) => {
    setCurrentChatId(chatId);
    try {
      const messagesData = await fetchMessagesForChat(chatId);
      setMessages(messagesData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleNewChat = async () => {
    try {
      const newChatId = await createNewChat();
      setChats((prev) => [{ id: newChatId, title: 'New Chat' }, ...prev]);
      setCurrentChatId(newChatId);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      if (chatId === currentChatId) {
        // If current chat is deleted, clear messages
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageUpload = (file) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageData(reader.result);
    };
  };

  const removeImage = () => {
    setImageFile(null);
    setImageData(null);
  };

  const handleSend = async () => {
    if (!input.trim() && !imageData) return;

    const userMessage = {
      role: 'user',
      content: input,
      image: imageData,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Reset input and image
    setInput('');
    setImageFile(null);
    setImageData(null);

    try {
      // Save user message to database
      await saveUserMessage(currentChatId, userMessage);

      // Update chat title if it's the first message
      if (messages.length === 0) {
        const title = input || 'Image Message';
        await updateChatTitle(currentChatId, title);
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === currentChatId ? { ...chat, title } : chat
          )
        );
      }

      await sendMessageToModel(updatedMessages);
    } catch (error) {
      console.error(error);
    }
  };

  const sendMessageToModel = async (updatedMessages) => {
    try {
      // Estimate tokens and prepare messages to send
      let tokensCount = 0;
      let messagesToSend = [];
      const reverseMessages = [...updatedMessages].reverse();
  
      for (const message of reverseMessages) {
        // Create a copy of the message without the image data
        const messageForTokenEstimation = { ...message };
        delete messageForTokenEstimation.image;
  
        const messageTokens = estimateTokens(JSON.stringify(messageForTokenEstimation));
        if (tokensCount + messageTokens > MAX_CONTEXT_TOKENS) {
          break;
        }
        tokensCount += messageTokens;
        messagesToSend.unshift(message);
      }
  
      if (messagesToSend.length === 0) {
        console.error('No messages to send after token estimation.');
        return;
      }
  
      // Payload for the model
      const payload = {
        model: selectedModel,
        messages: messagesToSend,
        temperature: 0.7,
        max_tokens: Math.min(MAX_TOTAL_TOKENS - tokensCount, 4096),
        stream: true,
      };
  
      const response = await sendMessageToLMStudio(payload);

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;
      let botMessage = { role: 'assistant', content: '' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        const lines = chunkValue
          .split('\n')
          .filter((line) => line.trim() !== '');

        for (const line of lines) {
          const message = line.replace(/^data: /, '');
          if (message === '[DONE]') {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(message);
            const delta = parsed.choices[0].delta;
            if (delta.content) {
              botMessage.content += delta.content;
              // Update messages state
              setMessages((prevMessages) => {
                const updated = [...prevMessages];
                updated[updated.length - 1] = { ...botMessage };
                return updated;
              });
            } else if (delta.image) {
              botMessage.image = delta.image;
              // Update messages state
              setMessages((prevMessages) => {
                const updated = [...prevMessages];
                updated[updated.length - 1] = { ...botMessage };
                return updated;
              });
            }
          } catch (e) {
            console.error('Error parsing message:', message, e);
          }
        }
      }

      // Save bot message to database
      await saveBotMessage(currentChatId, botMessage);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex height="100vh" bg="gray.900" color="white" overflow={'hidden'}>
      <Sidebar
        username={username}
        chats={chats}
        currentChatId={currentChatId}
        selectChat={selectChat}
        handleNewChat={handleNewChat}
        handleDeleteChat={handleDeleteChat}
        loadingChats={loadingChats}
      />
      <Flex direction="column" width="100%" p={4}>
        <ChatHeader
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          models={models}
          loadingModels={loadingModels}
        />
        <Divider />
        <VStack
          flex="1"
          overflowY="auto"
          spacing={3}
          mt={4}
          width="100%"
          px={4}
        >
          {messages.map((msg, index) => (
            <Message key={index} msg={msg} username={username} />
          ))}
        </VStack>
        <ChatInput
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          handleImageUpload={handleImageUpload}
          removeImage={removeImage}
          isDisabled={!currentChatId}
          imageFile={imageFile}
        />
      </Flex>
    </Flex>
  );
}

export default Chat;
