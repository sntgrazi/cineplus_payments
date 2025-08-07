<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-bold text-gray-900">
            Painel Administrativo - CinePlus
          </h1>
          <div class="flex items-center space-x-4">
            <span class="text-gray-700">Olá, {{ authStore.userName }}</span>
            <button
              @click="logout"
              class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">P</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Total de Planos
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.totalPlans }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">$</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Pagamentos Hoje
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.paymentsToday }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span class="text-white font-bold">U</span>
                  </div>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">
                      Novos Clientes
                    </dt>
                    <dd class="text-lg font-medium text-gray-900">
                      {{ stats.newCustomers }}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gerenciamento de Planos -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Gerenciar Planos
              </h3>
              <button
                @click="showCreatePlan = true"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Novo Plano
              </button>
            </div>

            <!-- Lista de Planos -->
            <div class="overflow-hidden">
              <div v-if="loading" class="text-center py-4">
                Carregando planos...
              </div>
              
              <div v-else-if="plans.length === 0" class="text-center py-4 text-gray-500">
                Nenhum plano encontrado
              </div>

              <div v-else class="space-y-4">
                <div
                  v-for="plan in plans"
                  :key="plan.id"
                  class="border border-gray-200 rounded-lg p-4"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="text-lg font-medium text-gray-900">{{ plan.name }}</h4>
                      <p class="text-gray-600">{{ plan.description }}</p>
                      <div class="mt-2">
                        <span class="text-2xl font-bold text-green-600">
                          R$ {{ plan.price ? plan.price : '0.00' }}
                        </span>
                        <span class="text-gray-500">
                          / {{ plan.duration_months === 1 ? 'mês' : plan.duration_months + ' meses' }}
                        </span>
                      </div>
                      <div class="mt-2">
                        <span
                          :class="[
                            'px-2 py-1 rounded-full text-xs',
                            plan.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          ]"
                        >
                          {{ plan.is_active ? 'Ativo' : 'Inativo' }}
                        </span>
                      </div>
                    </div>
                    
                    <div class="flex space-x-2">
                      <button
                        @click="editPlan(plan)"
                        class="text-blue-600 hover:text-blue-800"
                      >
                        Editar
                      </button>
                      <button
                        @click="togglePlanStatus(plan)"
                        :class="[
                          'text-sm px-3 py-1 rounded',
                          plan.is_active
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        ]"
                      >
                        {{ plan.is_active ? 'Desativar' : 'Ativar' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal para criar/editar plano -->
    <div
      v-if="showCreatePlan || editingPlan"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ editingPlan ? 'Editar Plano' : 'Novo Plano' }}
          </h3>
          
          <form @submit.prevent="savePlan">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  v-model="planForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea
                  v-model="planForm.description"
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Preço (R$)</label>
                  <input
                    v-model="planForm.price"
                    type="number"
                    step="0.01"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700">Duração (meses)</label>
                  <input
                    v-model="planForm.duration_months"
                    type="number"
                    min="1"
                    required
                    class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div class="flex items-center">
                <input
                  v-model="planForm.is_active"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label class="ml-2 block text-sm text-gray-900">
                  Plano ativo
                </label>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {{ saving ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const router = useRouter()
const authStore = useAuthStore()

// Estado
const loading = ref(false)
const saving = ref(false)
const plans = ref([])
const showCreatePlan = ref(false)
const editingPlan = ref(null)

const stats = reactive({
  totalPlans: 0,
  paymentsToday: 0,
  newCustomers: 0
})

const planForm = reactive({
  name: '',
  description: '',
  price: 0,
  duration_months: 1,
  is_active: true
})

// Verificar autenticação ao montar
onMounted(async () => {
  const isAuthenticated = await authStore.verifyToken()
  if (!isAuthenticated || !authStore.isAdmin) {
    router.push('/login')
    return
  }
  
  await loadPlans()
  loadStats()
})

// Carregar planos
const loadPlans = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/plans')
    if (response.data.success) {
      plans.value = response.data.data
      stats.totalPlans = plans.value.length
    }
  } catch (error) {
    console.error('Erro ao carregar planos:', error)
  } finally {
    loading.value = false
  }
}

// Carregar estatísticas
const loadStats = () => {
  // Aqui você pode fazer chamadas para APIs de estatísticas
  stats.paymentsToday = Math.floor(Math.random() * 50)
  stats.newCustomers = Math.floor(Math.random() * 20)
}

// Editar plano
const editPlan = (plan) => {
  editingPlan.value = plan
  planForm.name = plan.name
  planForm.description = plan.description
  planForm.price = plan.price
  planForm.duration_months = plan.duration_months
  planForm.is_active = plan.is_active
}

// Salvar plano
const savePlan = async () => {
  saving.value = true
  try {
    const planData = { ...planForm }
    
    let response
    if (editingPlan.value) {
      response = await axios.put(`/api/plans/${editingPlan.value.id}`, planData)
    } else {
      response = await axios.post('/api/plans', planData)
    }
    
    if (response.data.success) {
      await loadPlans()
      closeModal()
    }
  } catch (error) {
    console.error('Erro ao salvar plano:', error)
    alert('Erro ao salvar plano. Verifique os dados e tente novamente.')
  } finally {
    saving.value = false
  }
}

// Alternar status do plano
const togglePlanStatus = async (plan) => {
  try {
    const response = await axios.put(`/api/plans/${plan.id}`, {
      ...plan,
      is_active: !plan.is_active
    })
    
    if (response.data.success) {
      await loadPlans()
    }
  } catch (error) {
    console.error('Erro ao alterar status do plano:', error)
  }
}

// Fechar modal
const closeModal = () => {
  showCreatePlan.value = false
  editingPlan.value = null
  
  // Limpar formulário
  planForm.name = ''
  planForm.description = ''
  planForm.price = 0
  planForm.duration_months = 1
  planForm.is_active = true
}

// Logout
const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
