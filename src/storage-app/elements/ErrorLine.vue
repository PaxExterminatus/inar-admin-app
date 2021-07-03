<template>
  <div class="error-line" :class="classes">
    <slot></slot>
    <div class="error-message actions">
      <slot name="tags"></slot>
      <span v-if="hasErrors">{{ firstError }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    hasErrors() {
      return this.errors.length;
    },

    classes() {
      return {
        invalid: this.hasErrors,
      };
    },

    firstError() {
      return this.errors[0];
    },
  },
}
</script>

<style lang="sass">
.error-line
  label
    margin-bottom: 5px
  &.invalid
    input
      border-color: #f44336 !important
  .error-message
    display: flex
    flex-wrap: wrap
    align-items: center
    color: #f44336
    font-size: 1rem
    min-height: 1.4rem
</style>
