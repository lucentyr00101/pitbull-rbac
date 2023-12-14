import storage from 'store'
import expirePlugin from 'store/plugins/expire'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { autoLogout, welcome } from '@/utils/util'
import { login, getInfo, refreshToken, logout, verifyCode, fetchCurrentUser, getQr } from '@/api/login'
import generatePermissions from '@/utils/generatePermission'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {},
    userInfo: null,
    permissions: [],
    logoutModal: false,
    logoutType: null,
    actionPermissions: []
  },

  getters: {
    currentUser: (state) => state.userInfo,
    permissions: (state) => state.permissions,
    showLogout: (state) => state.logoutModal,
    logoutType: (state) => state.logoutType,
    actionPermissions: state => state.actionPermissions
  },

  mutations: {
    SET_ACTION_PERMISSIONS (state, payload) {
      state.actionPermissions = payload
    },
    SET_SHOW_LOGOUT: (state, payload) => {
      state.logoutModal = payload
    },
    SET_LOGOUT_TYPE (state, payload) {
      state.logoutType = payload
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_USER_INFO: (state, payload) => {
      state.userInfo = payload
    },
    SET_PERMISSIONS (state, payload) {
      state.permissions = [...payload]
    }
  },

  actions: {
    setActionPermissions ({ commit }, roles) {
      const data = generatePermissions(roles)
      commit('SET_ACTION_PERMISSIONS', data)
    },
    verifyCode ({ state }, payload) {
      const token = storage.get(ACCESS_TOKEN) || state.token
      return new Promise((resolve, reject) => {
        const data = {
          ...payload,
          applicationType: process.env.VUE_APP_PLATFORM_TYPE,
          username: payload.username || state.userInfo.username
        }
        verifyCode(data, token)
          .then((response) => {
            if (storage.get(`qr_${data.username}`)) {
              storage.remove(`qr_${data.username}`)
            }
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    fetchCurrentUser ({ state, commit }, payload) {
      const token = storage.get(ACCESS_TOKEN) || state.token
      return new Promise((resolve, reject) => {
        fetchCurrentUser(token)
          .then((response) => {
            commit('SET_USER_INFO', response.data)
            // commit(
            //   'SET_ROLES',
            //   response.data.roles.map((el) => el.userType.toLowerCase())
            // )
            // TODO: Set permissions here
            commit('SET_PERMISSIONS', [])
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getQrImage ({ state }, username) {
      const data = {
        username: username,
        token: state.token
      }
      return new Promise((resolve, reject) => {
        getQr(data)
          .then((response) => {
            storage.set(`qr_${username}`, response.data)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    // 登录
    RefreshToken ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        refreshToken({ refreshToken: payload })
          .then((response) => {
            const tokenExpiration = new Date().getTime() + 1000 * response.data.expiresIn - 500
            const refreshTokenExp = new Date().getTime() + 1000 * response.data.refreshExpiresIn - 500
            storage.set(ACCESS_TOKEN, response.data.accessToken, tokenExpiration)
            storage.set(REFRESH_TOKEN, response.data.refreshToken, refreshTokenExp)
            commit('SET_TOKEN', response.data.accessToken)
            resolve()
          })
          .catch((error) => {
            autoLogout()
            reject(error)
          })
      })
    },
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((response) => {
            commit('SET_TOKEN', response.data.accessToken)
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        // 请求后端获取用户信息 /api/user/info
        getInfo()
          .then((response) => {
            const { result } = response
            if (result.role && result.role.permissions.length > 0) {
              const role = { ...result.role }
              role.permissions = result.role.permissions.map((permission) => {
                const per = {
                  ...permission,
                  actionList: (permission.actionEntitySet || {}).map((item) => item.action)
                }
                return per
              })
              role.permissionList = role.permissions.map((permission) => {
                return permission.permissionId
              })
              // 覆盖响应体的 role, 供下游使用
              result.role = role

              commit('SET_ROLES', role)
              commit('SET_INFO', result)
              commit('SET_NAME', { name: result.name, welcome: welcome() })
              commit('SET_AVATAR', result.avatar)
              // 下游
              resolve(result)
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'))
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },

    // 登出
    Logout ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        logout(payload)
          .then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            storage.clearAll()
            resolve()
          })
          .catch((err) => {
            console.log('logout fail:', err)
            reject(err)
            // resolve()
          })
          .finally(() => {})
      })
    }
  }
}

export default user
