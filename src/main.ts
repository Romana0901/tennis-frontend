import { createApp } from 'vue'

import App from './App.vue'
import router from './routes'
import { registerPlugins } from './plugins'

import '@fontsource/roboto/100.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto/900.css'

const app = createApp(App).use(router)

registerPlugins(app)

app.mount('#app')
