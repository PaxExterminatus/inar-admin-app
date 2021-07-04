<template>
  <Dialog
      class="edit-dialog-component"
      position="top"
      :modal="true"
      :header="opt.header"
      v-model:visible="opt.show"
  >
    <slot></slot>

    <template #footer>
      <Button class="btn-default btn-primary" @click="cancel()" :disabled="opt.loading">Cancel</Button>
      <Button class="btn-default btn-primary" @click="save()" :disabled="opt.loading || opt.options.disabled"><i :class="saveIcon"/> {{saveLabel}}</Button>
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

    progress: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    /** @returns {EditDialogState|Object} */
    opt() {
      return this.state;
    },
    saveIcon() {
      return this.opt.loading ? 'pi pi-spinner pi-spin' : 'pi pi-check';
    },
    saveLabel() {
      if (this.progress) {
        return `${this.progress}%`;
      }
      return this.opt.options.yesLabel;
    },
  },

  methods: {
    save() {
      this.opt.wait();
      this.$emit('save');
    },
    cancel() {
      this.state.close();
      this.$emit('cancel');
    },
  }
}
</script>

<style lang="sass" scoped>
.pi
  margin-right: 5px
</style>