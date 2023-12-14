<template>
  <div>
    <a-card :bordered="false">
      <FilterForm
        v-model="queryParam"
        :columns="columns"
        @click="$refs.table.refresh(true)"
        queryPermission="resourcePermission-query"
        resetPermission="resourcePermission-reset"
      >
        <template #operator>
          <a-button
            v-action:resourcePermission-batchConfiguration
            @click="batchModalHandler({ show: true, action: 'batch' })"
            type="primary"
          >
            {{ $t('table.action.batch-configuration') }}
          </a-button>
        </template>
      </FilterForm>
      <s-table
        permissionName="resourcePermission-view"
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

        <span slot="type" slot-scope="text">
          <span>{{ $t(`table.select.${text.toLowerCase()}`) }}</span>
        </span>

        <span slot="action" v-action:resourcePermission-edit slot-scope="text, data">
          <a @click="modalHandler({ show: true, action: 'edit', data })">{{ $t('table.action.edit') }}</a>
        </span>
      </s-table>
    </a-card>
    <FormModal :modal="formModal" @refreshTable="refreshTable" />
    <BatchModal :modal="batchFormModal" @refreshTable="refreshTable" />
  </div>
</template>

<script>
import { columns } from './settings'
import FormModal from '@/components/App/ResourceManagement/ResourcePermission/Form'
import BatchModal from '@/components/App/ResourceManagement/ResourcePermission/BatchForm'
export default {
  name: 'ResouceManagementPermission',
  components: {
    FormModal,
    BatchModal
  },
  data() {
    return {
      formModal: { show: false },
      batchFormModal: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const { data } = await this.$store.dispatch('resource-permission/fetchList', params)
        return data
      },
      queryParam: {},
      applicationList: []
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
        this.applicationList.push({
          value: item?.oauth2RegisteredClient?.clientName || '-',
          label: item?.oauth2RegisteredClient?.clientName || '-',
          id: item?.id
        })
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
      this.batchModalHandler({ show: false })
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    },
    batchModalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.batchFormModal = { show, action, data }
    }
  }
}
</script>
