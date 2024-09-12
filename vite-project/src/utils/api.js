import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const login = (email, password) => API.post('/auth/login', { email, password });
export const signup = (userData) => axios.post('http://localhost:5000/api/auth/register', userData);
export const fetchLogs = (token) =>
  API.get('/logs', { headers: { Authorization: `Bearer ${token}` } });
export const addLog = (logData, token) =>
  API.post('/logs', logData, { headers: { Authorization: `Bearer ${token}` } });
