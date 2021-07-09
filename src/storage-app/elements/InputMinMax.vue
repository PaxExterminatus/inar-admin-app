<template>
  <div class="input-min-max p-inputgroup">
    <InputNumber class="input-min" v-model="input.min" v-tooltip.top="'From'"/>
    <InputNumber class="input-max" v-model="input.max" v-tooltip.top="'To'"/>
  </div>
</template>

<script>
import InputNumber from 'primevue/inputnumber'

export default {

  components: {
    InputNumber,
  },

  props: {
    input: {
      type: Object,
      default: () => ({}),
    },
    help: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
  },

  computed: {
    /** @return {{min: number, max: number}|Object} */
    inp() {
      return this.input;
    },
  },

}
</script>

<style lang="sass">
.input-min-max
  display: flex
  width: auto
  .input-min, .input-max
    width: 100px
  input
    max-width: 100%
</style>