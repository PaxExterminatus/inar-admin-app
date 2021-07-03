<template>
  <div class="form-component">
    <ErrorLine class="input-line" :errors="errors['name']">
      <label for="name">Name</label>
      <InputText id="name" v-model="input.name"/>
    </ErrorLine>

    <ErrorLine class="input-line" :errors="errors['props.max_size']">
      <label for="size">Maximum file size</label>
      <InputText id="size" type="number" v-model="input.props.max_size"/>
    </ErrorLine>

    <ErrorLine class="input-line" :errors="errors['props.max_polygons']">
      <label for="polygons">Maximum number of polygons</label>
      <InputText id="polygons" type="number" v-model="input.props.max_polygons"/>
    </ErrorLine>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext'
import { ErrorLine } from '../elements'

export default {
  components: {
    InputText,
    ErrorLine,
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
