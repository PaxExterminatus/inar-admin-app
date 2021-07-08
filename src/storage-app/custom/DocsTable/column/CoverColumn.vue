<template>
  <div class="docs-cover-column">
    <img class="product-image" :title="doc.name" :alt="doc.name" :src="doc.props.cover"/>
  </div>
</template>

<script>
export default {

  props: {
    slotProps: {
      type: Object,
      default: () => ({}),
    },
  },

  computed: {
    /** @return {StorageDoc} */
    doc() {
      return this.slotProps.data;
    },
  },
}
</script>
