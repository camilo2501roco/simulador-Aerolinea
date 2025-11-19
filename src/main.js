import { createApp } from 'vue'
import App from './App.vue'
import { Quasar } from 'quasar'


import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/fontawesome-v6/fontawesome-v6.css'


import 'quasar/src/css/index.sass'

const app = createApp(App)

app.use(Quasar, {
  plugins: {},
})

app.mount('#app')