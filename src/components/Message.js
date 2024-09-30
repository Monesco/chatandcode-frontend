// Message.js
import React from 'react';
import { HStack, Avatar, Box, Image } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css';

const Message = ({ msg, username }) => {
  const isUser = msg.role === 'user';

  return (
    <HStack
      width="100%"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      alignItems="flex-start"
      spacing={2}
      paddingY={1}
    >
      {!isUser && (
        <Avatar size="sm" name="C&C" mt={1} backgroundColor={'gray.500'} />
      )}
      <Box
        bg={isUser ? 'cyan.900' : 'gray.700'}
        color="white"
        p={6}
        borderRadius="lg"
        maxWidth="92%"
        wordBreak="break-word"
        overflowWrap="anywhere"
        overflow="hidden"
        sx={{
          pre: {
            bg: 'gray.800',
            borderRadius: 'xl',
            p: 5,
            ml: '15px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowX: 'auto',
          },
          code: {
            fontFamily: 'monospace',
            color: 'cyan.400',
          },
          table: {
            width: '100%',
            display: 'block',
            overflowX: 'auto',
          },
          td: {
            border: '0.5px solid',
            borderColor: 'gray.600',
            padding: '0.5rem',
          },
          th: {
            border: '0.5px solid',
            borderColor: 'gray.600',
            padding: '0.5rem',
            bg: 'gray.600',
          },
        }}
        ml={isUser ? 0 : 1}
        mr={isUser ? 1 : 0}
      >
        {msg.image && (
          <Image src={msg.image} alt="Uploaded" maxWidth="90%" mb={2} />
        )}
        {msg.content && (
          <ReactMarkdown
            children={msg.content}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          />
        )}
      </Box>
      {isUser && (
        <Avatar
          size="sm"
          name={username}
          mt={1}
          backgroundColor={'cyan.600'}
        />
      )}
    </HStack>
  );
};

export default Message;
