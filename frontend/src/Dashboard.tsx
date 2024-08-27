import React, { useState, useEffect } from 'react';
import { Box, Heading, Select, Table, Thead, Tbody, Tr, Th, Td, VStack, Container, Text } from "@chakra-ui/react";
import axios from 'axios';

interface Starship {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Dashboard: React.FC = () => {
  const [starships, setStarships] = useState<Starship[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');

  useEffect(() => {
    fetchManufacturers();
    fetchStarships();
  }, []);

  useEffect(() => {
    fetchStarships();
  }, [selectedManufacturer]);

  const fetchManufacturers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/manufacturers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setManufacturers(response.data);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
    }
  };

  const fetchStarships = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = selectedManufacturer
        ? `${API_URL}/starships?manufacturer=${encodeURIComponent(selectedManufacturer)}`
        : `${API_URL}/starships`;
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStarships(response.data);
    } catch (error) {
      console.error('Error fetching starships:', error);
    }
  };

  return (
    <Container maxW="100%" p={0} bg="brand.800" minH="100vh">
      <VStack spacing={4} align="stretch" width="full" p={4}>
        <Heading textAlign="center" my={4} color="accent.yellow">Star Wars Starships</Heading>
        <Select 
          placeholder="Select manufacturer"
          value={selectedManufacturer} 
          onChange={(e) => setSelectedManufacturer(e.target.value)}
          mb={4}
          bg="brand.700"
          color="brand.100"
          borderColor="brand.600"
          _hover={{ borderColor: "accent.blue" }}
        >
          <option value="">All Manufacturers</option>
          {manufacturers.map((manufacturer) => (
            <option key={manufacturer} value={manufacturer}>
              {manufacturer}
            </option>
          ))}
        </Select>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th color="accent.blue">Name</Th>
                <Th color="accent.blue">Model</Th>
                <Th color="accent.blue">Manufacturer</Th>
                <Th color="accent.blue">Cost in Credits</Th>
              </Tr>
            </Thead>
            <Tbody>
              {starships.map((ship) => (
                <Tr key={ship.name}>
                  <Td color="brand.100">{ship.name}</Td>
                  <Td color="brand.100">{ship.model}</Td>
                  <Td color="brand.100">{ship.manufacturer}</Td>
                  <Td color="brand.100">{ship.cost_in_credits}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default Dashboard;