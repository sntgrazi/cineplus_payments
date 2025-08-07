<template>
  <div class="min-h-screen bg-red-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
      <div class="mb-6">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Pagamento Não Realizado</h1>
        <p class="text-gray-600">Ocorreu um problema com seu pagamento.</p>
      </div>

      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 class="font-semibold text-red-800 mb-2">O que aconteceu?</h3>
        <ul class="text-sm text-red-700 text-left space-y-1">
          <li>• Dados do cartão incorretos</li>
          <li>• Limite insuficiente</li>
          <li>• Problema na operadora</li>
          <li>• Pagamento cancelado pelo usuário</li>
        </ul>
      </div>

      <div class="space-y-3">
        <p class="text-sm text-gray-600">
          Não se preocupe! Você pode tentar novamente ou escolher outra forma de pagamento.
        </p>
        
        <div class="flex flex-col space-y-2">
          <router-link
            to="/checkout"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tentar Novamente
          </router-link>
          
          <router-link
            to="/"
            class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Escolher Outro Plano
          </router-link>
        </div>
      </div>

      <div class="mt-6 text-xs text-gray-500">
        <p>Precisa de ajuda? Entre em contato conosco:</p>
        <p class="font-medium">suporte@exemplo.com</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Componente simples sem lógica complexa
</script>
