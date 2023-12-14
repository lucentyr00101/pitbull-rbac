export default {
  path: '/role-management',
  name: 'RoleManagement',
  component: () => import('@/views/App/RolesManagement'),
  meta: { icon: 'form', title: 'menu.roles', keepAlive: true }
}
