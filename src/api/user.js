import request from '@/utils/request'

// 用户登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 用户退出
export function logout(data) {
  return request({
    url: '/user/logout',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo(_id, access_token) {
  return request({
    url: '/user/',
    method: 'get',
    headers: { 'Authorization': 'Bearer ' + access_token },
    params: { '_id': _id }
  })
}

// 获取用户列表
