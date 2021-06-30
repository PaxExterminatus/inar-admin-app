<template>
  <div class="dirs">
    <template v-for="dir in dirs">
      <Dir :name="dir.name"/>
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
