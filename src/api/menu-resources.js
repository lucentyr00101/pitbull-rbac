import request from '@/utils/request'

const api = {
  addDirectory: '/sysResource/add/directory',
  addMenu: '/sysResource/add/menu',
  addSubmenu: '/sysResource/add/submenu',
  addAction: '/sysResource/add/action',
  updateDirectory: '/sysResource/update/directory',
  updateMenu: '/sysResource/update/menu',
  updateSubmenu: '/sysResource/update/submenu',
  updateAction: '/sysResource/update/action',
  menuTree: '/sysResource/tree',
  menuTreeActive: '/sysResource/tree/active',
  delete: '/sysResource/delete'
}

export function deleteResource (params) {
  return request({
    url: api.delete,
    method: 'delete',
    params
  })
}

export function updateDirectory (data) {
  return request({
    url: api.updateDirectory,
    method: 'put',
    data
  })
}

export function updateMenu (data) {
  return request({
    url: api.updateMenu,
    method: 'put',
    data
  })
}

export function updateSubmenu (data) {
  return request({
    url: api.updateSubmenu,
    method: 'put',
    data
  })
}

export function updateAction (data) {
  return request({
    url: api.updateAction,
    method: 'put',
    data
  })
}

export function addAction (data) {
  return request({
    url: api.addAction,
    method: 'post',
    data
  })
}

export function addSubmenu (data) {
  return request({
    url: api.addSubmenu,
    method: 'post',
    data
  })
}

export function addMenu (data) {
  return request({
    url: api.addMenu,
    method: 'post',
    data
  })
}

export function addDirectory (data) {
  return request({
    url: api.addDirectory,
    method: 'post',
    data
  })
}

export function fetchMenuTree (params) {
  return request({
    url: api.menuTree,
    method: 'get',
    params
  })
}

export function fetchMenuTreeActive (params) {
  return request({
    url: api.menuTreeActive,
    method: 'get',
    params
  })
}
