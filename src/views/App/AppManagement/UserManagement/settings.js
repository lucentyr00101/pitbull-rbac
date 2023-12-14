import { i18nRender } from '@/locales/index'

export const columns = (applicationEnums, roleEnums, applicationId) => {
  return [
    {
      title: i18nRender('table.column.app'),
      dataIndex: 'applicationId',
      valueType: 'select',
      api: true,
      valueEnums: [{ value: 'All', label: i18nRender('table.select.all') }].concat(applicationEnums),
      initialValue: 'All',
      hideInTable: true
    },
    {
      title: i18nRender('table.column.role'),
      dataIndex: 'roleId',
      valueType: 'select',
      api: true,
      valueEnums: [{ value: 'All', label: i18nRender('table.select.all') }].concat(
        applicationId ? roleEnums.filter((item) => item.applicationId === applicationId) : roleEnums
      ),
      initialValue: 'All',
      hideInTable: true
    },
    {
      title: i18nRender('table.column.account'),
      dataIndex: 'account',
      width: 150,
      hideInTable: true
    },
    {
      title: i18nRender('table.column.status'),
      dataIndex: 'status',
      width: 150,
      valueType: 'select',
      initialValue: 'All',
      valueEnums: {
        All: i18nRender('table.select.all'),
        Enable: i18nRender('table.select.enable'),
        Disable: i18nRender('table.select.disable')
      },
      hideInTable: true
    },
    {
      title: i18nRender('table.column.account'),
      dataIndex: 'username',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.role'),
      dataIndex: 'roles',

      hideInSearch: true,
      scopedSlots: { customRender: 'roles' }
    },
    {
      title: i18nRender('table.column.session-duration'),
      dataIndex: 'sessionDuration',
      ellipsis: true,
      hideInSearch: true,
      scopedSlots: { customRender: 'session-duration' }
    },
    {
      title: i18nRender('table.column.app'),
      dataIndex: 'application.oauth2RegisteredClient.clientName',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.status'),
      dataIndex: 'status',
      ellipsis: true,
      hideInSearch: true,
      scopedSlots: { customRender: 'status' }
    },
    {
      title: i18nRender('table.column.profile-picture'),
      dataIndex: 'profilePictures',
      hideInSearch: true,
      scopedSlots: { customRender: 'profilePicture' }
    },
    {
      title: i18nRender('table.column.created-time'),
      dataIndex: 'createdTime',
      hideInSearch: true
    },
    {
      title: i18nRender('table.column.action'),
      dataIndex: 'action',
      width: 140,
      scopedSlots: { customRender: 'action' },
      hideInSearch: true
    }
  ]
}
