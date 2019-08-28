import settings from 'electron-settings'
import SyncSqlite3 from '@/utils/sync_sqlite3'
import Vue from 'vue'
import { sleep } from '@/utils'

const database = {
  state: {
      database: null,
      sqlite3Url: null,
      cnyPerUsdt: null,
      coins: [],
      totalUsdt:  0,
      totalCny:  0
  },
  mutations: {
    SET_DATABASE: (state, database) => {
        state.database = database
    },
    SET_SQLITE3_URL: (state, url) => {
      Vue.set(state, 'sqlite3Url', url)
    },
    SET_CNY_PER_USDT: (state, value) => {
      Vue.set(state, 'cnyPerUsdt', value)
    },
    SET_COINS: (state, value) => {
      state.coins = value
    }
  },
  actions: {
    SetDatabase({ commit }, database) {
        commit('SET_DATABASE', database)
    },
    ReloadDatabase({ commit }) {
        if (!settings.has('sqlite3_url')) {
            settings.set('sqlite3_url', 'C:/Users/username/OneDrive/sqlite/info.sqlite3')
        }
        commit('SET_DATABASE', new SyncSqlite3(settings.get('sqlite3_url')))
    },
    ReadSettings({ commit, state }) {
      if (state.sqlite3Url == null) {
        if (!settings.has('sqlite3_url')) {
          settings.set('sqlite3_url', 'C:/Users/username/OneDrive/sqlite/info.sqlite3')
          settings.set('cny_per_usdt', 7)
        }
        commit('SET_SQLITE3_URL', settings.get('sqlite3_url'))
        commit('SET_CNY_PER_USDT', settings.get('cny_per_usdt'))
      }
    },
    SetSqlite3Url({commit}, url) {
      settings.set('sqlite3_url', url)
      commit('SET_SQLITE3_URL', url)
    },
    SetCnyPerUsdt({commit}, value) {
      settings.set('cny_per_usdt', value)
      commit('SET_CNY_PER_USDT', value)
    },
    async RefreshCoins({commit, state}) {
      const rows = await state.database.all('select * from coin_charging_history')
      let coins = []
      for (var i = 0; i < rows.length; ++i) {
        rows[i].usdt_per_coin = 'please reload'
        rows[i].total_usdt = 'please reload'
        coins.push(rows[i])
      }
      state.coins = coins
    },
    RefreshCoinCnys({commit, state}) {
      for (const i in state.coins) {
        state.coins[i].usdt_per_coin = 'loading'
        state.coins[i].total_usdt = 'loading'
      }
      return new Promise(async (resolve, reject) => {
        let refreshingCount = 0
        state.totalUsdt = 0
        for (const i in state.coins) {
          Vue.prototype.$axios.get(
            'https://api.huobi.pro/market/history/kline?period=1day&size=1&symbol=' +
            state.coins[i].coin_short_name + 'usdt'
          ).then(response=> {
            state.coins[i].usdt_per_coin = response.data[0].close
            state.coins[i].total_usdt = state.coins[i].usdt_per_coin * state.coins[i].amount
            state.totalUsdt += state.coins[i].total_usdt
            ++refreshingCount
            if (refreshingCount == state.coins.length) {
              resolve()
            }
          }, error => {
            alert(JSON.parse(error))
          })
          await sleep(1000);
        }
      })
    }
  }
}

export default database
