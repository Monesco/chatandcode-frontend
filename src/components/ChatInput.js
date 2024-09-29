import React from 'react';
import { HStack, Input, Button } from '@chakra-ui/react';

const ChatInput = ({ input, setInput, handleSend, isDisabled }) => {
  return (
    <HStack mt={4}>
      <Input
        placeholder="Type your message..."
        bg="gray.700"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        isDisabled={isDisabled}
        fontFamily={"monospace"}
      />
      <Button onClick={handleSend} colorScheme="green" isDisabled={isDisabled} fontFamily={"monospace"} backgroundColor={"green.400"}>
        Send
      </Button>
    </HStack>
  );
};

export default ChatInput;
