<template>
  <ErrorLine class="input-file input-line" :errors="errors['name'] || errors['file']">

    <label for="name">File</label>
    <div class="p-inputgroup">
      <input class="p-inputtext p-component" id="name" v-model="inputFilename"/>
      <Button title="Select file" icon="pi pi-folder-open" @click="storageFileInputOpen"/>
    </div>

    <template #tags v-if="extension && extensionError">
      <Tag v-tooltip.top="'Invalid file extension, expected .obj or .fbx'" icon="pi pi-exclamation-triangle" severity="danger" :value="`.${extension}`"></Tag>
    </template>

    <input type="file" ref="storageFileInput" hidden @change="storageFileInputChange">
  </ErrorLine>
</template>

<script>
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import { ErrorLine } from '../elements'

export default {
  components: {
    Tag,
    Button,
    ErrorLine,
  },

  props: {
    modelValue: {
      type: String,
      default: '',
    },
    errors: {
      type: Object,
      default: () => [],
    },
  },

  data() {
    return {
      inputFilename: '',
    };
  },

  mounted() {
    this.inputFilename = this.modelValue;
  },

  watch: {
    inputFilename(filename) {
      this.$emit('update:modelValue', filename);
      const hasError = !['obj', 'fbx'].includes(this.extension);
      this.$emit('validate', hasError);
    },
  },

  computed: {
    extension() {
      return this.getExtension(this.modelValue);
    },
  },

  methods: {
    getExtension(filename) {
      return filename.split('.').length > 1 ? filename.split('.').pop() : filename.split('.')[1] || '';
    },

    storageFileInputOpen() {
      this.$refs.storageFileInput.click();
    },

    storageFileInputChange() {
      const file = this.$refs.storageFileInput.files[0];
      this.inputFilename = file.name;
      this.$emit('file', file);
    },
  },
}
</script>

