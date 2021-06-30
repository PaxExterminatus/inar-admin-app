<template>
  <Dialog class="edit-dialog-component" position="top" :modal="true" :header="opt.header" v-model:visible="opt.show">

    <slot></slot>

    <template #footer>
      <Button class="btn-default btn-primary" @click="cancel()">Cancel</Button>
      <Button class="btn-default btn-primary" @click="save()"><i :class="saveIcon"/> Save</Button>
    </template>
  </Dialog>
</template>

<script>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { EditDialogState, EditDialogOptions } from './'

export default {
  components: {
    Button,
    Dialog,
  },

  props: {
    state: {
      type: Object,
      default: () => EditDialogState.make(EditDialogOptions.init()),
    },
  },

  computed: {
    /** @returns {EditDialogState|Object} */
    opt() {
      return this.state;
    },
    saveIcon() {
      return this.opt.wait ? 'pi pi-spinner pi-spin' : 'pi pi-check';
    },
  },

  methods: {
    save() {
      this.$emit('save');
    },
    cancel() {
      this.state.close();
      this.$emit('cancel');
    },
  }
}
</script>
