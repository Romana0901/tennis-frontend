import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1f7a4d',
          secondary: '#245b86',
          accent: '#d99a2b',
          background: '#f5f7f4',
          surface: '#ffffff',
        },
      },
    },
  },
})
