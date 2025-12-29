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

const savedTheme = localStorage.getItem('theme') || 'light';

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: savedTheme,
    themes:{
      light: {
        colors: {
          background: '#ffffffff', 
        }
      },
      dark:{
        colors:{
          'primary-darken-1': '#1D5C90'
        }
      }
    }
  },
  components: {
    VIconBtn,
  },
})
