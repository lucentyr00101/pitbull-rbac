<template>
  <a-modal
    :maskClosable="false"
    :title="$t('table.action.add-new-action')"
    :width="600"
    :visible="value"
    @ok="handleSubmit"
    @cancel="closeModal"
    :okText="$t('modal.action.save')"
    :confirmLoading="saving"
  >
    <a-form :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 16 }">
      <a-form-item :label="$t('form.action-name')" labelAlign="right">
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
      <a-form-item :label="$t('form.button-access-code')" labelAlign="right">
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
      <a-form-item :label="$t('form.url')" labelAlign="right">
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
      <a-form-item :label="$t('form.sort')" labelAlign="right">
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
    </a-form>
  </a-modal>
</template>

<script>
const fields = ['actionName', 'buttonAccessCode', 'uri', 'sort']

export default {
  props: {
    value: Boolean,
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
  created() {
    fields.forEach((v) => this.form.getFieldDecorator(v))
  },
  methods: {
    showNotification(message) {
      this.$notification.open({
        message,
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
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
            await this.$store.dispatch('menu-resources/addAction', data)
            this.closeModal()
            this.$emit('refresh')
            this.showNotification(this.$t('notification.action.added'))
          } catch (e) {
            console.log(e)
            this.$message.error(this.$t(e?.response?.data?.code))
          }
          this.saving = false
        }
      })
    },
    closeModal() {
      this.$emit('input', false)
      this.form.resetFields()
    }
  }
}
</script>
