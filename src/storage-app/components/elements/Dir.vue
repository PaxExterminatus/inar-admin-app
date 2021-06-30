<template>
  <div class="folder-cmp" :class="classes">

    <template v-if="loading">
      <i class="folder-icon pi pi-spin pi-spinner"/>
    </template>

    <template v-else-if="root">
      <i class="folder-icon pi pi-cloud"/>
    </template>

    <template v-else>
      <i class="folder-icon pi pi-folder"/>
    </template>

    <span class="folder-name">
      {{ name }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'Dir',

  props: {
    name: {
      type: String,
      default: '',
    },
    selected: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    root: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    classes() {
      return {
        selected: this.selected,
      };
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
