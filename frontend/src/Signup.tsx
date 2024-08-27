import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, Text, Link as ChakraLink, Container, Flex } from "@chakra-ui/react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/signup`, { username, password });
      navigate('/login');
    } catch (error) {
      setError('Signup failed. Please try again.');
      console.error('Signup failed:', error);
    }
  };

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center">
      <Container maxW="lg" py={12}>
        <VStack spacing={8} w="full">
          <Heading>Sign Up</Heading>
          {error && <Text color="red.500">{error}</Text>}
          <Box as="form" onSubmit={handleSignup} width="full">
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
              <Button type="submit" colorScheme="blue" width="full">Sign Up</Button>
            </VStack>
          </Box>
          <Text>
            Already have an account? <ChakraLink as={Link} to="/login" color="blue.500">Login</ChakraLink>
          </Text>
        </VStack>
      </Container>
    </Flex>
  );
};

export default Signup;