import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-admin-template/department/list',
    method: 'get',
    params
  })
}

export function getDepartmentOptions(params) {
  return request({
    url: '/vue-admin-template/department/select',
    method: 'get',
    params
  })
}
