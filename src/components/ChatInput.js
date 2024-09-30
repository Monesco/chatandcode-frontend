// ChatInput.js
import React, { useRef } from 'react';
import {
  HStack,
  Input,
  Button,
  IconButton,
  Text,
  Box,
} from '@chakra-ui/react';
import { AttachmentIcon, CloseIcon } from '@chakra-ui/icons';

const ChatInput = ({
  input,
  setInput,
  handleSend,
  isDisabled,
  handleImageUpload,
  imageFile,
  removeImage,
}) => {
  const fileInputRef = useRef();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <Box mt={4}>
      {imageFile && (
        <HStack mb={2}>
          <Text>{imageFile.name}</Text>
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            onClick={removeImage}
            aria-label="Remove image"
          />
        </HStack>
      )}
      <HStack>
        <IconButton
          icon={<AttachmentIcon />}
          onClick={handleUploadClick}
          isDisabled={isDisabled}
          aria-label="Upload image"
        />
        <Input
          placeholder="Type your message..."
          bg="gray.700"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          isDisabled={isDisabled}
          fontFamily={'monospace'}
        />
        <Button
          onClick={handleSend}
          colorScheme="green"
          isDisabled={isDisabled}
          fontFamily={'monospace'}
          backgroundColor={'green.400'}
        >
          Send
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </HStack>
    </Box>
  );
};

export default ChatInput;
