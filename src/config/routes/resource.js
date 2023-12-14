const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: '/resource-management',
  redirect: '/resource-management/menu',
  component: RouteView,
  meta: { title: 'menu.resource', icon: 'form' },
  children: [
    {
      path: '/resource-management/menu',
      name: 'ResourceMenu',
      component: () => import('@/views/App/ResourceManagement/Menu'),
      meta: { title: 'menu.menu-resources', keepAlive: true }
    },
    {
      path: '/resource-management/permissions',
      name: 'ResourcePermissions',
      component: () => import('@/views/App/ResourceManagement/Permissions'),
      meta: { title: 'menu.resource-permission', keepAlive: true }
    }
  ]
}
