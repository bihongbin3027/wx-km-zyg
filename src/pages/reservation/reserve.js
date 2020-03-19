import React, { Component } from 'react'
import { Modal, Toast, Tabs } from 'antd-mobile'
import API from '../../api/api'
import { documentTitle, urlParse, doctorPhoto } from '../../utils/utils'
import styles from './reservation.module.css'

class Reserve extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: urlParse(),
      tabIndex: 0,
      tabs: [{
        title: '挂号'
      }, {
        title: '理疗'
      }],
      list: [],
      phyList: []
    }
  }

  errorImg(e) {
    e.target.src = doctorPhoto()
  }

  // 挂号
  registered(index) {
    let params = {}
    if (index === undefined) {
      index = this.state.page.tag - 1
    }
    if (index === 1) {
      params.regType = '1'
    }
    Toast.loading('加载中..', 0)
    API.getPayRegInfo(params).then(res => {
      let data = {}
      Toast.hide()
      if (index === 1) {
        data.phyList = res
        data.tabIndex = 1
      } else {
        data.list = res
        data.tabIndex = 0
      }
      this.setState(data, () => {
        this.reduceTime()
      })
    })
  }

  // 预约状态
  paytypes({regStatus, leftTime}) {
    let regstatus = ''
    let color1 = {
      color: '#04BE02'
    }
    let color2 = {
      color: '#999'
    }
    let color3 = {
      color: '#fbbc5e'
    }
    switch (regStatus) {
      case '1':
        regstatus = <span style={color1}>已预约</span>
        break;
      case '2':
        regstatus = <span style={color2}>已取消</span>
        break
      case '3':
        regstatus = <span style={color1}>已取号</span>
        break
      case '4':
        regstatus = <span style={color2}>已就诊</span>
        break
      case '5':
        regstatus = <span style={color2}>未就诊</span>
        break  
      case '6':
        if (leftTime === 0) {
          regstatus = <span style={color2}>已取消</span>
        } else {
          regstatus = <span style={color3}>未支付</span>
        }
        break 
      case '7':
        regstatus = <span style={color2}>爽约</span>
        break        
      default:
        break
    }
    return regstatus
  }

  // 支付时间格式化
  formatTime({leftTime}) {
    return Math.floor(leftTime / 60) + '分' + (leftTime % 60) + '秒'
  }

  // 支付倒计时
  reduceTime() {
    let that = this
    let { list, phyList } = this.state
    let listLen = list.length
    let phyLen = phyList.length
    clearInterval(this.timer)
    clearInterval(this.phyTimer)
    this.timer = setInterval(() => {
      if (listLen === 0) {
        clearInterval(that.timer)
      }
      list.forEach((item) => {
        if (item.leftTime !== 0) {
          item.leftTime--
        } else {
          listLen = listLen - 1
        }
      })
      this.setState({list})
    }, 1000)
    this.phyTimer = setInterval(() => {
      if (phyLen === 0) {
        clearInterval(that.phyTimer)
      }
      phyList.forEach((item) => {
        if (item.leftTime !== 0) {
          item.leftTime--
        } else {
          phyLen = phyLen - 1
        }
      })
      this.setState({phyList})
    }, 1000)
  }

  // 取消订单
  cancel({orderNo}, index, e) {
    e.stopPropagation()
    Modal.alert('提示', '确定取消当前预约？', [{
      text: '我再想想',
    }, {
      text: '确定',
      onPress: () => {
        Toast.loading('取消中..', 0)
        API.cancalRegister({
          orderNo
        }).then(res => {
          Toast.hide()
          let { list, phyList, tabIndex } = this.state
          if (tabIndex === 0) {
            list[index].regStatus = '2'
            this.setState({list})
          }
          if (tabIndex === 1) {
            phyList[index].regStatus = '2'
            this.setState({phyList})
          }
          Toast.success('已取消', 1)
        })
      }
    }])
  }

  // 退费
  refund({registerId}, index, e) {
    e.stopPropagation()
    Modal.alert('提示', '确定取消当前预约？', [{
      text: '我再想想',
    }, {
      text: '确定',
      onPress: () => {
        Toast.loading('取消中..', 0)
        API.cancelRegist({
          registerId
        }).then(res => {
          Toast.hide()
          let { list, phyList, tabIndex } = this.state
          if (tabIndex === 0) {
            list[index].regStatus = '2'
            this.setState({list})
          }
          if (tabIndex === 1) {
            phyList[index].regStatus = '2'
            this.setState({phyList})
          }
          Toast.success('已取消', 1)
        })
      }
    }])
  }

  // 支付
  pay({orderNo, docName, cardName, regMoney, remark}, e) {
    e.stopPropagation()
    let type = 0
    if (remark) {
      type = 2
    } else {
      type = 1
    }
    this.props.history.push({
      pathname: '/pay',
      search: `orderNo=${orderNo}&docName=${docName}&cardName=${cardName}&regMoney=${regMoney}&type=${type}`
    })
  }

  // 跳转到详情
  todetaials(el) {
    this.props.history.push({
      pathname: '/reservedetails',
      search: `params=${JSON.stringify(el)}`
    })
  }

  // 再次预约
  onceAgain({myDocId, itemId, remark, origRegMoney}, e) {
    e.stopPropagation()
    const { tabIndex } = this.state
    let ch = ''
    if (tabIndex === 0) {
      ch = `docId=${myDocId}`
    }
    if (tabIndex === 1) {
      ch = `docId=${myDocId}&itemId=${itemId}&PhysioName=${remark}&PhysioMoney=${origRegMoney}`
    }
    this.props.history.push({
      pathname: '/doctordetails',
      search: ch
    })
  }

  onTabClick(tab, index) {
    this.setState({
      tabIndex: index
    })
    this.registered(index)
  }

  listRender(el, index) {
    return <div className={styles.box} onClick={this.todetaials.bind(this, el)} key={index}>
      <div className={styles.reserve_top}>
        <div className={styles.reserve_user}>
          <div className={styles.doctor_img}><img src={doctorPhoto(el.portait, el.docId)} onError={this.errorImg.bind(this)} alt="" /></div>
          <div>
            <div className={styles.doctor_name}>{el.docName}<span>{el.title}</span></div>
            <div className={styles.doctor_department}>弘德分馆<span>{el.deptName}</span></div>
          </div>
        </div>
        <div>{this.paytypes(el)}</div>
      </div>
      <ul className={styles.reserve_ul}>
        <li><span>订单编号</span>{el.regNo}</li>
        {
          el.remark ? (
            <li><span>预约套餐</span>{el.remark}</li>
          ) : null
        }
        <li><span>预约费用</span><i className={styles.color3}>&yen;{el.regMoney}</i></li>
        <li><span>就&nbsp;&nbsp;诊&nbsp;&nbsp;人</span>{el.cardName}</li>
        <li><span>就诊时间</span>{el.regDate}&nbsp;{el.startTime}~{el.endTime}</li>
        <li><span>就诊地点</span>康美中医馆-深圳弘德分馆</li>
      </ul>
      {
        (el.regStatus === '6' && el.leftTime !== 0) ? (
          <div className={styles.reserve_foot}>
            <div className="reserve-foot"><p>请于<span className={styles.reserve_foot_left}>{this.formatTime(el)}</span>完成支付</p></div>
            <div className={styles.btn_margin}>
              <div className={styles.foot_btn_style} onClick={this.cancel.bind(this, el, index)}>取消</div>
              <div className={styles.foot_btn_style1} onClick={this.pay.bind(this, el)}>支付</div>
            </div>
          </div>
        ) : null
      }
      {
        el.regStatus === '1' ? (
          <div className={styles.reserve_foot}>
            <div></div>
            <div className={styles.foot_btn_style} onClick={this.refund.bind(this, el, index)}>取消</div>
          </div>
        ) : null
      }
      {
        ((el.regStatus !== '1' && el.regStatus !== '6' && el.regStatus !== '5') || (el.regStatus === '6' && el.leftTime === 0)) ? (
          <div className={styles.reserve_foot}>
            <div></div>
            <div className={styles.foot_btn_style} onClick={this.onceAgain.bind(this, el)}>再次预约</div>
          </div>
        ) : null
      }
    </div>
  }

  componentDidMount() {
    documentTitle('我的预约')
    this.registered()
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    clearInterval(this.phyTimer)
  }

  render() {
    const { page, tabs, list, phyList } = this.state

    return (
      <React.Fragment>
        <Tabs tabs={tabs} initialPage={page.tag - 1} swipeable={false} onChange={this.onTabClick.bind(this)}>
          <div>
            {
              list.length ? list.map((el, index) => {
                return this.listRender(el, index)
              }) : <div className="no-result">没有预约记录</div>
            }
          </div>
          <div>
            {
              phyList.length ? phyList.map((el, index) => {
                return this.listRender(el, index)
              }) : <div className="no-result">没有预约记录</div>
            }
          </div>
        </Tabs>
      </React.Fragment>
    )
  }
}

export default Reserve
