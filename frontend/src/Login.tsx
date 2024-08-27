import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link as ChakraLink, Container, Flex } from "@chakra-ui/react";
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
    <Flex 
      minHeight="100vh" 
      width="full" 
      align="center" 
      justifyContent="center" 
      layerStyle="starWarsBackground"
    >
      <Container maxW="lg" py={12} bg="rgba(0, 0, 0, 0.7)" borderRadius="md" boxShadow="xl">
        <VStack spacing={8} w="full">
          <Heading color="accent.yellow">Login to Star Wars Database</Heading>
          {error && <Text color="accent.red">{error}</Text>}
          <Box as="form" onSubmit={handleLogin} width="full">
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color="brand.300">Username</FormLabel>
                <Input 
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  bg="brand.700"
                  color="brand.100"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="brand.300">Password</FormLabel>
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  bg="brand.700"
                  color="brand.100"
                />
              </FormControl>
              <Button type="submit" colorScheme="yellow" width="full">Login</Button>
            </VStack>
          </Box>
          <Text color="brand.300">
            Don't have an account? <ChakraLink as={Link} to="/signup" color="accent.blue">Sign up</ChakraLink>
          </Text>
        </VStack>
      </Container>
    </Flex>
  );
};

export default Login;