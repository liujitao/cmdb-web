import request from '@/utils/request'

export function getDepartmentTree() {
  return request({
    url: '/vue-admin-template/department/tree',
    method: 'get'
  })
}

export function getDepartmentOptions(params) {
  return request({
    url: '/vue-admin-template/department/select',
    method: 'get',
    params
  })
}
