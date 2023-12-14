<template>
  <div>
    <a-card :bordered="false">
      <FilterForm
        @changeValue="handleChange"
        :columns="columns"
        v-model="queryParam"
        @click="$refs.table.refresh(true), (selectedApp = null)"
        queryPermission="userManagement-query"
        resetPermission="userManagement-reset"
      >
        <template #operator>
          <a-button v-action:userManagement-addNew @click="modalHandler({ show: true, action: 'add' })" type="primary">
            {{ $t('table.action.add-new') }}
          </a-button>
        </template>
      </FilterForm>
      <s-table
        permissionName="userManagement-view"
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
        <span slot="roles" slot-scope="text">
          <span v-for="(item, index) in text" :key="index"> {{ index > 0 ? ', ' + item.name : item.name }}</span>
        </span>
        <span slot="session-duration" slot-scope="text">
          {{ text ? translateDuration(text) : '-' }}
        </span>
        <span slot="profilePicture" slot-scope="text">
          <img
            v-if="text.length"
            style="width: 50px; height: 50px; cursor: pointer; object-fit: contain"
            :src="text[0]?.fileLink"
            alt=""
            @click="handlePreview(text[0].fileLink)"
          />
        </span>
        <span slot="status" slot-scope="text">
          <span :style="{ color: getColor(text) }">{{ $t(`table.select.${text.toLowerCase()}`) }}</span>
        </span>

        <span slot="action" slot-scope="text, data">
          <a v-action:userManagement-edit @click="modalHandler({ show: true, action: 'edit', data })">{{
            $t('table.action.edit')
          }}</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link"> {{ $t('table.action.more') }} <a-icon type="down" /> </a>
            <down-outlined />
            <a-menu slot="overlay">
              <a-menu-item v-action:userManagement-resetGA>
                <a @click="modalHandler({ show: true, action: 'reset', data })">{{
                  $t('table.action.reset-ga-code')
                }}</a>
              </a-menu-item>
              <a-menu-item v-action:userManagement-remove>
                <a @click="handleDelete(data)">{{ $t('table.action.remove') }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
      </s-table>
    </a-card>
    <FormModal :modal="formModal" @refreshTable="refreshTable" />
    <ImagePreview v-model="showPreview" :link="currentImg" @clearImage="currentImg = null" />
  </div>
</template>

<script>
import { columns } from './settings'
import ImagePreview from '@/components/App/Global/ImagePreview'
import FormModal from '@/components/App/AppManagement/User/Form'
import InfoCircle from '@/assets/info-circle.svg'

export default {
  name: 'UserManagement',
  components: {
    FormModal,
    ImagePreview
  },
  data() {
    return {
      formModal: { show: false },
      loadData: async (parameter) => {
        const { pageNo, pageSize } = parameter
        const _parameter = {
          page: pageNo - 1,
          size: pageSize
        }
        const params = Object.assign(_parameter, this.queryParam)
        const { data } = await this.$store.dispatch('user-management/list', params)
        return data
      },
      queryParam: {},
      applicationList: [],
      roleList: [],
      activeApplicationList: [],
      showPreview: false,
      currentImg: null,
      selectedApp: null
    }
  },
  computed: {
    columns() {
      return columns(this.applicationList, this.roleList, this.selectedApp)
    }
  },
  created() {
    this.getDropdowns()
  },
  methods: {
    handleDelete({ id }) {
      if (!id) return
      this.$confirm({
        title: this.$t('table.dialog.delete-user-msg'),
        okText: this.$t('table.action.yes'),
        cancelText: this.$t('table.action.no'),
        icon: () => <img style={{ float: 'left', marginRight: '16px' }} src={InfoCircle} />,
        onOk: async () => {
          try {
            await this.$store.dispatch('user-management/remove', { id })
            this.$notification.open({
              message: this.$t('notification.user.deleted'),
              icon: <a-icon type="check-circle" theme="twoTone" two-tone-color="#52c41a" />
            })
            this.refreshTable()
          } catch (e) {
            this.$message.error(this.$t(e?.response?.data?.code))
          }
        }
      })
    },
    handleChange({ name, value }) {
      if (name === 'applicationId') {
        this.selectedApp = value
      }
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
    handlePreview(link) {
      this.showPreview = true
      this.currentImg = link
    },
    async getDropdowns() {
      this.applicationList = []
      const { data } = await this.$store.dispatch('dropdowns/applications')
      data?.map((item) => {
        this.applicationList.push({ value: item.id, label: item?.oauth2RegisteredClient?.clientName || '-' })
      })
      const { data: roleList } = await this.$store.dispatch('dropdowns/roles')
      this.roleList = roleList?.map((item) => {
        return { value: item.id, label: item?.name || '-', applicationId: item?.application?.id || null }
      })
      this.activeApplicationList = []
      const { data: activeApplications } = await this.$store.dispatch('dropdowns/activeApplications')
      activeApplications?.map((item) => {
        this.activeApplicationList.push({ value: item.id, label: item?.oauth2RegisteredClient?.clientName || '-' })
      })
    },
    refreshTable() {
      this.$refs.table.refresh()
      this.modalHandler({ show: false })
    },
    modalHandler(payload) {
      const { show = false, action = undefined, data = {} } = payload || {}
      this.formModal = { show, action, data }
    }
  }
}
</script>
