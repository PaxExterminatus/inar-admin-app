<template>
  <DataTable class="storage-files p-datatable-sm" :value="docs">
    <Column headerClass="column-state" bodyClass="column-state">
      <template #body="slotProps">
        <i class="pi pi-cloud"/>
      </template>
    </Column>

    <Column field="name" header="Name"></Column>

    <Column field="preview" header="Preview" headerClass="column-preview" bodyClass="column-preview-body">
      <template #body="slotProps">
        <img :src="slotProps.data.props.cover" class="product-image"/>
      </template>
    </Column>

    <Column field="size" header="Size">
      <template #body="slotProps">
        {{ sizeFormat(slotProps.data.props.size)  }}
      </template>
    </Column>

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
import FileSize from '../services/FileSize'

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
    sizeFormat(bytes) {
      return FileSize.inBytes(bytes).format();
    },
  },
}
</script>

<style lang="sass">
.storage-files
  .column-state
    width: 70px
    text-align: center !important
  .column-preview
    width: 200px
    .p-column-title
      width: 100%
      text-align: center
  .column-preview-body
    display: flex
    justify-content: center
</style>
