import React from 'react';
import {
  HStack,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const ChatHeader = ({
  selectedModel,
  setSelectedModel,
  models,
  loadingModels,
}) => {
  return (
    <HStack justifyContent="space-between" mb={4}>
      <Text fontSize="xl" fontFamily={'monospace'}>
        Chatting with:  {selectedModel}
      </Text>
      {loadingModels ? (
        <Spinner size="sm" />
      ) : (
        <Menu>
          <MenuButton
            as={Button}
            bg="gray.700"
            fontFamily={'monospace'}
            rightIcon={<ChevronDownIcon />}
          >
            {selectedModel || 'Select Model'}
          </MenuButton>
          <MenuList bg="gray.700" color="white">
            {models.map((model) => (
              <MenuItem
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                _hover={{ bg: 'gray.600' }}
                fontFamily={'monospace'}
              >
                {model.id}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      )}
    </HStack>
  );
};

export default ChatHeader;
