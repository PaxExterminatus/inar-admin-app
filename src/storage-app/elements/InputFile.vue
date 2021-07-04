<template>
  <ErrorLine class="input-file input-line" :errors="errors['name'] || errors['file']">

    <label for="name">Name</label>

    <div class="p-inputgroup">
      <Button title="Select file" icon="pi pi-folder-open" @click="storageFileInputOpen"/>
      <InputText id="name" v-model="input.name"/>
      <template v-if="extension">
        <span class="p-inputgroup-addon">.{{extension}}</span>
      </template>
    </div>
    <div class="actions">
      <template v-if="extensionError">
        <Tag v-tooltip.top="'Invalid file extension, expected .obj or .fbx'" icon="pi pi-exclamation-triangle" severity="danger" :value="`.${extension}`"></Tag>
      </template>
    </div>

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
      input: {
        name: this.modelValue,
      },
    };
  },

  mounted() {
    this.splitFilename(this.modelValue);
  },

  computed: {
    extensionError() {
      if (!this.extension) return false;
      return !['obj', 'fbx'].includes(this.extension);
    },
  },

  watch: {
    modelValue(filename) {
      this.splitFilename(filename);
    }
  },

  methods: {
    splitFilename(filename) {
      console.log('splitFilename', filename);
      const name = filename.split('.').slice(0, -1).join('.');
      this.input.name = name;
      this.filename = name;
      this.extension = filename.split('.').pop();
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
