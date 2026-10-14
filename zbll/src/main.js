// must be first: migrates renamed case keys in localStorage before stores load
import "@/helpers/migrate_case_keys"
import { createApp } from 'vue'
import App from './App.vue'

// router
import router from './router'

// Pinia
import { createPinia } from 'pinia'

// bootstrap, icons and theme
import "bootstrap"
import "bootstrap-icons/font/bootstrap-icons.css"
// import 'bootstrap-select/dist/js/bootstrap-select.min';
// the .min.css file for specific Bootstrap theme will be loaded and applied in App.vue

// i18n
import {i18n} from "@/locale"

createApp(App)
  .use(router)
  .use(createPinia())
  .use(i18n)
  .mount('#app')