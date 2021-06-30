<template>
  <div class="dir-deeping">
    <Dir name="Storage" :selected="true" :loading="true" :root="true" @click.native="root"/>

    <template v-for="(iDir, index) in dirs">
      <Dir :name="iDir.name"/>
    </template>
  </div>
</template>

<script>
import Dir from '../elements/Dir';

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

  methods: {
    root() {
      this.$emit('root');
    },
  },
}
</script>
