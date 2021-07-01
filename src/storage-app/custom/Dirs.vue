<template>
  <div class="dirs">
    <slot></slot>
    <template v-for="dir in dirs">
      <Dir :dir="dir" @select="select" @open="open"/>
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

  computed: {
    /** @return {StorageDir[]} */
    folders() {
      return this.dirs;
    }
  },

  methods: {
    /** @param {StorageDir} dir */
    select(dir) {
      this.folders.forEach(dir => dir.unSelect())
      dir.select();
      this.$emit('select', dir);
    },

    /** @param {StorageDir} dir */
    open(dir) {
      this.select(dir);
      this.$emit('open', dir);
    },
  },
}
</script>
