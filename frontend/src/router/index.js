import { createRouter, createWebHistory } from 'vue-router'
import PlanList from '@/components/PlanList.vue'
import Checkout from '@/components/Checkout.vue'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'plans',
    component: PlanList,
    meta: {
      title: 'CinePlus - Escolher Plano'
    }
  },
  {
    path: '/checkout',
    name: 'checkout',
    component: Checkout,
    meta: {
      title: 'CinePlus - Finalizar Compra'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: 'CinePlus - Login',
      requiresGuest: true
    }
  },
  {
    path: '/pagamento/sucesso',
    name: 'payment-success',
    component: () => import('@/views/PaymentSuccess.vue'),
    meta: {
      title: 'Pagamento Realizado'
    }
  },
  {
    path: '/pagamento/erro',
    name: 'payment-error',
    component: () => import('@/views/PaymentError.vue'),
    meta: {
      title: 'Erro no Pagamento'
    }
  },
  {
    path: '/pagamento/pendente',
    name: 'payment-pending',
    component: () => import('@/views/PaymentPending.vue'),
    meta: {
      title: 'Pagamento Pendente'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/views/Admin.vue'),
    meta: {
      title: 'CinePlus - Administração',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Página não encontrada'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Atualizar título da página
  document.title = to.meta.title || 'CinePlus'
  
  // Verificar autenticação se necessário
  if (to.meta.requiresAuth) {
    const isAuthenticated = await authStore.verifyToken()
    
    if (!isAuthenticated) {
      next('/login')
      return
    }
    
    // Verificar se precisa ser admin
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      next('/')
      return
    }
  }
  
  // Redirecionar usuários autenticados da página de login
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  next()
})

export default router
