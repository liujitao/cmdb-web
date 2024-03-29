import { constantRoutes } from '@/router'
import Layout from '@/layout'

/**
 * 循环生成异步路由
 * @Author   HarveyCheng
 * @DateTime 2018-10-09
 * @param    {[type]}    routes [description]
 * @return   {[type]}           [description]
 */
function loopCreateRouter(routes) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    const tpl = Object.assign({}, tmp)
    if (typeof tmp['component'] !== 'undefined' && tmp['component']) {
      if (tmp['component'] === 'Layout') {
        tpl['component'] = Layout
      } else {
        tpl['component'] = resolve => require([`../../${tmp['component']}.vue`], resolve)
      }
    }
    if (tmp['children']) {
      tpl['children'] = loopCreateRouter(tmp['children'])
    }
    res.push(tpl)
  })
  return res
}

const state = {
  routes: [],
  second_routes: [],
  third_routes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_SECOND_ROUTES: (state, routes) => {
    state.second_routes = routes
  },
  SET_THIRD_ROUTES: (state, routes) => {
    state.third_routes = routes
  }
}

// 获取菜单
const actions = {
  generateRoutes({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      const asyncRouterMap = data
      const accessedRoutes = loopCreateRouter(asyncRouterMap)

      // 插入dashboard
      accessedRoutes.unshift({
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
          path: 'dashboard',
          name: 'Dashboard',
          component: () => import('@/views/dashboard/index'),
          meta: { title: 'Dashboard', icon: 'dashboard' }
        }]
      })

      // 插入404
      accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', constantRoutes.concat(accessedRoutes))
      resolve(accessedRoutes)
    })
  },
  changeSecondRoutes({ commit, state }, data) {
    commit('SET_SECOND_ROUTES', [])
    const second_routes = state.routes.find(item => {
      return !item.hidden && (item.path === data.path || (data.path === '' && item.path === '/'))
    })
    if (typeof second_routes !== 'undefined' && second_routes.children) {
      const res = second_routes.children.filter(item => {
        return !item.hidden && item.path
      })
      if (res.length > 1) {
        commit('SET_SECOND_ROUTES', res)
      }
    }
  },
  changeThirdRoutes({ commit, state }, data) {
    commit('SET_THIRD_ROUTES', [])
    const third_routes = state.second_routes.find(item => {
      return !item.hidden && (item.path === data.path || (data.path === '' && item.path === '/'))
    })
    if (typeof third_routes !== 'undefined' && third_routes.children) {
      const res = third_routes.children.filter(item => {
        return !item.hidden && item.path
      })
      if (res.length > 1) {
        commit('SET_THIRD_ROUTES', res)
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
