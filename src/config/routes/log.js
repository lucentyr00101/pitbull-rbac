const RouteView = {
  name: 'RouteView',
  render: h => h('router-view')
}

export default {
  path: '/log-management',
  redirect: '/log-management/menu',
  component: RouteView,
  meta: { title: 'menu.log', icon: 'form' },
  children: [
    {
      path: '/log-management/login',
      name: 'LoginLog',
      component: () => import('@/views/App/LogManagement/Login'),
      meta: { title: 'menu.login-log', keepAlive: true }
    },
    {
      path: '/log-management/activity',
      name: 'ActivityLog',
      component: () => import('@/views/App/LogManagement/Activity'),
      meta: { title: 'menu.activity-log', keepAlive: true }
    }
  ]
}
