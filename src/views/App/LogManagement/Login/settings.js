import { i18nRender } from '@/locales/index'

export const columns = (appEnums) => {
  return [
    {
      title: i18nRender('table.column.app'),
      dataIndex: 'clientName',
      valueType: 'select',
      api: true,
      valueEnums: appEnums,
      initialValue: 'All',
      width: '20%'
    },
    {
      title: i18nRender('table.column.user'),
      dataIndex: 'username',
      width: '20%'
    },
    {
      title: i18nRender('table.column.ip'),
      dataIndex: 'ipAddress',
      width: '20%'
    },
    {
      title: i18nRender('table.column.browser-information'),
      dataIndex: 'userAgent',
      width: '20%',
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.login-time'),
      dataIndex: 'loginTime',
      width: '20%',
      hideInSearch: true
    }
  ]
}
