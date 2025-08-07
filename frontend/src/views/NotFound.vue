<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
      <div class="mb-6">
        <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">404</h1>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Página não encontrada</h2>
        <p class="text-gray-600">A página que você está procurando não existe ou foi removida.</p>
      </div>

      <div class="space-y-3">
        <router-link
          to="/"
          class="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Ir para Home
        </router-link>
        
        <button
          @click="goBack"
          class="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Voltar
        </button>
      </div>

      <div class="mt-8 text-sm text-gray-500">
        <p>Se você acredita que isso é um erro,</p>
        <p>entre em contato conosco.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>
