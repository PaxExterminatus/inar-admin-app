<template>
  <EditDialog :opt="editDialogOpt">

    <template v-if="input">
      <div class="modal-input">
        <label for="name">Name</label>
        <InputText id="name" v-model="input.name"/>
      </div>

      <div class="modal-input">
        <label for="polygons">Maximum number of polygons</label>
        <InputText id="polygons" type="number" v-model="input.props.max_polygons"/>
      </div>

      <div class="modal-input">
        <label for="size">Max file size</label>
        <InputText id="size" type="number" v-model="input.props.max_size"/>
      </div>
    </template>

  </EditDialog>
</template>

<script>
import InputText from 'primevue/inputtext'
import { EditorState } from './index';
import { StorageDir } from '../entity';
import { storageClient } from '../StorageClient'
import { EditDialog } from '../elements/EditDialog';

export default {
  components: {
    InputText,
    EditDialog,
  },

  props: {
    opt: {
      type: EditorState,
      required: true,
    },
    inp: {
      type: StorageDir,
      required: true,
    },
  },

  data() {
    return {
      input: StorageDir.empty('New folder'),
    };
  },

  watch: {
    inp() {
      this.input.fill(this.inp);
    },
  },

  computed: {
    showEditor: {
      get() {
        return this.state.show
      },
      set() {
        this.state.flipShow();
      },
    },

    /** @return {StorageDoc} */
    dir() {
      return this.inp;
    },
    /** @return {EditorState} */
    state() {
      return this.opt;
    },
    saveIcon() {
      return this.state.loading ? 'pi pi-spinner pi-spin' : 'pi pi-check';
    },
  },

  methods: {
    cancel() {
      this.state.close();
    },

    save() {
      this.state.start();
      storageClient.save(this.input)
          .then(response => {
            this.$emit('save', response);
            this.state.close();
          })
          .finally(() => {
            this.state.stop();
          });
    }
  },

}
</script>
