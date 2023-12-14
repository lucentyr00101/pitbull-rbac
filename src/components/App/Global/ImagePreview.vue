<template>
  <a-modal
    :maskClosable="false"
    @cancel="closeModal"
    :visible="value"
    :okButtonProps="{style: { display: 'none' }}"
    :cancelButtonProps="{style: { display: 'none' }}"
  >
    <img style="width: 100%" :src="link" alt="" />
  </a-modal>
</template>

<script>
export default {
  props: {
    value: Boolean,
    link: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    closeModal () {
      this.$emit('clearImage')
      this.$emit('input', false)
    }
  }
}
</script>
