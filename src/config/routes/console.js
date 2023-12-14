export default {
  path: '/statistics',
  name: 'ConsoleStatistics',
  component: () => import('@/views/App/Console/UserStatistics'),
  meta: { icon: 'form', title: 'menu.online-users', keepAlive: true }
}
