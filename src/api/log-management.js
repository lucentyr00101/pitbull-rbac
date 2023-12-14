import request from '@/utils/request'

const api = {
  loginList: '/sysAccessLog/search',
  activityList: '/sysActivityLog/search'
}

export function activityList(data) {
  return request({
    url: api.activityList,
    method: 'post',
    data
  })
}

export function loginList(data) {
  return request({
    url: api.loginList,
    method: 'post',
    data
  })
}
