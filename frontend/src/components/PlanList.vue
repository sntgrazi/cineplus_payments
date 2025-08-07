<template>
  <div class="bg-white">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Sistema de Pagamento</h1>
            <p class="text-gray-600 mt-1">Escolha o plano ideal para você</p>
          </div>
          <router-link
            to="/admin"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Área Admin
          </router-link>
        </div>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="container mx-auto px-4 py-12">
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </div>

    <!-- Plans Grid -->
    <main v-else class="container mx-auto px-4 py-12">
      <div v-if="plans.length === 0" class="text-center py-12">
        <div class="bg-gray-50 rounded-xl p-8">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhum plano disponível</h3>
          <p class="text-gray-500">Aguarde enquanto preparamos nossos planos para você.</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          <!-- Plan Header -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <h3 class="text-xl font-bold mb-2">{{ plan.name }}</h3>
            <div class="flex items-baseline">
              <span class="text-3xl font-bold">R$ {{ formatPrice(plan.price) }}</span>
              <span class="text-blue-100 ml-2">/ {{ plan.duration_months }} mês{{ plan.duration_months > 1 ? 'es' : '' }}</span>
            </div>
          </div>

          <!-- Plan Content -->
          <div class="p-6">
            <p v-if="plan.description" class="text-gray-600 mb-6">
              {{ plan.description }}
            </p>

            <!-- Features -->
            <div v-if="plan.features && plan.features.length > 0" class="mb-6">
              <h4 class="font-semibold text-gray-800 mb-3">Recursos inclusos:</h4>
              <ul class="space-y-2">
                <li
                  v-for="feature in plan.features"
                  :key="feature"
                  class="flex items-center text-gray-600"
                >
                  <svg class="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <!-- Select Button -->
            <button
              @click="selectPlan(plan)"
              class="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Escolher este plano
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanStore } from '@/stores/planStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const planStore = usePlanStore()
const toast = useToast()

const plans = ref([])
const loading = ref(true)

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2).replace('.', ',')
}

const selectPlan = (plan) => {
  planStore.setSelectedPlan(plan)
  router.push('/checkout')
}

const loadPlans = async () => {
  try {
    loading.value = true
    plans.value = await planStore.fetchPlans()
  } catch (error) {
    console.error('Erro ao carregar planos:', error)
    toast.error('Erro ao carregar planos. Tente novamente.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPlans()
})
</script>
