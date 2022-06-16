import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding // value 为 v-permission="['/setting/role/post']" 传过来的绑定值 value=["/setting/role/post"]
  const permission = store.getters && store.getters.permission // permission=[{"id": "120016", "title": "新增", "path": "/setting/role/post"}, {"id": "120017", "title": "修改", "path": "/setting/role/patch"}]

  if (value && value instanceof Array) {
    if (value.length > 0) {
      const permissionRoles = value

      const hasPermission = permission.some(perm => {
        return permissionRoles.includes(perm.path)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  } else {
    throw new Error(`need roles! Like v-permission="['admin','editor']"`)
  }
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}
