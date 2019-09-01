<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="160px">
      <el-form-item label="sqlite3 路径">
        <el-input v-model="form.sqlite3Url"></el-input>
      </el-form-item>
      <el-form-item label="一美元等于多少人民币">
        <el-input v-model="form.cnyPerUsdt"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="set">更新</el-button>
        <el-button @click="reload">重设</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default { 
  computed: {
    ...mapGetters('data', [
      'sqlite3Url', 'cnyPerUsdt'
    ]),
  },
  data() {
    return {
      form: {
        sqlite3Url: '',
        cnyPerUsdt: 0
      }
    }
  },
  created() {
    this.reload()
  },
  methods: {
    ...mapActions('data', [
      'ReloadData', 'SetSqlite3Url', 'SetCnyPerUsdt'
    ]),
    reload() {
      this.ReloadData()
      this.form.sqlite3Url = this.sqlite3Url
      this.form.cnyPerUsdt = this.cnyPerUsdt
      this.$notify({
        type: 'success',
        title: 'settings success',
        message: '加载成功'
      })
    },
    set() {
      this.SetSqlite3Url(this.form.sqlite3Url)
      this.SetCnyPerUsdt(this.form.cnyPerUsdt)
      this.reload()
      this.$notify({
        type: 'success',
        title: 'settings success',
        message: '更新成功'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>