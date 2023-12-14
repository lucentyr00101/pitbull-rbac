<template>
  <a-modal
    :visible="value"
    :maskClosable="false"
    @cancel="closeModal"
    :footer="null"
    :width="1000"
    :bodyStyle="{ maxHeight: '800px', 'overflow-y': 'auto', width: '1000px' }"
  >
    <a-form v-if="model" :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <template v-for="(field, i) in fields">
        <a-form-item style="margin-bottom: 0px" :key="i" :label="field.label">
          <pre v-if="isObject(field.key)">{{ parse(field.key) }}</pre>
          <span v-else>
            {{ model[field.key] || '-' }}
          </span>
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    value: Boolean,
    model: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  computed: {
    fields() {
      return [
        { key: 'clientName', label: this.$t('table.column.app') },
        { key: 'username', label: this.$t('table.column.user') },
        { key: 'ipAddress', label: this.$t('table.column.ip') },
        { key: 'url', label: this.$t('table.column.url') },
        { key: 'param', label: this.$t('table.column.request-parameters') },
        { key: 'result', label: this.$t('table.column.response-results') }
      ]
    }
  },
  methods: {
    parse(key) {
      const data = this.model[key]
      return JSON.stringify(JSON.parse(data), null, 0).trim()
    },
    isObject(key) {
      const data = this.model[key]
      try {
        JSON.parse(data)
        return true
      } catch (e) {
        return false
      }
    },
    closeModal() {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .ant-row.ant-form-item label {
  font-weight: 700;
}
</style>
