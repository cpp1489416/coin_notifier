const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  database: state => state.database.database,
  sqlite3Url: state=> state.database.sqlite3Url,
  cnyPerUsdt: state => state.database.cnyPerUsdt,
  coins: state => state.database.coins,
  totalUsdt: state => state.database.totalUsdt
}
export default getters
