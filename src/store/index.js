import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
// 默认路由模式为静态路由 (router.config.js)
import permission from './modules/static-router'

// dynamic router permission control (Experimental)
// 动态路由模式（api请求后端生成）
// import permission from './modules/async-router'

import getters from './getters'

import appManagement from './modules/app-management'
import roleManagement from './modules/role-management'
import dropdowns from './modules/dropdowns'
import menuResources from './modules/menu-resources'
import userManagement from './modules/user-management'
import resourcePermission from './modules/resource-permission'
import userStats from './modules/user-stats'
import logManagement from './modules/log-management'
import timezone from './modules/timezone'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission,
    dropdowns,
    'app-management': appManagement,
    'role-management': roleManagement,
    'menu-resources': menuResources,
    'user-management': userManagement,
    'resource-permission': resourcePermission,
    'user-stats': userStats,
    'log-management': logManagement,
    timezone
  },
  state: {},
  mutations: {},
  actions: {},
  getters
})
