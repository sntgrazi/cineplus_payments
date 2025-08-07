<template>
  <div class="min-h-screen bg-green-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
      <div class="mb-6">
        <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Pagamento Aprovado!</h1>
        <p class="text-gray-600">Seu pagamento foi processado com sucesso.</p>
      </div>

      <div v-if="paymentInfo" class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
        <h3 class="font-semibold text-gray-800 mb-2">Detalhes do Pagamento:</h3>
        <div class="space-y-1 text-sm text-gray-600">
          <div><strong>Plano:</strong> {{ paymentInfo.plan?.name }}</div>
          <div><strong>Valor:</strong> R$ {{ formatPrice(paymentInfo.amount) }}</div>
          <div><strong>Status:</strong> {{ getStatusText(paymentInfo.status) }}</div>
        </div>
      </div>

      <div class="space-y-3">
        <p class="text-sm text-gray-500">
          Em breve você receberá um e-mail com todos os detalhes da sua compra.
        </p>
        
        <div class="flex flex-col space-y-2">
          <router-link
            to="/"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voltar aos Planos
          </router-link>
          
          <button
            @click="shareSuccess"
            class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Compartilhar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePaymentStore } from '@/stores/paymentStore'
import { useToast } from 'vue-toastification'

const route = useRoute()
const paymentStore = usePaymentStore()
const toast = useToast()

const paymentInfo = ref(null)

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2).replace('.', ',')
}

const getStatusText = (status) => {
  const statusMap = {
    'approved': 'Aprovado',
    'pending': 'Pendente',
    'in_process': 'Em processamento',
    'rejected': 'Rejeitado',
    'cancelled': 'Cancelado'
  }
  return statusMap[status] || status
}

const shareSuccess = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Pagamento Aprovado!',
      text: 'Meu pagamento foi aprovado com sucesso!',
      url: window.location.href
    })
  } else {
    // Fallback para dispositivos que não suportam Web Share API
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copiado para a área de transferência!')
  }
}

onMounted(async () => {
  const paymentId = route.query.payment_id
  const collectionId = route.query.collection_id
  const external_reference = route.query.external_reference

  if (external_reference) {
    try {
      paymentInfo.value = await paymentStore.getPaymentStatus(external_reference)
    } catch (error) {
      console.error('Erro ao buscar informações do pagamento:', error)
    }
  }
})
</script>
