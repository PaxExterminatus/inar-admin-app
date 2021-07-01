<template>
  <div class="folder-cmp" :class="classes" @click="click">

    <template v-if="storageDir.state.loading">
      <i class="folder-icon pi pi-spin pi-spinner"/>
    </template>

    <template v-else-if="storageDir.state.type === 'root'">
      <i class="folder-icon pi pi-cloud"/>
    </template>

    <template v-else>
      <i class="folder-icon pi pi-folder"/>
    </template>

    <span class="folder-name">
      {{ storageDir.name }}
    </span>
  </div>
</template>

<script>
import { StorageDir } from '../entity'

export default {
  props: {
    dir: {
      type: Object,
      default: () => StorageDir.empty(),
    },
  },

  computed: {
    /** @returns {StorageDir|Object} */
    storageDir() {
      return this.dir;
    },

    classes() {
      return {
        selected: this.storageDir.state.selected,
      };
    },
  },

  methods: {
    click() {
      this.storageDir.select();
      this.$emit('select');
    },
  },
}
</script>

<style lang="sass">
.folder-cmp
  display: flex
  overflow: hidden
  color: rgba(0,0,0,.72)
  font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif
  font-size: 13px
  border: 1px solid #dadce0
  padding: 12px 16px
  border-radius: 5px
  cursor: pointer
  min-width: 200px
  &.selected
    background-color: #e8f0fe
    color: #1967d2
    &:hover
      background-color: #e8f0fe
  &:hover
    background-color: #dadce0
  .folder-icon
    margin-right: 12px
  .folder-name
    display: flex
    align-items: center
    text-overflow: ellipsis
    font-weight: 600
</style>
