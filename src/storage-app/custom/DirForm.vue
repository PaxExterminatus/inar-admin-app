<template>
  <div class="form-component">
    <ErrorLine class="input-line" :errors="errors['name']">
      <label for="name">Name</label>
      <InputText id="name" v-model="input.name"/>
    </ErrorLine>

    <ErrorLine class="input-line" :errors="errors['props.max_size']">
      <label>Maximum file size</label>
      <InputFileSize v-model="input.props.max_size"/>
    </ErrorLine>

    <ErrorLine class="input-line" :errors="errors['props.max_polygons']">
      <label for="polygons">Maximum number of polygons</label>
      <InputNumber id="polygons" v-model="input.props.max_polygons" showButtons/>
    </ErrorLine>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { ErrorLine, InputFileSize } from '../elements'

export default {
  components: {
    InputText,
    ErrorLine,
    InputFileSize,
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
    /** @returns {StorageDir|Object} */
    input() {
      return this.inp;
    },
  },
}
</script>
