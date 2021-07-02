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
        <img :src="slotProps.data.props.cover" class="product-image"/>
      </template>
    </Column>

    <Column field="size" header="Size"></Column>

    <Column header="Actions">
      <template #body="slotProps">
        <div class="actions">
          <Button title="Edit" icon="pi pi-pencil" @click="edit(slotProps.data)"/>
          <Button title="Delete" icon="pi pi-trash" @click="remove(slotProps.data)"/>
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'

export default {
  components: {
    Column,
    DataTable,
    Button,
  },

  props: {
    docs: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    edit(doc) {
      this.$emit('edit', doc);
    },
    remove(doc) {
      this.$emit('remove', doc);
    },
  },
}
</script>
