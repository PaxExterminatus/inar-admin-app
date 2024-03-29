<template>
  <DataTable class="storage-files p-datatable-sm"
             :value="docs" :paginator="true"
             :rows="10"
             :totalRecords="pagination.total"
             :lazy="true"
             @page="onPage($event)"
             v-model:first="pagination.first"
  >
<!--    <Column field="parent" header="Folder" v-if="showDir">-->
<!--      <template #body="slotProps">-->
<!--        <Dir :dir="slotProps.data.parent"/>-->
<!--      </template>-->
<!--    </Column>-->

    <Column headerClass="column-state" bodyClass="column-state">
      <template #body="slotProps">
        <div class="docs-state-column">
          <template v-if="slotProps.data.download">
            <i class="pi pi-cloud" v-tooltip="'File available'" style="color: darkgreen"/>
          </template>

          <template v-else>
            <i class="pi pi-cloud" v-tooltip="'The model file is not attached or is not available'" style="color: red"/>
          </template>

          <template v-if="slotProps.data.size > asDir(slotProps.data.parent).maxSize">
            <i class="pi pi-exclamation-triangle"
               v-tooltip="'File larger than budget for this type of asset'"
               style="color: darkorange"
            />
          </template>
        </div>
      </template>
    </Column>

    <Column field="name" header="Name"></Column>

    <Column field="preview" header="Preview" headerClass="column-preview" bodyClass="column-preview-body">
      <template #body="slotProps">
        <img class="product-image" :title="slotProps.data.name" :alt="slotProps.data.name" :src="slotProps.data.props.cover"/>
      </template>
    </Column>

    <Column field="polygons" header="Polygons">
      <template #body="slotProps">
        {{ slotProps.data.props.polygons  }}
      </template>
    </Column>

    <Column field="size" header="Size">
      <template #body="slotProps">
        {{ sizeFormat(slotProps.data.props.size)  }}
      </template>
    </Column>

    <Column field="type" header="Type">
      <template #body="slotProps">
        {{ capitalize(slotProps.data.props.type) }}
      </template>
    </Column>

    <Column header="Actions">
      <template #body="slotProps">
        <div class="actions">
          <SplitButton :model="shareMenu(slotProps.data)" v-tooltip.top="'Copy download URL'" :icon="copyIcon" @click="share(slotProps.data)" :disabled="!slotProps.data.download"/>
          <Button v-tooltip.top="'Edit'" icon="pi pi-pencil" @click="edit(slotProps.data)"/>
          <Button v-tooltip.top="'Delete'" icon="pi pi-trash" @click="remove(slotProps.data)"/>
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<script>
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import SplitButton from 'primevue/splitbutton'
import FileSize from '../../services/FileSize'
import { Dir } from '../../elements'

export default {
  components: {
    Column,
    DataTable,
    Button,
    Paginator,
    SplitButton,
    Dir,
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
    dirCol: {
      type: Boolean,
      default: false,
    },
    paginator: {
      type: Object,
      default: () => ({}),
    },
    showDir: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      state: {
        copied: false,
      },
    };
  },

  computed: {
    copyIcon() {
      return this.state.copied ? 'pi pi-check' : 'pi pi-copy';
    },
    /**
     * @return {{
     *   page: number
     *   first: number
     *   total: number
     *   per: number
     * }|Object}
     */
    pagination() {
      return this.paginator;
    },
  },

  methods: {
    /**
     * @param {StorageDir} dir
     * @return {StorageDir}
     */
    asDir(dir) {
      return dir;
    },
    /**
     * @param {StorageDoc} doc
     */
    shareMenu(doc) {
      return [
        {
          label: 'Download',
          icon: 'pi pi-external-link',
          url: doc.download,
          target: '_blank',
        },
      ];
    },
    /**
     * @param {StorageDoc} doc
     */
    share(doc) {
      this.copyTextToClipboard(doc.download);
      this.$emit('share', doc);
    },
    edit(doc) {
      this.$emit('edit', doc);
    },
    remove(doc) {
      this.$emit('remove', doc);
    },
    sizeFormat(bytes) {
      return FileSize.inBytes(bytes).format();
    },
    /**
     * @param {{
     *   page: number
     *   pageCount: number
     *   rows: number
     *   sortField: any
     *   sortOrder: any
     *   originalEvent: Object
     *   multiSortMeta: Object
     *   first: number
     *   filters: Object
     * }} pageEvent
     */
    onPage(pageEvent) {
      this.pagination.page = pageEvent.page + 1;
      this.pagination.per = pageEvent.rows;
      this.$emit('request', pageEvent);
    },
    capitalize(s) {
      return s[0].toUpperCase() + s.slice(1);
    },
    copyTextToClipboard(text) {
      navigator.clipboard.writeText(text)
      .then(() => {
        this.state.copied = true;
        setTimeout(() => {
          this.state.copied = false;
        }, 1000);
      }, (e) => {
        setTimeout(() => {
          this.state.copied = false;
        }, 1000);
      });
    }
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
