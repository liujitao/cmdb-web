import { login, logout, getUserInfo } from '@/api/user'
import { getCookieToken, setCookieToken, removeCookieToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getCookieToken('access_token'),
    name: '',
    avatar: '',
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState())
  },
  SET_NAME: (state, real_name) => {
    state.name = real_name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state, _id) => {
    state._id = _id
  },
  SET_ACCESS_TOKEN: (state, access_token) => {
    state.access_token = access_token
  },
  SET_REFRESH_TOKEN: (state, refresh_token) => {
    state.refresh_token = refresh_token
  },
  SET_USER_DATA: (state, user_data) => {
    state.user_data = user_data
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { user, password } = userInfo
    return new Promise((resolve, reject) => {
      // 调用＠/api/user.js中的login方法
      login({ user: user.trim(), password: password })
        .then(response => {
          const { data } = response
          // console.log(data)

          // 写入vuex
          commit('SET_ID', data._id)
          commit('SET_ACCESS_TOKEN', data.access_token)
          commit('SET_REFRESH_TOKEN', data.refresh_token)

          // 写入cookie
          setCookieToken('access_token', data.access_token)
          setCookieToken('refresh_token', data.refresh_token)

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({ '_id': state._id, 'access_token': state.access_token, 'refresh_token': state.refresh_token })
        .then(() => {
          removeCookieToken('access_token') // must remove  token  first
          removeCookieToken('refresh_token')
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state._id, state.access_token)
        .then(response => {
          const { data } = response
          // console.log(data)

          if (!data) {
            reject('验证失败，请重新登录.')
          }

          const roles = data.roles
          if (!roles || roles.length <= 0) {
            reject('用户权限错误，权限参数必须是一个非空数组!')
          }

          // 写入vuex
          commit('SET_ROLES', roles)
          commit('SET_NAME', data.real_name)
          commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
          commit('SET_USER_DATA', data)

          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeCookieToken('access_token') // must remove  token  first
      removeCookieToken('refresh_token')
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
