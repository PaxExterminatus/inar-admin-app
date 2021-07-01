<template>
  <div class="dirs">
    <slot></slot>
    <template v-for="dir in dirs">
      <Dir :dir="dir"/>
    </template>
  </div>
</template>

<script>
import Dir from '../elements/Dir'

export default {
  components: {
    Dir,
  },
  props: {
    dirs: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
