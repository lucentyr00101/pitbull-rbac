<template>
  <a-form
    :form="form"
    style="width: 500px"
  >
    <a-form-item
      :label="$t('form.submenu-title')"
      labelAlign="left"
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
      labelAlign="left"
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
      labelAlign="left"
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
      labelAlign="left"
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
      labelAlign="left"
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
      labelAlign="left"
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
      labelAlign="left"
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
    <a-space style="float: right;">
      <a-button type="danger" ghost @click="showConfirmDelete" :loading="saving">{{ $t('delete') }}</a-button>
      <a-button type="primary" @click="handleSubmit" :loading="saving">{{ $t('save') }}</a-button>
    </a-space>
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import InfoCircle from '@/assets/info-circle.svg'

const fields = ['submenuTitle', 'componentName', 'pageUrl', 'showMenu', 'cacheComponent', 'level', 'sort']

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
  watch: {
    model (values) {
      if (values) this.setValues()
      else this.form.resetFields()
    }
  },
  async created () {
    fields.forEach((v) => this.form.getFieldDecorator(v))
    await this.$nextTick()
    this.setValues()
  },
  methods: {
    async showConfirmDelete () {
      this.$confirm({
        title: this.$t('messages.submenu.confirm-delete'),
        okText: this.$t('form.yes'),
        cancelText: this.$t('form.no'),
        centered: true,
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: () => this.handleDelete()
      })
    },
    async handleDelete () {
      this.saving = true
      try {
        await this.$store.dispatch('menu-resources/deleteResource', { id: this.model.id })
        this.showNotification(this.$t('notification.submenu.deleted'))
        this.$emit('delete')
        this.$emit('refresh')
      } catch (e) {}
      this.saving = false
    },
    showNotification (message) {
      this.$notification.open({
        message,
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    setValues () {
      this.form.setFieldsValue({
        ...pick(this.model, fields),
        submenuTitle: this.model.title
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
            data.id = this.model.id
            await this.$store.dispatch('menu-resources/updateSubmenu', data)
            this.$emit('refresh')
            this.showNotification(this.$t('notification.submenu.updated'))
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
