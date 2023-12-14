import { i18nRender } from '@/locales/index'

export const columns = (applicationEnums) => {
  return [
    {
      title: i18nRender('table.column.app'),
      dataIndex: 'applicationName',
      valueType: 'select',
      api: true,
      initialValue: 'All',
      valueEnums: [{ value: 'All', label: i18nRender('table.select.all') }].concat(applicationEnums),
      hideInTable: true
    },
    {
      title: i18nRender('table.column.app'),
      dataIndex: 'application.oauth2RegisteredClient.clientName',
      hideInSearch: true,
      width: '15%'
    },
    {
      title: i18nRender('table.column.permission-name'),
      dataIndex: 'permissionName',
      key: 'permissionName',
      width: '15%',
      labelWidth: 130
    },
    {
      title: i18nRender('table.column.permission-code'),
      dataIndex: 'permissionCode',
      key: 'permissionCode',
      width: '15%',
      labelWidth: 120
    },
    {
      title: i18nRender('table.column.type'),
      dataIndex: 'resourceType',
      key: 'resourceType',
      hideInSearch: true,
      scopedSlots: { customRender: 'type' },
      width: '15%'
    },
    {
      title: i18nRender('table.column.status'),
      dataIndex: 'status',
      key: 'status',
      valueType: 'select',
      initialValue: 'All',
      valueEnums: {
        All: i18nRender('table.select.all'),
        Enable: i18nRender('table.select.enable'),
        Disable: i18nRender('table.select.disable')
      },
      scopedSlots: { customRender: 'status' },
      width: '15%'
    },
    {
      title: i18nRender('table.column.created-time'),
      dataIndex: 'createdTime',
      hideInSearch: true,
      width: '15%'
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
