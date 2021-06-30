<template>
  <div class="storage-app">
    <DirDeeping/>

    <Dirs :dirs="kept.dirs"/>

    <EditDialog :state="state.dirEditor">
      <DirForm :inp="input.dir"/>
    </EditDialog>

    <EditDialog :state="state.docEditor">
      <DocForm :inp="input.dir"/>
    </EditDialog>

    <div>
      <Button @click="state.docEditor.open()">Edit</Button>
    </div>
  </div>
</template>

<script>
import Dirs from './custom/Dirs'
import Button from 'primevue/button'
import { storageClient } from '../api/StorageClient'
import { EditDialog, EditDialogOptions, EditDialogState } from './elements/EditDialog'
import { DirForm, DocForm, DirDeeping } from './custom'
import { StorageDir } from './entity'

export default {
  components: {
    Button,
    Dirs,
    EditDialog,
    DirForm,
    DocForm,
    DirDeeping,
  },

  data() {
    return {
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
      },
    };
  },

  mounted() {
    storageClient.get()
        .then(r => {
          this.kept.dirs = r.data.dirs;
          this.kept.docs = r.data.docs;
        });
  }
}
</script>
