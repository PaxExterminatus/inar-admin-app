<template>
  <div class="storage-app">
    <Dirs :dirs="nav.dirs" @select="dirOpenNav">
      <Dir :dir="root" @select="rootSelect"/>
    </Dirs>

    <div class="actions">
      <Button v-tooltip="'Create folder'" icon="pi pi-plus-circle" @click="createNewDir"/>
      <Button v-tooltip.top="'Edit folder'" icon="pi pi-pencil" @click="dirEdit" :disabled="!input.dir.id"/>
      <Button v-tooltip.top="'Delete folder'" icon="pi pi-trash" @click="dirRemoveDialog" :disabled="!input.dir.id"/>
      <Divider layout="vertical"/>
      <Button v-tooltip.top="'Create model'" icon="pi pi-cloud-upload" @click="docCreate" :disabled="!can.makeFile"/>
      <ToggleButton v-tooltip.top="'Search'" onIcon="pi pi-search" offIcon="pi pi-search" v-model="state.filters.state.show"/>
    </div>

    <Dirs :dirs="kept.dirs" @select="dirSelect" @open="dirOpen"/>

    <Filters class="p-my-1" :state="state.filters" @search="docSearch"/>

    <Docs :docs="kept.docs" :dir="dirCurrent" :paginator="pagination.docs" :showDir="!can.makeFile"
          @edit="docEdit" @request="docRequest" @remove="docRemoveDialog"
    />

    <EditDialog :state="state.dirEditor" @save="dirSave">
      <DirForm :inp="input.dir" :errors="errors.dir"/>
    </EditDialog>

    <EditDialog :state="state.docEditor" :progress="state.progress" @save="docSave">
      <DocForm :inp="input.doc" :errors="errors.doc" :progress="state.progress" @validate="state.docEditor.options.disabled = $event"/>
    </EditDialog>

    <EditDialog :state="state.dirRemove" @save="dirRemove">
      <p class="flex-center-align actions p-my-2">
        <span>Do you want to delete this folder?</span>
        <strong>{{ input.dir.name }}</strong>
      </p>
    </EditDialog>

    <EditDialog :state="state.docRemove" @save="docRemove">
      <p class="flex-center-align actions p-my-2">
        <img :src="input.doc.props.cover" class="product-image"/>
        <span>Do you want to delete this model?</span>
        <strong>{{ input.doc.name }}</strong>
      </p>
    </EditDialog>

    <Toast/>
  </div>
</template>

<script>
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import Toast from 'primevue/toast';
import { storageClient } from '../api/StorageClient'
import { EditDialog, EditDialogOptions, EditDialogState } from './elements/EditDialog'
import { DirForm, DocForm, Docs, Dirs, filters } from './custom'
import { StorageDir, StorageDoc } from './entity'
import { Dir } from './elements';
import FileSize from './services/FileSize'
import Column from 'primevue/column'
import ToggleButton from 'primevue/togglebutton'

