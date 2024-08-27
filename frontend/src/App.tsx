import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Starship {
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const App: React.FC = () => {
  const [starships, setStarships] = useState<Starship[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (token) {
      fetchManufacturers();
      fetchStarships();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchStarships();
    }
  }, [selectedManufacturer]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      setToken(response.data.access_token);
      setError('');
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      console.error('Login failed:', error);
    }
  };

  const fetchManufacturers = async () => {
    try {
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

  if (!token) {
    return (
      <div>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={login}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>Star Wars Starships</h1>
      <select 
        value={selectedManufacturer} 
        onChange={(e) => setSelectedManufacturer(e.target.value)}
      >
        <option value="">All Manufacturers</option>
        {manufacturers.map((manufacturer) => (
          <option key={manufacturer} value={manufacturer}>
            {manufacturer}
          </option>
        ))}
      </select>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Model</th>
            <th>Manufacturer</th>
            <th>Cost in Credits</th>
          </tr>
        </thead>
        <tbody>
          {starships.map((ship) => (
            <tr key={ship.name}>
              <td>{ship.name}</td>
              <td>{ship.model}</td>
              <td>{ship.manufacturer}</td>
              <td>{ship.cost_in_credits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;