<template>
  <div class="docs-state-column">
    <template v-if="slotProps.data.download">
      <i class="pi pi-cloud" v-tooltip="'File available'" style="color: darkgreen"/>
    </template>

    <template v-else>
      <i class="pi pi-cloud" v-tooltip="'The model file is not attached or is not available'" style="color: red"/>
    </template>

    <template v-if="false">
      <i class="pi pi-exclamation-triangle"
         v-tooltip="'File larger than budget for this type of asset'"
         style="color: darkorange"
      />
    </template>
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

}
</script>

<style lang="sass">

</style>