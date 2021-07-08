<template>
  <Toolbar class="filters-components actions-box">
    <template #left>
      <InputText
          class="action"
          placeholder="Name"
          v-model="st.input.name"
          @keyup.enter="search"
      />

      <InputText
          class="action"
          placeholder="Extension"
          v-model="st.input.extension"
          @keyup.enter="search"
      />

      <SelectType
          class="action"
          optionLabel="name"
          optionValue="code"
          placeholder="Type"
          v-model="st.input.type"
          :options="st.value.type"
      />

      <InputMinMax class="action" :input="st.input.size" @keyup.enter="search" help="File size in MB" icon="pi-file"/>
      <InputMinMax class="action" :input="st.input.polygon" @keyup.enter="search" help="Number of polygons" icon="pi-clone"/>

      <ToggleButton
          class="action"
          v-model="st.input.exceeded"
          onIcon="pi pi-exclamation-triangle"
          offIcon="pi pi-exclamation-triangle"
          v-tooltip.top="'Exceeded file size'"
      />
    </template>

    <template #right>
      <template v-if="!st.state.dynamic">
        <Button
            type="button"
            icon="pi pi-search"
            :loading="st.state.loading"
            @click="search"
            v-tooltip.top="'Start searching'"
        />
      </template>

      <ToggleButton
          v-model="st.state.dynamic"
          class="action"
          onIcon="pi pi-cog"
          offIcon="pi pi-cog"
          v-tooltip.top="'Send request automatically after changing filter value'"
      />
    </template>
  </Toolbar>
</template>

<script>
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import Toolbar from 'primevue/toolbar'
import ToggleButton from 'primevue/togglebutton'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Slider from 'primevue/slider'
import InputMinMax from '../../elements/InputMinMax'

export default {
  components: {
    SelectType: MultiSelect,
    Toolbar,
    ToggleButton,
    Button,
    InputText,
    InputNumber,
    Slider,
    InputMinMax,
  },

  props: {
    state: {
      type: Object,
      required: true,
    },
  },

  computed: {
    /** @return {FiltersState|Object} */
    st() {
      return this.state;
    },
  },

  methods: {
    search() {
      this.st.loadingOn();
      this.$emit('search');
    },
  },
}
</script>

<style lang="sass">
.filters-components
  padding: 0 !important
  .p-multiselect
    width: 200px
</style>
