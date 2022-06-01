import request from '@/utils/request'

export function createRole(data) {
  return request({
    url: '/vue-admin-template/role/create',
    method: 'post',
    data
  })
}

export function getRole(params) {
  return request({
    url: '/vue-admin-template/role/get',
    method: 'get',
    params
  })
}

export function updateRole(data) {
  return request({
    url: '/vue-admin-template/role/update',
    method: 'patch',
    data
  })
}

export function deleteRole(params) {
  return request({
    url: '/vue-admin-template/role/delete',
    method: 'delete',
    params
  })
}

export function getRoleList(params) {
  return request({
    url: '/vue-admin-template/role/list',
    method: 'get',
    params
  })
}

export function getRoleOptions(params) {
  return request({
    url: '/vue-admin-template/role/select',
    method: 'get',
    params
  })
}
