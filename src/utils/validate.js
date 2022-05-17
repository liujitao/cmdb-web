/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 校验登录ID */
export function validLoginID(str) {
  const mobile = /^[1][3,4,5,7,8][0-9]{9}$/
  const email = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  return mobile.test(str) || email.test(str)
}

/* 校验登录密码 */
export function validPassword(str) {
  const password = /^[1][3,4,5,7,8][0-9]{9}$/
  return password.test(str)
}

/* 校验移动电话号码 */
export function validMobile(str) {
  const mobile = /^[1][3,4,5,7,8][0-9]{9}$/
  return mobile.test(str)
}

/* 校验电子邮箱地址 */
export function validEmail(str) {
  const email = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  return email.test(str)
}

