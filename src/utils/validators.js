import { i18nRender } from '@/locales'

export function validateIp(rule, value, _callback) {
  try {
    if (!value) return _callback()
    const ipList = []
    value.split(',').forEach((item) => {
      ipList.push(item.replaceAll('\n', ''))
    })
    const regex =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
    const valid = ipList.every((ip) => regex.test(ip))
    if (ipList.length > 10) {
      _callback(i18nRender('messages.maximum-ip'))
    }
    return valid ? _callback() : _callback(i18nRender('messages.invalid-ip-address'))
  } catch (err) {
    return _callback(err)
  }
}
