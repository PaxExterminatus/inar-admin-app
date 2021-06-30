<template>
  <div class="storage-app">
    <div>{{ kept.docs }}</div>
    <div>{{ kept.files }}</div>
    <div>
      <Button>Save</Button>
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button'
import { storageClient } from '../api/StorageClient'

export default {
  components: {
    Button,
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
