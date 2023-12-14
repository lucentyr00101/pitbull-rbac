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
      />
    </a-card>
  </div>
</template>

<script>
import { columns } from './settings'

export default {
  data() {
    return {
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const { clientName, username, ipAddress } = this.queryParam
        const params = {
          page: pageNo - 1,
          size: pageSize,
          ...(clientName ? { applicationName: clientName } : {}),
          ...(username ? { username } : {}),
          ...(ipAddress ? { ipAddress } : {})
        }
        const { data } = await this.$store.dispatch('log-management/loginList', params)
        return data
      },
      queryParam: {},
      appList: []
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
