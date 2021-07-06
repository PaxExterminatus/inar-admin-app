<template>
  <div class="form-component doc-form">
    <TabView>

      <TabPanel header="Model">

        <InputFile @file="select" :errors="errors" v-model="input.name" @validate="$emit('validate', $event)"/>

        <ErrorLine class="input-line" :errors="errors['props.size']">
          <InputFileSize v-model="input.props.size" :disabled="!!input.file" :sync="!input.file">
            <Tag severity="info" class="p-m-lg-auto" v-tooltip.top="'File size limit'" :value="fileSize(dir.maxSize).format()"/>
          </InputFileSize>

          <template #tags>
            <template v-if="input.props.size > dir.maxSize">
              <Tag v-tooltip.top="'File larger than budget for this type of asset'" icon="pi pi-exclamation-triangle" severity="warning" :value="fileSize(dir.maxSize).format()"/>
            </template>
          </template>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.polygons']">
          <label for="polygons">
            Polygons
            <Tag severity="info" class="p-m-lg-auto" v-tooltip.top="'Polygons limit'" :value="dir.maxPolygons"/>
          </label>
          <InputNumber id="polygons" v-model="input.props.polygons" showButtons/>

          <template #tags>
            <template v-if="input.props.polygons > dir.maxPolygons">
              <Tag v-tooltip.top="'Too many polygons for this type of asset'" icon="pi pi-exclamation-triangle" severity="warning" :value="dir.maxPolygons"/>
            </template>
          </template>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.type']">
          <label for="polygons">Type</label>
          <Dropdown v-model="input.props.type" :options="typeOptions" optionLabel="name" optionValue="code"/>
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
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import TabView from 'primevue/tabview'
import Dropdown from 'primevue/dropdown'
import TabPanel from 'primevue/tabpanel'
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { ErrorLine, InputFileSize, InputFile } from '../elements'
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
    InputFile,
    Dropdown,
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

    validation: {
      extension: '',
    },

    currentDir: {
      type: Object,
      default: () => ({}),
    },

    progress: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      preview: null,

      typeOptions: [
        {code: 'posed', name: 'Posed'},
        {code: 'rigged', name: 'Rigged'},
        {code: 'animated', name: 'Animated'},
      ],
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

    /**
     * @param {File} file
     */
    select(file) {
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