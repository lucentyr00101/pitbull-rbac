import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'
import global from './zh-CN/global'

import menu from './zh-CN/menu'
import setting from './zh-CN/setting'
import user from './zh-CN/user'
import dashboard from './zh-CN/dashboard'
import form from './zh-CN/form'
import result from './zh-CN/result'
import account from './zh-CN/account'
import table from './zh-CN/table'
import error from './zh-CN/error'
import modal from './zh-CN/modal'
import messages from './zh-CN/messages'
import notification from './zh-CN/notification'
import apiErrors from './zh-CN/api-errors'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentCN
}

export default {
  message: '-',

  'layouts.usermenu.dialog.title': '信息',
  'layouts.usermenu.dialog.content': '您确定要注销吗？',
  'layouts.userLayout.title': 'Ant Design 是西湖区最具影响力的 Web 设计规范',
  'continue': '继续',
  'back-to-login': '返回登录页',
  'scan-qr-code': '请使用谷歌身份验证器扫描二维码',
  'application': '应用',
  'hour': '{n} 小时',
  'hours': '{n} 小时',
  ...components,
  ...global,
  ...menu,
  ...setting,
  ...user,
  ...dashboard,
  ...form,
  ...result,
  ...account,
  ...table,
  ...error,
  ...modal,
  ...messages,
  ...notification,
  ...apiErrors
}
