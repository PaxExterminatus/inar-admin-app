<template>
  <div class="storage-app">
    <Dirs :dirs="nav.dirs" @select="dirOpenNav">
      <Dir :dir="root" @select="rootSelect"/>
    </Dirs>

    <div class="actions">
      <Button title="Create" icon="pi pi-plus-circle" @click="createNewDir"/>
      <template v-if="input.dir.id">
        <Button title="Edit" icon="pi pi-pencil" @click="state.dirEditor.open()"/>
        <Button title="Delete" icon="pi pi-trash" @click="state.dirRemove.open()"/>
      </template>
      <Divider layout="vertical"/>
      <Button title="Create document" icon="pi pi-cloud-upload" @click="state.docEditor.open()"/>
    </div>

    <Dirs :dirs="kept.dirs" @select="dirSelect" @open="dirOpen"/>

    <Docs :docs="kept.docs"/>

    <EditDialog :state="state.dirEditor" @save="dirSave">
      <DirForm :inp="input.dir" :errors="errors.dir"/>
    </EditDialog>

    <EditDialog :state="state.docEditor">
      <DocForm :inp="input.dir"/>
    </EditDialog>

    <EditDialog :state="state.dirRemove" @save="dirRemove">
      <p>Do you want to delete this folder? <strong>{{ this.input.dir.name }}</strong></p>
    </EditDialog>

    <Toast/>
  </div>
</template>

<script>
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import { storageClient } from '../api/StorageClient'
import { EditDialog, EditDialogOptions, EditDialogState } from './elements/EditDialog'
import { DirForm, DocForm, Docs, Dirs } from './custom'
import { StorageDir, StorageDoc } from './entity'
import { Dir } from './elements';
import Toast from 'primevue/toast';

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
      },

      input: {
        dir: StorageDir.empty(),
        doc: StorageDoc.empty(),
      },

      errors: {
        dir: {},
      },

      nav: {
        dirs: [],
      },
    };
  },

  mounted() {
    this.rootSelect();
  },

  methods: {
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
      this.input.dir = dir;
      this.getStorageDir(dir);
      this.nav.dirs.forEach(iDir => {
        iDir.unSelect();
      });
      this.nav.dirs.push(dir);
      this.root.unSelect();
    },
    /** @param {StorageDir} dir */
    dirOpenNav(dir) {
      this.input.dir = dir;
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
      this.kept.docs = data.docs.map(doc => {
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
    },
  },
}
</script>
