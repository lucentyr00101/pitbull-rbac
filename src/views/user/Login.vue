<template>
  <div class="user-layout-content">
    <div class="top">
      <div class="title">
        {{ $t('menu.welcome') }}
      </div>
    </div>
    <div class="main">
      <a-form id="formLogin" class="user-layout-login" ref="formLogin" :form="form" @submit="handleSubmit">
        <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px" :message="errorMessage" />
        <a-form-item>
          <a-input
            size="large"
            type="text"
            :placeholder="$t('user.login.userName')"
            :maxLength="25"
            :disabled="loginBtn"
            v-decorator="[
              'username',
              {
                rules: [{ required: true, message: $t('user.userName.required') }, { validator: handleUsernameOrEmail }]
              }
            ]"
          >
            <a-icon slot="prefix" type="user" :style="{ color: '#1890FF' }" />
          </a-input>
        </a-form-item>

        <a-form-item>
          <a-input-password
            size="large"
            :placeholder="$t('user.login.password')"
            :maxLength="16"
            :disabled="loginBtn"
            v-decorator="[
              'password',
              {
                rules: [
                  { required: true, message: $t('user.password.required') },
                  { min: 8, message: $t('user.password.required') }
                ]
              }
            ]"
          >
            <a-icon slot="prefix" type="lock" :style="{ color: '#1890FF' }" />
          </a-input-password>
        </a-form-item>

        <a-form-item style="margin-top: 24px">
          <a-button
            size="large"
            type="primary"
            htmlType="submit"
            class="login-button"
            :loading="loginBtn"
            :disabled="loginBtn"
            >{{ $t('user.login.login') }}</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { getSmsCaptcha } from '@/api/login'
import UserLayout from '@/layouts/UserLayout.vue'
import storage from 'store'
import { ACCESS_TOKEN, REFRESH_TOKEN, INITIAL_AUTH } from '@/store/mutation-types'

export default {
  components: {
    UserLayout
  },
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      errorMessage: null,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      requiredGoogleAuth: false,
      fields: ['username', 'password']
    }
  },
  created() {
    const { username, password } = storage.get(INITIAL_AUTH) || []
    if (username && password) {
      this.fields.forEach((v) => this.form.getFieldDecorator(v))
      this.form.setFieldsValue({
        username,
        password
      })
    }
    storage.remove(INITIAL_AUTH)
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    // handler
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
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },
    handleSubmit(e) {
      e.preventDefault()
      this.loginBtn = true

      const validateFieldsKey = this.customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha']

      this.form.validateFields(validateFieldsKey, { force: true }, async (err, values) => {
        if (!err) {
          try {
            const res = await this.Login(values)
            this.loginSuccess(res, values.username, values.password)

            const initalAuthExpiration = new Date().getTime() + 10000 * 5
            storage.set(INITIAL_AUTH, { username: values.username, password: values.password }, initalAuthExpiration)
          } catch (err) {
            this.requestFailed(err)
          }
          this.loginBtn = false
        }
        this.loginBtn = false
      })
    },
    getCaptcha(e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state
      } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true

          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          getSmsCaptcha({ mobile: values.mobile })
            .then((res) => {
              setTimeout(hide, 2500)
              this.$notification['success']({
                message: '提示',
                description: '验证码获取成功，您的验证码为：' + res.result.captcha,
                duration: 8
              })
            })
            .catch((err) => {
              setTimeout(hide, 1)
              clearInterval(interval)
              state.time = 60
              state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    setTokens(data) {
      return new Promise((resolve) => {
        const { expiresIn, refreshExpiresIn, accessToken: token, refreshToken } = data
        const tokenExpiration = new Date().getTime() + 1000 * expiresIn
        const refreshTokenExp = new Date().getTime() + 1000 * refreshExpiresIn
        storage.set(ACCESS_TOKEN, token, tokenExpiration)
        storage.set(REFRESH_TOKEN, refreshToken, refreshTokenExp)
        this.$store.commit('SET_TOKEN', token)
        resolve()
      })
    },
    async loginSuccess (res, username, password) {
      // check res.homePage define, set $router.push name res.homePage
      // Why not enter onComplete
      const { data } = res
      const { application } = data || {}
      const { oauth2RegisteredClient } = application || {}
      const { clientId } = oauth2RegisteredClient || {}
      if (clientId !== process.env.VUE_APP_CLIENT_ID) {
        this.errorMessage = 'You are not allowed to access this app.'
        this.isLoginError = true
      } else if (data?.gaStatus === 'Disable') {
        await this.setTokens(data)
        this.$router.push({ path: '/' })
        this.$message.success(this.$t('notification.login-success'))
      } else {
        this.$router.push({
          name: 'qr-verification',
          params: {
            t: data.accessToken,
            rt: data.refreshToken,
            expiresIn: data.expiresIn,
            refreshExpiresIn: data.refreshExpiresIn,
            username,
            password,
            isResetOtp: data.isResetOtp
          }
        })
      }
    },
    requestFailed(err) {
      this.errorMessage = this.$t(err?.response?.data?.code)
      this.isLoginError = true
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
