const sqlite3 = require('sqlite3').verbose()  

export default class SyncSqlite3 {  
  // omitting other methods
  constructor(url) {
      this.url = url;
      this.db = new sqlite3.Database(url)
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, result) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          reject(err)
        } else {
          resolve(result)
        }
      })    
    })
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          console.log('Error running sql: ' + sql)
          console.log(err)
          alert('Error running sql: ' + sql + ', maybe database not exist.')
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }
}