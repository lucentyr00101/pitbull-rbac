<template>
  <a-modal
    :maskClosable="false"
    :title="!model?.id ? $t('table.action.add-new') : $t('table.action.edit')"
    :width="600"
    :visible="value"
    @ok="handleSubmit"
    @cancel="closeModal"
    :okText="$t('modal.action.save')"
    :confirmLoading="confirmLoading"
    :bodyStyle="{ maxHeight: '800px', 'overflow-y': 'auto' }"
  >
    <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
      <a-form-item :label="i18nRender('table.column.app-name')">
        <a-input
          :maxLength="25"
          :placeholder="$t('table.column.app-name')"
          v-decorator="[
            'clientName',
            {
              rules: [{ required: true, message: $t('error.app-name.required') }]
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="i18nRender('table.column.app-id')">
        <a-input
          :maxLength="25"
          :placeholder="$t('table.column.app-id')"
          :disabled="!!model"
          v-decorator="[
            'clientId',
            {
              rules: [
                { required: true, message: $t('error.app-id.required') },
                { pattern: /^[a-zA-Z0-9\-]+$/, message: $t('error.app-id.format') }
              ]
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="i18nRender('table.column.status')">
        <a-select
          :placeholder="$t('table.column.select')"
          :options="dropdowns.status"
          v-decorator="[
            'status',
            {
              initialValue: 'Enable'
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="i18nRender('table.column.app-template')">
        <a-select
          :placeholder="$t('table.column.app-template')"
          @change="onChange"
          v-decorator="[
            'appTemplate',
            {
              initialValue: 'None'
            }
          ]"
        >
          <a-select-option value="None"> {{ $t('table.options.none') }}</a-select-option>
          <a-select-option value="Easygetapp"> Easygetapp</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label="i18nRender('table.column.level')">
        <a-select
          :options="dropdowns.levels"
          placeholder="1-6"
          v-decorator="[
            'level',
            {
              rules: [{ required: selectedAppTemplate !== 'None', message: $t('error.level.required') }]
            }
          ]"
        />
      </a-form-item>
      <!-- <a-form-item :label="i18nRender('table.column.password')">
        <a-input :maxLength="25" disabled :placeholder="$t('table.column.password')" v-decorator="['clientSecret']" />
      </a-form-item> -->
      <a-form-item :label="i18nRender('table.column.session-duration')">
        <a-select
          :placeholder="$t('table.column.refresh-token-lifespan')"
          :options="dropdowns.refreshTokenLifespan"
          v-decorator="[
            'refreshTokenLifespan',
            {
              rules: [{ required: true, message: $t('error.refresh-token-lifespan.required') }],
              initialValue: '1 Hour'
            }
          ]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.ip-whitelist')">
        <a-input
          type="textarea"
          :auto-size="{ minRows: 2, maxRows: 6 }"
          :maxLength="159"
          v-decorator="['ipWhitelist', { rules: [{ validator: validateIp }] }]"
        />
      </a-form-item>
      <a-form-item :label="$t('table.column.remarks')">
        <a-input
          type="textarea"
          :auto-size="{ minRows: 2, maxRows: 6 }"
          :placeholder="$t('table.column.remarks')"
          :maxLength="100"
          v-decorator="['remarks']"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { i18nRender } from '@/locales'
import pick from 'lodash.pick'
import { validateIp } from '@/utils/validators'
import { generateCode } from '@/utils/helpers'

const fields = [
  'clientId',
  'clientName',
  'status',
  'refreshTokenLifespan',
  'ipWhitelist',
  'remarks',
  'appTemplate',
  'level'
]

