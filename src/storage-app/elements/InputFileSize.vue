<template>
  <div>
    <label>
      <slot></slot>
    </label>
    <div class="p-inputgroup">
      <div class="p-inputgroup-addon" v-tooltip.top="'Megabytes'">MB</div>
      <span class="p-inputnumber p-component p-inputwrapper p-inputwrapper-filled p-inputnumber-buttons-stacked">
        <input class="p-inputtext p-component p-inputnumber-input" v-model="sizeInput" :disabled="disabled">
      </span>
      <div class="p-inputgroup-addon" v-if="sizeFormat">
        {{sizeFormat}}
      </div>
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
        return this.modelValue / (1024 * 1024);
      },
      set(val) {
        if (this.modelValue !== val) {
          const sizeInBytes = val * (1024 * 1024);
          this.$emit('update:modelValue', sizeInBytes);
        }
      },
    },
    sizeFormat() {
      const size = FileSize.inBytes(this.modelValue).size()
      return size.order === 0 ? '' : `${size.value}${size.unit}`;
    },
  },
}
</script>
