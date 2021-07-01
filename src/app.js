import { createApp } from 'vue'
// Libraries - PrimeVue
import PrimeVue from 'primevue/config'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'

// Applications - Storage
import StorageApp from './storage-app/StorageApp'

const storageApp = createApp(StorageApp)

storageApp.config.devtools = true

storageApp
    .directive('tooltip', Tooltip)
    .use(PrimeVue)
    .use(ToastService)
    .mount('#storage-app');
