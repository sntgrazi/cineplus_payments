import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const usePaymentStore = defineStore('payment', () => {
  const payments = ref([])
  const currentPayment = ref(null)
  const loading = ref(false)

  const createPreference = async (paymentData) => {
    try {
      loading.value = true
      const response = await api.post('/payments/create-preference', paymentData)
      return response.data
    } catch (error) {
      console.error('Erro ao criar preferência de pagamento:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const getPaymentStatus = async (paymentId) => {
    try {
      loading.value = true
      const response = await api.get(`/payments/${paymentId}/status`)
      currentPayment.value = response.data.data
      return response.data.data
    } catch (error) {
      console.error('Erro ao buscar status do pagamento:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchPayments = async (filters = {}) => {
    try {
      loading.value = true
      const params = new URLSearchParams(filters).toString()
      const url = params ? `/payments?${params}` : '/payments'
      const response = await api.get(url)
      payments.value = response.data.data
      return response.data
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const clearCurrentPayment = () => {
    currentPayment.value = null
  }

  return {
    payments,
    currentPayment,
    loading,
    createPreference,
    getPaymentStatus,
    fetchPayments,
    clearCurrentPayment
  }
})
