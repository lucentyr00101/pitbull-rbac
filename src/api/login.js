import request from '@/utils/request'

const userApi = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  // get my info
  UserInfo: '/user/info',
  UserMenu: '/user/nav',
  RefreshToken: '/auth/refreshToken',
  getQr: '/auth/qrImage',
  verifyCode: '/auth/verify',
  me: '/auth/me'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function verifyCode (parameter, token) {
  return request({
    url: userApi.verifyCode,
    method: 'post',
    data: parameter,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function fetchCurrentUser (token) {
  return request({
    url: userApi.me,
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function refreshToken (data) {
  return request({
    url: userApi.RefreshToken,
    method: 'post',
    data,
    headers: {
      Authorization: ''
    }
  })
}

export function getQr (parameter) {
  const token = parameter.token
  const { username, applicationType } = parameter
  return request({
    url: userApi.getQr,
    method: 'put',
    data: {
      username,
      applicationType
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout (data) {
  return request({
    url: userApi.Logout,
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
