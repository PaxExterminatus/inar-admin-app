<template>
  <DataTable class="storage-files p-datatable-sm" :value="docs">
    <Column headerClass="column-small" bodyClass="column-small">
      <template #body="slotProps">
        <i class="pi pi-cloud"/>
      </template>
    </Column>

    <Column field="name" header="Name"></Column>

    <Column field="preview" header="Preview">
      <template #body="slotProps">
        <img :src="slotProps.data.preview" class="product-image"/>
      </template>
    </Column>

    <Column field="size" header="Size"></Column>

    <Column header="Actions">
      <template #body="slotProps">
        Actions
      </template>
    </Column>
  </DataTable>
</template>

<script>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'

export default {
  components: {
    Column,
    DataTable,
  },

  props: {
    docs: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
