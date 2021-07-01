<template>
  <div class="form-component">
    <TabView>
      <TabPanel header="Model">
        <ErrorLine class="input-line" :errors="errors['name']">
          <label for="name">Name</label>
          <InputText id="name" v-model="input.name"/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.size']">
          <label for="size">Size</label>
          <InputText id="size" type="number" v-model="input.props.size"/>
        </ErrorLine>

        <ErrorLine class="input-line" :errors="errors['props.polygons']">
          <label for="polygons">Polygons</label>
          <InputText type="number" id="polygons" v-model="input.props.polygons"/>
        </ErrorLine>
      </TabPanel>

      <TabPanel header="Preview">
        <ErrorLine class="input-line" :errors="errors['props.preview']">
          <label for="preview">Preview</label>
          <InputText id="preview" v-model="input.props.preview"/>
        </ErrorLine>

        <Divider align="center">
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

      <TabPanel header="File" v-if="input.file">
        <div>
          <span>File name</span>
          <span>{{ input.file.name }}</span>
        </div>

        <div>
          <span>File size</span>
          <span>{{ input.file.size }}</span>
        </div>
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

export default {
  components: {
    InputText,
    Textarea,
    TabPanel,
    TabView,
    ErrorLine,
    Divider,
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
    /** @returns {StorageDir|Object} */
    input() {
      return this.inp;
    },
  },
}
</script>
