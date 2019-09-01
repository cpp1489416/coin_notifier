import settings from 'electron-settings'
import SyncSqlite3 from '@/utils/sync_sqlite3'
import Vue from 'vue'
import { sleep } from '@/utils'

const data = {
  namespaced: true,
  getters: {
    database: state => state.database,
    sqlite3Url: state=> state.sqlite3Url,
    cnyPerUsdt: state => state.cnyPerUsdt,
  },
  state: {
      database: null,
      sqlite3Url: null,
      cnyPerUsdt: null,
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
  },
  actions: {
    ReloadData({ commit, state, dispatch }) {
      if (state.sqlite3Url != null) {
        return
      }
      if (!settings.has('sqlite3_url')) {
        settings.set('sqlite3_url', 'C:/Users/username/OneDrive/sqlite/info.sqlite3')
        settings.set('cny_per_usdt', 7)
      }
      commit('SET_SQLITE3_URL', settings.get('sqlite3_url'))
      commit('SET_CNY_PER_USDT', settings.get('cny_per_usdt'))  
      commit('SET_DATABASE', new SyncSqlite3(settings.get('sqlite3_url')))
      dispatch('SetDatabaseChanged')
    },
    SetSqlite3Url({commit, dispatch}, url) {
      settings.set('sqlite3_url', url)
      commit('SET_SQLITE3_URL', url)
      dispatch('SetDatabaseChanged')
    },
    SetCnyPerUsdt({commit, dispatch}, value) {
      settings.set('cny_per_usdt', value)
      commit('SET_CNY_PER_USDT', value)
      dispatch('SetDatabaseChanged')
    },
    SetDatabaseChanged({commit}) {
      commit('coins/SET_DATABASE_CHANGED', true, {root: true})
    }

  }
}

export default data
