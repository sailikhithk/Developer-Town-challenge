import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  FormControl, 
  FormLabel, 
  Input, 
  VStack, 
  Heading, 
  Text, 
  Link as ChakraLink, 
  Container, 
  Flex, 
  useToast
} from "@chakra-ui/react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const toast = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username and password are required');
      return;
    }

    try {
      await axios.post(`${API_URL}/signup`, { username, password });
      toast({
        title: "Account created.",
        description: "Welcome to the Star Wars Database!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'Signup failed. Please try again.');
      } else {
        setError('Signup failed. Please try again.');
      }
      console.error('Signup failed:', error);
    }
  };

  return (
    <Flex minHeight="100vh" width="full" align="center" justifyContent="center" bg="brand.800">
      <Container maxW="lg" py={12}>
        <VStack spacing={8} w="full">
          <Heading color="accent.yellow">Join the Star Wars Database</Heading>
          {error && <Text color="accent.red">{error}</Text>}
          <Box as="form" onSubmit={handleSignup} width="full">
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
              <Button type="submit" colorScheme="yellow" width="full">Sign Up</Button>
            </VStack>
          </Box>
          <Text color="brand.300">
            Already have an account? <ChakraLink as={Link} to="/login" color="accent.blue">Login</ChakraLink>
          </Text>
        </VStack>
      </Container>
    </Flex>
  );
};

export default Signup;