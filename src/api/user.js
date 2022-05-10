import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getUserInfo() {
  return request({
    url: '/vue-admin-template/user/get',
    method: 'get'
    // params: { id }
  })
}

export function getList(params) {
  return request({
    url: '/vue-admin-template/user/list',
    method: 'get',
    params
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
