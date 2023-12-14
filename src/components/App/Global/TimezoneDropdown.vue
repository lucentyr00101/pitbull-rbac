<template>
  <!-- v-if="currentUser"  -->
  <div style="padding: 0px;">
    <a-dropdown
      v-model="visible"
      :trigger="['click']"
      placement="bottomCenter"
      overlayClassName="_timezoneDropdown"
      style="padding: 0px 10px;"
    >
      <span ref="noticeRef" style="padding: 0 8px; display: block; height: 100%;">
        <span class="ant-pro-account-avatar" style="margin-right: 5px">
          <span style="margin-right: 10px"> {{ timezone }} </span>
          <!-- <img src="@/assets/globe_hires_1.svg" /> -->
        </span>
        <a-icon v-if="!visible" type="down" />
        <a-icon v-else type="up" />
      </span>
      <template v-slot:overlay>
        <a-menu class="ant-pro-drop-down menu">
          <template v-for="(item, i) in timezoneDropdown">
            <a-menu-item :key="i" @click="handleClick(item)">
              {{ item.label }}
            </a-menu-item>
          </template>
        </a-menu>
        </a-list>
      </template>
    </a-dropdown>
  </div>
</template>

<script>
// import Globe from '@/assets/globe_hires_1.svg'
import { mapGetters } from 'vuex'
import moment from 'moment'
import { i18nRender } from '@/locales'

export default {
  name: 'TimezoneDropdown',
  data() {
    return {
      timezoneDropdown: [],
      loading: false,
      loadingMore: false,
      showLoadingMore: false,
      visible: false,
      search: ''
    }
  },
  props: {
    menu: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    search(val) {
      console.log(val)
      if (val === '') {
        this.onSearch('')
      }
    }
  },
  computed: {
    ...mapGetters('timezone', [
      'timezone'
    ]),
    ...mapGetters(['currentUser'])
  },
  methods: {
    i18nRender,
    moment,
    fetchNotice() {
      if (!this.visible) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 2000)
      } else {
        this.loading = false
      }
      this.visible = !this.visible
    },
    async handleClick(selectedItem) {
      await this.$store.dispatch('timezone/update', { sysTimezoneId: selectedItem.value, id: this.currentUser.id })
      if (this.currentUser.sysTimezone) {
        this.$store.commit('timezone/SET_TIMEZONE', selectedItem?.label)
        this.$router.go()
      }
      this.visible = false
    },
    async onSearch(name) {
      this.loading = true
      try {
        const { data } = await this.$store.dispatch('timezone/list', {
          // language: this.$exportLang(),
          ...(name && { name })
        })
        this.timezoneDropdown = data.data.map((el) => ({ value: el.id, label: el.code, offset: el.offset }))
      } catch (e) {}
      this.loading = false
    }
  },
  async created() {
    await this.onSearch(null)

    if (this.currentUser.sysTimezone) {
      const text = `${this.currentUser.sysTimezone.code}`
      this.$store.commit('timezone/SET_TIMEZONE', text)
    } else {
      const tz = this.timezoneDropdown.find(x => x.label === 'UTC +08')
      if (tz) {
        await this.$store.dispatch('timezone/update', { sysTimezoneId: tz.value, id: this.currentUser.id })
        this.$store.commit('timezone/SET_TIMEZONE', tz.label)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-dropdown-menu {
  overflow-y: scroll;
  height: 200px;
  .ant-dropdown-menu-item {
    :hover {
      cursor: pointer;
    }
  }
}

/* Not supports in Firefox and IE */

/* total width */
::-webkit-scrollbar {
  background-color: #fff;
  width: 16px;
}

/* background of the scrollbar except button or resizer */
::-webkit-scrollbar-track {
  background-color: #fff;
}

/* scrollbar itself */
::-webkit-scrollbar-thumb {
  background-color: #babac0;
  border-radius: 16px;
  border: 4px solid #fff;
}

/* set button(top and bottom of the scrollbar) */
::-webkit-scrollbar-button {
  display: none;
}

</style>
