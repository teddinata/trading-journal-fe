// src/store/auth.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authAPI } from '../service/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)

  const register = async (userData) => {
    try {
      loading.value = true
      const response = await authAPI.register(userData)
      return response.data
    } finally {
      loading.value = false
    }
  }

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
      // Clear other stored data if any
    }
  }

  const loadUser = async () => {
    if (localStorage.getItem('token')) {
      try {
        const response = await authAPI.getUser()
        user.value = response.data
      } catch (error) {
        localStorage.removeItem('token')
        user.value = null
      }
    }
  }

  return { user, loading, register, login, logout, loadUser }
})