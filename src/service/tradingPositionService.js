// src/services/tradingPositionsService.js
import axios from '@/config/axios'

export const tradingPositionsService = {
  getPositions: async (params) => {
    try {
      const response = await axios.get('/trading/positions', { params })
      return response.data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  },

  getPosition: async (id) => {
    const response = await axios.get(`/trading/positions/${id}`)
    return response.data
  },

  createPosition: async (data) => {
    const response = await axios.post('/trading/positions', data)
    return response.data
  },

  addTransaction: async (positionId, data) => {
    const response = await axios.post(`/trading/positions/${positionId}/transaction`, data)
    return response.data
  }
}