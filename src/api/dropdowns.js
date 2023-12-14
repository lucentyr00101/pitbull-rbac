import request from '@/utils/request'

const api = {
  applications: '/dropdown/application',
  activeApplications: '/dropdown/application/active',
  roles: '/dropdown/role',
  sessionDuration: '/dropdown/sessionDuration',
  refreshTokenLifespan: '/dropdown/refreshTokenLifespan'
}

export function applications(data) {
  return request({
    url: api.applications,
    method: 'get',
    data
  })
}

export function activeApplications(data) {
  return request({
    url: api.activeApplications,
    method: 'get',
    data
  })
}

export function roles(data) {
  return request({
    url: api.roles,
    method: 'get',
    data
  })
}

export function sessionDuration(params) {
  return request({
    url: api.sessionDuration,
    method: 'get',
    params
  })
}

export function refreshTokenLifespan(params) {
  return request({
    url: api.refreshTokenLifespan,
    method: 'get',
    params
  })
}
