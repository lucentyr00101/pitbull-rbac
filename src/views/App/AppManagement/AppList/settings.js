import { i18nRender } from '@/locales/index'

export const columns = [
  {
    title: i18nRender('table.column.app-id'),
    dataIndex: 'oauth2RegisteredClient.clientId',
    width: '20%',
    key: 'app-id'
  },
  {
    title: i18nRender('table.column.app-name'),
    dataIndex: 'oauth2RegisteredClient.clientName',
    width: '20%',
    key: 'app-name',
    labelWidth: 100
  },
  {
    title: i18nRender('table.column.session-duration'),
    dataIndex: 'oauth2RegisteredClient.refreshTokenLifespan',
    key: 'refresh-token-lifespan',
    width: '20%',
    hideInSearch: true,
    scopedSlots: { customRender: 'session-duration' }
  },
  {
    title: i18nRender('table.column.status'),
    dataIndex: 'status',
    key: 'status',
    width: '20%',
    scopedSlots: { customRender: 'status' },
    valueType: 'select',
    initialValue: 'All',
    valueEnums: {
      All: i18nRender('table.select.all'),
      Enable: i18nRender('table.select.enable'),
      Disable: i18nRender('table.select.disable')
    }
  },
  {
    title: i18nRender('table.column.action'),
    dataIndex: 'action',
    key: 'action',
    width: '10%',
    scopedSlots: { customRender: 'action' },
    hideInSearch: true
  }
]
