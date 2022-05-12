import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/role/list',
    method: 'get',
    params
  })
}

export function getRoleOptions(params) {
  return request({
    url: '/vue-admin-template/role/list',
    method: 'get',
    params
  })
}
