<template>
  <div>
    <a-card :bordered="false">
      <FilterForm
        v-model="queryParam"
        :columns="columns"
        @click="$refs.table.refresh(true)"
        queryPermission="onlineUsers-query"
        resetPermission="onlineUsers-reset"
      />
      <s-table
        permissionName="onlineUsers-view"
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
        <template #online-duration="text">
          <DurationTimer :startTime="text" />
        </template>

        <span slot="action" slot-scope="text, data">
          <a @click="handleForceLogout(data)">{{ $t('table.action.force-logout') }}</a>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import { columns } from './settings'
import DurationTimer from '@/components/App/Global/DurationTimer'

export default {
  components: {
    DurationTimer
  },
  data() {
    return {
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const { clientName } = this.queryParam
        const params = {
          page: pageNo - 1,
          size: pageSize,
          ...(clientName ? { applicationName: clientName } : {})
        }
        const { data } = await this.$store.dispatch('user-stats/list', params)
        return data
      },
      queryParam: {},
      appList: [],
      interval: null
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
    async handleForceLogout({ id }) {
      try {
        await this.$store.dispatch('user-stats/revoke', { id })
        this.$refs.table.refresh()
      } catch (e) {
        console.log(e)
      }
    },
    async fetchApps() {
      const initial = { value: 'All', label: this.$t('table.select.all') }
      try {
        const { data } = await this.$store.dispatch('dropdowns/activeApplications')
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
