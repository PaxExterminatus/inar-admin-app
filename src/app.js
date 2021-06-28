import { createApp } from 'vue'
// Libraries - PrimeVue
import PrimeVue from 'primevue/config'
import button from 'primevue/button'

// Applications - Storage
import StorageApp from './applications/Storage'

const storageApp = createApp(StorageApp)

storageApp
    .use(PrimeVue)
    .component('btn', button)
    .mount('#storage-app');
