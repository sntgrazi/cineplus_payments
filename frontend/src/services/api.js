import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Aqui você pode adicionar tokens de autenticação se necessário
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Servidor respondeu com status de erro
      console.error('Erro da API:', error.response.data)
      return Promise.reject(error.response.data)
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error('Erro de rede:', error.request)
      return Promise.reject({ message: 'Erro de conexão com o servidor' })
    } else {
      // Algo deu errado na configuração da requisição
      console.error('Erro:', error.message)
      return Promise.reject({ message: error.message })
    }
  }
)

export default api
