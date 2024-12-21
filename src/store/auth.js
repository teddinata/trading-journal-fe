// src/store/auth.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authAPI } from '../service/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)

  const login = async (credentials) => {
    try {
      loading.value = true
      const response = await authAPI.login(credentials)
      const token = response.data.data.token.access_token
      localStorage.setItem('token', token)
      return token
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } finally {
      localStorage.removeItem('token')
      user.value = null
    }
  }

  return { user, loading, login, logout }
})
