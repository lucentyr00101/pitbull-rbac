import request from '@/utils/request'

const api = {
  list: '/application/search',
  add: '/application/add',
  update: '/application/update',
  all: '/application/all'
}

export function all (data) {
  return request({
    url: api.all,
    method: 'get',
    data
  })
}

export function list (data) {
  return request({
    url: api.list,
    method: 'post',
    data
  })
}

export function add (data) {
  return request({
    url: api.add,
    method: 'post',
    data
  })
}

export function update (data) {
  return request({
    url: api.update,
    method: 'put',
    data
  })
}
