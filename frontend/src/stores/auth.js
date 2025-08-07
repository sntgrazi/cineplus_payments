import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || ''
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${API_URL}/auth/login`, {
          email,
          password
        })

        if (response.data.success) {
          this.token = response.data.data.token
          this.user = response.data.data.user
          
          localStorage.setItem('token', this.token)
          
          // Configurar axios para usar o token
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          
          return { success: true }
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao fazer login'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async register(name, email, password) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${API_URL}/auth/register`, {
          name,
          email,
          password
        })

        if (response.data.success) {
          this.token = response.data.data.token
          this.user = response.data.data.user
          
          localStorage.setItem('token', this.token)
          
          // Configurar axios para usar o token
          axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
          
          return { success: true }
        } else {
          throw new Error(response.data.message)
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Erro ao criar conta'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async verifyToken() {
      if (!this.token) return false

      try {
        // Configurar axios para usar o token
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        const response = await axios.get(`${API_URL}/auth/verify`)
        
        if (response.data.success) {
          this.user = response.data.data.user
          return true
        } else {
          this.logout()
          return false
        }
      } catch (error) {
        this.logout()
        return false
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    clearError() {
      this.error = null
    }
  }
})
