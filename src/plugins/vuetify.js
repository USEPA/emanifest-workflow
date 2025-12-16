/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { VIconBtn } from 'vuetify/labs/VIconBtn'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'system',
    themes:{
      light: {
        colors: {
          background: '#F5F5F5', 
        }
      }
    }
  },
  components: {
    VIconBtn,
  },
})
