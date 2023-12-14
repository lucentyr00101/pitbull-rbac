<template>
  <div>
    <a-modal
      :title="$t('table.column.batch-permission-config')"
      :okButtonProps="{ style: { display: treeData.length == 0 ? 'none' : '' } }"
      v-model="modal.show"
      :width="500"
      :okText="$t('table.action.save')"
      :maskClosable="false"
      @cancel="closeModal()"
      @ok="handleSubmit()"
    >
      <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
        <a-form-item :label="`${$t('table.column.app')}: `" labelAlign="right">
          <a-select
            style="width: 100%"
            :placeholder="$t('select')"
            @change="(e) => fetchPermissions(e)"
            v-decorator="[
              'applicationId',
              {
                rules: [{ required: true, message: $t('error.app.required') }]
              }
            ]"
          >
            <a-select-option v-for="(item, index) in applicationList" :key="index" :value="item.id">{{
              item.label
            }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-spin :spinning="isLoading">
            <a-tree
              :style="{ maxWidth: 400, overflowY: 'auto', overflowX: 'auto' }"
              v-model="checkedKeys"
              checkable
              :checkStrictly="true"
              :expanded-keys="expandedKeys"
              :auto-expand-parent="autoExpandParent"
              :selected-keys="selectedKeys"
              :tree-data="treeData"
              @expand="onExpand"
              @select="onSelect"
              @check="onCheck"
            />
          </a-spin>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'ResourceManagementBatchModal',
  props: {
    modal: { type: Object, default: () => ({ show: false }) }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      fields: ['sysResourceIds'],
      isLoading: false,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      saving: false,
      visible: false,
      treeData: [],
      selectedAppId: null,
      allowedType: ['Directory', 'Menu', 'Submenu']
    }
  },
  computed: {
    applicationList() {
      return this.mainParent.applicationList
    },
    mainParent() {
      return this.getParent('ResouceManagementPermission')
    }
  },
  watch: {
    checkedKeys(data) {
      //
    }
  },
  methods: {
    returnId(arr) {
      return arr.reduce((prev, curr) => {
        const { showMenu, resourceType, id, children } = curr
        const allowed = this.allowedType.includes(resourceType)
        if (showMenu === 'Yes' && allowed) prev.push(id)
        if (children?.length) prev.push([...this.returnId(children)])
        return prev.flat()
      }, [])
    },
    async fetchPermissions(applicationId) {
      this.isLoading = true
      try {
        const { data } = await this.$store.dispatch('menu-resources/fetchMenuTree', { applicationId })
        this.treeData = this.generateTree(data)
        const checkedKeys = this.returnId(data)
        this.checkedKeys = { checked: checkedKeys }
        this.selectedAppId = applicationId
      } catch (e) {}
      this.isLoading = false
    },
    generateTree(data) {
      // const lang = storage.get('lang')
      return data.reduce((list, item) => {
        const obj = {
          title: item.permissionName,
          key: item.id
        }
        item.children && (obj.children = this.generateTree(item.children))
        if (this.allowedType.includes(item.resourceType)) list.push(obj)
        return list
      }, [])
    },
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck(checkedKeys, info) {
      this.checkedKeys = checkedKeys
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },
    handleSubmit() {
      this.form.validateFields((err, values) => !err && this.showInfo())
    },
    showNotification() {
      this.$notification.open({
        message: this.$t('notification.batch-permission.updated'),
        icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
      })
    },
    async showInfo() {
      const data = {
        applicationId: this.selectedAppId,
        resourceIds: [...this.checkedKeys.checked] || []
      }
      try {
        await this.$store.dispatch('resource-permission/updateBatchConfiguration', data)
        this.showNotification()
        this.closeModal()
        this.$emit('refreshTable')
      } catch (e) {
        this.$message.error(this.$t(e?.response?.data?.code))
      }
    },
    closeModal() {
      this.form.resetFields()
      this.checkedKeys = []
      this.selectedAppId = null
      this.treeData = []
      this.mainParent.getApplicationList()
    }
  }
}
</script>
