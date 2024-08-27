import React, { useState, useEffect } from 'react';
import { Box, Heading, Select, Table, Thead, Tbody, Tr, Th, Td, VStack, Container, Text, Flex } from "@chakra-ui/react";
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
    <Flex 
      direction="column" 
      minHeight="100vh" 
      width="full" 
      layerStyle="dashboardBackground"
    >
      <Container maxW="container.xl" p={4}>
        <VStack spacing={8} align="stretch" width="full">
          <Heading textAlign="center" my={4} color="accent.yellow" fontSize="4xl">Star Wars Starships</Heading>
          <Select 
            placeholder="Select manufacturer"
            value={selectedManufacturer} 
            onChange={(e) => setSelectedManufacturer(e.target.value)}
            bg="rgba(0, 0, 0, 0.7)"
            color="accent.yellow"
            borderColor="accent.blue"
            _hover={{ borderColor: "accent.yellow" }}
            _focus={{ borderColor: "accent.yellow", boxShadow: "0 0 0 1px #ffe81f" }}
            sx={{
              "& option": {
                bg: "brand.800",
                color: "accent.yellow",
              },
              "& option:hover": {
                bg: "brand.700",
              },
            }}
          >
            <option value="">All Manufacturers</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </Select>
          <Box overflowX="auto" bg="rgba(0, 0, 0, 0.7)" borderRadius="md" boxShadow="xl">
            <Table variant="simple">
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
    </Flex>
  );
};

export default Dashboard;