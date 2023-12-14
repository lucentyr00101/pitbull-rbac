import router, { resetRouter } from './router'
import store from './store'
import storage from 'store'
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import { setDocumentTitle, domTitle } from '@/utils/domUtil'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/store/mutation-types'
import { i18nRender } from '@/locales'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const allowList = ['login', 'qr-verification'] // no redirect allowList
const loginRoutePath = '/user/login'
const defaultRoutePath = '/online-users'

const generateRoutes = async (to, from, next) => {
  await store.dispatch('fetchCurrentUser')
  await store.dispatch('GenerateRoutes', store.getters.currentUser.roles)
  await store.dispatch('setActionPermissions', store.getters.currentUser.roles)
  resetRouter()
  store.getters.addRouters.forEach(r => router.addRoute(r))

  const redirect = decodeURIComponent(from.query.redirect || to.path)
  if (to.path === redirect) {
    // set the replace: true so the navigation will not leave a history record
    next({ ...to, replace: true })
  } else {
    // 跳转到目的路由
    next({ path: redirect })
  }
}

router.beforeEach(async (to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && typeof to.meta.title !== 'undefined' && setDocumentTitle(`${i18nRender(to.meta.title)} - ${domTitle}`)
  /* has token */
  const token = storage.get(ACCESS_TOKEN)
  const refreshToken = storage.get(REFRESH_TOKEN)
  // const permissions = store.getters.permissions
  if (token) {
    if (to.path === loginRoutePath) {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      if (!store.getters.currentUser && store.getters.addRouters.length === 0) {
        await generateRoutes(to, from, next)
      } else {
        next()
      }
    }
  } else if (!token && refreshToken) {
    await store.dispatch('RefreshToken', refreshToken)
    await generateRoutes(to, from, next)
  } else {
     if (allowList.includes(to.name)) {
      // 在免登录名单，直接进入
      next()
    } else {
      next({ path: loginRoutePath, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
  // next()
  // } else {
  //   if (allowList.includes(to.name)) {
  //     // 在免登录名单，直接进入
  //     next()
  //   } else {
  //     next({ path: loginRoutePath, query: { redirect: to.fullPath } })
  //     NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  //   }
  // }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
