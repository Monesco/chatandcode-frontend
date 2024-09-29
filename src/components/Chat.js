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
import { jwtDecode } from 'jwt-decode';

function Chat() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const [loadingModels, setLoadingModels] = useState(true);

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [loadingChats, setLoadingChats] = useState(true);

  // Get username from token
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
        // Fetch models
        const modelsData = await fetchModels();
        setModels(modelsData);
        setSelectedModel(modelsData[0]?.id || '');
        setLoadingModels(false);

        // Fetch user's chats
        const chatsData = await fetchChats();
        setChats(chatsData);
        setLoadingChats(false);
        if (chatsData.length > 0) {
          // Load the latest chat by default
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
        // If the deleted chat was the current chat, clear messages
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');

    try {
      // Save user's message to backend
      await saveUserMessage(currentChatId, userMessage);

      // Update chat title if it's the first user message
      if (messages.length === 0) {
        await updateChatTitle(currentChatId, userMessage.content);
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === currentChatId
              ? { ...chat, title: userMessage.content }
              : chat
          )
        );
      }

      // Estimate tokens and trim conversation
      let tokensCount = 0;
      let messagesToSend = [];
      const reverseMessages = [...updatedMessages].reverse();

      for (const message of reverseMessages) {
        const messageTokens = estimateTokens(JSON.stringify(message));
        if (tokensCount + messageTokens > MAX_CONTEXT_TOKENS) {
          break;
        }
        tokensCount += messageTokens;
        messagesToSend.unshift(message);
      }

      // Prepare API payload
      const payload = {
        model: selectedModel,
        messages: messagesToSend,
        temperature: 0.7,
        max_tokens: Math.min(MAX_TOTAL_TOKENS - tokensCount, 4096),
        stream: true, // Enable streaming
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
            const content = parsed.choices[0].delta.content;
            if (content) {
              botMessage.content += content;
              // Update the messages state
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

      // Save bot's message to backend
      await saveBotMessage(currentChatId, botMessage);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex height="100vh"bg="gray.900" color="white">
      <Sidebar
        username={username}
        chats={chats}
        currentChatId={currentChatId}
        selectChat={selectChat}
        handleNewChat={handleNewChat}
        handleDeleteChat={handleDeleteChat}
        loadingChats={loadingChats}
      />
      <Flex direction="column" width="80%" p={4}>
        <ChatHeader
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          models={models}
          loadingModels={loadingModels}
        />
        <Divider />
        <VStack
          flex="auto"
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
          isDisabled={!currentChatId}
        />
      </Flex>
    </Flex>
  );
}

export default Chat;
