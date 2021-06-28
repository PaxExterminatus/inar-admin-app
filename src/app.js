import { createApp } from 'vue'
import StorageApp from './apps/Storage'


const storageApp = createApp(StorageApp)

storageApp
    .mount('#storage-app');
