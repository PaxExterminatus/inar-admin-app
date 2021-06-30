<template>
  <div class="form-component">

    <template v-if="input">
      <div class="input-line">
        <label for="name">Name</label>
        <InputText id="name" v-model="input.name"/>
      </div>

      <div class="input-line">
        <label for="polygons">Maximum number of polygons</label>
        <InputText id="polygons" type="number" v-model="input.props.max_polygons"/>
      </div>

      <div class="input-line">
        <label for="size">Max file size</label>
        <InputText id="size" type="number" v-model="input.props.max_size"/>
      </div>
    </template>

  </div>
</template>

<script>
import InputText from 'primevue/inputtext'

export default {
  components: {
    InputText,
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
