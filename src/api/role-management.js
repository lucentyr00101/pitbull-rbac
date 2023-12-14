import request from '@/utils/request'

const api = {
  list: '/sysRole/search',
  add: '/sysRole/add',
  update: '/sysRole/update',
  updatePermission: '/sysRole/update/permissionConfig',
  fetchPermissions: '/sysResource/tree/active'
}

export function fetchList(data) {
  return request({
    url: api.list,
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: api.updatePermission,
    method: 'put',
    data
  })
}

export function fetchPermissions(params) {
  return request({
    url: api.fetchPermissions,
    method: 'get',
    params
  })
}
