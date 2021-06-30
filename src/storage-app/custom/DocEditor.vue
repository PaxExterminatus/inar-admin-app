<template>
  <BModal v-model="state.show" class="storage-modal" size="lg">
    <template #modal-title>
      File
    </template>

    <template v-if="input">
      <div class="modal-input">
        <label for="name">Name</label>
        <BFormInput id="name" v-model="input.name"/>
      </div>

      <div class="modal-input">
        <label for="preview">Preview</label>
        <BFormInput id="preview" v-model="input.preview"/>
      </div>

      <div class="modal-input">
        <label for="url">URL</label>
        <BFormInput id="url" v-model="input.url"/>
      </div>

      <div class="modal-input">
        <label for="polygons">Polygons</label>
        <BFormInput type="number" id="polygons" v-model="input.polygons"/>
      </div>

      <div class="modal-input">
        <label for="size">Size</label>
        <BFormInput type="number" id="size" v-model="input.size"/>
      </div>

      <template v-if="input.file">
        <div class="modal-input p-float-label">
          <div>
            <span>File name</span>
            <span>{{ input.file.name }}</span>
          </div>
          <div>
            <span>File size</span>
            <span>{{ input.file.size }}</span>
          </div>
        </div>
      </template>

      <div class="modal-input">
        <label for="description">Description</label>
        <BFormTextarea id="description" v-model="input.props.description"/>
      </div>

      <div class="modal-input">
        <label for="note">Note</label>
        <BFormInput id="note" v-model="input.note"/>
      </div>

      <div class="modal-input">
        <label for="Topic">Topic</label>
        <BFormInput id="topic" v-model="input.topic"/>
      </div>

      <div class="modal-input-label">
        <label for="Thesis">Thesis</label>
        <BFormInput id="thesis" v-model="input.thesis"/>
      </div>
    </template>

    <template #modal-footer>
      <BButton class="btn-default btn-primary" @click="cancel()">Cancel</BButton>
      <BButton class="btn-default btn-primary" @click="save()">
        <b-spinner small type="grow"/>
        Save
      </BButton>
    </template>
  </BModal>
</template>

<script>
import { EditorState } from './index'
import { StorageDoc } from '../entity'
import { storageClient } from '../StorageClient'
import { FileSize } from '../../../services/files'
import { BButton, BModal, BFormInput, BFormTextarea } from 'bootstrap-vue'

export default {
  components: {
    BButton,
    BModal,
    BFormInput,
    BFormTextarea,
  },

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

  data() {
    return {
      input: StorageDoc.empty(),
    };
  },

  watch: {
    inp() {
      this.input.fill(this.inp);
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
    saveIcon() {
      return this.state.loading ? 'pi pi-spinner pi-spin' : 'pi pi-check';
    },
  },

  methods: {
    cancel() {
      this.state.close();
      this.$emit('cancel');
    },
    save() {
      this.state.start();
      storageClient.save(this.input)
          .then(response => {
            this.input.fill(response.data.item);
            if (this.input.file) {
              const doc = this.input;
              console.log('this.input.parent_id', this.input.parent_id);
              storageClient.upload(doc, event => {console.log(event)})
                  .then(response => {
                    this.inp.kept();
                    doc.kept();
                    this.$emit('save', response);
                    this.$emit('upload', response);
                    this.state.close();
                  })
                  .catch((error) => {
                    doc.state = 'local';
                    console.error(error);
                  });
            } else {
              this.$emit('save', response);
              this.state.close();
            }
          })
          .finally(() => {
            this.state.stop();
          });
    },
  },
}
</script>
