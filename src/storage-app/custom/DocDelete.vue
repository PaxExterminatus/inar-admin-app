<template>
  <Dialog class="storage-modal" header="Are you sure you want to delete this file?" :visible.sync="state.show" :modal="true" position="top">

    <template v-if="doc">
      <p class="mt-4">
        {{ doc.name }}
      </p>
    </template>

    <template #footer>
      <BButton variant="outline" @click="no()">No</BButton>
      <BButton variant="primary" @click="yes()"><i :class="yesIcon"/> Yes</BButton>
    </template>

  </Dialog>
</template>

<script>
import { EditorState } from './index';
import { StorageDoc } from '../entity';
import { storageClient } from '../StorageClient'

export default {
  props: {
    opt: {
      type: EditorState,
      required: true,
    },
    inp: {
      type: StorageDoc,
      required: true,
    },
  },

  computed: {
    /** @return {StorageDoc} */
    doc() {
      return this.inp;
    },
    /** @return {EditorState} */
    state() {
      return this.opt;
    },
    yesIcon() {
      return this.state.loading ? 'pi pi-spinner pi-spin' : 'pi pi-check';
    },
  },

  methods: {
    no() {
      this.$emit('no');
    },

    yes() {
      this.state.start();
      storageClient.delete(this.doc.id)
          .then(response => {
            this.$emit('yes', response);
            this.state.close();
          })
          .finally(() => {
            this.state.stop();
          });
    },
  },
}
</script>
