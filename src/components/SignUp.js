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
  Center,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa'; // Importing icons for the input fields
import logo from '../images/logo.webp';

const API_URL = process.env.REACT_APP_API_URL;

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axios.post(`${API_URL}/signup`, { username, password });
      alert('Account created successfully');
      navigate('/login');
    } catch (error) {
      alert('Username already exists');
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
      {/* SignUp */}
      <ScaleFade initialScale={0.9} in={true}>
        <Center>
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

            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              Create Account
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
                  size="md"
                  borderRadius="md"
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
                  size="md"
                  borderRadius="md"
                />
              </InputGroup>

              {/* Confirm Password Input with Icon */}
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <FaLock color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg="gray.700"
                  border="none"
                  _placeholder={{ color: 'gray.400' }}
                  _hover={{ bg: "gray.600" }}
                  _focus={{ bg: "gray.600" }}
                  size="md"
                  borderRadius="md"
                />
              </InputGroup>

              <Button
                onClick={handleSignUp}
                colorScheme="teal"
                width="50%"
                size="md"
                _hover={{ transform: 'scale(1.05)' }}
                transition="0.2s ease-in-out"
              >
                Sign Up
              </Button>
              <Button
                onClick={() => navigate('/login')}
                variant="link"
                colorScheme="green"
                size="md"
                _hover={{ textDecoration: 'underline' }}
              >
                Back to Login
              </Button>
            </VStack>
          </Box>
        </Center>
      </ScaleFade>
    </Box>
  );
}

export default SignUp;
