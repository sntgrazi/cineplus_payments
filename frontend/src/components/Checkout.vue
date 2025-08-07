<template>
  <div class="bg-white min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-6">
        <div class="flex items-center justify-between">
          <div>
            <router-link to="/" class="text-blue-600 hover:text-blue-700 font-medium">
              ← Voltar aos planos
            </router-link>
            <h1 class="text-3xl font-bold text-gray-900 mt-2">Finalizar Compra</h1>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-12">
      <div v-if="!selectedPlan" class="text-center py-12">
        <div class="bg-gray-50 rounded-xl p-8">
          <h3 class="text-xl font-semibold text-gray-700 mb-2">Nenhum plano selecionado</h3>
          <p class="text-gray-500 mb-4">Selecione um plano para continuar.</p>
          <router-link
            to="/"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Escolher Plano
          </router-link>
        </div>
      </div>

      <div v-else class="max-w-4xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Customer Form -->
          <div class="card p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Seus Dados</h2>
            
            <form @submit.prevent="processPayment">
              <div class="form-group">
                <label class="form-label">Nome Completo *</label>
                <input
                  v-model="form.full_name"
                  type="text"
                  class="form-input"
                  required
                  placeholder="Seu nome completo"
                />
              </div>

              <div class="form-group">
                <label class="form-label">E-mail *</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  required
                  placeholder="seu@email.com"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Telefone *</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="form-input"
                  required
                  placeholder="(11) 99999-9999"
                  @input="formatPhone"
                />
              </div>

              <div class="form-group">
                <label class="form-label">CPF</label>
                <input
                  v-model="form.cpf"
                  type="text"
                  class="form-input"
                  placeholder="000.000.000-00"
                  @input="formatCPF"
                />
              </div>

              <div class="form-group">
                <label class="form-label">Data de Nascimento</label>
                <input
                  v-model="form.birth_date"
                  type="date"
                  class="form-input"
                />
              </div>

              <!-- Address -->
              <div class="mt-8">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Endereço (Opcional)</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="form-group">
                    <label class="form-label">CEP</label>
                    <input
                      v-model="form.address.zip_code"
                      type="text"
                      class="form-input"
                      placeholder="00000-000"
                      @input="formatCEP"
                      @blur="searchCEP"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Rua</label>
                    <input
                      v-model="form.address.street"
                      type="text"
                      class="form-input"
                      placeholder="Nome da rua"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Número</label>
                    <input
                      v-model="form.address.number"
                      type="text"
                      class="form-input"
                      placeholder="123"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Bairro</label>
                    <input
                      v-model="form.address.neighborhood"
                      type="text"
                      class="form-input"
                      placeholder="Nome do bairro"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Cidade</label>
                    <input
                      v-model="form.address.city"
                      type="text"
                      class="form-input"
                      placeholder="Nome da cidade"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">Estado</label>
                    <select v-model="form.address.state" class="form-select">
                      <option value="">Selecione...</option>
                      <option v-for="state in brazilStates" :key="state.value" :value="state.value">
                        {{ state.label }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full mt-8 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </span>
                <span v-else>Pagar com Mercado Pago</span>
              </button>
            </form>
          </div>

          <!-- Order Summary -->
          <div class="card p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
            
            <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg mb-6">
              <h3 class="text-lg font-bold">{{ selectedPlan.name }}</h3>
              <p class="text-blue-100 text-sm mt-1">{{ selectedPlan.description }}</p>
            </div>

            <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Plano:</span>
                <span class="font-semibold">{{ selectedPlan.name }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600">Duração:</span>
                <span class="font-semibold">{{ selectedPlan.duration_months }} mês{{ selectedPlan.duration_months > 1 ? 'es' : '' }}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-600">Valor:</span>
                <span class="font-semibold">R$ {{ formatPrice(selectedPlan.price) }}</span>
              </div>

              <hr class="border-gray-200">

              <div class="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span class="text-green-600">R$ {{ formatPrice(selectedPlan.price) }}</span>
              </div>
            </div>

            <!-- Features -->
            <div v-if="selectedPlan.features && selectedPlan.features.length > 0" class="mt-6">
              <h4 class="font-semibold text-gray-800 mb-3">Recursos inclusos:</h4>
              <ul class="space-y-2">
                <li
                  v-for="feature in selectedPlan.features"
                  :key="feature"
                  class="flex items-center text-gray-600 text-sm"
                >
                  <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ feature }}
                </li>
              </ul>
            </div>

            <!-- Security Badge -->
            <div class="mt-6 p-4 bg-gray-50 rounded-lg">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm text-gray-600">Pagamento 100% seguro</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Processado pelo Mercado Pago
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePlanStore } from '@/stores/planStore'
import { usePaymentStore } from '@/stores/paymentStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const planStore = usePlanStore()
const paymentStore = usePaymentStore()
const toast = useToast()

const loading = ref(false)

const selectedPlan = computed(() => planStore.selectedPlan)

const form = ref({
  full_name: '',
  email: '',
  phone: '',
  cpf: '',
  birth_date: '',
  address: {
    zip_code: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: ''
  }
})

const brazilStates = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
]

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2).replace('.', ',')
}

const formatPhone = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/^(\d{2})(\d)/g, '($1) $2')
  value = value.replace(/(\d)(\d{4})$/, '$1-$2')
  form.value.phone = value
}

const formatCPF = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d)/, '$1.$2')
  value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  form.value.cpf = value
}

const formatCEP = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  value = value.replace(/^(\d{5})(\d)/, '$1-$2')
  form.value.address.zip_code = value
}

const searchCEP = async () => {
  const cep = form.value.address.zip_code.replace(/\D/g, '')
  if (cep.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        form.value.address.street = data.logradouro
        form.value.address.neighborhood = data.bairro
        form.value.address.city = data.localidade
        form.value.address.state = data.uf
      }
    } catch (error) {
      console.log('Erro ao buscar CEP:', error)
    }
  }
}

const processPayment = async () => {
  try {
    loading.value = true

    const paymentData = {
      plan_id: selectedPlan.value.id,
      customer: {
        full_name: form.value.full_name,
        email: form.value.email,
        phone: form.value.phone.replace(/\D/g, ''),
        cpf: form.value.cpf || null,
        birth_date: form.value.birth_date || null,
        address: form.value.address.street ? form.value.address : null
      }
    }

    const result = await paymentStore.createPreference(paymentData)
    
    if (result.success) {
      // Redirecionar para o Mercado Pago
      window.location.href = result.data.init_point
    } else {
      toast.error('Erro ao processar pagamento. Tente novamente.')
    }
  } catch (error) {
    console.error('Erro ao processar pagamento:', error)
    toast.error('Erro ao processar pagamento. Tente novamente.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!selectedPlan.value) {
    router.push('/')
  }
})
</script>
