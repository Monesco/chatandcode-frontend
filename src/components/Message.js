// Message.js
import React from 'react';
import { HStack, Avatar, Box } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css'; // Use a dark theme

const Message = ({ msg, username }) => {
  const isUser = msg.role === 'user';

  return (
    <HStack
      width="100%"
      minWidth={"400px"}
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      alignItems="flex-start"
      spacing={2}
      paddingY={1}
    >
      {!isUser && <Avatar size="sm" name="C&C" mt={1} />}
      <Box
        bg={isUser ? 'blue.400' : 'gray.700'}
        color="white"
        p={4}
        borderRadius="lg"
        maxWidth="92%"
        wordBreak="break-word"
        overflowWrap="anywhere"
        overflow="hidden"
        sx={{
          'pre': {
            bg: 'gray.800',
            borderRadius: 'md',
            p: 5,
            ml: "5px",
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            overflowX: 'auto',
          },
          'code': {
            fontFamily: 'monospace',
            color: 'cyan.400',
          },
          'table': {
            width: '100%',
            display: 'block',
            overflowX: 'auto',
          },
          'td, th': {
            border: '1px solid',
            borderColor: 'gray.600',
            padding: '0.5rem',
          },
          'th': {
            bg: 'gray.600',
          },
        }}
        ml={isUser ? 0 : 1}
        mr={isUser ? 1 : 0}
      >
        <ReactMarkdown
          children={msg.content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        />
      </Box>
      {isUser && <Avatar size="sm" name={username} mt={1} />}
    </HStack>
  );
};

export default Message;
