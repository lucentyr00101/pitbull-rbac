<template>
  <div>
    <a-modal
      :title="modalTitle"
      v-model="modal.show"
      :width="700"
      :okText="isModalView ? $t('table.action.edit') : $t('table.action.save')"
      :maskClosable="false"
      @cancel="closeModal()"
      @ok="handleSubmit()"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item :label="$t('table.column.app')">
          <a-select
            style="width: 100%"
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
        <a-form-item :label="`${$t('table.column.role')}: `">
          <a-input
            :maxLength="25"
            :disabled="isModalView"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: $t('error.role-name.required') }]
              }
            ]"
            type="text"
          />
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
            <a-select-option v-for="(item, index) in status" :key="index" :value="item.value">{{
              item.label
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :label="`${$t('table.column.remarks')}: `">
          <a-input :disabled="isModalView" v-decorator="['remarks']" :maxLength="100" type="textarea" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'RoleManagementModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fields: ['name', 'status', 'remarks', 'applicationId'],
      status: [
        { label: this.$t('table.select.enable'), value: 'Enable' },
        { label: this.$t('table.select.disable'), value: 'Disable' }
      ]
    }
  },
  computed: {
    applicationList() {
      return this.mainParent.activeApplicationList
    },
    mainParent() {
      return this.getParent('RoleManagement')
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
      this.mainParent.getApplicationList()
      if (params.show && params.action !== 'add' && params?.data) {
        this.fields.forEach((v) => this.form.getFieldDecorator(v))
        const { name, status, remarks, application } = params.data
        this.form.setFieldsValue({
          name,
          status,
          remarks,
          applicationId: application.id || null
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
        message: this.isModalEdit ? this.$t('notification.role.updated') : this.$t('notification.role.added'),
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
            name: this.form.getFieldValue('name'),
            status: this.form.getFieldValue('status'),
            remarks: this.form.getFieldValue('remarks'),
            applicationId: this.form.getFieldValue('applicationId')
          }
          try {
            await this.$store.dispatch(`role-management/${this.isModalEdit ? 'update' : 'add'}`, data)
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
