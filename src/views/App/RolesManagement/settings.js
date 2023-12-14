import { i18nRender } from '@/locales/index'

export const columns = (applicationEnums) => {
  return [
    {
      title: i18nRender('table.column.app'),
      dataIndex: 'applicationId',
      valueType: 'select',
      api: true,
      valueEnums: [{ value: 'All', label: i18nRender('table.select.all') }].concat(applicationEnums),
      hideInTable: true
    },
    {
      title: i18nRender('table.column.app'),
      dataIndex: 'application.oauth2RegisteredClient.clientName',
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.role'),
      dataIndex: 'name',
      key: 'name'
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
      scopedSlots: { customRender: 'status' }
    },
    {
      title: i18nRender('table.column.created-time'),
      dataIndex: 'createdTime',
      width: 300,
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.created-by'),
      dataIndex: 'createdBy',
      width: 300,
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.action'),
      dataIndex: 'action',
      key: 'action',
      width: 200,
      scopedSlots: { customRender: 'action' },
      hideInSearch: true
    }
  ]
}
