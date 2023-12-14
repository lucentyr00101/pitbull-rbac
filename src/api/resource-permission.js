import request from '@/utils/request'

const api = {
  list: '/sysResource/search',
  updatePermission: '/sysResource/update/permission',
  updateBatchConfiguration: '/sysResource/update/configuration'
}

export function fetchList(data) {
  return request({
    url: api.list,
    method: 'post',
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

export function updateBatchConfiguration(data) {
  return request({
    url: api.updateBatchConfiguration,
    method: 'put',
    data
  })
}
