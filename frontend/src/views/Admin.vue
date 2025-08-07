<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <div class="w-64 bg-white shadow-lg flex-shrink-0">
      <!-- Header da Sidebar -->
      <div class="px-6 py-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">CinePlus</h2>
            <p class="text-sm text-gray-600">Admin Panel</p>
          </div>
        </div>
      </div>

      <!-- Menu da Sidebar -->
      <nav class="px-4 py-6 space-y-2">
        <button
          @click="activeSection = 'dashboard'"
          :class="[
            'w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors',
            activeSection === 'dashboard'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
          </svg>
          Dashboard
        </button>

        <button
          @click="activeSection = 'plans'"
          :class="[
            'w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors',
            activeSection === 'plans'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Gerenciar Planos
        </button>

        <button
          @click="activeSection = 'customers'"
          :class="[
            'w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors',
            activeSection === 'customers'
              ? 'bg-blue-100 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-gray-100'
          ]"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
          </svg>
          Clientes
        </button>
      </nav>

      <!-- Footer da Sidebar -->
      <div class="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <router-link
          to="/"
          class="w-full flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
          </svg>
          Voltar ao Site
        </router-link>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ getSectionTitle() }}
              </h1>
              <p class="text-gray-600 mt-1">{{ getSectionDescription() }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-gray-700">Olá, Admin</span>
              <button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- Dashboard Section -->
        <div v-show="activeSection === 'dashboard'">
          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Total de Planos</h3>
                  <p class="text-3xl font-bold text-gray-700">{{ plans.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100 text-green-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Pagamentos</h3>
                  <p class="text-3xl font-bold text-gray-700">{{ payments.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
              <div class="flex items-center">
                <div class="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 616 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">Clientes</h3>
                  <p class="text-3xl font-bold text-gray-700">{{ customers.length }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                @click="activeSection = 'plans'; showCreateForm = true"
                class="flex items-center p-4 border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <svg class="w-6 h-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                </svg>
                <div class="text-left">
                  <p class="font-medium text-gray-900">Criar Novo Plano</p>
                  <p class="text-sm text-gray-600">Adicione um novo plano de assinatura</p>
                </div>
              </button>
              
              <button
                @click="activeSection = 'customers'; loadCustomers()"
                class="flex items-center p-4 border border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors"
              >
                <svg class="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path>
                </svg>
                <div class="text-left">
                  <p class="font-medium text-gray-900">Atualizar Clientes</p>
                  <p class="text-sm text-gray-600">Recarregar lista de clientes</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Planos Section -->
        <div v-show="activeSection === 'plans'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Lista de Planos</h2>
            <button
              @click="showCreateForm = true"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              + Criar Novo Plano
            </button>
          </div>

          <div v-if="plans.length === 0" class="text-center py-12 bg-white rounded-lg">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-lg text-gray-600">Nenhum plano cadastrado</p>
            <p class="text-gray-500 mt-1">Clique no botão acima para criar seu primeiro plano</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="plan in plans"
              :key="plan.id"
              class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div class="space-y-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900">{{ plan.name }}</h3>
                    <p class="text-sm text-gray-600 mt-1">{{ plan.description }}</p>
                  </div>
                  <span
                    :class="[
                      'px-2 py-1 text-xs rounded-full',
                      plan.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ plan.is_active ? 'Ativo' : 'Inativo' }}
                  </span>
                </div>
                
                <div class="border-t pt-4">
                  <p class="text-2xl font-bold text-green-600">
                    R$ {{ formatPrice(plan.price) }}
                  </p>
                  <p class="text-sm text-gray-500">{{ plan.duration_months }} mês(es)</p>
                </div>
                
                <div class="flex space-x-2 pt-4 border-t">
                  <button
                    @click="editPlan(plan)"
                    class="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
                  >
                    Editar
                  </button>
                  <button
                    @click="deletePlan(plan.id)"
                    class="flex-1 bg-red-600 text-white py-2 px-3 rounded-md hover:bg-red-700 transition-colors text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Clientes Section -->
        <div v-show="activeSection === 'customers'">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Lista de Clientes</h2>
            <button
              @click="loadCustomers"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Atualizar Lista
            </button>
          </div>
          
          <div v-if="loadingCustomers" class="text-center py-12 bg-white rounded-lg">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p class="text-gray-600 mt-4">Carregando clientes...</p>
          </div>
          
          <div v-else-if="customers.length === 0" class="text-center py-12 bg-white rounded-lg">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 616 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"></path>
            </svg>
            <p class="text-lg text-gray-600">Nenhum cliente encontrado</p>
            <p class="text-gray-500 mt-1">Os clientes aparecerão aqui após realizarem pagamentos</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="customer in customers"
              :key="customer.id"
              class="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ customer.full_name }}</h3>
                    <p class="text-sm text-gray-600">{{ customer.email }}</p>
                    <p class="text-sm text-gray-500">{{ customer.phone }}</p>
                  </div>
                </div>
                
                <div class="border-t pt-4">
                  <div class="text-sm text-gray-600 space-y-2">
                    <div class="flex justify-between">
                      <span>Cliente desde:</span>
                      <span class="font-medium">{{ formatDate(customer.created_at) }}</span>
                    </div>
                    <div v-if="customer.payment_count" class="flex justify-between">
                      <span>Pagamentos:</span>
                      <span class="font-medium">{{ customer.payment_count }}</span>
                    </div>
                    <div v-if="customer.total_spent" class="flex justify-between">
                      <span>Total gasto:</span>
                      <span class="font-medium text-green-600">R$ {{ formatPrice(customer.total_spent) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

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
              <label class="block text-sm font-medium text-gray-700 mb-1">Nome do Plano</label>
              <input
                v-model="planForm.name"
                type="text"
                required
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Plano Básico"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
              <textarea
                v-model="planForm.description"
                rows="3"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descrição do plano..."
              ></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                <input
                  v-model="planForm.price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0,00"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Duração (meses)</label>
                <input
                  v-model="planForm.duration_months"
                  type="number"
                  min="1"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="1"
                />
              </div>
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

// State
const activeSection = ref('dashboard')
const plans = ref([])
const payments = ref([])
const customers = ref([])
const loading = ref(false)
const loadingCustomers = ref(false)
const showCreateForm = ref(false)
const editingPlan = ref(null)

const planForm = ref({
  name: '',
  description: '',
  price: '',
  duration_months: 1
})

// Methods
const getSectionTitle = () => {
  const titles = {
    dashboard: 'Dashboard',
    plans: 'Gerenciar Planos',
    customers: 'Clientes'
  }
  return titles[activeSection.value] || 'Dashboard'
}

const getSectionDescription = () => {
  const descriptions = {
    dashboard: 'Visão geral do sistema',
    plans: 'Criar, editar e gerenciar planos de assinatura',
    customers: 'Visualizar e gerenciar clientes cadastrados'
  }
  return descriptions[activeSection.value] || 'Painel administrativo'
}

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2).replace('.', ',')
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}

const loadData = async () => {
  try {
    await planStore.fetchPlans()
    plans.value = planStore.plans
    
    await paymentStore.fetchPayments()
    payments.value = paymentStore.payments
    
    await loadCustomers()
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    toast.error('Erro ao carregar dados')
  }
}

const loadCustomers = async () => {
  try {
    loadingCustomers.value = true
    const response = await fetch('/api/admin/customers', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      customers.value = data.data || []
    } else {
      toast.error('Erro ao carregar clientes')
    }
  } catch (error) {
    console.error('Erro ao carregar clientes:', error)
    toast.error('Erro ao carregar clientes')
  } finally {
    loadingCustomers.value = false
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
