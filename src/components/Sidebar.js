import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    VStack,
    HStack,
    Divider,
    Image,
    Text,
    IconButton,
    Spinner,
    useMediaQuery,
    Tooltip,
    Flex,
    Portal,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, ChatIcon } from '@chakra-ui/icons';
import { FiLogOut } from 'react-icons/fi';
import logo from '../images/logo.png';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({
    username,
    chats,
    currentChatId,
    selectChat,
    handleNewChat,
    handleDeleteChat,
    loadingChats,
}) => {
    //Use media query to detect small screen size
    const [isMinimized] = useMediaQuery('(max-width: 815px)');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    //State for context menu
    const [contextMenuChatId, setContextMenuChatId] = useState(null);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);

    //Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (isContextMenuOpen) {
                setIsContextMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isContextMenuOpen]);

    return (
        <Flex
            direction="column"
            justifyContent="space-between"
            height="100vh"
            width={isMinimized ? '80px' : '20%'}
            minWidth={isMinimized ? '80px' : '0%'}            
            mr={isMinimized ? '20px' : '0px'}
            bg="gray.800"
            p={4}
            overflowY="hidden"
            transition="width 0.3s ease-in-out"
        >
            {/*Top Section*/}
            <Box>
                {/* Logo */}
                <Image
                    src={logo}
                    alt="Logo"
                    boxSize={isMinimized ? '50px' : '100px'}
                    mb={4}
                    mx="auto"
                    borderRadius="full"
                    transition="box-size 0.3s ease-in-out"
                />

                <Divider mb={2} size={3} />

                {/*Username's Chats Title/Icon */}
                <Tooltip label={`${username}'s Chats`} placement="right" isDisabled={!isMinimized} fontFamily={'monospace'}>
                    <Text
                        fontSize="lg"
                        mb={2}
                        fontFamily={'monospace'}
                        ml="auto"
                        mr="auto"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        width={isMinimized ? 'auto' : '90%'}
                        textAlign="center"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                    >
                        {isMinimized ? <ChatIcon boxSize={6} /> : `${username}'s Chats`}
                    </Text>
                </Tooltip>

                <Divider mb={2} />

                {/*New Chat Button/Icon*/}
                <Flex justifyContent="center" alignItems="center" flexDirection="column">
                    <Tooltip label="New Chat" placement="right" >
                        <Button
                            size={'sm'}
                            variant="solid"
                            colorScheme="blue"
                            backgroundColor={"blue.300"}                            
                            borderRadius={'2xl'}
                            width={isMinimized ? 'auto' : '50%'}
                            onClick={handleNewChat}
                            leftIcon={isMinimized ? null : <AddIcon />}
                            iconSpacing={isMinimized ? '0' : '1'}
                            fontFamily={'monospace'}
                            overflow="hidden"                            
                            
                            p={isMinimized ? '0' : '4'}
                            
                            transition="width 0.3s ease-in-out"
                        >
                            {isMinimized ? <AddIcon /> : 'Chat'}
                        </Button>
                    </Tooltip>
                </Flex>
                
                <VStack align="center" spacing={2} >
                    <Divider mt={2} />

                    {/*Chats List*/}
                    {loadingChats ? (
                        <Spinner size="sm" />
                    ) : (
                        chats.map((chat) => (
                            <Box
                                key={chat.id}
                                width="100%"
                                onContextMenu={(e) => {
                                    if (isMinimized) {
                                        e.preventDefault();
                                        setContextMenuChatId(chat.id);
                                        setContextMenuPosition({ x: e.clientX, y: e.clientY });
                                        setIsContextMenuOpen(true);
                                    }
                                }}
                            >
                                {isMinimized ? (
                                    //Render as icon when minimized
                                    <Tooltip fontFamily={'monospace'} label={chat.title} placement="right">
                                        <IconButton
                                            icon={<ChatIcon />}
                                            size="md"
                                            variant={chat.id === currentChatId ? 'solid' : 'outline'}
                                            colorScheme="teal"
                                            onClick={() => selectChat(chat.id)}
                                            mb={2}
                                        />
                                    </Tooltip>
                                ) : (
                                    //Render full chat item when not minimized
                                    <HStack width="100%" justifyContent="space-between">
                                        <Button
                                            variant={chat.id === currentChatId ? 'solid' : 'outline'}
                                            colorScheme="teal"
                                            justifyContent="flex-start"
                                            width="100%"
                                            onClick={() => selectChat(chat.id)}
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                            whiteSpace="nowrap"
                                            fontFamily={'monospace'}
                                        >
                                            {chat.title}
                                        </Button>
                                        <Tooltip label="Delete Chat" placement="right">
                                            <IconButton
                                                icon={<CloseIcon />}
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                                onClick={() => handleDeleteChat(chat.id)}
                                            />
                                        </Tooltip>
                                    </HStack>
                                )}
                            </Box>
                        ))
                    )}
                </VStack>
                
            </Box>

            {/*Bottom Section*/}
            <Flex justifyContent="center" alignItems="center" flexDirection="column">
                <Divider mb={2} />
                <Tooltip label="Logout" placement="right" isDisabled={!isMinimized}>
                    <Button
                        size={'sm'}
                        variant="outline"
                        colorScheme="red"
                        justifyContent="center"
                        width={isMinimized ? 'auto' : '60%'}
                        onClick={handleLogout}
                        leftIcon={isMinimized ? null : <FiLogOut />}
                        iconSpacing={isMinimized ? '0' : '4'}
                        fontFamily={'monospace'}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                        p={isMinimized ? '0' : '2'}
                        alignSelf="center"
                        transition="width 0.3s ease-in-out"
                    >
                        {isMinimized ? <FiLogOut /> : 'Logout'}
                    </Button>
                </Tooltip>
            </Flex>

            {/*Context Menu*/}
            {isContextMenuOpen && (
                <Portal>
                    <Box
                        position="absolute"
                        left={`${contextMenuPosition.x}px`}
                        top={`${contextMenuPosition.y}px`}
                        bg="gray.700"
                        borderRadius="md"
                        boxShadow="md"
                        zIndex={1000}
                        minWidth="150px"
                    >
                        <VStack align="stretch" spacing={0}>
                            <Button
                                variant="ghost"
                                justifyContent="flex-start"                                
                                onClick={() => {
                                    handleDeleteChat(contextMenuChatId);
                                    setIsContextMenuOpen(false);
                                }}
                            >
                                Delete Chat
                            </Button>

                        </VStack>
                    </Box>
                </Portal>
            )}
        </Flex>
    );
};

export default Sidebar;
