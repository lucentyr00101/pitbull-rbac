import request from '@/utils/request'

const api = {
  list: '/onlineUserStatistic/search',
  revoke: 'onlineUserStatistic/revoke'
}

export function list(data) {
  return request({
    url: api.list,
    method: 'post',
    data
  })
}

export function revoke(data) {
  return request({
    url: api.revoke,
    method: 'post',
    data
  })
}
