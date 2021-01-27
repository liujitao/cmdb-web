import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const expires = {
  'access_token': 6 / 1 / 24, // 10分钟
  'refresh_token': 7 // 7天
}

export function setCookieToken(key, token) {
  return Cookies.set(key, token, { expires: expires[key] })
}

export function getCookieToken(key) {
  return Cookies.get(key)
}

export function removeCookieToken(key) {
  return Cookies.remove(key)
}
