import request from '@/utils/request'

export function createPermission(data) {
  return request({
    url: '/vue-admin-template/permission/create',
    method: 'post',
    data
  })
}

export function getPermission(params) {
  return request({
    url: '/vue-admin-template/permission/get',
    method: 'get',
    params
  })
}

export function updatePermission(data) {
  return request({
    url: '/vue-admin-template/permission/update',
    method: 'patch',
    data
  })
}

export function deletePermission(params) {
  return request({
    url: '/vue-admin-template/permission/delete',
    method: 'delete',
    params
  })
}

export function getPermissionList(params) {
  return request({
    url: '/vue-admin-template/permission/list',
    method: 'get',
    params
  })
}

export function getPermissionTree() {
  return request({
    url: '/vue-admin-template/permission/tree',
    method: 'get'
  })
}

export function getPermissionOptions(params) {
  return request({
    url: '/vue-admin-template/permission/select',
    method: 'get',
    params
  })
}
