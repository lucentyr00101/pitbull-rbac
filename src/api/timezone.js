import request from '@/utils/request'

const api = {
  update: '/sysUser/timezone',
  list: '/sysTimezone/search'
}
export function update(data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}

export function list(data) {
  return request({
    url: api.list,
    method: 'post',
    data
  })
}
