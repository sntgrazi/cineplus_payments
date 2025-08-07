<template>
  <div class="min-h-screen bg-yellow-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
      <div class="mb-6">
        <div class="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Pagamento Pendente</h1>
        <p class="text-gray-600">Seu pagamento está sendo processado.</p>
      </div>

      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 class="font-semibold text-yellow-800 mb-2">O que isso significa?</h3>
        <div class="text-sm text-yellow-700 text-left space-y-2">
          <p>Seu pagamento foi recebido e está sendo verificado pelo banco.</p>
          <p><strong>Tempo estimado:</strong> até 2 dias úteis</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="font-semibold text-blue-800 mb-2">Próximos passos:</h4>
          <ul class="text-sm text-blue-700 text-left space-y-1">
            <li>1. Aguarde a confirmação do pagamento</li>
            <li>2. Você receberá um e-mail quando aprovado</li>
            <li>3. Seu acesso será liberado automaticamente</li>
          </ul>
        </div>

        <div class="flex flex-col space-y-2">
          <button
            @click="checkStatus"
            :disabled="loading"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            <span v-if="loading">Verificando...</span>
            <span v-else>Verificar Status</span>
          </button>
          
          <router-link
            to="/"
            class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Voltar ao Início
          </router-link>
        </div>
      </div>

      <div class="mt-6 text-xs text-gray-500">
        <p>Dúvidas? Entre em contato:</p>
        <p class="font-medium">suporte@exemplo.com</p>
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

const loading = ref(false)

const checkStatus = async () => {
  const external_reference = route.query.external_reference
  
  if (!external_reference) {
    toast.warning('ID do pagamento não encontrado')
    return
  }

  try {
    loading.value = true
    const payment = await paymentStore.getPaymentStatus(external_reference)
    
    if (payment.status === 'approved') {
      toast.success('Pagamento aprovado!')
      // Redirecionar para página de sucesso
      router.push(`/pagamento/sucesso?external_reference=${external_reference}`)
    } else if (payment.status === 'rejected') {
      toast.error('Pagamento rejeitado')
      router.push(`/pagamento/erro?external_reference=${external_reference}`)
    } else {
      toast.info(`Status atual: ${payment.status}`)
    }
  } catch (error) {
    console.error('Erro ao verificar status:', error)
    toast.error('Erro ao verificar status do pagamento')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Verificar status automaticamente ao carregar a página
  setTimeout(() => {
    checkStatus()
  }, 2000)
})
</script>
