// eslint-disable-next-line
import { fetchRoutes } from '@/api/login'
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView } from '@/layouts'
import { i18nRender } from '@/locales/index'

// 前端路由表 (基于动态)
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  '403': () => import(/* webpackChunkName: "error" */ '@/views/exception/403'),
  '404': () => import(/* webpackChunkName: "error" */ '@/views/exception/404'),
  '500': () => import(/* webpackChunkName: "error" */ '@/views/exception/500'),

  OnlineUsers: () => import('@/views/App/Console/UserStatistics'),

  // Application
  AppList: () => import('@/views/App/AppManagement/AppList'),
  UserManagement: () => import('@/views/App/AppManagement/UserManagement'),

  // Resource
  MenuResources: () => import('@/views/App/ResourceManagement/Menu'),
  ResourcePermission: () => import('@/views/App/ResourceManagement/Permissions'),

  Roles: () => import('@/views/App/RolesManagement'),

  LoginLog: () => import('@/views/App/LogManagement/Login'),
  ActivityLog: () => import('@/views/App/LogManagement/Activity')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*',
  redirect: '/404',
  hidden: true
}

// 根级菜单
const rootRouter = {
  key: '',
  name: 'index',
  pageUrl: '/',
  component: 'BasicLayout',
  redirect: '/onlineUsers',
  title: i18nRender('menu.home'),
  meta: {
    title: '首页'
  },
  children: []
}

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = async resourcePermissions => {
  try {
    const menuNav = []
    rootRouter.children = resourcePermissions
    menuNav.push(rootRouter)
    const routers = generator(menuNav, null)
    routers.push(notFoundRouter)
    console.log('routers', routers)
    return routers
  } catch (e) {
    throw e
  }
}

function hasView (obj) {
  if (obj) {
    const { title, resourceType } = obj
    return obj.children?.length > 0
      ? obj.children.some(child => hasView(child))
      : title?.toLowerCase() === 'view' && resourceType?.toLowerCase() === 'action'
  }
  return false
}

const toKebabCase = str =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('-')

function convertStringForLocales (str) {
  const kebab = toKebabCase(str)
  const _str = `menu.${kebab}`
  return i18nRender(_str).includes('menu')
    ? str
    : i18nRender(_str)
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  const routeTypes = ['directory', 'menu', 'submenu']
  return routerMap.reduce((routes, item) => {
    if (item.resourceType === undefined || routeTypes.includes(item.resourceType.toLowerCase())) {
      const {
        pageUrl: path,
        componentName: name,
        permissionName: permission,
        showMenu: show,
        title,
        redirect
      } = item
      const currentRouter = {
        path,
        name,
        redirect,
        component: constantRouterComponents[item.componentName || item.component || '404'] || RouteView,
        meta: {
          title: convertStringForLocales(title),
          icon: item.icon || undefined,
          permission
        }
      }
      const _hasView = hasView(item)
      // 是否设置了隐藏菜单

      /*
        Hierarchy: [Resource Permission > Batch Config > Roles Permissions]
        showmenu = yes | hasView = true
        false, !true[false] = hidden = false

        showmenu = yes | hasView = false
        false, !false[true] = hidden = true

        showmenu = no | hasView = true
        true = hidden = true
      */
      if (show === 'No' || !_hasView) {
        currentRouter.hidden = true
      }
      // 是否有子菜单，并递归处理
      if (item.children && item.children.length > 0) {
        // Recursion
        currentRouter.children = generator(item.children, currentRouter)
      }
      routes.push(currentRouter)
      return routes
    }
  }, [])
}
