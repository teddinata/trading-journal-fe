// src/services/api.js
import axios from '../config/axios'

export const authAPI = {
  register: (userData) => axios.post('/api/v1/auth/register', userData),
  login: (credentials) => axios.post('/api/v1/auth/login', credentials),
  logout: () => axios.post('/api/v1/auth/logout'),
  getUser: () => axios.get('/api/v1/auth/me')
}

export const tradeAPI = {
  getStats: () => axios.get('/trades/stats'),
  getRecentTrades: () => axios.get('/trades/recent'),
  addTrade: (trade) => axios.post('/trades', trade)
}