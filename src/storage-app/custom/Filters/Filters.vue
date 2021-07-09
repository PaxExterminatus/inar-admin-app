<template>
  <Dialog class="filters-components" header="Search" v-model:visible="st.state.show" position="right">
    <label>File Name</label>
    <div class="p-inputgroup">
      <InputText placeholder="Name" v-model="st.input.name" @keyup.enter="search"/>
    </div>

    <label>File Extension</label>
    <div class="p-inputgroup">
      <InputText placeholder="Extension" v-model="st.input.extension" @keyup.enter="search"/>
    </div>

    <label>Type</label>
    <div class="p-inputgroup">
      <SelectType optionLabel="name" optionValue="code" placeholder="Type" v-model="st.input.type" :options="st.value.type"/>
    </div>

    <label>File Size</label>
    <InputMinMax :input="st.input.size" @keyup.enter="search" help="File size in MB" icon="pi-file"/>

    <label>Polygons Count</label>
    <InputMinMax :input="st.input.polygon" @keyup.enter="search" help="Number of polygons" icon="pi-clone"/>

    <label>
      <ToggleButton class="action" v-model="st.input.exceeded" onIcon="pi pi-exclamation-triangle" offIcon="pi pi-exclamation-triangle"/>
      <span class="p-ml-2">Exceeded file size</span>
    </label>

    <div class="actions">
      <Button class="search-action" type="button" label="Search" icon="pi pi-search" v-bind="st.state.search" @click="search"/>
      <Button class="p-button-secondary p-button-text" icon="pi pi-filter-slash" @click="clear" v-tooltip.left="'Clear'"/>
    </div>

    <div class="actions2">
      <ToggleButton class="action" onIcon="pi pi-cog" offIcon="pi pi-cog" v-model="st.state.dynamic" v-tooltip.left="'Send request automatically after changing filter value'"/>
    </div>
  </Dialog>
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
import Dialog from 'primevue/dialog'

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
    Dialog,
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
      this.st.searchStart();
      this.$emit('search');
    },
    filter() {
      this.st.filterStart();
      this.$emit('filter');
    },
    clear() {
      this.st.clear();
    },
  },
}
</script>

<style lang="sass">
.filters-components
  height: 100vh
  width: 300px
  padding: 0 !important
  background-color: #FFF
  .p-dialog-content
    height: 100%
    display: flex
    flex-direction: column
  .actions2
    margin: auto 0 5px 0
    display: flex
    justify-content: flex-end
  label
    margin: 5px 0
    display: flex
    align-items: center
  .p-multiselect
    width: 200px
  .search-action
    flex: 1
</style>
