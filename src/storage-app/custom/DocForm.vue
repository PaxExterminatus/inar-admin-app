<template>
  <div class="form-component doc-form">
    <TabView>

      <TabPanel header="Model">
        <ErrorLine class="input-line" :errors="errors['file']">
          <div class="actions">
            <input type="file" ref="storageFileInput" hidden @change="storageFileInputChange">
            <Button title="Select file" icon="pi pi-folder-open" @click="storageFileInputOpen"/>
            <template v-if="input.file">
              <span class="file-name">{{ input.file.name }}</span>
            </template>
          </div>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['name']">
          <label for="name">Name</label>
          <InputText id="name" v-model="input.name"/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.size']">
          <label for="size">Size</label>

          <InputFileSize id="size" :size="input.props.size"/>

          <template #tags>
            <template v-if="input.props.size > dir.maxSize">
              <Tag v-tooltip.top="'File larger than budget for this type of asset'" icon="pi pi-exclamation-triangle" severity="warning" :value="fileSize(dir.maxSize).format()"/>
            </template>
          </template>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.polygons']">
          <label for="polygons">Polygons</label>
          <InputNumber id="polygons" v-model="input.props.polygons" showButtons/>

          <template #tags>
            <template v-if="input.props.polygons > dir.maxPolygons">
              <Tag v-tooltip.top="'Too many polygons for this type of asset'" icon="pi pi-exclamation-triangle" severity="warning" :value="dir.maxPolygons"/>
            </template>
          </template>

        </ErrorLine>
      </TabPanel>

      <TabPanel header="Cover">

        <ErrorLine class="input-line" :errors="errors['props.preview'] || errors['preview']">
          <label for="url">Preview</label>
          <div class="input-image">
            <div class="product-preview" >
              <img class="image-box" v-if="preview || input.props.preview" :src="preview || input.props.cover" alt="Model Cover">
              <div class="image-box" v-else>
                <i class="pi pi-image"/>
              </div>
            </div>

            <div class="actions">
              <input type="file" ref="storagePreviewInput" hidden @change="storagePreviewInputChange">
              <Button title="Select file" icon="pi pi-folder-open" @click="storagePreviewInputOpen"/>
              <template v-if="preview">
                <Button class="to-right" title="Select file" icon="pi pi-times" @click="cancel"/>
              </template>
            </div>
          </div>
        </ErrorLine>

        <Divider :align="'center'">
          <span class="p-tag">OR</span>
        </Divider>

        <ErrorLine class="input-line" :errors="errors['props.url']">
          <div class="input-image">
            <div class="product-preview" >
              <img class="image-box" v-if="input.props.url" :src="input.props.url" alt="Model Cover">
              <div class="image-box" v-else>
                <i class="pi pi-image"/>
              </div>
            </div>
            <div class="actions">
              <template v-if="input.props.url">
                <Button class="to-right" title="Select file" icon="pi pi-times" @click="clearUrl"/>
              </template>
            </div>
          </div>

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
import Tag from 'primevue/tag';
import Divider from 'primevue/divider'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import { ErrorLine, InputFileSize } from '../elements'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import FileSize from '../services/FileSize'


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
    Tag,
    InputFileSize,
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

    currentDir: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      preview: null,
    };
  },

  computed: {
    /** @returns {StorageDoc|Object} */
    input() {
      return this.inp;
    },
    /** @returns {StorageDir|Object} */
    dir() {
      return this.currentDir;
    },
    size() {
      return FileSize.inBytes(this.input.props.size).size();
    },
  },

  methods: {
    fileSize(bytes) {
      return FileSize.inBytes(bytes);
    },
    cancel() {
      this.preview = null;
      this.input.previewDetach();
    },

    clearUrl() {
      this.input.props.url = null;
    },

    storagePreviewInputOpen() {
      this.$refs.storagePreviewInput.click();
    },

    storagePreviewInputChange() {
      const file = this.$refs.storagePreviewInput.files[0];
      this.preview = URL.createObjectURL(file);
      this.input.previewAttach(file);
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