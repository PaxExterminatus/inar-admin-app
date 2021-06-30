<template>
  <div class="storage-app">
    <Dirs :dirs="kept.dirs"/>

    <EditDialog :state="state.dirEditor"></EditDialog>

    <div>
      <Button @click="state.dirEditor.open()">Edit</Button>
    </div>
  </div>
</template>

<script>
import Dirs from './custom/Dirs'
import Button from 'primevue/button'
import { storageClient } from '../api/StorageClient'
import { EditDialog, EditDialogOptions, EditDialogState } from './elements/EditDialog';

export default {
  components: {
    Button,
    Dirs,
    EditDialog,
  },

  data() {
    return {
      kept: {
        dirs: [],
        docs: [],
      },

      state: {
        dirEditor: EditDialogState.make(EditDialogOptions.init().headerSet('Folder editor')),
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
