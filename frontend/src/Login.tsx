import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      localStorage.setItem('token', response.data.access_token);
      navigate('/dashboard');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login failed:', error);
    }
  };

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <VStack spacing={4} align="flex-start">
        <Heading>Login</Heading>
        {error && <Text color="red.500">{error}</Text>}
        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">Login</Button>
          </VStack>
        </form>
        <Text>
          Don't have an account? <ChakraLink as={Link} to="/signup" color="blue.500">Sign up</ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login;