<template>
  <Dir :dir="dir"/>
</template>

<script>
import { Dir } from '../../../elements'

export default {
  components: {
    Dir,
  },

  props: {
    slotProps: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    /** @return {StorageDir} */
    dir() {
      return this.slotProps.data.parent;
    },
  },
}
</script>
