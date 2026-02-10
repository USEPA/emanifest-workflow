/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
import { VIconBtn } from 'vuetify/labs/VIconBtn'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

const savedTheme = localStorage.getItem('theme') || 'light'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: savedTheme,
    themes: {
      light: {
        colors: {
          'background': '#ffffffff',
          'primary-lighten-4': '#C3DAF8',
        },
      },
      dark: {
        colors: {
          'primary-darken-1': '#1D5C90',
          'primary-darken-2': '#123A59',
        },
      },
    },
  },
  components: {
    VIconBtn,
  },
})
