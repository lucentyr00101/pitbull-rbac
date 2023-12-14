<template>
  <div>
    <!-- <a @click="modalConfigHandler({ show: true, action: 'edit' })">{{ $t('table.action.config-access') }}</a> -->
    <a-card>
      <FilterForm
        :columns="columns"
        v-model="queryParam"
        @click="$refs.table.refresh(true)"
        queryPermission="roles-query"
        resetPermission="roles-reset"
      >
        <template #operator>
          <a-button v-action:roles-addNew @click="modalHandler({ show: true, action: 'add' })" type="primary">
            {{ $t('table.action.add-new') }}
          </a-button>
        </template>
      </FilterForm>
      <s-table
        permissionName="roles-view"
        rowKey="id"
        ref="table"
        size="default"
        :columns="
          columns.filter((item) => {
            return !item.hideInTable
          })
        "
        :data="loadData"
        :pagination="{
          'show-total': (total, range) => $tc('table.column.total-items', total),
          showSizeChanger: true,
          showQuickJumper: true
        }"
      >
        <span slot="status" slot-scope="text">
          <span :style="{ color: getColor(text) }">{{ $t(`table.select.${text.toLowerCase()}`) }}</span>
        </span>

        <span slot="action" slot-scope="text, data">
          <a v-action:roles-edit @click="modalHandler({ show: true, action: 'edit', data })">{{
            $t('table.action.edit')
          }}</a>
          <a-divider type="vertical" />
          <a v-action:roles-configAccess @click="modalConfigHandler({ show: true, action: 'edit', data })">{{
            $t('table.action.config-access')
          }}</a>
        </span>
      </s-table>
    </a-card>
    <FormModal :modal="formModal" @refreshTable="refreshTable" />
    <ConfigModal :modal="formModalConfig" @refreshTable="refreshTable" />
  </div>
</template>

<script>
import { columns } from './settings'
import FormModal from '@/components/App/RoleManagement/Form'
import ConfigModal from '@/components/App/RoleManagement/ConfigForm'
export default {
  name: 'RoleManagement',
  components: {
    FormModal,
    ConfigModal
  },
  data() {
    return {
      formModal: { show: false },
      formModalConfig: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const data = await this.$store.dispatch('role-management/fetchList', params)
        return data
      },
      queryParam: {},
      applicationList: [],
      activeApplicationList: []
    }
  },
  computed: {
    columns() {
      return columns(this.applicationList)
    }
  },
  created() {
    this.getApplicationList()
  },
  methods: {
    async getApplicationList() {
      this.applicationList = []
      const { data } = await this.$store.dispatch('dropdowns/applications')
      data?.map((item) => {
        this.applicationList.push({ value: item.id, label: item?.oauth2RegisteredClient?.clientName || '-' })
      })
      this.activeApplicationList = []
      const { data: activeApplications } = await this.$store.dispatch('dropdowns/activeApplications')
      activeApplications?.map((item) => {
        this.activeApplicationList.push({ value: item.id, label: item?.oauth2RegisteredClient?.clientName || '-' })
      })
    },
    getColor(status) {
      let color
      switch (status) {
        case 'Enable':
          color = 'green'
          break

        default:
          color = 'red'
          break
      }
      return color
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
      this.modalConfigHandler({ show: false })
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    modalConfigHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModalConfig = { show, action, data }
    }
  }
}
</script>
