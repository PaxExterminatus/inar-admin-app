<template>
  <div class="form-component doc-form">
    <TabView>
      <TabPanel header="Model">
        <div class="actions">
          <input type="file" ref="storageFileInput" hidden @change="storageFileInputChange">
          <Button title="Select file" icon="pi pi-folder-open" @click="storageFileInputOpen"/>
          <template v-if="input.file">
            <span class="file-name">{{ input.file.name }}</span>
          </template>
        </div>

        <ErrorLine class="input-line" :errors="errors['name']">
          <label for="name">Name</label>
          <InputText id="name" v-model="input.name"/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.size']">
          <label for="size">Size</label>
          <InputNumber id="size" v-model="input.props.size" showButtons/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.polygons']">
          <label for="polygons">Polygons</label>
          <InputNumber id="polygons" v-model="input.props.polygons" showButtons/>
        </ErrorLine>
      </TabPanel>

      <TabPanel header="Cover">
        <div class="actions">
          <input type="file" ref="storagePreviewInput" hidden @change="storagePreviewInputChange">
          <Button title="Select file" icon="pi pi-folder-open" @click="storagePreviewInputOpen"/>
        </div>

        <ErrorLine class="input-line" :errors="errors['props.preview']">
          <label for="preview">Preview</label>
          <InputText id="preview" v-model="input.props.preview"/>
        </ErrorLine>

        <Divider :align="'center'">
          <span class="p-tag">OR</span>
        </Divider>

        <ErrorLine class="input-line" :errors="errors['props.url']">
          <label for="url">URL</label>
          <InputText id="url" v-model="input.props.url"/>
        </ErrorLine>
      </TabPanel>

      <TabPanel header="Description">
        <ErrorLine class="input-line" :errors="errors['props.description']">
          <label for="description">Description</label>
          <Textarea id="description" v-model="input.props.description" :autoResize="true"/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.note']">
          <label for="note">Note</label>
          <InputText id="note" v-model="input.props.note"/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.topic']">
          <label for="Topic">Topic</label>
          <InputText id="topic" v-model="input.props.topic"/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.thesis']">
          <label for="Thesis">Thesis</label>
          <InputText id="thesis" v-model="input.props.thesis"/>
        </ErrorLine>
      </TabPanel>

    </TabView>
  </div>
</template>

<script>
import Divider from 'primevue/divider'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import { ErrorLine } from '../elements'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'

export default {
  components: {
    InputText,
    Textarea,
    TabPanel,
    TabView,
    ErrorLine,
    Divider,
    Button,
    InputNumber,
  },

  props: {
    inp: {
      type: Object,
      default: () => ({}),
    },

    errors: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    /** @returns {StorageDoc|Object} */
    input() {
      return this.inp;
    },
  },

  methods: {
    storagePreviewInputOpen() {
      this.$refs.storagePreviewInput.click();
    },

    storagePreviewInputChange() {
      const file = this.$refs.storagePreviewInput.files[0];
      this.input.props.preview = file.name;
    },

    storageFileInputOpen() {
      this.$refs.storageFileInput.click();
    },

    storageFileInputChange() {
      const file = this.$refs.storageFileInput.files[0];
      this.input.file = file;
      this.input.name = file.name;
      this.input.props.size = file.size;
    },
  },
}
</script>

<style lang="sass">
.doc-form
  .file-name
    display: flex
    align-items: center
</style>