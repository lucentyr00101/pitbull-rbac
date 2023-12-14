<template>
  <a-form :form="form" style="width: 500px">
    <a-form-item :label="$t('form.action-name')" labelAlign="left">
      <a-input
        :maxLength="100"
        :placeholder="$t('form.action-name')"
        v-decorator="[
          'actionName',
          {
            rules: [{ required: true, message: $t('error.action-name.required') }]
          }
        ]"
      />
    </a-form-item>
    <a-form-item :label="$t('form.button-access-code')" labelAlign="left">
      <a-input
        :maxLength="100"
        :placeholder="$t('form.button-access-code')"
        v-decorator="[
          'buttonAccessCode',
          {
            rules: [
              { required: true, message: $t('error.button-access-code.required') },
              { pattern: /^[^\s]+$/, message: $t('messages.invalid-button-access-code') }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item :label="$t('form.url')" labelAlign="left">
      <a-input
        :maxLength="100"
        :placeholder="$t('form.url')"
        v-decorator="[
          'uri',
          {
            rules: [
              { required: true, message: $t('error.uri.required') },
              { pattern: /^[^\s]+$/, message: $t('messages.invalid-uri') }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-form-item :label="$t('form.sort')" labelAlign="left">
      <a-input
        :maxLength="3"
        :placeholder="$t('form.sort')"
        v-decorator="[
          'sort',
          {
            rules: [
              { required: true, message: $t('error.sort.required') },
              { pattern: /^\d+$/, message: $t('messages.invalid-sort') }
            ]
          }
        ]"
      />
    </a-form-item>
    <a-space style="float: right">
      <a-button type="danger" ghost @click="showConfirmDelete" :loading="saving">{{ $t('delete') }}</a-button>
      <a-button type="primary" @click="handleSubmit" :loading="saving">{{ $t('save') }}</a-button>
    </a-space>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import InfoCircle from '@/assets/info-circle.svg'

const fields = ['actionName', 'buttonAccessCode', 'uri', 'sort']

export default {
  props: {
    model: {
      type: Object,
      default: () => null
    },
    appId: {
      type: String,
      default: () => ''
    },
    parentId: {
      type: Number,
      default: () => null
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      saving: false
    }
  },
  computed: {
    showMenuOptions() {
      return [
        { value: 'Yes', label: this.$t('form.yes') },
        { value: 'No', label: this.$t('form.no') }
      ]
    }
  },
  watch: {
    model(values) {
      if (values) this.setValues()
      else this.form.resetFields()
    }
  },
  async created() {
    fields.forEach((v) => this.form.getFieldDecorator(v))
    await this.$nextTick()
    this.setValues()
  },
  methods: {
    async showConfirmDelete() {
      this.$confirm({
        title: this.$t('messages.action.confirm-delete'),
        okText: this.$t('form.yes'),
        cancelText: this.$t('form.no'),
        centered: true,
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: () => this.handleDelete()
      })
    },
    async handleDelete() {
      this.saving = true
      try {
        await this.$store.dispatch('menu-resources/deleteResource', { id: this.model.id })
        this.showNotification(this.$t('notification.action.deleted'))
        this.$emit('delete')
        this.$emit('refresh')
      } catch (e) {}
      this.saving = false
    },
    showNotification(message) {
      this.$notification.open({
        message,
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    setValues() {
      this.form.setFieldsValue({
        ...pick(this.model, fields),
        actionName: this.model.title
      })
    },
    handleSubmit() {
      this.form.validateFields(async (errors, values) => {
        if (!errors) {
          this.saving = true
          try {
            const ignoreKeys = ['level']
            const data = fields.reduce((acc, curr) => {
              if (!ignoreKeys.includes(curr)) {
                acc[curr] = this.form.getFieldValue(curr)
              }
              return acc
            }, {})
            data.applicationId = this.appId
            data.parentResourceId = this.parentId
            data.id = this.model.id
            await this.$store.dispatch('menu-resources/updateAction', data)
            this.$emit('refresh')
            this.showNotification(this.$t('notification.action.updated'))
          } catch (e) {
            console.log(e)
            this.$message.error(this.$t(e?.response?.data?.code))
          }
          this.saving = false
        }
      })
    }
  }
}
</script>
