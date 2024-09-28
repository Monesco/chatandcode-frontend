import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Input,
  Button,
  Text,
  VStack,
  Image,
  ScaleFade,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa'; // Importing icons
import logo from '../images/logo.webp';

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      navigate('/chat');
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  return (
    <Box
      bg="gray.900"
      color="white"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {/* Login */}
      <ScaleFade initialScale={0.7} in={true}>
        <Box
          bg="gray.800"
          p={8}
          borderRadius="full"
          boxShadow="xl"
          width={["90%", "400px"]}
          maxW="400px"
          textAlign="center"
        >
          {/* Logo */}
          <Image
            src={logo}
            alt="Logo"
            boxSize="180px"
            mb={4}
            mx="auto"
            borderRadius="full"
          />

          <Text fontSize="2xl" fontWeight="bold" mb={6} fontFamily={"monospace"}>
            WELCOME BACK!
          </Text>

          <VStack spacing={4}>
            {/* Username Input with Icon */}
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaUser color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                bg="gray.700"
                border="none"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: "gray.600" }}
                _focus={{ bg: "gray.600" }}
                size="lg"
              />
            </InputGroup>

            {/* Password Input with Icon */}
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FaLock color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                bg="gray.700"
                border="none"
                _placeholder={{ color: 'gray.400' }}
                _hover={{ bg: "gray.600" }}
                _focus={{ bg: "gray.600" }}
                size="lg"
              />
            </InputGroup>

            <Button
              onClick={handleLogin}
              colorScheme="teal"
              width="50%"
              size="lg"
              _hover={{ transform: 'scale(1.05)' }}
              transition="0.2s ease-in-out"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              variant="link"
              colorScheme="green"
              size="md"
              _hover={{ textDecoration: 'underline' }}
            >
              Create an account
            </Button>
          </VStack>
        </Box>
      </ScaleFade>
    </Box>
  );
}

export default Login;
