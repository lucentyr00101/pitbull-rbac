<template>
  <div>
    <a-card>
      <a-space>
        <span>{{ $t('table.column.app') }}: </span>
        <a-spin :spinning="loading.apps">
          <a-select v-model="selectedApp" :options="appList" style="min-width: 250px" />
        </a-spin>
        <!-- <a-button type="primary" @click="handleAddDirectory">{{ $t('table.action.add-new-directory') }}</a-button> -->
        <a-button type="primary" v-action:menuResources-addNewMenu @click="handleAddMenu">{{
          $t('table.action.add-new-menu')
        }}</a-button>
        <!-- <a-button type="primary" @click="handleAddSubmenu">{{ $t('table.action.add-new-submenu') }}</a-button> -->
        <a-button type="primary" v-action:menuResources-addNewAction @click="handleAddAction">{{
          $t('table.action.add-new-action')
        }}</a-button>
      </a-space>
    </a-card>
    <a-card style="margin-top: 20px">
      <a-row>
        <a-col :span="6">
          <a-tree
            @select="onSelect"
            :tree-data="menuData"
            :selectedKeys="selectedKeys"
            v-if="permissions.includes('menuResources-view')"
          >
            <template #title="data">
              <ellipsis :length="30" tooltip>
                {{ data.title }}
              </ellipsis>
            </template>
          </a-tree>
        </a-col>
        <a-col :span="18">
          <DirectoryForm
            v-if="isDirectory"
            @refresh="fetchMenuTree"
            :appId="selectedApp"
            :model="selectedItem"
            @delete="selectedItem = null"
          />
          <MenuForm
            v-if="isMenu"
            @refresh="fetchMenuTree"
            :parentId="selectedItem?.resourceId"
            :appId="selectedApp"
            :model="selectedItem"
            @delete="selectedItem = null"
          />
          <SubMenuForm
            v-if="isSubMenu"
            @refresh="fetchMenuTree"
            :parentId="selectedItem?.resourceId"
            :appId="selectedApp"
            :model="selectedItem"
            @delete="selectedItem = null"
          />
          <ActionForm
            v-if="isAction"
            @refresh="fetchMenuTree"
            :parentId="selectedItem?.resourceId"
            :appId="selectedApp"
            :model="selectedItem"
            @delete="selectedItem = null"
          />
        </a-col>
      </a-row>
    </a-card>
    <DirectoryModal v-model="showAddDirectory" @refresh="fetchMenuTree" :appId="selectedApp" />
    <MenuModal
      v-model="showAddMenu"
      :selectedItemType="selectedItem?.resourceType?.toLowerCase()"
      @refresh="fetchMenuTree"
      :parentId="selectedItem?.resourceId"
      :appId="selectedApp"
    />
    <SubmenuModal
      v-model="showAddSubmenu"
      @refresh="fetchMenuTree"
      :parentId="selectedItem?.resourceId"
      :appId="selectedApp"
    />
    <ActionModal
      v-model="showAddAction"
      @refresh="fetchMenuTree"
      :parentId="selectedItem?.resourceId"
      :appId="selectedApp"
    />
  </div>
</template>

<script>
import DirectoryForm from '@/components/App/ResourceManagement/MenuResource/DirectoryForm'
import MenuForm from '@/components/App/ResourceManagement/MenuResource/MenuForm'
import SubMenuForm from '@/components/App/ResourceManagement/MenuResource/SubMenuForm'
import ActionForm from '@/components/App/ResourceManagement/MenuResource/ActionForm'
import DirectoryModal from '@/components/App/ResourceManagement/MenuResource/Add/DirectoryModal'
import MenuModal from '@/components/App/ResourceManagement/MenuResource/Add/MenuModal'
import SubmenuModal from '@/components/App/ResourceManagement/MenuResource/Add/SubmenuModal'
import ActionModal from '@/components/App/ResourceManagement/MenuResource/Add/ActionModal'
import { Ellipsis } from '@/components'

