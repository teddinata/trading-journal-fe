// src/services/api.js
import axios from '../config/axios'

export const authAPI = {
  register: (userData) => axios.post('/auth/register', userData),
  login: (credentials) => axios.post('/auth/login', credentials),
  logout: () => axios.post('/auth/logout'),
  getUser: () => axios.get('/auth/me')
}

export const tradeAPI = {
  getStats: () => axios.get('/trades/stats'),
  getRecentTrades: () => axios.get('/trades/recent'),
  addTrade: (trade) => axios.post('/trades', trade)
}