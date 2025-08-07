<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Área Administrativa</h1>
            <p class="text-gray-600 mt-1">Gerenciar planos e pagamentos</p>
          </div>
          <router-link
            to="/"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar ao Site
          </router-link>
        </div>
      </div>
    </header>

    <!-- Content -->
    <main class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Plans Management -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Gerenciar Planos</h2>
          
          <div class="space-y-4">
            <button
              @click="showCreateForm = true"
              class="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              + Criar Novo Plano
            </button>

            <div v-if="plans.length === 0" class="text-center py-8 text-gray-500">
              Nenhum plano cadastrado
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="plan in plans"
                :key="plan.id"
                class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-gray-900">{{ plan.name }}</h3>
                    <p class="text-sm text-gray-600">{{ plan.description }}</p>
                    <p class="text-lg font-bold text-green-600 mt-2">
                      R$ {{ formatPrice(plan.price) }}
                    </p>
                  </div>
                  <div class="flex space-x-2">
                    <button
                      @click="editPlan(plan)"
                      class="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Editar
                    </button>
                    <button
                      @click="deletePlan(plan.id)"
                      class="text-red-600 hover:text-red-700 text-sm"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payments Overview -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Pagamentos Recentes</h2>
          
          <div v-if="payments.length === 0" class="text-center py-8 text-gray-500">
            Nenhum pagamento encontrado
          </div>

          <div v-else class="space-y-3">
            <div
              v-for="payment in payments"
              :key="payment.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h3 class="font-semibold text-gray-900">{{ payment.customer?.full_name }}</h3>
                  <p class="text-sm text-gray-600">{{ payment.plan?.name }}</p>
                  <p class="text-sm text-gray-500">{{ formatDate(payment.created_at) }}</p>
                </div>
                <div class="text-right">
                  <p class="font-bold text-gray-900">R$ {{ formatPrice(payment.amount) }}</p>
                  <span
                    :class="getStatusClass(payment.status)"
                    class="text-xs px-2 py-1 rounded-full"
                  >
                    {{ getStatusText(payment.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Create/Edit Plan Modal -->
    <div
      v-if="showCreateForm || editingPlan"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ editingPlan ? 'Editar Plano' : 'Criar Novo Plano' }}
        </h3>
        
        <form @submit.prevent="savePlan">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                v-model="planForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                v-model="planForm.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
              <input
                v-model="planForm.price"
                type="number"
                step="0.01"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duração (meses)</label>
              <input
                v-model="planForm.duration_months"
                type="number"
                min="1"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              type="submit"
              :disabled="loading"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {{ loading ? 'Salvando...' : 'Salvar' }}
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePlanStore } from '@/stores/planStore'
import { usePaymentStore } from '@/stores/paymentStore'
import { useToast } from 'vue-toastification'

const planStore = usePlanStore()
const paymentStore = usePaymentStore()
const toast = useToast()

const plans = ref([])
const payments = ref([])
const loading = ref(false)
const showCreateForm = ref(false)
const editingPlan = ref(null)

const planForm = ref({
  name: '',
  description: '',
  price: '',
  duration_months: 1
})

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2).replace('.', ',')
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': 'Pendente',
    'approved': 'Aprovado',
    'rejected': 'Rejeitado',
    'cancelled': 'Cancelado'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  const classMap = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'cancelled': 'bg-gray-100 text-gray-800'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800'
}

const loadData = async () => {
  try {
    loading.value = true
    plans.value = await planStore.fetchPlans()
    const paymentData = await paymentStore.fetchPayments({ limit: 10 })
    payments.value = paymentData.data || []
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    toast.error('Erro ao carregar dados')
  } finally {
    loading.value = false
  }
}

const editPlan = (plan) => {
  editingPlan.value = plan
  planForm.value = {
    name: plan.name,
    description: plan.description,
    price: plan.price,
    duration_months: plan.duration_months
  }
}

const cancelEdit = () => {
  showCreateForm.value = false
  editingPlan.value = null
  planForm.value = {
    name: '',
    description: '',
    price: '',
    duration_months: 1
  }
}

const savePlan = async () => {
  try {
    loading.value = true
    
    if (editingPlan.value) {
      await planStore.updatePlan(editingPlan.value.id, planForm.value)
      toast.success('Plano atualizado com sucesso!')
    } else {
      await planStore.createPlan(planForm.value)
      toast.success('Plano criado com sucesso!')
    }
    
    cancelEdit()
    await loadData()
  } catch (error) {
    console.error('Erro ao salvar plano:', error)
    toast.error('Erro ao salvar plano')
  } finally {
    loading.value = false
  }
}

const deletePlan = async (planId) => {
  if (confirm('Tem certeza que deseja excluir este plano?')) {
    try {
      await planStore.deletePlan(planId)
      toast.success('Plano excluído com sucesso!')
      await loadData()
    } catch (error) {
      console.error('Erro ao excluir plano:', error)
      toast.error('Erro ao excluir plano')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>
