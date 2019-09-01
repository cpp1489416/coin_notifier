import settings from 'electron-settings'
import SyncSqlite3 from '@/utils/sync_sqlite3'
import Vue from 'vue'
import { sleep } from '@/utils'

const coins = {
  namespaced: true,
  getters: {
    coins: state => state.coins,
    totalUsdt: state => state.totalUsdt,
    refreshing: state => state.refreshing,
    databaseChanged: state => state.databaseChanged,
    success: state => state.success
  },
  state: {
      coins: [],
      totalUsdt:  0,
      totalCny:  0,
      refreshing: false,
      databaseChanged: true,
      success: false
  },
  mutations: {
    SET_COINS: (state, value) => {
      state.coins = value
    },
    SET_TOTAL_USDT: (state, value) => {
      state.totalUsdt = value
    },
    SET_REFRESHING: (state, value) => {
      state.refreshing = value
    },
    SET_SUCCESS: (state, value) => {
      state.success = value
    },
    SET_DATABASE_CHANGED: (state, value) => {
      state.databaseChanged = value
    }
  },
  actions: {
    async RefreshCoins({commit, state, dispatch, rootGetters}) {
      dispatch('data/ReloadData', null, {root: true})
      if (state.databaseChanged && !state.refreshing) {
        const rows = await rootGetters['data/database'].all('select * from coin_charging_history')
        let coins = []
        for (var i = 0; i < rows.length; ++i) {
          rows[i].usdt_per_coin = '<span style="color:darkblue">请调用api</span>'
          rows[i].total_usdt = '<span style="color:darkblue">请调用api</span>'
          rows[i].status = 'loaded'
          rows[i].ratio = 0
          coins.push(rows[i])
        }
        commit('SET_COINS', coins)
        commit('SET_DATABASE_CHANGED', false)
      }
    },
    async RefreshCoinCnys({commit, state, dispatch}) {
      if (state.refreshing) {
        return
      }
      if (state.databaseChanged) {
        await dispatch('RefreshCoins')
      }
      commit('SET_REFRESHING', true)
      const coins = state.coins
      for (const i in coins) {
        coins[i].usdt_per_coin = '<span style="background-color:darkgreen;color:white">加载中...</span>'
        coins[i].total_usdt = '<span style="background-color:darkgreen;color:white">加载中...</span>'
        coins[i].status = 'refreshing'
      }
      commit('SET_COINS', coins)
      return new Promise(async (resolve, reject) => {
        let refreshingCount = 0
        state.totalUsdt = 0
        const coins = state.coins
        let totalUsdt = 0
        commit('SET_SUCCESS', true)
        for (const i in state.coins) {
          Vue.prototype.$axios.get(
            'https://api.huobi.pro/market/history/kline?period=1day&size=1&symbol=' +
            coins[i].coin_short_name + 'usdt'
          ).then(response => {
            coins[i].usdt_per_coin = response.data[0].close
            coins[i].total_usdt =coins[i].usdt_per_coin *coins[i].amount
            totalUsdt += coins[i].total_usdt
            coins[i].total_usdt = parseFloat(coins[i].total_usdt).toFixed(2)
            coins[i].status = 'refreshed'
            ++refreshingCount
            commit('SET_COINS', coins)
            if (refreshingCount == state.coins.length) {
              for (const j in state.coins) {
                coins[j].ratio = coins[j].total_usdt / totalUsdt
              }
              commit('SET_TOTAL_USDT', totalUsdt)
              commit('SET_REFRESHING', false)
              resolve()
            }
          }).catch(error => {
            coins[i].usdt_per_coin = '<span style="background-color:darkred;color:white;">加载失败</span>'
            coins[i].total_usdt = '<span style="background-color:darkred;color:white;">加载失败</span>'
            coins[i].status = 'error'
            ++refreshingCount
            commit('SET_COINS', coins)
            commit('SET_SUCCESS', false)
            if (refreshingCount == state.coins.length) {
              commit('SET_REFRESHING', false)
              resolve()
            }
            console.log(error)
          })
          await sleep(1000);
        }
      })
    }
  }
}

export default coins
