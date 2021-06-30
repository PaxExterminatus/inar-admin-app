<template>
  <div class="form-component">
    <TabView>
      <TabPanel header="General">
        <div class="input-line">
          <label for="name">Name</label>
          <InputText id="name" v-model="input.name"/>
        </div>

        <div class="input-line">
          <label for="preview">Preview</label>
          <InputText id="preview" v-model="input.preview"/>
        </div>

        <div class="input-line">
          <label for="url">URL</label>
          <InputText id="url" v-model="input.url"/>
        </div>

        <div class="input-line">
          <label for="polygons">Polygons</label>
          <InputText type="number" id="polygons" v-model="input.polygons"/>
        </div>

        <div class="input-line">
          <label for="size">Size</label>
          <InputText type="number" id="size" v-model="input.size"/>
        </div>

        <div class="input-line">
          <label for="description">Description</label>
          <Textarea id="description" v-model="input.props.description" :autoResize="true"/>
        </div>
      </TabPanel>

      <TabPanel header="Other">
        <div class="input-line">
          <label for="note">Note</label>
          <InputText id="note" v-model="input.note"/>
        </div>

        <div class="input-line">
          <label for="Topic">Topic</label>
          <InputText id="topic" v-model="input.topic"/>
        </div>

        <div class="input-line">
          <label for="Thesis">Thesis</label>
          <InputText id="thesis" v-model="input.thesis"/>
        </div>
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
import Textarea from 'primevue/textarea'
import InputText from 'primevue/inputtext'
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

export default {
  components: {
    InputText,
    Textarea,
    TabPanel,
    TabView,
  },

  props: {
    inp: {
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
