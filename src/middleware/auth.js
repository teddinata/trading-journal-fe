// src/middleware/auth.js
export const authMiddleware = (router) => {
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    const isAuthRoute = to.matched.some(record => record.meta.requiresAuth)
    
    if (isAuthRoute && !token) {
      next('/login')
    } else if (to.path === '/login' && token) {
      next('/')
    } else {
      next()
    }
  })
}