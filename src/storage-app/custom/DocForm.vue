<template>
  <div class="form-component doc-form">

    <TabView>
      <TabPanel header="Model">

        <InputFile @file="select" :errors="errors" v-model="doc.name" @validate="validateFile"/>

        <ErrorLine class="input-line" :errors="errors['item.props.size']">
          <InputFileSize v-model="doc.props.size" :disabled="!!doc.file" :sync="!doc.file">
            File size
            <Tag severity="info" icon="pi pi-info-circle" class="p-m-lg-auto" v-tooltip.top="'File size limit'" :value="fileSize(dir.maxSize).format()"/>
          </InputFileSize>

          <template #tags>
            <template v-if="doc.props.size > dir.maxSize">
              <Tag v-tooltip.top="'File larger than budget for this type of asset'" icon="pi pi-exclamation-triangle" severity="warning" :value="fileSize(dir.maxSize).format()"/>
            </template>
          </template>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['item.props.polygons']">
          <label for="polygons">
            Polygons
            <Tag severity="info" icon="pi pi-info-circle" class="p-m-lg-auto" v-tooltip.top="'Polygons limit'" :value="dir.maxPolygons"/>
          </label>
          <InputNumber id="polygons" v-model="doc.props.polygons" showButtons/>

          <template #tags>
            <template v-if="doc.props.polygons > dir.maxPolygons">
              <Tag v-tooltip.top="'Too many polygons for this type of asset'" icon="pi pi-exclamation-triangle" severity="warning" :value="dir.maxPolygons"/>
            </template>
          </template>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['item.props.type']">
          <label for="polygons">Type</label>
          <Dropdown v-model="doc.props.type" :options="typeOptions" optionLabel="name" optionValue="code"/>
        </ErrorLine>
      </TabPanel>

      <TabPanel header="Cover">

        <ErrorLine class="input-line" :errors="errors['item.props.preview'] || errors['item.preview']">
          <label for="url">Preview</label>
          <div class="input-image">
            <div class="product-preview" >
              <img class="image-box" v-if="preview || doc.props.preview" :src="preview || doc.props.cover" alt="Model Cover">
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

        <ErrorLine class="input-line" :errors="errors['item.props.url']">
          <div class="input-image">
            <div class="product-preview" >
              <img class="image-box" v-if="doc.props.url" :src="doc.props.url" alt="Model Cover">
              <div class="image-box" v-else>
                <i class="pi pi-image"/>
              </div>
            </div>
            <div class="actions">
              <template v-if="doc.props.url">
                <Button class="to-right" title="Select file" icon="pi pi-times" @click="clearUrl"/>
              </template>
            </div>
          </div>

          <label for="url">URL</label>
          <InputText id="url" v-model="doc.props.url"/>
        </ErrorLine>
      </TabPanel>

      <TabPanel header="Description">
        <ErrorLine class="input-line" :errors="errors['item.props.description']">
          <label for="description">Description</label>
          <Textarea id="description" v-model="doc.props.description" :autoResize="true"/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['item.props.note']">
          <label for="note">Note</label>
          <InputText id="note" v-model="doc.props.note"/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['item.props.topic']">
          <label for="Topic">Topic</label>
          <InputText id="topic" v-model="doc.props.topic"/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['item.props.thesis']">
          <label for="Thesis">Thesis</label>
          <InputText id="thesis" v-model="doc.props.thesis"/>
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
    doc() {
      return this.inp;
    },
    /** @returns {StorageDir|Object} */
    dir() {
      return this.inp.parent;
    },
    size() {
      return FileSize.inBytes(this.doc.props.size).size();
    },
  },

  methods: {
    validateFile(hasError) {
      this.$emit('validate', hasError);
    },

    fileSize(bytes) {
      return FileSize.inBytes(bytes);
    },
    cancel() {
      this.preview = null;
      this.doc.previewDetach();
    },

    clearUrl() {
      this.doc.props.url = null;
    },

    storagePreviewInputOpen() {
      this.$refs.storagePreviewInput.click();
    },

    storagePreviewInputChange() {
      const file = this.$refs.storagePreviewInput.files[0];
      this.preview = URL.createObjectURL(file);
      this.doc.previewAttach(file);
    },

    /**
     * @param {File} file
     */
    select(file) {
      this.doc.file = file;
      this.doc.name = file.name;
      this.doc.props.size = file.size;
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