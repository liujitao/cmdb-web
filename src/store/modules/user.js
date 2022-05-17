import { login, logout, getUser, refreshToken } from '@/api/user'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    refresh_token: getRefreshToken(),
    id: '',
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_REFRESH_TOKEN: (state, token) => {
    state.refresh_token = token
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { loginID, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ login_id: loginID.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_REFRESH_TOKEN', data.refresh_token)
        setToken(data.token)
        setRefreshToken(data.refresh_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getUser({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUser().then(response => {
        const { data } = response

        if (!data) {
          return reject('用户验证失败，请重新登录')
        }

        const { id, user_name, avatar } = data
        commit('SET_ID', id)
        commit('SET_NAME', user_name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        removeRefreshToken()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      removeRefreshToken()
      commit('RESET_STATE')
      resolve()
    })
  },

  refreshToken({ state, commit }) {
    return new Promise((resolve, reject) => {
      // console.log('state.token', state.token)
      // console.log('state.refresh_token', state.refresh_token)
      refreshToken().then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_REFRESH_TOKEN', data.refresh_token)
        setToken(data.token)
        setRefreshToken(data.refresh_token)
        resolve()
      }).catch((error) => {
        console.log('error.......', error)
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

