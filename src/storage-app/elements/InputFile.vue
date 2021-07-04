<template>
  <ErrorLine class="input-file input-line" :errors="errors">
    <div class="actions">
      <input type="file" ref="storageFileInput" hidden @change="storageFileInputChange">
      <Button title="Select file" icon="pi pi-folder-open" @click="storageFileInputOpen"/>
      <template v-if="filename">
        <span class="file-name">{{ filename }}</span>
      </template>
    </div>
  </ErrorLine>
</template>

<script>
import { ErrorLine } from '../elements'
import Button from 'primevue/button'

export default {
  components: {
    ErrorLine,
    Button,
  },

  props: {
    errors: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      filename: '',
    };
  },

  methods: {
    storageFileInputOpen() {
      this.$refs.storageFileInput.click();
    },

    storageFileInputChange() {
      const file = this.$refs.storageFileInput.files[0];
      this.filename = file.name;
      this.$emit('select', file);
    },
  },
}
</script>

<style lang="sass">
.input-file
  width: 100%
</style>
