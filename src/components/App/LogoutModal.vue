<template>
  <a-modal
    :visible="showModal"
    :maskClosable="false"
    :closable="false"
    :okButtonProps="{ style: { display: 'none' } }"
    :cancelButtonProps="{ style: { display: 'none' } }"
  >
    <div class="message">
      <p>{{ messagesMap() }}</p>
    </div>
  </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      timer: 5
    }
  },
  watch: {
    showModal(visible) {
      if (visible) {
        this.runTimer()
      }
    }
  },
  computed: {
    ...mapGetters(['showLogout', 'logoutType']),
    showModal() {
      return this.showLogout
    }
  },
  methods: {
    messagesMap() {
      const dict = {
        resetOTP: this.$tc('notification.ga-code.reset', this.timer),
        roleDisabled: this.$tc('notification.role.disabled', this.timer),
        roleUpdated: this.$tc('notification.role.updated-2', this.timer),
        permissionUpdated: this.$tc('notification.permission.updated-2', this.timer),
        disabled: this.$tc('notification.account.disabled', this.timer)
      }
      return dict[this.logoutType] || ''
    },
    async logout() {
      try {
        const payload = {
          username: this.$store.getters.currentUser.username
        }
        await this.$store.dispatch('Logout', payload)
        window.location.href = '/'
      } catch (e) {
        console.log(e)
      }
    },
    runTimer() {
      setTimeout(async () => {
        if (this.timer > 0) {
          this.timer--
          this.runTimer()
        } else {
          await this.logout()
        }
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.message {
  font-weight: bold;
  font-size: 20px;
  padding-top: 20px;
  p {
    margin-bottom: 0;
  }
}
</style>
