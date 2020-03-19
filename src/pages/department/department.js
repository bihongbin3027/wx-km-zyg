import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { documentTitle, torepeatJSON, urlParse } from '../../utils/utils'
import API from '../../api/api'
import DoctorItem from '../../components/doctoritem/doctoritem'
import styles from './department.module.css'

class Department extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 所有医生
      docTorData: [],
      // 选中时间li的索引
      activeClass: -1,
      // 选中全部医生active
      allDoc: true,
      // 日期数据
      dateList: []
    }
  }

  // 星期几
  week (num) {
    var week = '';
    switch (num) {
      case '1':
        week = '周一'
        break
      case '2':
        week = '周二'
        break
      case '3':
        week = '周三'
        break
      case '4':
        week = '周四'
        break
      case '5':
        week = '周五'
        break
      case '6':
        week = '周六'
        break
      case '7':
        week = '周日'
        break
      default:  
    }
    return week
  }

  // 获取不同时间段医生
  liActive(item, index) {
    let obj = this.allDesDoctor.concat()
    let arr = []
    obj.forEach((age, index) => {
      age.scheduleDateTotal.forEach((date) => {
        if (date.scheduleDate === item.name) {
          arr.push(obj[index])
        }
      })
    })
    this.setState({
      allDoc: false,
      activeClass: index,
      docTorData: arr
    })
  }

  // 全部医生
  allDate() {
    this.setState({
      activeClass: -1,
      allDoc: true,
      docTorData: this.allDesDoctor
    })
  }

  init() {
    const { hisDeptId } = urlParse()
    const params = {
      hisParentId: 1,
      hisDeptId: hisDeptId
    }
    Toast.loading('加载中..', 0)
    API.getScheduleInfo(params).then(res => {
      let list = []
      let sortObj = null
      Toast.hide()
      // 暂存所有医生
      this.allDesDoctor = res
      res.forEach((age) => {
        if (age.scheduleDateTotal) {
          age.scheduleDateTotal.forEach((date) => {
            list.push({
              name: date.scheduleDate,
              time: this.week(date.scheduleWeek)
            })
          })
        }
      })
      sortObj = torepeatJSON(list)
      sortObj.sort((a, b) => {
        return parseInt(a.name.replace('/', '')) - parseInt(b.name.replace('/', ''));
      })
      this.setState({
        dateList: sortObj,
        docTorData: res
      })
    })
  }

  componentDidMount() {
    documentTitle(urlParse().deptName)
    this.init()
  }

  render() {
    const { dateList, docTorData, activeClass, allDoc } = this.state

    return (
      <React.Fragment>
        {
          (docTorData.length && dateList.length) ? <div>
            <div className={styles.date}>
              <div className={styles.date_left} onClick={this.allDate.bind(this)} style={{color: allDoc ? '#fbbc5e' : ''}}>全部<br />日期</div>
              <ul className={styles.date_ul}>
                {
                  dateList.map((el, index) => {
                    return (
                      <li className={activeClass === index ? styles.active : ''} onClick={this.liActive.bind(this, el, index)} key={index}>
                        <div>{el.name}</div>
                        <div>{el.time}</div>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div> : null
        }
        {
          docTorData.length ? (
            <div className={styles.doctor_wrap}>
              {
                docTorData.map((doctor, index) => {
                  return <DoctorItem {...doctor} {...this.props} key={index} />
                })
              }
            </div>
          ) : <div className="no-result">没有医生排班</div>
        }
      </React.Fragment>
    )
  }
}

export default Department
