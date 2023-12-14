<template>
  <div>
    <a-modal
      :title="$t('table.column.permission-configuration')"
      :okButtonProps="{ style: { display: treeData.length == 0 ? 'none' : '' } }"
      v-model="modal.show"
      :width="500"
      :okText="$t('table.action.save')"
      :maskClosable="false"
      :confirmLoading="confirmLoading"
      @cancel="closeModal()"
      @ok="handleSubmit()"
    >
      <a-form :form="form" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }">
        <a-form-item :label="$t('table.column.permission')">
          <a-spin v-if="treeData.length" :spinning="isLoading">
            <a-tree
              :style="{ maxWidth: 400, overflowY: 'auto', overflowX: 'auto' }"
              v-model="checkedKeys"
              checkable
              :expanded-keys="expandedKeys"
              :selected-keys="selectedKeys"
              :tree-data="treeData"
              @expand="onExpand"
              @select="onSelect"
              @check="onCheck"
            />
          </a-spin>
          <p v-else>-</p>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'RoleManagementConfigAccessModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fields: ['sysResourceIds'],
      isLoading: false,
      expandedKeys: [],
      selectedKeys: [],
      checkedKeys: [],
      halfChecked: [],
      saving: false,
      visible: false,
      treeData: [],
      flatTreeData: [],
      allowedType: [],
      confirmLoading: false
    }
  },
  computed: {
    applicationList() {
      return this.mainParent.activeApplicationList
    },
    mainParent() {
      return this.getParent('RoleManagement')
    }
  },
  watch: {
    async modal(params) {
      if (params.show && params?.data) {
        const {
          sysResourceResponse,
          sysResourceHalfChecksResponse,
          application: { id }
        } = params.data
        await this.fetchPermissions(id)
        await this.$nextTick()
        this.checkedKeys = sysResourceResponse?.reduce((acc, item) => {
          const { status, id } = item
          if (status === 'Enable') acc.push(id)
          return acc
        }, [])
        this.halfChecked = sysResourceHalfChecksResponse?.reduce((acc, item) => {
          const { status, id } = item
          if (status === 'Enable') acc.push(id)
          return acc
        }, [])
      }
    }
  },
  methods: {
    validateHalfChecks(parentResourceId) {
      const parent = this.flatTreeData.find((x) => x.resourceId === parentResourceId)
      const children = this.flatTreeData.filter((x) => x.parentResourceId === parent?.resourceId) || []
      const allChecked = children.every((x) => this.checkedKeys.includes(x.id))
      let arr = []
      if (allChecked) {
        const index = this.checkedKeys.findIndex((id) => id === parent?.id)
        if (index === -1) this.checkedKeys.push(parent?.id)
      } else {
        arr.push(parent?.id)
      }
      const parentHasParent = this.flatTreeData.find((x) => x.resourceId === parent?.parentResourceId)
      if (parentHasParent) {
        const data = this.validateHalfChecks(parent.parentResourceId)
        arr = [...arr, ...data]
      }
      return arr
    },
    onCheck(checkedKeys, info) {
      this.halfChecked = info.halfCheckedKeys
      this.checkedKeys = checkedKeys
    },
    recursive(arr) {
      return arr.reduce((prev, curr) => {
        if (curr.children?.length > 0) {
          const data = this.recursive(curr.children)
          prev.push(data)
        }
        prev.push(curr)
        return prev.flat()
      }, [])
    },
    async fetchPermissions(applicationId) {
      this.isLoading = true
      try {
        const { data } = await this.$store.dispatch('menu-resources/fetchMenuTreeActive', { applicationId })
        this.treeData = this.generateTree(data)
        this.flatTreeData = this.recursive(data)
      } catch (e) {}
      this.isLoading = false
    },
    generateTree(data) {
      return data.reduce((list, item) => {
        const obj = {
          title: item.permissionName,
          key: item.id
        }
        item.children && (obj.children = this.generateTree(item.children))
        if (item.status === 'Enable') list.push(obj)
        return list
      }, [])
    },
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    showNotification() {
      this.$notification.open({
        message: this.$t('notification.permission.updated'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    async showInfo() {
      this.confirmLoading = true
      const data = {
        id: this.modal.data.id,
        sysResourceIds: [...this.checkedKeys],
        sysResourceHalfCheckIds: [...this.halfChecked]
      }
      try {
        await this.$store.dispatch('role-management/updatePermission', data)
        this.showNotification()
        this.closeModal()
        this.$emit('refreshTable')
      } catch (e) {
        this.$message.error(this.$t(e?.response?.data?.code))
      }
      this.confirmLoading = false
    },
    closeModal() {
      this.form.resetFields()
      this.checkedKeys = []
      this.halfChecked = []
      this.expandedKeys = []
      this.flatTreeData = []
    }
  }
}
</script>