export default {
  components: {
    DirectoryForm,
    MenuForm,
    SubMenuForm,
    ActionForm,
    DirectoryModal,
    MenuModal,
    SubmenuModal,
    ActionModal,
    Ellipsis
  },
  data() {
    return {
      loading: {
        apps: false
      },
      selectedKeys: [],
      showAddDirectory: false,
      showAddMenu: false,
      showAddSubmenu: false,
      showAddAction: false,
      form: this.$form.createForm(this),
      selectedItem: null,
      menuData: [],
      selectedApp: null,
      appList: []
    }
  },
  watch: {
    async selectedApp() {
      this.selectedItem = null
      this.selectedKeys = []
      await this.fetchMenuTree()
    }
  },
  async created() {
    await this.fetchApplications()
  },
  computed: {
    permissions() {
      return this.$store.getters.actionPermissions?.map((x) => x.accessCode)
    },
    isDirectory() {
      return this.selectedItem?.resourceType?.toLowerCase() === 'directory'
    },
    isMenu() {
      return this.selectedItem?.resourceType?.toLowerCase() === 'menu'
    },
    isSubMenu() {
      return this.selectedItem?.resourceType?.toLowerCase() === 'submenu'
    },
    isAction() {
      return this.selectedItem?.resourceType?.toLowerCase() === 'action'
    },
    canAddAction() {
      if (this.selectedItem && this.selectedItem.children) {
        const allChildrenAreActionType = this.selectedItem.children.every(
          (x) => x.resourceType.toLowerCase() === 'action'
        )
        return allChildrenAreActionType
      } else if (this.isDirectory || this.isMenu || this.isSubMenu) {
        return true
      }
      return false
    }
  },
  methods: {
    async fetchMenuTree() {
      try {
        const { data } = await this.$store.dispatch('menu-resources/fetchMenuTree', { applicationId: this.selectedApp })
        this.menuData = data
      } catch (e) {
        console.log(e)
      }
    },
    async fetchApplications() {
      this.loading.apps = true
      try {
        const { data } = await this.$store.dispatch('dropdowns/activeApplications')
        this.appList = data.map((app) => {
          return {
            label: app.oauth2RegisteredClient.clientName,
            value: app.id
          }
        })
      } catch (e) {
        console.log(e)
      }
      this.loading.apps = false
    },
    showWarning(message) {
      this.$warning({
        title: message
      })
    },
    handleAddDirectory() {
      this.selectedApp ? (this.showAddDirectory = true) : this.showWarning(this.$t('error.no-application-selected'))
    },
    handleAddMenu() {
      if (!this.selectedApp) {
        this.showWarning(this.$t('error.no-application-selected'))
      } else if (this.isDirectory) {
        this.showAddMenu = true
      } else if (this.isMenu) {
        this.showAddSubmenu = true
      } else if (!this.isAction) {
        this.showAddDirectory = true
      } else {
        this.showWarning(this.$t('error.no-directory-selected'))
      }
    },
    handleAddSubmenu() {
      if (!this.selectedApp) {
        this.showWarning(this.$t('error.no-application-selected'))
      } else if (!this.isMenu) {
        this.showWarning(this.$t('error.no-menu-selected'))
      } else {
        this.showAddSubmenu = true
      }
    },
    handleAddAction() {
      if (!this.selectedApp) {
        this.showWarning(this.$t('error.no-application-selected'))
      } else if (!this.canAddAction) {
        this.showWarning(this.$t('error.no-submenu-selected'))
      } else {
        this.showAddAction = true
      }
    },
    onSelect(selectedKeys, e) {
      if (selectedKeys.length) {
        this.selectedItem = { ...e.node.dataRef }
        this.selectedKeys = [...selectedKeys]
      } else {
        this.selectedKeys = []
        this.selectedItem = null
      }
    }
  }
}
</script>
