import request from '@/utils/request'

export function createUser(data) {
  return request({
    url: '/vue-admin-template/user/create',
    method: 'post',
    data
  })
}

export function getUser(params) {
  return request({
    url: '/vue-admin-template/user/get',
    method: 'get',
    params
  })
}

export function updateUser(data) {
  return request({
    url: '/vue-admin-template/user/update',
    method: 'patch',
    data
  })
}
export function deleteUser(params) {
  return request({
    url: '/vue-admin-template/user/delete',
    method: 'delete',
    params
  })
}

export function getUserList(params) {
  return request({
    url: '/vue-admin-template/user/list',
    method: 'get',
    params
  })
}

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function refreshToken() {
  return request({
    url: '/vue-admin-template/user/refresh',
    method: 'post'
  })
}

export function changePassword(data) {
  return request({
    url: '/vue-admin-template/user/change_password',
    method: 'post',
    data
  })
}
