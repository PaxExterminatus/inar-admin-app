<template>
  <ErrorLine class="input-file input-line" :errors="errors['name'] || errors['file']">

    <label for="name">File | Filename</label>
    <div class="p-inputgroup">
      <Button title="Select file" icon="pi pi-folder-open" @click="storageFileInputOpen"/>
      <InputText id="name" v-model="inputFilename"/>
      <span class="p-inputgroup-addon">.{{extension}}</span>
    </div>

    <template #tags v-if="extensionError">
      <Tag v-tooltip.top="'Invalid file extension, expected .obj or .fbx'" icon="pi pi-exclamation-triangle" severity="danger" :value="`.${extension}`"></Tag>
    </template>

    <input type="file" ref="storageFileInput" hidden @change="storageFileInputChange">
  </ErrorLine>
</template>

<script>
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import { ErrorLine } from '../elements'

export default {
  components: {
    ErrorLine,
    Button,
    InputText,
    Tag,
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
      filename: '',
      extension: '',
    };
  },


  mounted() {
    this.splitFilename(this.modelValue);
  },

  computed: {
    extensionError() {
      if (!this.modelValue) return false;
      const hasError = !['obj', 'fbx'].includes(this.extension);
      this.$emit('validate', hasError);
      return hasError;
    },

    inputFilename: {
      get() {
        return this.modelValue;
      },
      set(filename) {
        this.splitFilename(filename);
        this.$emit('update:modelValue', filename);
      },
    },
  },

  watch: {
    modelValue(filename) {
      console.log('watch.modelValue');
      this.splitFilename(filename);
    }
  },

  methods: {
    splitFilename(filename) {
      const name = filename.split('.').slice(0, -1).join('.');
      this.name = name;
      this.filename = name;
      this.extension = filename.split('.').length > 1 ? filename.split('.').pop() : filename.split('.')[1] || '';
    },

    storageFileInputOpen() {
      this.$refs.storageFileInput.click();
    },

    storageFileInputChange() {
      const file = this.$refs.storageFileInput.files[0];
      this.splitFilename(file.name);
      this.$emit('select', file);
    },
  },
}
</script>

<style lang="sass">
.input-file
  width: 100%
  .p-inputgroup-addon.invalid
    color: darkred
</style>
