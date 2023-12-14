<template>
  <a-form :form="form" style="width: 500px">
    <a-form-item :label="$t('form.directory-title')" labelAlign="left">
      <a-input
        :maxLength="100"
        :placeholder="$t('form.directory-title')"
        v-decorator="[
          'directoryTitle',
          {
            rules: [{ required: true, message: $t('error.directory-title.required') }]
          }
        ]"
      />
    </a-form-item>
    <a-form-item :label="$t('form.component-name')" labelAlign="left">
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
    <a-form-item :label="$t('form.page-url')" labelAlign="left">
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
    <a-form-item :label="$t('form.component-redirection')" labelAlign="left">
      <a-input
        :maxLength="100"
        :placeholder="$t('form.component-redirection')"
        v-decorator="[
          'componentRedirection',
          {
            rules: [{ pattern: /^[^\s]+$/, message: $t('messages.invalid-component-redirection') }]
          }
        ]"
      />
    </a-form-item>
    <a-form-item :label="$t('form.component-icon')" labelAlign="right">
      <div class="file-upload-with-preview">
        <a-input :maxLength="100" :placeholder="$t('form.component-icon')" disabled v-decorator="['icon']" />
        <a-icon style="font-size: 30px" :type="form.getFieldValue('icon')" />
      </div>
      <a-button type="primary" @click="showIconSelector = true">{{ $t('messages.choose-icon') }}</a-button>
    </a-form-item>
    <a-form-item :label="$t('form.show-menu')" labelAlign="left">
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
    <a-form-item :label="$t('form.level')" labelAlign="left">
      <a-input
        :maxLength="100"
        :placeholder="$t('form.level')"
        disabled
        v-decorator="[
          'level',
          {
            initialValue: 1
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
    <IconSelector @change="iconSelected" v-model="showIconSelector" />
  </a-form>
</template>

<script>
import pick from 'lodash.pick'
import InfoCircle from '@/assets/info-circle.svg'
import IconSelector from '@/components/App/ResourceManagement/MenuResource/IconSelector'

const fields = [
  'directoryTitle',
  'componentName',
  'pageUrl',
  'componentRedirection',
  'icon',
  'showMenu',
  'level',
  'sort'
]

export default {
  components: {
    IconSelector
  },
  props: {
    appId: {
      type: String,
      default: () => ''
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      imagePreview: null,
      fileList: [],
      saving: false,
      showIconSelector: false
    }
  },
  watch: {
    model(values) {
      if (values) this.setValues()
      else this.form.resetFields()
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
  async created() {
    fields.forEach((v) => this.form.getFieldDecorator(v))
    await this.$nextTick()
    this.setValues()
  },
  methods: {
    iconSelected(value) {
      this.form.setFieldsValue({ icon: value })
    },
    async showConfirmDelete() {
      this.$confirm({
        title: this.$t('messages.directory.confirm-delete'),
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
        this.showNotification(this.$t('notification.directory.deleted'))
        this.$emit('delete')
        this.$emit('refresh')
      } catch (e) {}
      this.saving = false
    },
    setValues() {
      this.form.setFieldsValue({
        ...pick(this.model, fields),
        directoryTitle: this.model.title,
        icon: this.model?.icon
      })
      if (this.model?.icon?.fileLink) this.imagePreview = this.model.icon.fileLink
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
            data.id = this.model.id
            await this.$store.dispatch('menu-resources/updateDirectory', data)
            this.$emit('refresh')
            this.showNotification(this.$t('notification.directory.updated'))
          } catch (e) {
            console.log(e)
            this.$message.error(this.$t(e?.response?.data?.code))
          }
          this.saving = false
        }
      })
    },
    showNotification(message) {
      this.$notification.open({
        message,
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    }
  }
}
</script>

<style lang="less" scoped>
.file-upload-with-preview {
  display: flex;
  gap: 10px;
  img {
    width: 32px;
    height: 32px;
  }
}
</style>
