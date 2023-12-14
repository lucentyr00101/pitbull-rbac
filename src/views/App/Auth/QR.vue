<template>
  <div class="user-layout-content">
    <div class="top">
      <div class="loading">
        <a-spin :tip="$t('loading')" v-if="QRloading" style="margin: auto"> </a-spin>
        <div v-else>
          <div v-if="image" class="google-title">{{ $t('scan-qr-code') }}</div>
          <img :src="image" />
        </div>
      </div>
      <div class="description">{{ $t('user.insert.authcode') }}</div>
    </div>
    <div class="main">
      <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
        <a-form-item>
          <a-input
            size="large"
            type="text"
            :maxLength="6"
            :placeholder="$t('user.login.mobile.verification-code.placeholder')"
            v-decorator="[
              'qr',
              {
                rules: [{ required: true, message: $t('user.verification-code.required') }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item style="margin-top: 24px">
          <a-button
            :disabled="!(form.getFieldValue('qr') && form.getFieldValue('qr').length === 6)"
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            block
          >
            {{ $t('continue') }}
          </a-button>
        </a-form-item>
        <a-form-item style="margin-top: 24px">
          <a-button size="large" type="secondary" class="login-button" @click="backToLogin" block>
            {{ $t('back-to-login') }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import storage from 'store'
import { ACCESS_TOKEN, REFRESH_TOKEN, INITIAL_AUTH } from '@/store/mutation-types'
import UserLayout from '@/layouts/UserLayout.vue'
export default {
  data() {
    return {
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      form: this.$form.createForm(this, { onValuesChange: this.handleFormChange }),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      image: null,
      QRloading: false,
      disabledSubmit: true
    }
  },
  components: { UserLayout },
  async created() {
    this.runMiddleware()
    const token = this.$route.params.t
    const { isResetOtp, username } = this.$route.params
    if (token && isResetOtp) {
      await this.fetchQr()
    } else if (token && storage.get(`qr_${username}`)) {
      this.image = storage.get(`qr_${username}`)
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    handleFormChange(props, value) {
      this.disabledSubmit = value.qr.length < 6
    },
    // handler
    backToLogin() {
      const { email, password } = this.$route.params
      this.$router.push({ name: 'login', params: { email, password } })
    },
    async fetchQr() {
      // await this.$store.dispatch('fetchCurrentUser')
      this.QRloading = true
      try {
        const { username } = this.$route.params
        const res = await this.$store.dispatch('getQrImage', username)
        this.image = res.data
      } catch (error) {
      } finally {
        this.QRloading = false
      }
    },
    runMiddleware() {
      const keys = ['username', 'password', 'isResetOtp', 't', 'rt', 'expiresIn', 'refreshExpiresIn']
      const params = this.$route.params
      const valid = Object.keys(params).length > 0 && Object.keys(params).every((_key) => keys.includes(_key))
      if (!valid) {
        this.$router.push({ path: '/' })
      }
    },
    handleUsernameOrEmail(rule, value, callback) {
      const { state } = this
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        state.loginType = 0
      } else {
        state.loginType = 1
      }
      callback()
    },
    async handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err) => {
        if (err) return
        try {
          const { username } = this.$route.params
          const data = {
            code: this.form.getFieldValue('qr'),
            username
          }
          await this.$store.dispatch('verifyCode', data)
          await this.setTokens()
          this.$router.push({ path: '/' })
          this.$message.success(this.$t('notification.login-success'))
          storage.remove(INITIAL_AUTH)
        } catch (ex) {
          console.log(e)
          this.$message.error(this.$t(ex?.response?.data?.code))
        }
      })
    },
    setTokens() {
      return new Promise((resolve) => {
        const { expiresIn, refreshExpiresIn, t: token, rt: refreshToken } = this.$route.params
        const tokenExpiration = new Date().getTime() + 1000 * expiresIn
        const refreshTokenExp = new Date().getTime() + 1000 * refreshExpiresIn
        storage.set(ACCESS_TOKEN, token, tokenExpiration)
        storage.set(REFRESH_TOKEN, refreshToken, refreshTokenExp)
        this.$store.commit('SET_TOKEN', token)
        resolve()
      })
    },
    loginSuccess(res) {
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      /*
      this.$router.push({ name: 'analysis' }, () => {
        console.log('onComplete')
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      })
      */
      this.$router.push({ path: '/system-setup' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed(err) {
      this.isLoginError = true
      console.log(err)
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
  }
}
</script>

<style lang="less" scoped>
.loading {
  display: flex;
}
.google-title {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 700;
}
.description {
  font-size: 16px;
  margin-bottom: 12px;
}
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .container {
    width: 100%;
    min-height: 100%;
    background: #f0f2f5 url(~@/assets/background.svg) no-repeat 50%;
    background-size: 100%;
    //padding: 50px 0 84px;
    position: relative;
    display: flex;
  }
}

@media (max-width: 960px) {
  .header {
    padding: 30px;
  }
}
</style>
