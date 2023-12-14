import request from '@/utils/request'

const api = {
  list: '/sysUser/search',
  add: '/sysUser/add',
  update: '/sysUser/update',
  reset: '/auth/resetOtp',
  remove: '/sysUser/delete'
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

export function reset(data) {
  return request({
    url: api.reset,
    method: 'put',
    data
  })
}

export function remove(params) {
  return request({
    url: api.remove,
    method: 'delete',
    params
  })
}
