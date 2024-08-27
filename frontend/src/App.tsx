import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider, Box } from "@chakra-ui/react";
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import starWarsTheme from './theme';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={starWarsTheme}>
      <Box width="100vw" height="100vh" overflowX="hidden">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </Box>
    </ChakraProvider>
  );
};

export default App;