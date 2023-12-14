import { i18nRender } from '@/locales/index'

export const columns = (appEnums) => {
  return [
    {
      title: i18nRender('table.column.app'),
      dataIndex: 'clientName',
      valueType: 'select',
      api: true,
      valueEnums: appEnums,
      initialValue: 'All'
    },
    {
      title: i18nRender('table.column.user'),
      dataIndex: 'sysUser.username',
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.ip'),
      dataIndex: 'ipAddress',
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.browser-information'),
      dataIndex: 'browserInfo',
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.online-duration'),
      dataIndex: 'duration',
      hideInSearch: true,
      scopedSlots: { customRender: 'online-duration' }
    },
    {
      title: i18nRender('table.column.login-time'),
      dataIndex: 'loginTime',
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.action'),
      dataIndex: 'action',
      key: 'action',
      scopedSlots: { customRender: 'action' },
      hideInSearch: true,
      width: '10%'
    }
  ]
}