export default {
  name: 'ApplicationForm',
  data() {
    return {
      confirmLoading: false,
      form: this.$form.createForm(this),
      appSecret: null,
      dropdowns: {
        refreshTokenLifespan: [],
        levels: [
          { value: 1, label: 1 },
          { value: 2, label: 2 },
          { value: 3, label: 3 },
          { value: 4, label: 4 },
          { value: 5, label: 5 },
          { value: 6, label: 6 }
        ],
        status: [
          { label: i18nRender('table.select.enable'), value: 'Enable' },
          { label: i18nRender('table.select.disable'), value: 'Disable' }
        ]
      },
      selectedAppTemplate: 'None'
    }
  },
  props: {
    value: Boolean,
    model: {
      type: Object,
      default: () => null
    }
  },
  watch: {
    value(visible) {
      if (visible) {
        this.form.setFieldsValue({
          clientSecret: '****************'
        })
        this.appSecret = generateCode(16)
      }
    }
  },
  created() {
    fields.forEach((v) => this.form.getFieldDecorator(v))
    this.$watch('model', () => {
      this.selectedAppTemplate = 'None'
      if (this.model?.id) {
        const { refreshTokenLifespan, clientId, clientName, clientSecret } = this.model.oauth2RegisteredClient
        this.model &&
          this.form.setFieldsValue({
            ...pick(this.model, fields),
            clientSecret: '****************',
            clientId,
            clientName,
            refreshTokenLifespan: refreshTokenLifespan.toString()
          })
        setTimeout(() => {
          this.form.setFieldsValue({
            ipWhitelist: this.model?.ipWhitelist?.replaceAll('\n', '').replaceAll(',', ',\n')
          })
        }, 100)
        this.appSecret = clientSecret
        this.fileList = this.model.attachments?.map((attachment) => {
          const { fileOriginName: name, fileLink: url } = attachment
          return {
            uid: '-1',
            name,
            status: 'done',
            url,
            update: true
          }
        })

        this.selectedAppTemplate = this.model.appTemplate
      }
    })
    this.fetchRefreshTokenLifespan()
  },
  methods: {
    validateIp,
    i18nRender,
    onChange(selectedValue) {
      this.selectedAppTemplate = selectedValue
    },
    async fetchRefreshTokenLifespan() {
      this.dropdowns.refreshTokenLifespan = []
      const { data: sessionDuration } = await this.$store.dispatch('dropdowns/refreshTokenLifespan')
      sessionDuration?.map((item) => {
        this.dropdowns?.refreshTokenLifespan.push({ value: item, label: this.translateDuration(item) })
      })
    },
    fileTypeCheck(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error(this.$t('messages.png-jpg-only'))
      }
      return isJpgOrPng
    },
    handleChange({ file, fileList }) {
      // For removing of logo from api
      const isEdit = file.update
      const index = this.fileList.findIndex((x) => x.uid === file.uid)
      if (isEdit) {
        this.fileList.splice(index, 1)
        return
      }
      // For uploading new photo
      if (this.fileTypeCheck(file)) {
        this.fileList = fileList
      }
    },
    reduceDropdown(data) {
      return data.reduce((prev, curr) => {
        const data = {
          label: curr.name,
          value: curr.name
        }
        prev.push(data)
        return prev
      }, [])
    },
    // 初始化方法
    /**
     * 提交表单
     */
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      validateFields(async (errors, values) => {
        if (!errors) {
          this.confirmLoading = true
          try {
            const data = fields.reduce(
              (prev, curr) => {
                const oauth = ['clientId', 'clientName', 'refreshTokenLifespan']
                if (!oauth.includes(curr)) prev[curr] = values[curr]
                // else if (curr === 'clientSecret') prev.oauth2RegisteredClient.clientSecret = this.appSecret
                else prev.oauth2RegisteredClient[curr] = values[curr]
                return prev
              },
              { oauth2RegisteredClient: {} }
            )

            if (this.model?.id) {
              data.id = this.model.id
            }
            data.ipWhitelist = data?.ipWhitelist?.replaceAll('\n', '')
            !this.model?.id
              ? await this.$store.dispatch('app-management/add', data)
              : await this.$store.dispatch('app-management/update', data)
            this.$emit('refreshTable')
            this.closeModal()
            !this.model?.id
              ? this.showNotification(i18nRender('notification.application.added'))
              : this.showNotification(i18nRender('notification.application.updated'))
          } catch (e) {
            console.log(e)
            this.$message.error(this.$t(e?.response?.data?.code))
          }
          this.confirmLoading = false
        }
      })
    },
    showNotification(message) {
      this.$notification.open({
        message,
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    closeModal() {
      this.$emit('input', false)
      this.$emit('clearModel')
      this.fileList = []
      this.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .file-upload_help-right.ant-form-item-with-help {
  .ant-col.ant-form-item-control-wrapper .ant-form-item-control {
    display: flex;
    align-items: center;

    .ant-form-explain {
      margin-bottom: 20px;
    }
  }
}
</style>
