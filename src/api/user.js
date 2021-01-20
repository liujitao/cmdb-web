import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

/*
登录响应
{
  "code": 20000,
  "message":  "用户登录成功",
  "error":  "",
  "data": {
    "_id":  "5fc8c496f332a7a81af1a80c",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmM4YzQ5NmYzMzJhN2E4MWFmMWE4MGMiLCJleHAiOjE2MTEwMzk0NTN9.AY5UipX14Phyt9ga5Dm_qbqfjUytA_8gVTwBbl_Tq58","refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmM4YzQ5NmYzMzJhN2E4MWFmMWE4MGMiLCJleHAiOjE2MTExMjUyNTN9.gIPyH6pfujvClWHGouQC8d81sacuvxdJiNlFjkx7BNo"
  }
}
*/

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

/*
用户信息
{
  "code": 0,
  "message": "用户获取成功",
  "error": "",
  "data": {
    "_id": "5fc8c496f332a7a81af1a80c",
    "user_name": "user21",
    "real_name": "用户21",
    "mobile": "13900000021",
    "email": "user21@abc.com",
    "password": "$2a$10$q5CBJdypI4Yi4Kq8/Qpwbe0qxvGUzbBbPowPVFYS2Iso5RQC69Rru",
    "create_at": 1606993046,
    "update_at": 0,
    "team_id": "5fc8c495f332a7a81af1a7fe"
  }
}
*/

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
