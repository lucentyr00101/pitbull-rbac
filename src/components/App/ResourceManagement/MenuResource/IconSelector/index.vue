<template>
  <a-modal
    :maskClosable="false"
    :title="$t('icon-selection')"
    :width="600"
    :visible="value"
    @ok="handleSubmit"
    @cancel="closeModal"
    :okText="$t('modal.action.save')"
    :confirmLoading="confirmLoading"
    :bodyStyle="{ maxHeight: '800px', 'overflow-y': 'auto' }"
  >
    <a-row :gutter="[20, 30]">
      <template v-for="(item, x) in gallery">
        <a-col :key="x" :span="8">{{ item.title }}: </a-col>
        <a-col :key="x" :span="16">
          <div class="icon-gallery">
            <template v-for="(icon, i) in item.icons">
              <a-icon
                @click="selectedIcon = icon"
                class="icon-component"
                :key="i"
                :type="icon"
                :class="{ 'selected': icon === selectedIcon }"
              />
            </template>
          </div>
        </a-col>
      </template>
    </a-row>
  </a-modal>
</template>

<script>
import settings from './settings'

export default {
  name: 'IconSelector',
  props: {
    value: Boolean
  },
  data () {
    return {
      confirmLoading: false,
      selectedIcon: null
    }
  },
  computed: {
    gallery () {
      return [
        { title: this.$t('directional-icons'), icons: settings.directional },
        { title: this.$t('suggested-icons'), icons: settings.suggested },
        { title: this.$t('editor-icons'), icons: settings.editor },
        { title: this.$t('data-icons'), icons: settings.data },
        { title: this.$t('brand-and-logos'), icons: settings.brands },
        { title: this.$t('application-icons'), icons: settings.app }
      ]
    }
  },
  methods: {
    closeModal () {
      this.$emit('input', false)
      this.selectedIcon = null
    },
    handleSubmit () {
      this.$emit('change', this.selectedIcon)
      this.closeModal()
    }
  }
}
</script>

<style lang="less" scoped>
.icon-gallery {
  max-height: 150px;
  overflow: auto;
  .icon-component {
    font-size: 30px;
    cursor: pointer;
    padding: 5px;
    &.selected {
      background: #1890ff;
    }
    &:hover {
      background: #1890ff;
    }
  }
}
</style>
