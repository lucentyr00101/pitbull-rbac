<template>
  <a-modal
    :maskClosable="false"
    :title="$t('table.action.add-new-submenu')"
    :width="500"
    :visible="value"
    @ok="handleSubmit"
    @cancel="closeModal"
    :okText="$t('modal.action.save')"
    :confirmLoading="saving"
  >
    <a-form
      :form="form"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
    >
      <a-form-item
        :label="$t('form.submenu-title')"
        labelAlign="right"
      >
        <a-input
          :maxLength="100"
          :placeholder="$t('form.submenu-title')"
          v-decorator="[
            'submenuTitle',
            {
              rules: [
                { required: true, message: $t('error.submenu-title.required') }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        :label="$t('form.component-name')"
        labelAlign="right"
      >
        <a-input
          :maxLength="100"
          :placeholder="$t('form.component-name')"
          v-decorator="[
            'componentName',
            {
              rules: [
                { required: true, message: $t('error.component-name.required') },
                { pattern: /^[^\s]+$/, message: $t('messages.invalid-component-name') }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        :label="$t('form.page-url')"
        labelAlign="right"
      >
        <a-input
          :maxLength="100"
          :placeholder="$t('form.page-url')"
          v-decorator="[
            'pageUrl',
            {
              rules: [
                { required: true, message: $t('error.page-url.required') },
                { pattern: /^[^\s]+$/, message: $t('messages.invalid-page-url') }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        :label="$t('form.show-menu')"
        labelAlign="right"
      >
        <a-select
          v-decorator="[
            'showMenu',
            {
              initialValue: 'Yes'
            }
          ]"
          :options="showMenuOptions"
        />
      </a-form-item>
      <a-form-item
        :label="$t('form.cache-component')"
        labelAlign="right"
      >
        <a-select
          v-decorator="[
            'cacheComponent',
            {
              initialValue: 'Yes'
            }
          ]"
          :options="showMenuOptions"
        />
      </a-form-item>
      <a-form-item
        :label="$t('form.level')"
        labelAlign="right"
      >
        <a-input
          :maxLength="100"
          :placeholder="$t('form.level')"
          disabled
          v-decorator="[
            'level',
            {
              initialValue: 3
            }
          ]"
        />
      </a-form-item>
      <a-form-item
        :label="$t('form.sort')"
        labelAlign="right"
      >
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
const fields = ['submenuTitle', 'componentName', 'pageUrl', 'showMenu', 'cacheComponent', 'level', 'sort']

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
  data () {
    return {
      form: this.$form.createForm(this),
      saving: false
    }
  },
  computed: {
    showMenuOptions () {
      return [
        { value: 'Yes', label: this.$t('form.yes') },
        { value: 'No', label: this.$t('form.no') }
      ]
    }
  },
  created () {
    fields.forEach((v) => this.form.getFieldDecorator(v))
  },
  methods: {
    showNotification (message) {
      this.$notification.open({
        message,
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    handleSubmit () {
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
            await this.$store.dispatch('menu-resources/addSubmenu', data)
            this.closeModal()
            this.$emit('refresh')
            this.showNotification(this.$t('notification.submenu.added'))
          } catch (e) {
            console.log(e)
            this.$message.error(this.$t(e?.response?.data?.code))
          }
          this.saving = false
        }
      })
    },
    closeModal () {
      this.$emit('input', false)
      this.form.resetFields()
    }
  }
}
</script>
