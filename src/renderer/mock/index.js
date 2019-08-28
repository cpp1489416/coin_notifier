import Mock, {Random} from 'mockjs' // 引入mockjs，npm已安装

Mock.setup({
  timeout: 1000 // 设置请求延时时间
})

const getdata = function (option) { // 定义请求数据方法
  let datalist = []
  for (let i = 0; i < 20; i += 1) {
    const o = { // mockjs模拟随机生成数据，生成20条
      recipeId: Random.guid(),
      billId: Random.string(10),
      orgId: Random.string('number', 8, 10),
      Date: Random.date('yyyy-MM-dd'),
      time: Random.time('A HH:mm:ss'),
      adress: Random.county(),
      viewName: Random.cword(4, 16), // 随机生成任意名称
      personName: Random.cname(),
      reason: Random.csentence(10, 32)
    }
    datalist.push(o)
  }
  return {
    data: datalist
  }
}

Mock.mock(RegExp('/user/info' + '.*'), /post|get/i, option => {
  console.log(option)
  const requestInfo = JSON.parse(option.body)
  console.log(requestInfo)
  return {
      "code": 0,
      "data":{
          "roles":["admin"],
          "name":"admin",
          "avatar":"/static/imgs/avatar.png"
        }
    }
}) 

Mock.mock('/user/login', /post|get/i, option => {
  console.log(option)
  const requestInfo = JSON.parse(option.body)
  console.log(requestInfo)
  return {
      "code": 0,
      "data":{
          "token":"admin"
        }
    }
})