export default {
  components: {
    Docs,
    Button,
    Dirs,
    EditDialog,
    DirForm,
    DocForm,
    Dir,
    Toast,
    Divider,
    Column,
    ...filters.components,
    ToggleButton,
  },

  data() {
    return {
      root: StorageDir.empty('Storage'),

      kept: {
        dirs: [],
        docs: [],
      },

      state: {
        dirEditor: EditDialogState.make(EditDialogOptions.init().headerSet('Folder editor')),
        docEditor: EditDialogState.make(EditDialogOptions.init().headerSet('Document editor')),
        dirRemove: EditDialogState.make(EditDialogOptions.init().headerSet('Remove folder').yes({label: 'Yes'})),
        docRemove: EditDialogState.make(EditDialogOptions.init().headerSet('Remove model').yes({label: 'Yes'})),
        progress: 0,
        filters: new filters.state.FiltersState(),
      },

      pagination: {
        docs: {
          total: 0,
          first: 0,
          page: 1,
          per: 15,
        },
      },

      input: {
        dir: StorageDir.empty(),
        doc: StorageDoc.empty(),
        original: {
          doc: StorageDir.empty(),
        },
      },

      errors: {
        dir: {},
        doc: {},
      },

      nav: {
        dirs: [],
      },
    };
  },

  mounted() {
    this.rootSelect();
  },

  computed: {
    can() {
      return {
        makeFile: this.dirCurrent && this.dirCurrent.id,
      };
    },

    dirCurrent() {
      this.state.filters.input.search = false;
      return this.nav.dirs.slice(-1).pop();
    },
  },

  watch: {
    /** @param {StorageDir|null} dir */
    dirCurrent(dir) {
      if (dir) this.state.filters.input.dirId = dir.id;
      else this.state.filters.input.dirId = null;
    },
  },

  methods: {
    docSearch() {
      this.pagination.docs.first = 0;
      this.pagination.docs.page = 1;
      this.state.filters.input.dirId = this.dirCurrent ? this.dirCurrent.id || null : null;
      storageClient.docs({
        filter: this.state.filters.input,
        pagination: this.pagination.docs,
      })
          .then(r => {
            this.acceptStorageData(r.data);
          })
          .catch(e => {

          })
          .finally(() => {
            this.state.filters.searchStop();
          });
    },

    docRequest() {
      storageClient.docs({
        parent: this.dirCurrent ? this.dirCurrent.id || null : null,
        filter: this.state.filters.input,
        pagination: this.pagination.docs,
      })
          .then(r => {
            this.acceptStorageData(r.data)
          })
          .catch(e => {

          })
          .finally(() => {

          });
    },

    dirEdit() {
      this.errors.doc = {};
      this.state.dirEditor.open()
      this.input.dir = this.input.dir.copy();
    },
    docRemoveDialog(doc) {
      this.input.doc = doc;
      this.state.docRemove.open();
    },
    docRemove() {
      storageClient.delete({
        id: this.input.doc.id,
        filter: this.state.filters.input,
        pagination: this.pagination.docs,
      })
          .then(r => {
            this.acceptStorageData(r.data);
            this.state.docRemove.close();
          })
          .catch(e => {
            this.$toast.add({severity:'error', summary: e.response.data.message, life: 3000});
          })
          .finally(() => {
            this.state.docRemove.stop();
          });
    },
    /** @param {StorageDoc} doc */
    docEdit(doc) {
      this.errors.doc = {};
      this.input.original.doc = doc;
      this.input.doc = doc.copy();
      this.state.docEditor.open();
    },

    docCreate() {
      this.errors.doc = {};
      this.state.docEditor.open();
      this.input.doc = new StorageDoc.empty({parent: this.dirCurrent});
    },

    /**
     * @param {ProgressEvent} e
     */
    uploadProgress(e) {
      this.state.progress = FileSize.inBytes(e.total).percent(e.loaded);
    },

    docSave() {
      this.errors.doc = {};
      const doc = this.input.doc;
      storageClient.save({
        item: doc,
        filter: this.state.filters.input,
        pagination: this.pagination.docs,
      })
          .then(r => {
            this.acceptStorageData(r.data);

            doc.fill(r.data.item);
            this.input.original.doc.fill(r.data.item)

            if (r.data.parent) doc.parentSet(r.data.parent);

            if (doc.file || doc.preview)
            {
              storageClient.upload(doc, this.uploadProgress, {
                filter: this.state.filters.input,
                pagination: this.pagination.docs,
              })
                  .then(r => {
                    this.state.docEditor.close();
                    this.input.doc = StorageDoc.empty();
                    this.acceptStorageData(r.data);
                  })
                  .catch(e => {
                    this.errors.doc = e.response.data.errors;
                    this.$toast.add({severity:'error', summary: e.response.data.message, life: 3000});
                  })
                  .finally(() => {
                    this.state.docEditor.stop();
                    this.state.progress = 0;
                  });
            } else {
              this.input.doc = StorageDoc.empty();
              this.acceptStorageData(r.data);
              this.state.docEditor.stop();
              this.state.docEditor.close();
            }
          })
          .catch(e => {
            console.error(e);
            this.errors.doc = e.response.data.errors;
            this.$toast.add({severity:'error', summary: e.response.data.message, life: 3000});
            this.state.docEditor.stop();
          });
    },

    dirRemoveDialog() {
      this.state.dirRemove.open();
    },

    dirRemove() {
      storageClient.delete({
        id: this.input.dir.id,
        filter: this.state.filters.input,
        pagination: this.pagination.docs,
      })
          .then(r => {
            this.acceptStorageData(r.data);
            this.state.dirRemove.close();
          })
          .catch(e => {
            this.$toast.add({severity:'error', summary: e.response.data.message, life: 3000});
          })
          .finally(() => {
            this.state.dirRemove.stop();
          });
    },

    dirSave() {
      this.errors.dir = [];
      storageClient.save({
        item: this.input.dir,
        filter: this.state.filters.input,
        pagination: this.pagination.docs,
      })
          .then(r => {
            this.acceptStorageData(r.data);
            this.state.dirEditor.close();
          })
          .catch(e => {
            this.errors.dir = e.response.data.errors;
            this.$toast.add({severity:'error', summary: e.response.data.message, life: 3000});
          })
          .finally(() => {
            this.state.dirEditor.stop();
          });
    },
    createNewDir() {
      if (this.nav.dirs.length) {
        /** @type {StorageDir} */
        const parent = this.nav.dirs.slice(-1).pop();
        this.input.dir = parent.makeChild();
      } else {
        this.input.dir = StorageDir.empty('New folder');
      }
      this.state.dirEditor.open();
    },
    /** @param {StorageDir} dir */
    dirSelect(dir) {
      this.root.unSelect();
      this.input.dir = dir;
      this.nav.dirs.forEach(iDir => {
        iDir.unSelect();
      });
    },
    /** @param {StorageDir} dir */
    dirOpen(dir) {
      this.pagination.docs.first = 0;
      this.input.dir = StorageDir.empty();
      this.getStorageDir(dir);
      this.nav.dirs.forEach(iDir => {
        iDir.unSelect();
      });
      this.nav.dirs.push(dir);
      this.root.unSelect();
    },
    /** @param {StorageDir} dir */
    dirOpenNav(dir) {
      this.pagination.docs.first = 0;
      this.state.filters.dir = dir;
      this.input.dir = StorageDir.empty();
      this.getStorageDir(dir);
      const position = this.nav.dirs.findIndex(iDir => iDir.id === dir.id);
      this.nav.dirs = this.nav.dirs.filter((dir, index) => index <= position)
    },

    rootSelect() {
      this.root.wait();
      this.root.select();
      this.nav.dirs = [];
      this.input.dir = StorageDir.empty();
      storageClient.get({
        id: null,
        filter: this.state.filters.input,
        pagination: {
          page: 1,
          per: 10,
        },
      }).then(r => {
        this.acceptStorageData(r.data)
      }).finally(() => {
        this.root.stop();
      });
    },

    /** @param {StorageDir} dir */
    getStorageDir(dir) {
      dir.wait();
      return storageClient.get({
        id: dir.id,
        filter: this.state.filters.input,
        pagination: {
          page: 1,
          per: 10,
        },
      }).then(r => {
        this.acceptStorageData(r.data)
      }).finally(() => {
        dir.stop();
      });
    },

    acceptStorageData(data) {
      if (data.dirs) {
        this.kept.dirs = data.dirs.map(dir => {
          return new StorageDir({
            id: dir.id,
            state: 'kept',
            size: dir.size,
            name: dir.name,
            parent_id: dir.parent_id,
            props: dir.props || {},
          });
        });
      }

      if (data.docs) {
        this.pagination.docs.total = data.docs.total;

        this.kept.docs = data.docs.data.map(doc => {
          return new StorageDoc({
            id: doc.id,
            size: doc.size,
            state: 'kept',
            name: doc.name,
            parent_id: doc.parent_id,
            download: doc.download,
            file: null,
            props: doc.props || {},
            parent: doc.parent || null,
          });
        });
      }

    },
  },
}
</script>
