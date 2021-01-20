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

/*
const expires = {
  'access_token': 5/60 },
  'refresh_token': 14 }
}

export function setToken(key, token) {
  return Cookies.set(key, token, expires: expires[key])
}

export function getToken(key) {
  return Cookies.get(key)
}

export function removeToken(key) {
  return Cookies.remove(key)
}
*/
