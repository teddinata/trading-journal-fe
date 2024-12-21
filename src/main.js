// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { authMiddleware } from './middleware/auth'
import './style.css'
import { Toaster } from 'vue-sonner'

const app = createApp(App)
const pinia = createPinia()

// Apply middleware
authMiddleware(router)

app
  .use(pinia)
  .use(router)
  .component('Toaster', Toaster)
  .mount('#app')

// Add vue-sonner styles manually
const style = document.createElement('style')
style.textContent = `
  .sonner-toast {
    --normal-bg: white;
    --normal-border: #E5E7EB;
    --normal-text: #1F2937;
    --success-bg: #DEF7EC;
    --success-border: #31C48D;
    --success-text: #046C4E;
    --error-bg: #FDE8E8;
    --error-border: #F98080;
    --error-text: #9B1C1C;
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: var(--normal-bg);
    border: 1px solid var(--normal-border);
    border-radius: 8px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 8px;
    transition: all 0.2s ease;
  }

  .sonner-toast[data-type="success"] {
    background: var(--success-bg);
    border-color: var(--success-border);
    color: var(--success-text);
  }

  .sonner-toast[data-type="error"] {
    background: var(--error-bg);
    border-color: var(--error-border);
    color: var(--error-text);
  }
`
document.head.appendChild(style)