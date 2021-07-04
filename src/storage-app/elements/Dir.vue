<template>
  <div class="folder-cmp" :class="classes" @click="select" @dblclick="open">

    <template v-if="folder.state.loading">
      <i class="folder-icon pi pi-spin pi-spinner"/>
    </template>

    <template v-else-if="folder.state.type === 'root'">
      <i class="folder-icon pi pi-cloud"/>
    </template>

    <template v-else>
      <i class="folder-icon pi pi-folder"/>
    </template>

    <div v-tooltip.top="folder.name" class="folder-name">{{ folder.name }}</div>

    <div class="tags">
      <template v-if="folder.props.max_polygons">
        <div class="tag">
          <span class="small-text">{{ folder.props.max_polygons }}</span>
          <i class="pi pi-clone"/>
        </div>
      </template>

      <template v-if="folder.props.max_size">
        <div class="tag">
          <span class="small-text">{{ sizeFormat(folder.props.max_size) }}</span>
          <i class="pi pi-file"/>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { StorageDir } from '../entity'
import Tag from 'primevue/tag';
import FileSize from '../services/FileSize'

export default {
  components: {
    Tag,
  },

  props: {
    dir: {
      type: Object,
      default: () => StorageDir.empty(),
    },
  },

  computed: {
    /** @returns {StorageDir|Object} */
    folder() {
      return this.dir;
    },

    classes() {
      return {
        selected: this.folder.state.selected,
      };
    },
  },

  methods: {
    select() {
      this.$emit('select', this.folder);
    },
    open() {
      this.$emit('open', this.folder);
    },
    sizeFormat(sizeInBytes) {
      return FileSize.inBytes(sizeInBytes).format();
    },
  },
}
</script>

<style lang="sass">
.folder-cmp
  position: relative
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
  &:hover
    .tag
      opacity: 1
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
    overflow: hidden
    text-overflow: ellipsis
    font-weight: 600
    max-width: 120px
    white-space: nowrap
  .tags
    position: absolute
    display: flex
    flex-direction: column
    right: 0
    top: 0
    height: 100%
  .small-text
    flex: 1
    text-align: left
  .tag
    display: flex
    align-items: center
    justify-content: center
    flex: 1
    text-align: center
    opacity: 0
    font-size: 10px
    .pi
      font-size: 10px
</style>
