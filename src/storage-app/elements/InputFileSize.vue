<template>
  <div>
    <label>
      Size {{ sizeFormat }}
      <slot></slot>
    </label>
    <div class="p-inputgroup">
      <div class="p-inputgroup-addon" v-tooltip.top="'Megabytes'">MB</div>
      <InputNumber v-model="sizeInput" showButtons :min="0" :disabled="disabled"/>
    </div>

  </div>

</template>

<script>
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber'
import { FileSize } from '../services/FileSize'

export default {
  components: {
    Dropdown,
    InputNumber,
  },

  props: {
    modelValue: {
      type: Number,
      default: 0,
    },
    sync: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    sizeInput: {
      get() {
        return this.modelValue / Math.pow(1024, 2);
      },
      set(val) {
        const sizeInBytes = val * Math.pow(1024, 2);
        this.$emit('update:modelValue', sizeInBytes);
      },
    },
    sizeFormat() {
      const size = FileSize.inBytes(this.modelValue).size()
      return size.order === 0 || size.order === 2 ? '' : `(or ${size.value}${size.unit})`;
    },
  },
}
</script>

<style lang="sass">
.p-inputgroup-addon.hoverable
  cursor: pointer
  &:hover
    opacity: .8
</style>
