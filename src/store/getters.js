const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  refresh_token: state => state.user.refresh_token,
  avatar: state => state.user.avatar,
  id: state => state.user.id,
  name: state => state.user.name,
  permission_routes: state => state.permission.routes,
  second_routes: state => state.permission.second_routes,
  third_routes: state => state.permission.third_routes
}
export default getters
