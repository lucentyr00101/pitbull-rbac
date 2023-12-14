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
      title: i18nRender('table.column.ip'),
      dataIndex: 'ipAddress'
    },
    {
      title: i18nRender('table.column.url'),
      dataIndex: 'url'
    },
    {
      title: i18nRender('table.column.request-parameters'),
      dataIndex: 'param',
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.response-results'),
      dataIndex: 'result',
      hideInSearch: true,
      ellipsis: true
    },
    {
      title: i18nRender('table.column.activity-time'),
      dataIndex: 'activityTime',
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.action'),
      dataIndex: 'action',
      scopedSlots: { customRender: 'action' },
      hideInSearch: true
    }
  ]
}
