<template>
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

    <InputNumber v-show="!state.showSelect" v-model="input" showButtons :min="0" mode="decimal" :minFractionDigits="2"/>
  </div>
</template>

<script>
import InputNumber from 'primevue/inputnumber'
import { FileSize, unitSystem } from '../services/FileSize'
import Dropdown from 'primevue/dropdown';

export default {
  components: {
    InputNumber,
    Dropdown,
  },

  props: {
    size: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      unitSystem: unitSystem,
      /** @type {{prefix: string, power: number, short: string}} */
      selectedUnit: unitSystem.units[1],
      state: {
        showSelect: false,
      },
    };
  },

  computed: {
    input: {
      get() {
        return this.size / Math.pow(unitSystem.factor, this.selectedUnit.power);
      },
      set() {
        this.$emit('input');
      },
    },
    selectedUnitName() {
      return this.selectedUnit.prefix + this.unitSystem.unit.plural;
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
