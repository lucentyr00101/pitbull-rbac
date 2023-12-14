<template>
  <div>
    <a-card :bordered="false">
      <FilterForm
        :columns="columns"
        v-model="queryParam"
        @click="$refs.table.refresh(true)"
        queryPermission="appList-query"
        resetPermission="appList-reset"
      >
        <template #operator>
          <a-button v-action:appList-addNew @click="showModal = true" type="primary">
            {{ $t('table.action.add-new') }}
          </a-button>
        </template>
      </FilterForm>
      <s-table
        permissionName="appList-view"
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
        <span slot="status" slot-scope="text">
          {{ $t(`table.select.${text.toLowerCase()}`) }}
        </span>

        <span slot="session-duration" slot-scope="text">
          {{ text ? translateDuration(text) : '-' }}
        </span>

        <span slot="attachments" slot-scope="text">
          <img
            v-if="text.length"
            style="width: 50px; height: 50px; cursor: pointer"
            :src="text[0]?.fileLink"
            alt=""
            @click="handlePreview(text[0].fileLink)"
          />
        </span>

        <span v-action:appList-edit slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">{{ $t('table.action.edit') }}</a>
        </span>
      </s-table>
    </a-card>
    <AppForm :model="model" v-model="showModal" @clearModel="model = null" @refreshTable="$refs.table.refresh(true)" />
    <ImagePreview v-model="showPreview" :link="currentImg" @clearImage="currentImg = null" />
  </div>
</template>

<script>
import { columns } from './settings'
import ImagePreview from '@/components/App/Global/ImagePreview'
import AppForm from '@/components/App/AppManagement/AppList/Form'

export default {
  components: {
    AppForm,
    ImagePreview
  },
  data() {
    return {
      showPreview: false,
      currentImg: null,
      model: null,
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const { oauth2RegisteredClient, ...rest } = this.queryParam
        const { clientId, clientName } = oauth2RegisteredClient || {}
        const _parameter = {
          page: pageNo - 1,
          size: pageSize,
          ...(clientId ? { applicationCode: clientId } : {}),
          ...(clientName ? { applicationName: clientName } : {})
        }
        const params = Object.assign(_parameter, rest)
        const { data } = await this.$store.dispatch('app-management/list', params)
        return data
      },
      queryParam: {},
      showModal: false
    }
  },
  computed: {
    columns() {
      return columns
    }
  },
  methods: {
    handlePreview(link) {
      this.showPreview = true
      this.currentImg = link
    },
    handleEdit(record) {
      this.model = { ...record }
      this.showModal = true
    }
  }
}
</script>
