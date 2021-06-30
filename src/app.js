import { createApp } from 'vue'
// Libraries - PrimeVue
import PrimeVue from 'primevue/config'

// Applications - Storage
import StorageApp from './storage-app/StorageApp'

const storageApp = createApp(StorageApp)

storageApp.config.devtools = true

storageApp
    .use(PrimeVue)
    .mount('#storage-app');
