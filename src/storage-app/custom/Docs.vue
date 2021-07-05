<template>
  <DataTable
      class="storage-files p-datatable-sm"
      :value="docs"
      :paginator="true"
      :rows="10"
      :totalRecords="pagination.total"
      :lazy="true"
      @page="onPage($event)"
  >
    <Column headerClass="column-state" bodyClass="column-state">
      <template #body="slotProps">
        <i class="pi pi-cloud"
           v-tooltip="'File available'"
           style="color: darkgreen"
        />
        <template v-if="slotProps.data.props.size > dir.props.max_size">
          <i class="pi pi-exclamation-triangle"
             v-tooltip="'File larger than budget for this type of asset'"
             style="color: darkorange"
          />
        </template>
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
import Paginator from 'primevue/paginator';

export default {
  components: {
    Column,
    DataTable,
    Button,
    Paginator,
  },

  props: {
    docs: {
      type: Array,
      default: () => [],
    },
    dir: {
      type: Object,
      default: () => ({}),
    },
    pagination: {
      type: Object,
      default: () => ({}),
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
    onPage(ev) {
      this.$emit('request', ev);
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
.p-datatable .p-paginator-bottom
  position: sticky
  bottom: 0
</style>
