const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: '/app-management',
  redirect: '/app-management/app-list',
  component: RouteView,
  meta: { title: 'table.column.app', icon: 'form' },
  children: [
    {
      path: '/app-management/app-list',
      name: 'AppManagementList',
      component: () => import('@/views/App/AppManagement/AppList'),
      meta: { title: 'menu.app-list', keepAlive: true }
    },
    {
      path: '/app-management/user-management',
      name: 'AppManagementUserManagement',
      component: () => import('@/views/App/AppManagement/UserManagement'),
      meta: { title: 'menu.user-management', keepAlive: true }
    }
  ]
}
