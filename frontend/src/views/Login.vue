<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLogin ? 'Fazer Login' : 'Criar Conta' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isLogin ? 'Acesse sua conta CinePlus' : 'Crie sua conta CinePlus' }}
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div v-if="!isLogin">
            <label for="name" class="sr-only">Nome</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nome completo"
            />
          </div>
          
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              :class="[
                'relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                isLogin ? 'rounded-t-md' : ''
              ]"
              placeholder="Email"
            />
          </div>
          
          <div>
            <label for="password" class="sr-only">Senha</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Senha"
            />
          </div>
        </div>

        <div v-if="authStore.error" class="text-red-600 text-sm text-center">
          {{ authStore.error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="authStore.loading">Processando...</span>
            <span v-else>{{ isLogin ? 'Entrar' : 'Criar Conta' }}</span>
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="toggleMode"
            class="text-blue-600 hover:text-blue-500 text-sm"
          >
            {{ isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Fazer login' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const form = reactive({
  name: '',
  email: '',
  password: ''
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  authStore.clearError()
  // Limpar formulário
  form.name = ''
  form.email = ''
  form.password = ''
}

const handleSubmit = async () => {
  authStore.clearError()
  
  let result
  if (isLogin.value) {
    result = await authStore.login(form.email, form.password)
  } else {
    result = await authStore.register(form.name, form.email, form.password)
  }
  
  if (result.success) {
    // Redirecionar baseado no papel do usuário
    if (authStore.isAdmin) {
      router.push('/admin')
    } else {
      router.push('/')
    }
  }
}
</script>
