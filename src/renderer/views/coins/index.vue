<template>
  <div class="app-container">
    <div class="button-toolbox">
      <el-button-group class="button-group">
        <el-button type="primary" icon="el-icon-refresh" @click="refresh" v-loading="refreshing" :disabled="refreshing">刷新</el-button>
        <el-button type="primary" icon="el-icon-success" @click="refresh" :disabled="refreshing">写入数据库</el-button>
        <el-button type="primary" icon="el-icon-circle-plus" @click="addNewCoin" :disabled="refreshing">添加新币种</el-button>
      </el-button-group>
      <div class="info">
        <label style="display:inline-block" v-if="!refreshing && totalUsdt !== 0 && success"> 
          总金额：{{totalUsdt | degree2 }}（美元），{{totalUsdt * cnyPerUsdt | degree2 }}（人民币）
        </label>
        <label style="display:inline-block" v-if="!refreshing && !success"> 
          加载失败，请重试
        </label>
        <label style="display:inline-block" v-if="refreshing"> 
          加载中...
        </label>
      </div>
    </div>
    <el-table :data="coins" stripe border style="width: 100%">
      <el-table-column width="90" label="比例" align="left" sortable :sort-method="compareRatio">
        <template slot-scope="scope">
          <i v-if="refreshing" class="el-icon-loading"></i>
          <span v-if="!refreshing && !success">N/A</span>
          <span v-if="!refreshing && success">{{ scope.row.ratio | degree2 }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <template slot="header" slot-scope="scope">
          <span>币种</span>
        </template>
        <template slot-scope="scope">
          {{scope.row.coin_short_name}}
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="数量" min-width="50">
        <template slot-scope="scope">
          {{scope.row.amount}}&nbsp;
          <span style="display:inline-block;float:right;">
            (<el-link icon="el-icon-edit" @click="refresh">更正数量</el-link>)
          </span>
        </template>
      </el-table-column>
      <el-table-column label="单价（美元）" min-width="25">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'refreshed'" v-html="scope.row.usdt_per_coin"></div>
          <i v-if="scope.row.status === 'refreshing'" class="el-icon-loading"></i>
          <i v-if="scope.row.status === 'error'" class="el-icon-error" style="color:darkred;"></i>
          <span v-if="scope.row.status === 'loaded'">N/A</span>
        </template>
      </el-table-column>
      <el-table-column label="总额（美元）" prop="total_usdt" min-width="25">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'refreshed'" v-html="scope.row.total_usdt"></div>
          <i v-if="scope.row.status === 'refreshing'" class="el-icon-loading"></i>
          <i v-if="scope.row.status === 'error'" class="el-icon-error" style="color:darkred;"></i>
          <span v-if="scope.row.status === 'loaded'">N/A</span>
        </template>
      </el-table-column>
    </el-table>     
    <el-dialog title="收货地址" :visible.sync="addCoinDialog.visible">
      <el-form >
        <el-form-item label="活动名称" label-width="120px">
          <el-input autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动区域" label-width="120px">
          <el-select placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCoinDialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="addCoinDialog.visible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import settings from 'electron-settings'
import { mapGetters, mapActions } from 'vuex'
import { sleep } from '@/utils'

export default {
  computed: {
    ...mapGetters('data', [
      'database', 'cnyPerUsdt'
    ]),
    ...mapGetters('coins', [
      'coins', 'totalUsdt', 'success', 'databaseChanged'
    ]),
    ...mapGetters('coins', {
      refreshing: 'refreshing'
    })
  },
  filters: {
    degree2(value) {
       let realVal = parseFloat(value).toFixed(2)
      return realVal
    }
  },
  data() {
    return {
      addCoinDialog: {
        visible: false
      }
    }
  },
  methods: {
    ...mapActions('data', [
      'ReloadData'
    ]),
    ...mapActions('coins', [
      'RefreshCoinCnys', 'RefreshCoins', 'RefreshCoinCnysIfDatabaseChanged'
    ]),
    async refresh() {
      await this.RefreshCoinCnys();
    },
    compareRatio(a, b) {
      if (!this.success || this.refreshing) {
        return 0
      }
      return parseFloat(a.ratio) - parseFloat(b.ratio)
    },
    async addNewCoin() {
      this.addCoinDialog.visible = true
    }
  },
  async created() {
    if (this.databaseChanged) {
      await this.RefreshCoinCnys()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.line{
  text-align: center;
}
.button-toolbox {
  overflow: visible;
  .button-group {
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 15px;
  }
  .info {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 15px;
    height: 100%;
    label {
      display: inline-block;
      font-size: 15px;
    }
  }
}
</style>

