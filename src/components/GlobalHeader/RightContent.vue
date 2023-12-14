<template>
  <div :class="wrpCls">
    <!-- <NoticeIcon /> -->
    <timezone-dropdown :menu="showTimezone" :class="prefixCls" />
    <a-divider type="vertical"/>
    <avatar-dropdown :menu="showMenu" :class="prefixCls" />
    <!-- <a @click="handleSettingDrawer"><img src="@/assets/setting-drawer-icon.svg" style="margin:0 8px 0 8px"/></a> -->
    <select-lang :class="prefixCls" />

    <!-- <setting-drawer v-if="isDev" :visible="visible" :settings="settings" @change="handleSettingChange" @setShow="handleSettingDrawer">
      <div style="margin: 12px 0">This is SettingDrawer custom footer content.</div>
    </setting-drawer> -->
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import SelectLang from '@/components/SelectLang'
import NoticeIcon from '../NoticeIcon/NoticeIcon.vue'
import SettingDrawer from '@/components/SettingDrawer/SettingDrawer.vue'
import TimezoneDropdown from '@/components/App/Global/TimezoneDropdown.vue'

import defaultSettings from '@/config/defaultSettings'
import { CONTENT_WIDTH_TYPE } from '@/store/mutation-types'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    SelectLang,
    NoticeIcon,
    TimezoneDropdown,
    SettingDrawer
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showMenu: true,
      showTimezone: true,
      currentUser: {},
      visible: false,
      isDev: process.env.NODE_ENV === 'development' || process.env.VUE_APP_PREVIEW === 'true',
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,
        multiTab: defaultSettings.multiTab,
        hideHintAlert: false,
        hideCopyButton: false
      }
    }
  },
  computed: {
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${this.isMobile || !this.topMenu ? 'light' : this.theme}`]: true
      }
    }
  },
  methods: {
    handleSettingChange({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
      }
    },
    handleSettingDrawer() {
      this.visible = !this.visible
    }
  }
}
</script>
