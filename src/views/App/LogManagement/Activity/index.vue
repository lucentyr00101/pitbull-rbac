<template>
  <div>
    <a-card>
      <FilterForm
        :columns="columns"
        v-model="queryParam"
        @click="$refs.table.refresh(true)"
        queryPermission="activityLog-query"
        resetPermission="activityLog-reset"
      />
      <s-table
        permissionName="activityLog-view"
        rowKey="id"
        ref="table"
        size="default"
        :columns="columns"
        :data="loadData"
        :pagination="{
          'show-total': (total, range) => $tc('table.label.total-items', total),
          showSizeChanger: true,
          showQuickJumper: true
        }"
      >
        <template #action="text, record">
          <a v-action:activityLog-view @click="viewRow(record)">{{ $t('table.action.c-view') }}</a>
        </template>
      </s-table>
    </a-card>
    <ViewLog v-model="showView" :model="mdl" />
  </div>
</template>

<script>
import ViewLog from '@/components/App/Log/ActivityLog/ViewLog'
import { columns } from './settings'

export default {
  components: {
    ViewLog
  },
  data() {
    return {
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const { clientName, url, ipAddress } = this.queryParam
        const params = {
          page: pageNo - 1,
          size: pageSize,
          ...(clientName ? { applicationName: clientName } : {}),
          ...(ipAddress ? { ipAddress } : {}),
          ...(url ? { url } : {})
        }
        const { data } = await this.$store.dispatch('log-management/activityList', params)
        return data
      },
      queryParam: {},
      appList: [],
      mdl: null,
      showView: false
    }
  },
  created() {
    this.fetchApps()
  },
  computed: {
    columns() {
      return columns([...this.appList])
    }
  },
  methods: {
    viewRow(data) {
      this.mdl = { ...data }
      this.showView = true
    },
    async fetchApps() {
      const initial = { value: 'All', label: this.$t('table.select.all') }
      try {
        const { data } = await this.$store.dispatch('dropdowns/applications')
        this.appList = data.reduce(
          (prev, curr) => {
            const obj = {
              label: curr.oauth2RegisteredClient.clientName,
              value: curr.oauth2RegisteredClient.clientName
            }
            prev.push(obj)
            return prev
          },
          [initial]
        )
      } catch (e) {}
    }
  }
}
</script>
