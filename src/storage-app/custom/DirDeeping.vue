<template>
  <div class="dir-deeping">
    <Dir name="Storage" :selected="true" :loading="true" :root="true" @click.native="root">
      <i class="folder-icon pi pi-cloud"/>
    </Dir>
  </div>
</template>

<script>
import Dir from '../elements/Dir';

export default {
  components: {
    Dir,
  },

  methods: {
    root() {
      this.$emit('root');
    },
  },
}
</script>
