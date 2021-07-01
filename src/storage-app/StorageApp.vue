<template>
  <div class="storage-app">
    <Dirs :dirs="nav.dirs">
      <Dir :dir="root" @select="rootSelect"/>
    </Dirs>

    <div class="actions-panel">
      <Button class="p-button-secondary p-button-outlined" icon="pi pi-plus-circle" title="Create"/>
      <Button class="p-button-secondary p-button-outlined" icon="pi pi-pencil" title="Edit"/>
      <Button class="p-button-secondary p-button-outlined" icon="pi pi-trash" title="Delete"/>
    </div>

    <Dirs :dirs="kept.dirs"/>

    <Docs :docs="kept.docs"/>

    <EditDialog :state="state.dirEditor">
      <DirForm :inp="input.dir"/>
    </EditDialog>

    <EditDialog :state="state.docEditor">
      <DocForm :inp="input.dir"/>
    </EditDialog>
  </div>
</template>

<script>
import Button from 'primevue/button'
import { storageClient } from '../api/StorageClient'
import { EditDialog, EditDialogOptions, EditDialogState } from './elements/EditDialog'
import { DirForm, DocForm, Docs, Dirs } from './custom'
import { StorageDir, StorageDoc } from './entity'
import { Dir } from './elements';

export default {
  components: {
    Docs,
    Button,
    Dirs,
    EditDialog,
    DirForm,
    DocForm,
    Dir,
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
      },

      input: {
        dir: StorageDir.empty('New folder'),
        doc: StorageDoc.empty(),
      },

      nav: {
        dirs: [],
      },
    };
  },

  mounted() {
    this.getStorage();
  },

  methods: {
    rootSelect() {
      this.root.wait();
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
