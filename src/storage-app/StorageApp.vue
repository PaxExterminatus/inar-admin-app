<template>
  <div class="storage-app">
    <Dirs :dirs="kept.dirs"/>
  </div>
</template>

<script>
import Dirs from './components/Dirs'
import Button from 'primevue/button'
import { storageClient } from '../api/StorageClient'

export default {
  components: {
    Button,
    Dirs,
  },

  data() {
    return {
      kept: {
        dirs: [],
        docs: [],
      },
    };
  },

  mounted() {
    storageClient.get()
        .then(r => {
          this.kept.dirs = r.data.dirs;
          this.kept.docs = r.data.docs;
        });
  }
}
</script>
