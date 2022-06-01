import request from '@/utils/request'

export function createDepartment(data) {
  return request({
    url: '/vue-admin-template/department/create',
    method: 'post',
    data
  })
}

export function getDepartment(params) {
  return request({
    url: '/vue-admin-template/department/get',
    method: 'get',
    params
  })
}

export function updateDepartment(data) {
  return request({
    url: '/vue-admin-template/department/update',
    method: 'patch',
    data
  })
}

export function deleteDepartment(params) {
  return request({
    url: '/vue-admin-template/department/delete',
    method: 'delete',
    params
  })
}

export function getDepartmentList(params) {
  return request({
    url: '/vue-admin-template/department/list',
    method: 'get',
    params
  })
}

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
