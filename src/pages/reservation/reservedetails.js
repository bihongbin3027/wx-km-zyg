import React, { Component } from 'react'
import { Modal, Toast } from 'antd-mobile'
import API from '../../api/api'
import { documentTitle, urlParse, doctorPhoto } from '../../utils/utils'
import styles from './reservation.module.css'

class ReserveDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      details: {}
    }
  }

  errorImg(e) {
    e.target.src = doctorPhoto()
  }

  // 支付时间格式化
  formatTime({leftTime}) {
    return Math.floor(leftTime / 60) + '分' + (leftTime % 60) + '秒'
  }

  // 取消订单
  cancel(details, e) {
    e.stopPropagation()
    Modal.alert('提示', '确定取消当前预约？', [{
      text: '我再想想',
    }, {
      text: '确定',
      onPress: () => {
        API.cancalRegister({
          orderNo: details.orderNo
        }).then(res => {
          let { details } = this.state
          details.regStatus = '2'
          this.setState({details})
          Toast.success('已取消', 1)
        })
      }
    }])
  }

  // 退费
  refund(details, e) {
    e.stopPropagation()
    Modal.alert('提示', '是否确认退款？', [{
      text: '我再想想',
    }, {
      text: '确定',
      onPress: () => {
        API.cancelRegist({
          registerId: details.registerId
        }).then(res => {
          let { details } = this.state
          details.regStatus = '2'
          this.setState({details})
          Toast.success('已退款', 1)
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
    this.props.history.replace({
      pathname: '/pay',
      search: `orderNo=${orderNo}&docName=${docName}&cardName=${cardName}&regMoney=${regMoney}&type=${type}`
    })
  }

  // 支付倒计时
  reduceTime () {
    this.timer = setInterval(() => {
      let { details } = this.state
      if (details.leftTime === 0) {
        clearInterval(this.timer)
      } else {
        details.leftTime--
      }
      this.setState({details})
    }, 1000)
  }

  componentDidMount() {
    let { params } = urlParse()
    documentTitle('预约详情')
    if (params) {
      this.setState({
        details: JSON.parse(params)
      }, () => {
        this.reduceTime()
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { details } = this.state

    return (
      <React.Fragment>
        <div className={styles.doctor_info}>
          <div className={styles.doctor_box}>
            <div className={styles.doctor_img}>
              <img src={doctorPhoto(details.portait, details.docId)} onError={this.errorImg.bind(this)} alt="" />
            </div>
            <div>
              <div className={styles.doctor_name}>{details.docName}<span>{details.title}</span></div>
              <div className={styles.doctor_department}>弘德分馆<span>{details.deptName}</span></div>
            </div>
          </div>
        </div>
        {
          details.remark ? (
            <div className="list-item borderBottom">
              <div className="list-line">
                <div className="list-content just-between">
                  <div className="dt">预约套餐</div>
                  <div>{details.remark}</div>
                </div>
              </div>
            </div>
          ) : null
        }
        <div className="list-item borderBottom">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt">订单编号</div>
              <div className={styles.color1}>{details.regNo}</div>
            </div>
          </div>
        </div>
        <div className="list-item borderBottom">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt">预约费用</div>
              <div className={styles.color2}>&yen; {details.regMoney}</div>
            </div>
          </div>
        </div>
        <div className="list-item borderBottom">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt">就&nbsp;&nbsp;诊&nbsp;&nbsp;人</div>
              <div className={styles.color1}>{details.cardName}</div>
            </div>
          </div>
        </div>
        <div className="list-item borderBottom">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt">就诊时间</div>
              <div className={styles.color1}>{details.regDate} {details.startTime}~{details.endTime}</div>
            </div>
          </div>
        </div>
        <div className="list-item borderBottom">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt">就诊地点</div>
              <div className={styles.color1}>康美中医馆-深圳弘德分馆</div>
            </div>
          </div>
        </div>
        {
          (details.regStatus === '6' && details.leftTime !== 0) ? (
            <div className={styles.reserve_foot_fixed}>
              <div><p>请于<span className={styles.reserve_foot_left}>{this.formatTime(details)}</span>完成支付</p></div>
              <div className={styles.btn_margin}>
                <div className={styles.foot_btn_style_max} onClick={this.cancel.bind(this, details)}>取消</div>
                <div className={styles.foot_btn_style1_max} onClick={this.pay.bind(this, details)}>支付</div>
              </div>
            </div>
          ) : null
        }
        {
          details.regStatus === '1' ? (
            <div className={styles.reserve_foot_fixed}>
              <div></div>
              <div className={styles.btn_margin}>
                <div className={styles.foot_btn_style_max} onClick={this.refund.bind(this, details)}>取消</div>
              </div>
            </div>
          ) : null
        }
        {
          (details.regStatus !== '1' && details.regStatus !== '6' && details.regStatus !== '5') || (details.regStatus === '6' && details.leftTime === 0) ? (
            <div className={styles.reserve_foot_fixed}>
              <div></div>
              <div className={styles.btn_margin}>
                <div className={styles.foot_btn_style_max} onClick={(e) => {
                  e.stopPropagation()
                  this.props.history.push({
                    pathname: '/doctordetails',
                    search: `docId=${details.myDocId}`
                  })
                }}>再次预约</div>
              </div>
            </div>
          ) : null
        }
      </React.Fragment>
    )
  }
}

export default ReserveDetails
