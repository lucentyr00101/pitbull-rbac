import antdEnUS from 'ant-design-vue/es/locale-provider/en_US'
import momentEU from 'moment/locale/eu'
import global from './en-US/global'

import menu from './en-US/menu'
import setting from './en-US/setting'
import user from './en-US/user'

import dashboard from './en-US/dashboard'
import form from './en-US/form'
import result from './en-US/result'
import account from './en-US/account'
import table from './en-US/table'
import error from './en-US/error'
import modal from './en-US/modal'
import messages from './en-US/messages'
import notification from './en-US/notification'
import apiErrors from './en-US/api-errors'

const components = {
  antLocale: antdEnUS,
  momentName: 'eu',
  momentLocale: momentEU
}

export default {
  message: '-',

  'layouts.usermenu.dialog.title': 'Message',
  'layouts.usermenu.dialog.content': 'Are you sure you would like to logout?',
  'layouts.userLayout.title': 'Ant Design is the most influential web design specification in Xihu district',
  'continue': 'Continue',
  'back-to-login': 'Back to Login Page',
  'scan-qr-code': 'Please scan the QR Code with Google Authenticator',
  'application': 'Application',
  'hour': '{n} hour',
  'hours': '{n} hours',
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
