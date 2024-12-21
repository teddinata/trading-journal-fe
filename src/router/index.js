import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/Login.vue'
import DashboardView from '../views/Dashboard.vue'
import DashboardLayout from '../components/layout/DashboardLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue')
      },
      {
        path: 'journals',
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
    next('/')
  } else {
    next()
  }
})

export default router