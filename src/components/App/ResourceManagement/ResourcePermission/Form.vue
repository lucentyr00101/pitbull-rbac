<template>
  <div>
    <a-modal
      :title="modalTitle"
      v-model="modal.show"
      :width="600"
      :okText="isModalView ? $t('table.action.edit') : $t('table.action.save')"
      :maskClosable="false"
      @cancel="closeModal()"
      @ok="handleSubmit()"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
        <a-form-item :label="`${$t('table.column.app')}: `">
          <a-input :disabled="true" v-decorator="['application']" type="text" />
        </a-form-item>
        <a-form-item :label="`${$t('table.column.permission-name')}: `">
          <a-input
            :maxLength="25"
            :disabled="isModalView"
            v-decorator="[
              'permissionName',
              {
                rules: [{ required: true, message: $t('error.permission-name.required') }]
              }
            ]"
            type="text"
          />
        </a-form-item>
        <a-form-item :label="`${$t('table.column.permission-code')}: `">
          <a-input :disabled="true" v-decorator="['permissionCode']" type="text" />
        </a-form-item>
        <a-form-item :label="$t('table.column.type')">
          <a-select style="width: 100%" :placeholder="$t('select')" v-decorator="['resourceType']">
            <a-select-option v-for="(item, index) in type" :key="index" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="$t('table.column.status')">
          <a-select
            style="width: 100%"
            :placeholder="$t('select')"
            v-decorator="[
              'status',
              {
                initialValue: 'Enable'
              }
            ]"
          >
            <a-select-option v-for="item in status" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'ResouceManagementPermissionModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fields: ['application', 'permissionName', 'permissionCode', 'resourceType', 'status'],
      status: ['Enable', 'Disable'],
      type: ['Directory', 'Menu', 'Submenu', 'Action']
    }
  },
  computed: {
    mainParent() {
      return this.getParent('ResouceManagementPermission')
    },
    isModalView() {
      return this.modal?.action === 'view'
    },
    isModalEdit() {
      return this.modal?.action === 'edit'
    },
    modalTitle() {
      if (this.isModalView) {
        return this.$t('table.action.view')
      } else if (this.isModalEdit) {
        return this.$t('table.action.edit')
      }
      return this.$t('table.action.add-new')
    }
  },
  watch: {
    modal(params) {
      if (params.show && params.action !== 'add' && params?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { application, permissionName, permissionCode, resourceType, status } = params.data
        this.form.setFieldsValue({
          application: application.oauth2RegisteredClient.clientName,
          permissionName,
          permissionCode,
          resourceType,
          status
        })
      }
    }
  },
  methods: {
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    showNotification() {
      this.$notification.open({
        message: this.isModalEdit ? this.$t('notification.resources-permission.updated') : '',
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    showInfo() {
      this.$confirm({
        title: this.$t('table.dialog.confirm-msg'),
        okText: this.$t('table.action.yes'),
        cancelText: this.$t('table.action.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          const data = {
            ...(this.isModalEdit ? { id: this.modal.data.id } : {}),
            permissionName: this.form.getFieldValue('permissionName'),
            resourceType: this.form.getFieldValue('resourceType'),
            status: this.form.getFieldValue('status')
          }
          try {
            await this.$store.dispatch(`resource-permission/updatePermission`, data)
            this.showNotification()
            this.closeModal()
            this.$emit('refreshTable')
          } catch (e) {
            this.$message.error(this.$t(e?.response?.data?.code))
          }
        }
      })
    },
    closeModal() {
      this.form.resetFields()
    }
  }
}
</script>
