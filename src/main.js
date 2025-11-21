/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'

const app = createApp(App)
registerPlugins(app)
app.mount('#app')

//run axe-core to detect accessibility issues
if (import.meta.env.MODE === 'development') {
    // Delay to let Vuetify fully render
    setTimeout(async () => {
        const axe = (await import('axe-core')).default
        axe.run(document.body, {}, (err, results) => {
            if (err) throw err
            console.log('Accessibility violations:', results.violations)
        })
    }, 3000) // 1.5s delay ensures Vuetify has rendered
}