<template>
  <div>
    <a-modal
      v-model="modal.show"
      :width="700"
      :okText="isModalView ? $t('table.action.edit') : $t('table.action.save')"
      :maskClosable="false"
      @cancel="closeModal()"
      @ok="handleSubmit()"
    >
      <template slot="title">
        <div style="display: flex; align-items: center">
          <a-icon
            v-if="isModalReset"
            type="info-circle"
            theme="filled"
            style="color: red; font-size: 20px; margin-right: 10px"
          />
          {{ modalTitle }}
        </div>
      </template>
      <!-- ADD AND EDIT FORM -->
      <a-form :form="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 15 }" v-if="!isModalReset">
        <a-form-item :label="`${$t('table.column.account')}: `">
          <a-input
            :maxLength="25"
            :disabled="isModalView"
            v-decorator="[
              'account',
              {
                rules: [{ required: true, message: $t('error.account.required') }, { validator: validate }]
              }
            ]"
            type="text"
          />
        </a-form-item>

        <a-form-item :label="`${$t('table.column.password')}: `">
          <div style="display: flex">
            <a-input-password
              :maxLength="16"
              :disabled="!isModalEdit"
              type="password"
              v-decorator="[
                'password',
                {
                  rules: [{ required: true, message: $t('error.password.required') }]
                }
              ]"
            />
            <a-button style="margin-left: 10px" v-if="!isModalEdit" type="primary" @click="copyPassword">
              Copy
            </a-button>
          </div>
        </a-form-item>

        <a-form-item
          :label="$t('table.column.profile-picture')"
          :help="$t('messages.file-upload-help')"
          class="file-upload_help-right"
        >
          <a-upload
            list-type="picture-card"
            :file-list="fileList"
            @change="handleChange"
            :beforeUpload="() => false"
            accept="image/*"
            :remove="() => (removedProfilePicture = true)"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">{{ $t('form.upload') }}</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-spin :spinning="loading.appList">
          <a-form-item :label="$t('table.column.app')">
            <a-select
              style="width: 100%"
              @change="handleAppChange"
              :placeholder="$t('select')"
              v-decorator="[
                'applicationId',
                {
                  rules: [{ required: true, message: $t('error.application.required') }]
                }
              ]"
            >
              <a-select-option v-for="(item, index) in applicationList" :key="index" :value="item.value">{{
                item.label
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-spin>

        <a-form-item :label="$t('table.column.role')">
          <a-select
            mode="multiple"
            style="width: 100%"
            :placeholder="$t('select')"
            v-decorator="[
              'roleId',
              {
                rules: [{ required: true, message: $t('error.role.required') }]
              }
            ]"
          >
            <a-select-option v-for="(item, index) in roleList" :key="index" :value="item.value">{{
              item.label
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item :label="$t('table.column.status')">
          <a-select
            style="width: 100%"
            :placeholder="$t('select')"
            v-decorator="[
              'status',
              {
                initialValue: 'Enable',
                rules: [{ required: true, message: $t('error.status.required') }]
              }
            ]"
          >
            <a-select-option v-for="(item, index) in status" :key="index" :value="item.value">{{
              item.label
            }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-spin :spinning="loading.sessionDuration">
          <a-form-item :label="$t('table.column.session-duration')">
            <a-select
              style="width: 100%"
              :placeholder="$t('select')"
              v-decorator="[
                'sessionDuration',
                {
                  rules: [{ required: true, message: $t('error.session-duration.required') }]
                }
              ]"
            >
              <a-select-option v-for="(item, index) in sessionDurationList" :key="index" :value="item.value">{{
                item.label
              }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-spin>

        <a-form-item :label="$t('table.column.google-auth-status')">
          <a-select
            style="width: 100%"
            :placeholder="$t('select')"
            v-decorator="[
              'gaStatus',
              {
                initialValue: 'Enable',
                rules: [{ required: true, message: $t('error.google-auth-status.required') }]
              }
            ]"
          >
            <a-select-option v-for="(item, index) in status" :key="index" :value="item.value">{{
              item.label
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.column.ip-whitelist')">
          <a-input
            type="textarea"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            :maxLength="159"
            :placeholder="$t('form.ipWhitelist')"
            v-decorator="['ipWhitelist', { rules: [{ validator: validateIp }] }]"
          />
        </a-form-item>
      </a-form>
      <!-- GA CODE RESET FORM -->
      <a-form v-else :form="form" style="padding: 5px">
        <p>{{ $t('table.dialog.ga-subtitle') }}</p>
        <a-form-item :label="`${$t('table.column.enter-ga-code')}: `">
          <a-input
            :maxLength="25"
            :placeholder="$t('table.column.enter-ga-code')"
            v-decorator="[
              'code',
              {
                rules: [{ required: true, message: $t('error.ga-code.required') }]
              }
            ]"
            type="text"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'
import { validateIp } from '@/utils/validators'

export default {
  name: 'UserManagementModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      InfoCircle,
      form: this.$form.createForm(this),
      fields: [
        'account',
        'password',
        'applicationId',
        'roleId',
        'status',
        'sessionDuration',
        'gaStatus',
        'attached',
        'ipWhitelist'
      ],
      status: [
        { label: this.$t('table.select.enable'), value: 'Enable' },
        { label: this.$t('table.select.disable'), value: 'Disable' }
      ],
      fileList: [],
      selectedAppId: null,
      sessionDurationList: [],
      loading: {
        appList: false,
        sessionDuration: false
      },
      removedProfilePicture: false
    }
  },
  computed: {
    roleList() {
      return this.mainParent.roleList.filter((item) => item.applicationId === this.selectedAppId)
    },
    applicationList() {
      return this.mainParent.activeApplicationList
    },
    mainParent() {
      return this.getParent('UserManagement')
    },
    isModalView() {
      return this.modal?.action === 'view'
    },
    isModalEdit() {
      return this.modal?.action === 'edit'
    },
    isModalReset() {
      return this.modal?.action === 'reset'
    },
    modalTitle() {
      if (this.isModalView) {
        return this.$t('table.action.view')
      } else if (this.isModalEdit) {
        return this.$t('table.action.edit')
      } else if (this.isModalReset) {
        return this.$t('table.dialog.reset-ga-code')
      }
      return this.$t('table.action.add-new')
    }
  },
  watch: {
    modal(params) {
      if (params.action === 'add') this.generatePassword()
      this.sessionDurationList = []
      this.mainParent.getDropdowns()
      if (params.show && params.action !== 'add' && params?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const {
          username,
          password,
          application,
          roles,
          status,
          sessionDuration,
          gaStatus,
          profilePictures,
          ipWhitelist
        } = params.data
        this.form.setFieldsValue({
          account: username,
          password,
          applicationId: application.id,
          roleId: roles.map((item) => {
            return item.id
          }) || [],
          status,
          sessionDuration,
          gaStatus
        })
        setTimeout(() => {
          this.form.setFieldsValue({
            ipWhitelist: ipWhitelist?.replaceAll('\n', '')?.replaceAll(',', ',\n')
          })
        }, 100)

        this.fileList = profilePictures.map((attachment) => {
          const { fileOriginName: name, fileLink: url } = attachment
          return {
            uid: '-1',
            name,
            status: 'done',
            url,
            update: true
          }
        })

        this.selectedAppId = application.id
        this.getSessionDuration(application.id)
      }
    }
  },
  methods: {
    validateIp,
    async handleAppChange(e) {
      this.selectedAppId = e
      this.form.setFieldsValue({ roleId: [] })
      await this.getSessionDuration(e)
      this.form.setFieldsValue({ sessionDuration: '1 Hour' })
    },
    validate(rule, value, callback) {
      var hasWhiteSpace = value.indexOf(' ') >= 0
      if (hasWhiteSpace) callback(new Error(this.$t('error.space.not-allowed')))
      else callback()
    },
    async getSessionDuration(applicationId) {
      this.loading.sessionDuration = true
      try {
        this.sessionDurationList = []
        const { data: sessionDuration } = await this.$store.dispatch('dropdowns/sessionDuration', {
          applicationId
        })
        sessionDuration?.map((item) => {
          this.sessionDurationList.push({ value: item, label: this.translateDuration(item) })
        })
      } catch (e) {}
      this.loading.sessionDuration = false
    },
    generatePassword() {
      const Allowed = {
        Uppers: 'QWERTYUIOPASDFGHJKLZXCVBNM',
        Lowers: 'qwertyuiopasdfghjklzxcvbnm',
        Numbers: '1234567890',
        Symbols: '!@#&_'
      }

      const getRandomCharFromString = (str) => str.charAt(Math.floor(Math.random() * str.length))

      let pwd = ''
      pwd += getRandomCharFromString(Allowed.Uppers) // pwd will have at least one upper
      pwd += getRandomCharFromString(Allowed.Lowers) // pwd will have at least one lower
      pwd += getRandomCharFromString(Allowed.Numbers) // pwd will have at least one number
      pwd += getRandomCharFromString(Allowed.Symbols) // pwd will have at least one symbol
      for (let i = pwd.length; i < 16; i++) pwd += getRandomCharFromString(Object.values(Allowed).join(''))
      setTimeout(() => {
        this.form.setFieldsValue({ password: pwd })
      }, 100)
    },
    async copyPassword() {
      await navigator.clipboard.writeText(this.form.getFieldValue('password'))

      this.$notification.open({
        message: this.$t('notification.copy.success'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
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
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    showNotification() {
      this.$notification.open({
        message: this.isModalReset
          ? this.$t('notification.ga-code-reset.success')
          : this.isModalEdit
          ? this.$t('notification.user.updated')
          : this.$t('notification.user.added'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      if (this.isModalReset) return this.handleReset()

      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.action.yes'),
        cancelText: this.$t('table.action.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const formData = new FormData()
          const form = {
            ...(this.isModalEdit ? { id: this.modal.data.id } : {}),
            account: this.form.getFieldValue('account'),
            password: this.form.getFieldValue('password'),
            applicationId: this.form.getFieldValue('applicationId'),
            roleIds: this.form.getFieldValue('roleId'),
            status: this.form.getFieldValue('status'),
            sessionDuration: this.form.getFieldValue('sessionDuration'),
            gaStatus: this.form.getFieldValue('gaStatus'),
            ipWhitelist: this.form.getFieldValue('ipWhitelist')?.replaceAll('\n', ''),
            deletePreviousProfilePicture: this.removedProfilePicture
          }

          formData.append(
            this.isModalEdit ? 'sysUserUpdateParam' : 'sysUserAddParam',
            new Blob([JSON.stringify(form)], { type: 'application/json' })
          )

          this.fileList.forEach((r) => formData.append('profilePicture', r.originFileObj))

          try {
            await this.$store.dispatch(`user-management/${this.isModalEdit ? 'update' : 'add'}`, formData)
            await this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(
              this.$t(e?.response?.data?.code === 301 ? e?.response?.data?.message : e?.response?.data?.code)
            )
          }
        }
      })
    },
    async handleReset() {
      const { username } = this.modal.data
      if (!username) return
      try {
        const data = {
          username,
          code: this.form.getFieldValue('code'),
          language: 'English'
        }
        await this.$store.dispatch('user-management/reset', data)
        await this.showNotification()
        this.closeModal()
        this.$emit('refreshTable')
      } catch (e) {
        this.$message.error(this.$t(e?.response?.data?.code))
      }
    },
    closeModal() {
      this.form.resetFields()
      this.fileList = []
      this.removedProfilePicture = false
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
