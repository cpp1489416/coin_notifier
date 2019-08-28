<template>
  <div class="app-container">
    <el-form ref="form" >
      <el-form-item>
        <el-button type="primary" @click="refresh" v-loading="refreshing" :disabled="refreshing"><i class="el-icon-refresh el-icon--left"></i>刷新</el-button>
        <label style="display:inline-block" v-if="!refreshing && totalUsdt !== 0"> 
          &nbsp;&nbsp;总金额：{{totalUsdt}}（美元），{{totalUsdt * cnyPerUsdt}}（人民币）
        </label>
      </el-form-item>
    </el-form>
    <el-table
      border
      :data="coins"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="180">
      </el-table-column>
      <el-table-column
        prop="coin_short_name"
        label="币种"
        width="180">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="数量">
      </el-table-column>
      <el-table-column
      prop="usdt_per_coin"
      label="单价（美元）">
      </el-table-column>
      <el-table-column
      prop="total_usdt"
      label="总额（美元）">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import settings from 'electron-settings'
import { mapGetters } from 'vuex'
import { sleep } from '@/utils'

export default {
  computed: {
    ...mapGetters([
      'database', 'cnyPerUsdt', 'coins', 'totalUsdt'
    ])
  },
  data() {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      refreshing: false
    }
  },
  methods: {
    async refresh() {
      this.refreshing = true
      await this.$store.dispatch('RefreshCoinCnys');
      this.refreshing = false
    },
  },
  async created() {
    this.$store.dispatch('ReadSettings')
    this.$store.dispatch('ReloadDatabase')
    console.log(this.coins)
    if (this.coins == null || this.coins == [] || this.coins.length == 0) {
      this.refreshing = true
      await this.$store.dispatch('RefreshCoins')
      await this.$store.dispatch('RefreshCoinCnys')
      this.refreshing = false
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

