// src/services/api.js
import axios from '../config/axios'

export const authAPI = {
  login: (credentials) => axios.post('/auth/login', credentials),
  logout: () => axios.post('/auth/logout')
}

export const tradeAPI = {
  getStats: () => axios.get('/trades/stats'),
  getRecentTrades: () => axios.get('/trades/recent'),
  addTrade: (trade) => axios.post('/trades', trade)
}