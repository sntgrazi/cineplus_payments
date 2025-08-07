import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/services/api'

export const usePlanStore = defineStore('plan', () => {
  const plans = ref([])
  const selectedPlan = ref(null)
  const loading = ref(false)

  const fetchPlans = async () => {
    try {
      loading.value = true
      const response = await api.get('/plans')
      plans.value = response.data.data
      return plans.value
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchPlanById = async (id) => {
    try {
      loading.value = true
      const response = await api.get(`/plans/${id}`)
      return response.data.data
    } catch (error) {
      console.error('Erro ao buscar plano:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createPlan = async (planData) => {
    try {
      loading.value = true
      const response = await api.post('/plans', planData)
      await fetchPlans() // Atualizar lista
      return response.data
    } catch (error) {
      console.error('Erro ao criar plano:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updatePlan = async (id, planData) => {
    try {
      loading.value = true
      const response = await api.put(`/plans/${id}`, planData)
      await fetchPlans() // Atualizar lista
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar plano:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deletePlan = async (id) => {
    try {
      loading.value = true
      const response = await api.delete(`/plans/${id}`)
      await fetchPlans() // Atualizar lista
      return response.data
    } catch (error) {
      console.error('Erro ao deletar plano:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const setSelectedPlan = (plan) => {
    selectedPlan.value = plan
  }

  const clearSelectedPlan = () => {
    selectedPlan.value = null
  }

  return {
    plans,
    selectedPlan,
    loading,
    fetchPlans,
    fetchPlanById,
    createPlan,
    updatePlan,
    deletePlan,
    setSelectedPlan,
    clearSelectedPlan
  }
})
