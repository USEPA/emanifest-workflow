/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import router from '@/router'
import App from './App.vue'
import { configure } from 'vue-gtag'

import 'unfonts.css'

const app = createApp(App)
registerPlugins(app)

if (import.meta.env.PROD) {
  configure({
    tagId: import.meta.env.VITE_GA_MEASUREMENT_ID,
    pageTracker: { router,
      
     }
  })
}

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // Dynamically load the dev-only axe plugin, then mount
  import('@/plugins/axe.dev')
    .then(({ default: axePlugin }) => {
      app.use(axePlugin, { router })
      app.mount('#app')
    })
    .catch(error => {
      console.error('Failed to load axe plugin', error)
      app.mount('#app')
    })
} else {
  app.mount('#app')
}