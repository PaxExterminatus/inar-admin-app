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
    </div>

    <Dirs :dirs="kept.dirs" @select="dirSelect" @open="dirOpen"/>

    <template v-if="can.makeFile">
      <Docs :docs="kept.docs" :dir="dirCurrent" :pagination="pagination.docs" @request="docRequest" @edit="docEdit" @remove="docRemoveDialog"/>
    </template>

    <EditDialog :state="state.dirEditor" @save="dirSave">
      <DirForm :inp="input.dir" :errors="errors.dir"/>
    </EditDialog>

    <EditDialog :state="state.docEditor" :progress="state.progress" @save="docSave">
      <DocForm :inp="input.doc" :errors="errors.doc" :current-dir="dirCurrent" :progress="state.progress" @validate="state.docEditor.options.disabled = $event"/>
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
import { DirForm, DocForm, Docs, Dirs } from './custom'
import { StorageDir, StorageDoc } from './entity'
import { Dir } from './elements';
import FileSize from './services/FileSize'

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
      },

      pagination: {
        docs: {
          total: 0,
        },
      },

      input: {
        dir: StorageDir.empty(),
        doc: StorageDoc.empty(),
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
      return this.nav.dirs.slice(-1).pop();
    },
  },

  methods: {
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
     * }} onPageEvent
     */
    docRequest(onPageEvent) {
      storageClient.docs({
        page: onPageEvent.page + 1,
        parentId: this.dirCurrent.id,
        per: onPageEvent.rows,
      })
          .then(r => {
            console.log(r.data);
            this.kept.docs = r.data.docs.data;
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
      storageClient.delete(this.input.doc.id)
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
    /**
     * @param {StorageDoc} doc
     */
    docEdit(doc) {
      this.errors.doc = {};
      this.input.doc = doc.copy();
      this.state.docEditor.open();
    },

    docCreate() {
      this.errors.doc = {};
      this.state.docEditor.open();
      const parent = this.dirCurrent;
      this.input.doc = new StorageDoc.empty({parent_id: parent ? parent.id : null});
    },

    /**
     * @param {ProgressEvent} e
     */
    uploadProgress(e) {
      this.state.progress = FileSize.inBytes(e.total).percent(e.loaded);
    },

    docSave() {
      this.errors.doc = {};
      storageClient.save(this.input.doc)
          .then(r => {
            this.acceptStorageData(r.data);
            this.input.doc.id = r.data.item.id;
            if (r.data.parent) {
              this.dirCurrent.props.over = r.data.parent.props.over;
            }
            if (this.input.doc.file || this.input.doc.preview)
            {
              storageClient.upload(this.input.doc, this.uploadProgress)
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
            this.errors.doc = e.response.data.errors;
            this.$toast.add({severity:'error', summary: e.response.data.message, life: 3000});
            this.state.docEditor.stop();
          });
    },

    dirRemoveDialog() {
      this.state.dirRemove.open();
    },

    dirRemove() {
      storageClient.delete(this.input.dir.id)
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
      storageClient.save(this.input.dir)
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
      this.getStorage()
          .finally(() => {
            this.root.stop();
          });
    },

    getStorage() {
      return storageClient.get()
          .then(r => {
            this.acceptStorageData(r.data)
          });
    },
    /** @param {StorageDir} dir */
    getStorageDir(dir) {
      dir.wait();
      return storageClient.get(dir.id)
          .then(r => {
            this.acceptStorageData(r.data)
          })
          .finally(() => {
            dir.stop();
          });
    },

    acceptStorageData(data) {
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

      this.pagination.docs.total = data.docs.total;
      this.kept.docs = data.docs.data.map(doc => {
        return new StorageDoc({
          id: doc.id,
          size: doc.size,
          state: 'kept',
          name: doc.name,
          parent_id: doc.parent_id,
          file: null,
          props: doc.props || {}
        });
      });
    },
  },
}
</script>
