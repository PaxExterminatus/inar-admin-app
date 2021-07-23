<template>
  <div class="form-component">
    <ErrorLine class="input-line" :errors="errors['item.name']">
      <label for="name">Name</label>
      <InputText id="name" v-model="input.name"/>
    </ErrorLine>

    <ErrorLine class="input-line" :errors="errors['item.props.max_size']">
      <InputFileSize v-model="input.props.max_size">
        Maximum file size
      </InputFileSize>
    </ErrorLine>

    <ErrorLine class="input-line" :errors="errors['item.props.max_polygons']">
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
