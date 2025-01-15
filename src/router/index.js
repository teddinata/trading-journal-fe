import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard.vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'
import Home from '../views/Home.vue'
import Calculator from '../views/Calculator.vue'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/kalkulator-saham',
    name: 'Calculator',
    component: Calculator
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: '/journals',
        name: 'Journal',
        component: () => import('@/views/Journal.vue')
      },
      {
        path: '/journal/:id',
        name: 'JournalDetail',
        component: () => import('@/views/JournalDetail.vue')
      },
      {
        path: '/journal/create',
        name: 'JournalCreate',
        component: () => import('@/views/AddPosition.vue')
      }
    ],
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router