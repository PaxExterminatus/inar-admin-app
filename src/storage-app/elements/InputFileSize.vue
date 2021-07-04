<template>
  <div>
    value: {{ modelValue }}
  </div>
  <div class="p-inputgroup">
    <span v-tooltip.top="capitalize(selectedUnitName)" class="p-inputgroup-addon hoverable" v-if="selectedUnit" @click="showSelect">
      {{ selectedUnit.short }}
    </span>

    <div class="p-inputgroup" v-show="state.showSelect">
      <Dropdown  v-model="selectedUnit" :options="unitSystem.units" optionLabel="short" @change="hideSelect" ref="selectedUnit"/>
      <span class="p-inputgroup-addon hoverable" v-if="selectedUnit" @click="hideSelect">
        <i class="pi pi-times"/>
      </span>
    </div>

    <InputNumber v-show="!state.showSelect" v-model="input" showButtons :min="0" mode="decimal" />
  </div>
</template>

<script>
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber'
import { FileSize, unitSystem } from '../services/FileSize'

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
  },

  data() {
    return {
      unitSystem: unitSystem,
      /** @type {{name: string, plural: string, prefix: string, short: string, factor: number, power: number}} */
      selectedUnit: unitSystem.units[2],

      state: {
        showSelect: false,
      },
    };
  },


  computed: {
    input: {
      get() {
        return this.modelValue / Math.pow(this.selectedUnit.factor, this.selectedUnit.power);
      },
      set(val) {
        const sizeInBytes = val * Math.pow(this.selectedUnit.factor, this.selectedUnit.power);
        this.$emit("update:modelValue", sizeInBytes);
      },
    },
    selectedUnitName() {
      return this.selectedUnit.name;
    },
  },

  methods: {
    showSelect() {
      this.state.showSelect = true;

      setTimeout(() => {
        this.$refs.selectedUnit.show();
      }, 100);
    },
    hideSelect() {
      this.state.showSelect = false;
    },
    capitalize(s) {
      return s[0].toUpperCase() + s.slice(1);
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
