import { constantRouterMap } from '@/config/router.config'
// import cloneDeep from 'lodash.clonedeep'
import { generatorDynamicRouter } from '@/router/generator-routers'

/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
// function hasPermission (permission, route) {
//   if (route.name === 'index') return true
//   if (route.meta && route.meta.permission) {
//     return permission.includes(route.meta.permission)
//   }
//   return true
// }

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

// function filterAsyncRouter (routerMap, permissions) {
//   const accessedRouters = routerMap.filter(route => {
//     if (hasPermission(permissions, route)) {
//       if (route.children && route.children.length) {
//         route.children = filterAsyncRouter(route.children, permissions)
//       }
//       return true
//     }
//     return false
//   })
//   return accessedRouters
// }

function deepMergeDuplicates(arr, prop) {
  const groups = {}

  arr.forEach((item) => {
    const propValue = item[prop]

    if (!propValue) {
      groups[null] = groups[null] || []
      groups[null].push(item)
    } else {
      groups[propValue] = groups[propValue] || []
      groups[propValue].push(item)
    }
  })

  const mergedArray = Object.values(groups).map((group) => {
    return group.reduce((merged, obj) => mergeObjects(merged, obj), {})
  })

  return mergedArray.sort((a, b) => a[prop] - b[prop])
}

function mergeObjects(obj1, obj2) {
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (obj1[key] !== undefined && typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
        obj1[key] = mergeObjects(obj1[key], obj2[key])
      } else {
        obj1[key] = obj2[key]
      }
    }
  }
  return obj1
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    async GenerateRoutes ({ commit }, roles) {
      const flatPermissions = roles?.map(x => x?.sysResourceResponse).flat() || []
      const data = deepMergeDuplicates(flatPermissions, 'id')
      try {
        const routers = await generatorDynamicRouter(data)
        commit('SET_ROUTERS', routers)
        return routers
      } catch (e) {
        throw e
      }
    }
  }
}

export default permission
