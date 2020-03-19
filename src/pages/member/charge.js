import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { documentTitle, loadFromLocal } from '../../utils/utils'
import API from '../../api/api'
import styles from './member.module.css'

class ChargeMember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      btnIndex: 0,
      price: 0,
      vipInfo: {
        memberName: '',
        memberNo: '',
        memberBalance: 0,
        memberScore: 0
      }
    }
  }

  async init() {
    Toast.loading('加载中..', 0)
    const vipDiscount = await API.VIPReChargeDiscount()
    const vipInfo = await API.getVIPInfo()
    this.setState({
      vipInfo: vipInfo.resultData,
      list: vipDiscount,
      price: vipDiscount[0].money
    })
    Toast.hide()
  }

  clickMoney(el, index) {
    this.setState({
      btnIndex: index,
      price: el.money
    })
  }

  onBridgeReady() {
    const { appId, timeStamp, nonceStr, sign } = this.wxInvoke
    // eslint-disable-next-line
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
      'appId': appId,
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': this.wxInvoke.package,
      'signType': 'MD5',
      'paySign': sign
    }, (res) => {
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        Toast.hide()
        Toast.info('充值成功', 1.5)
        setTimeout(() => {
          this.props.history.goBack()
        }, 1500)
      }
      if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        Toast.hide()
      }
    })
  }

  async submitTo() {
    const { price, vipInfo } = this.state
    const { memberId } = vipInfo
    if (!price) {
      Toast.info('请选择充值金额', 1)
      return
    }
    Toast.loading('支付中..', 0)
    const getVip = await API.getVIPOrder({
      memberId,
      money: price
    })
    let paywx = {
      orderId: getVip.orderId,
      openId: loadFromLocal('h5', 'openId'),
      ipAddress: '123.4.5.6',
      tradeType: 'JSAPI'
    }
    const getwxpayInfo = await API.getWxPrepayInfo(paywx)
    this.wxInvoke = getwxpayInfo
    if (typeof WeixinJSBridge === 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', this.nBridgeReady)
        document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
      }
    } else {
      this.onBridgeReady()
    }
  }

  componentDidMount() {
    documentTitle('会员卡充值')
    this.init()
  }

  render() {
    const { vipInfo, list, btnIndex, price } = this.state
    const { memberNo } = vipInfo

    return (
      <React.Fragment>
        <div className={styles.card}>
          <div className={styles.card_img}>
            <div className={styles.user}>
              <div>NO.{memberNo}</div>
            </div>  
          </div>
        </div>
        <dl className={styles.charge}>
          <dt>请选择充值金额</dt>
          <dd>
            <ul>
              {
                list.map((el, index ) => {
                  return <li key={index}><span className={index === btnIndex ? styles.active : ''} onClick={this.clickMoney.bind(this, el, index)}>{el.give + el.money}</span></li>
                })
              }
            </ul>
          </dd>
        </dl>
        <div className={styles.charge_foot}>
          <div className={styles.change_foot_left}>实际支付<span>&yen;{price}</span></div>
          <div className={styles.change_foot_right} onClick={this.submitTo.bind(this)}>立即充值</div>
        </div>
      </React.Fragment>
    )
  }
}

export default ChargeMember
