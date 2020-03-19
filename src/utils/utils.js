import base from '../envconfig/envconfig'

// 存入localStorage属性名
const localName = 'kmzyg'

// 设置title
export function documentTitle(title) {
  document.title = title
}

// 获取url参数
export function urlParse(ht) {
  let url = ht ? ht : (window.location.search || window.location.hash)
  if (url) {
    url = url.substr(url.indexOf('?') + 1); //字符串截取，比我之前的split()方法效率高 
  }
  // 创建一个对象，用于存name，和value   
  let result = {}
  let queryString = url || window.location.search.substring(1)
  let re = /([^&=]+)=([^&]*)/g
  let m = null
  // exec()正则表达式的匹配
  // eslint-disable-next-line
  while (m = re.exec(queryString)) {
    // 使用 decodeURIComponent() 对编码后的 URI 进行解码 
    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2])
  }
  return result
}

// 设置localStorage
export function saveToLocal(id, key, value) {
  let store = window.localStorage[localName]
  if (!store) {
    store = {}
    store[id] = {}
  } else {
    store = JSON.parse(store)
    if (!store[id]) {
      store[id] = {}
    }
  }
  store[id][key] = value
  window.localStorage[localName] = JSON.stringify(store)
}

// 读取localStorage
export function loadFromLocal(id, key, def) {
  let store = window.localStorage[localName]
  if (!store) {
    return def
  }
  store = JSON.parse(store)[id]
  if (!store) {
    return def
  }
  let ret = store[key]
  return ret || def
}

// 格式化时间
export function formatDate(time, formatStr) {
  let formatTime = ''
  // time参数ios有bug，只能传毫秒，不能传时间格式的字符串
  let now = time ? new Date(time) : new Date()
  let year = now.getFullYear()
  let month = now.getMonth() + 1
  let day = now.getDate()
  let week = now.getDay()
  let hour = now.getHours()
  let min = now.getMinutes()
  let sec = now.getSeconds()
  let weekArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  // 处理个位数
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  min = min < 10 ? '0' + min : min
  sec = sec < 10 ? '0' + sec : sec
  // 如果只有一个参数的时候，用12小时表示
  if (arguments.length === 1) {
    if (hour > 12) {
      hour -= 12
    }
    hour = hour < 10 ? '0' + hour : hour
  } else if (arguments.length === 2 && arguments[1] === 24) {
    hour = hour < 10 ? '0' + hour : hour
  }
  // 根据参数返回值
  switch (formatStr) {
    case 'MM-DD':
      formatTime = `${month}-${day}`
      break
    case 'YYYY-MM-DD':
      formatTime = `${year}-${month}-${day}`
      break
    case 'YYYY/MM/DD hh:mm:ss':
      formatTime = `${year}-${month}-${day} ${hour}:${min}:${sec}`
      break
    case 'WW':
      formatTime = weekArr[week]
      break
    default:
  }
  return formatTime
}

// 保存搜索记录
export function searchData(value) {
  let searchList = loadFromLocal('h5', 'searchList') || []
  let bool = true
  for (let i = 0; i < searchList.length; i++) {
    if (searchList[i] === value) {
      let deleteRow = searchList.splice(i, 1)
      searchList.splice(0, 0, deleteRow[0])
      bool = false
      break
    }
  }
  if (bool) {
    searchList.splice(0, 0, value)
  }
  if (searchList.length < 10) {
    saveToLocal('h5', 'searchList', searchList)
  } else {
    let arr = []
    for (let k = 0; k < 10; k++) {
      arr.push(searchList[k])
    }
    saveToLocal('h5', 'searchList', arr)
  }
}

// 日期获取年龄
export function getAge(strBirthday) {
  let returnAge
  let strBirthdayArr = strBirthday.split('-')
  let birthYear = strBirthdayArr[0]
  let birthMonth = strBirthdayArr[1]
  let birthDay = strBirthdayArr[2]

  let d = new Date()
  let nowYear = d.getFullYear()
  let nowMonth = d.getMonth() + 1
  let nowDay = d.getDate()

  if (nowYear === birthYear) {
    returnAge = 0 //同年 则为0岁
  }
  else {
    let ageDiff = nowYear - birthYear //年之差
    if (ageDiff > 0) {
      if (nowMonth === birthMonth) {
        let dayDiff = nowDay - birthDay //日之差
        if (dayDiff < 0) {
          returnAge = ageDiff - 1
        }
        else {
          returnAge = ageDiff
        }
      }
      else {
        let monthDiff = nowMonth - birthMonth //月之差
        if (monthDiff < 0) {
          returnAge = ageDiff - 1
        }
        else {
          returnAge = ageDiff
        }
      }
    }
    else {
      returnAge = 0 //返回-1 表示出生日期输入错误 晚于今天
    }
  }
  return returnAge
}

// 对象转为a=b格式
export function formateObjToParamStr(paramObj) {
  const sdata = []
  let filter = function (str) {
    str += '' // 隐式转换
    str = str.replace(/%/g, '%25')
    str = str.replace(/\+/g, '%2B')
    str = str.replace(/ /g, '%20')
    str = str.replace(/\//g, '%2F')
    str = str.replace(/\?/g, '%3F')
    str = str.replace(/&/g, '%26')
    // eslint-disable-next-line
    str = str.replace(/\=/g, '%3D')
    str = str.replace(/#/g, '%23')
    return str
  }
  for (let attr in paramObj) {
    sdata.push(`${attr}=${filter(paramObj[attr])}`)
  }
  return sdata.join('&')
}

/**
 * 去掉重复json数据
 * @example [{name:'06/06',time:'1'}]
 * @return Array
 */
export function torepeatJSON(list) {
  let arr = []
  for (let i = 0; i < list.length; i++) {
    if (i === 0) arr.push(list[i])
    let b = false
    if (arr.length > 0 && i > 0) {
      for (let j = 0; j < arr.length; j++) {
        if (arr[j].name === list[i].name) {
          b = true
        }
      }
      if (!b) {
        arr.push(list[i])
      }
    }
  }
  return arr
}

// 性别  1:男 ,2:女
export function getSex(sex) {
  sex = String(sex)
  if (sex === '1') {
    return '男'
  }
  if (sex === '2') {
    return '女'
  }
  return '未知'
}

// 医生头像
export function doctorPhoto(portait, hisDocId) {
  if (portait) {
    return portait
  } else if (hisDocId) {
    return base.imgUrl + hisDocId + '.jpg'
  } else {
    return require('../images/photo2x.png')
  }
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
export function accMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString()
  try {
    m += s1.split(".")[1].length
  }
  catch (e) {
  }
  try {
    m += s2.split(".")[1].length
  }
  catch (e) {
  }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
