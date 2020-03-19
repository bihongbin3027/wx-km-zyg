import React, { Component } from 'react'
import { Toast, Modal } from 'antd-mobile'
import Layer from '../../components/modal/modal'
import API from '../../api/api'
import { documentTitle, urlParse, loadFromLocal } from '../../utils/utils'
import radios from '../../style/radio.module.css'
import icons from '../../style/icon.module.css'
import styles from './pay.module.css'

class Pay extends Component {
  constructor(props) {
    super(props)
    this.vipconfirm = null
    this.state = {
      urlParse: urlParse(),
      /**
       * 1 会员卡支付
       * 2 微信支付
       */
      payType: '1',
      discount: {
        originalMoney: 0,
        discountMoney: 0
      },
      vipInfo: {
        memberName: '',
        memberNo: '',
        memberBalance: 0,
        memberScore: 0
      },
      vipPassword: ''
    }
  }

  orderType(docName) {
    const { urlParse } = this.state
    let txt = ''
    switch (urlParse.type) {
      case '1':
        txt = `${docName}-预约挂号`
        break
      case '2':
        txt = `${docName}-预约理疗`
        break
      case '3':
        txt = `预约门诊`
        break  
      default:
        break
    }
    return txt
  }

  inputChange(e) {
    this.setState({
      payType: e.target.value
    })
  }

  moneyShow({discountMoney, originalMoney}) {
    if (parseInt(discountMoney, 10) !== parseInt(originalMoney, 10)) {
      return <div>
        <span className={styles.original_price}>&yen;{discountMoney}</span><em className={styles.discount}>&yen;{originalMoney}</em>
      </div>
    } else {
      return <div>
        <span className={styles.original_price}>&yen;{discountMoney}</span>
      </div>
    }
  }

  async init() {
    const { urlParse } = this.state
    const { regMoney } = urlParse
    Toast.loading('加载中..', 0)
    const vipInfo = await API.getVIPInfo()
    if (vipInfo.resultData) {
      let discount = {}
      let type = ''
      switch (Number(urlParse.type)) {
        case 1:
          type = 'Reg'
          break
        case 2:
          type = 'PhoReg'
          break
        case 3:
          type = 'Bill'
          break  
        default:
          break
      }
      // 3-门诊缴费
      if (urlParse.type === '3') {
        discount.discountMoney = regMoney
        discount.originalMoney = regMoney
      } else {
        discount = await API.getVIPDiscount({
          orderId: urlParse.orderNo,
          memberId: vipInfo.resultData.memberId,
          type
        })
      }
      this.setState({
        vipInfo: vipInfo.resultData,
        discount
      })
    } else {
      this.setState({
        payType: '2',
        vipInfo: false
      })
    }
    Toast.hide()
  }

  vippassChange(e) {
    this.setState({
      vipPassword: e.target.value
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
        let url = ''
          switch (Number(this.urlInfo.type)) {
            case 1:
              url = {
                pathname: '/reserve'
              }
              break
            case 2:
              url = {
                pathname: '/reserve',
                search: 'tag=2'
              }
              break
            case 3:
              url = {
                pathname: '/order',
                search: 'tag=2'
              }
              break  
            default:
              break
          }
          this.props.history.replace(url)
      }
      if (res.err_msg === 'get_brand_wcpay_request:cancel') {
        Toast.hide()
      }
    })
  }

  vipRecharge() {
    const { urlParse, vipInfo, discount, vipPassword } = this.state
    // 会员卡余额小于当前支付金额，去充值
    if (parseInt(vipInfo.memberBalance, 10) < parseInt(discount.discountMoney, 10)) {
      Modal.alert('提示', '会员卡余额不足，是否前往充值？', [{
        text: '稍后再说',
      }, {
        text: '立即前往',
        onPress: () => {
          this.props.history.push('/chargemember')
        }
      }])
      return
    }
    if (vipPassword === '') {
      Toast.info('请输入会员卡密码', 1)
      return
    }
    API.VIPVereify({
      memberId: vipInfo.memberId,
      password: vipPassword
    }).then(() => {
      this.vipconfirm.hideModal()
      Toast.loading('支付中..', 0)
      API.VIPPay({
        orderId: urlParse.orderNo,
        memberId: vipInfo.memberId
      }).then(res => {
        Toast.hide()
        Toast.info('支付成功', 1.5)
        setTimeout(() => {
          let url = ''
          switch (Number(urlParse.type)) {
            case 1:
              url = {
                pathname: '/reserve'
              }
              break
            case 2:
              url = {
                pathname: '/reserve',
                search: 'tag=2'
              }
              break
            case 3:
              url = {
                pathname: '/order',
                search: 'tag=2'
              }
              break  
            default:
              break
          }
          this.props.history.replace(url)
        }, 1500)
      })
    })
  }

  // 立即支付
  submitTo() {
    const { payType, urlParse, vipInfo } = this.state
    const regMoney = parseInt(urlParse.regMoney, 10)
    // 会员卡支付
    if (payType === '1') {
      if (vipInfo) {
        if (regMoney === 0) {
          let payhy = {
            orderId: urlParse.orderNo,
            payType: '4'
          }
          Toast.loading('支付中..', 0)
          API.zeroPay(payhy).then(res => {
            Toast.hide()
            this.props.history.replace('/reserve')
          })
        } else {
          this.vipconfirm.showModal()
        }
      } else {
        Modal.alert('提示', '请先绑定会员卡', [{
          text: '取消',
        }, {
          text: '去绑定',
          onPress: () => {
            this.props.history.push('/addmember')
          }
        }])
        return
      }
    }
    // 微信支付
    if (payType === '2') {
      let paywx = {
        orderId: urlParse.orderNo,
        payType: '1',
        openId: loadFromLocal('h5', 'openId'),
        ipAddress: '123.4.5.6',
        tradeType: 'JSAPI'
      }
      Toast.loading('支付中..', 0)
      // 支付金额是0 调用另一个接口
      if (regMoney === 0) {
        API.zeroPay(paywx).then(res => {
          Toast.hide()
          this.props.history.replace('/reserve')
        })
      } else {
        API.getWxPrepayInfo(paywx).then(res => {
          this.wxInvoke = res
          this.urlInfo = this.state.urlParse
          if (typeof WeixinJSBridge === 'undefined') {
            if (document.addEventListener) {
              document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false)
            } else if (document.attachEvent) {
              document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady)
              document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady)
            }
          } else {
            this.onBridgeReady()
          }
        })
      }
    }
  }

  componentDidMount() {
    documentTitle('订单支付')
    this.init()
  }

  render() {
    const { payType, vipInfo, discount, vipPassword } = this.state
    const { orderNo, docName, regMoney } = this.state.urlParse

    return (
      <div className={styles.pay}>
        <div className="list-item font-size15 borderBottom borderTop">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt">订单编号</div>
              <div>{orderNo}</div>
            </div>
          </div>
        </div>
        <div className="list-item font-size15 borderBottom">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt">订单内容</div>
              <div>{this.orderType(docName)}</div>
            </div>
          </div>
        </div>
        <div className={styles.type}>选择支付方式</div>
        <label className="list-item font-size15 borderBottom borderTop">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt"><i className={icons.member_icon}></i>会员卡支付<i className={icons.fold_icon}></i></div>
              <div className="dd">
                <div className="can-selected" style={{marginRight: 10}}>
                  {
                    vipInfo ? <p className={styles.ky}>可用余额：{vipInfo.memberBalance}</p> : <p className={styles.bind_vip} onClick={() => {
                      this.props.history.push('/addmember')
                    }}>立即绑定会员卡</p>
                  }
                </div>
                <div className={radios.checkboxWrapper}>
                  <div className={radios.leftCheck}>
                    <input className={radios.checkboxInput} name="pay" type="radio" value="1" checked={payType === '1'} onChange={this.inputChange.bind(this)} />
                    <span className={radios.checkboxInner}></span>
                  </div>
                </div>
              </div>  
            </div>
          </div>
        </label>
        <label className="list-item font-size15 borderBottom">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt"><i className={icons.wx_icon}></i>微信支付</div>
              <div className={radios.checkboxWrapper}>
                <div className={radios.leftCheck}>
                  <input className={radios.checkboxInput} name="pay" type="radio" value="2" checked={payType === '2'} onChange={this.inputChange.bind(this)} />
                  <span className={radios.checkboxInner}></span>
                </div>
              </div>
            </div>
          </div>
        </label>
        <div className={styles.foot}>
          <div className={styles.price}>订单价格
            {
              (payType === '1' && Object.keys(vipInfo).length) ? this.moneyShow(discount) : <span className={styles.pricenum}>&yen;{regMoney}</span>
            }
          </div>
          <div className={styles.btn} onClick={this.submitTo.bind(this)}>立即支付</div>
        </div>
        <Layer ref={(layer) => { this.vipconfirm = layer }} onRightClick={this.vipRecharge.bind(this)}>
          <div className="modal-header">请输入会员卡密码</div>
          <div className="modal-body">
            <div className={styles.vippassword}><input type="password" value={vipPassword} onChange={this.vippassChange.bind(this)} placeholder="请输入会员卡密码" /></div>
            <div className={styles.vipprice}>
              <div className={styles.vipleft}>支付金额<span>{discount.discountMoney}&nbsp;元</span></div>
              <div className={styles.vipright} onClick={() => {
                Toast.info('请联系客服进行密码重置', 1)
              }}>忘记密码？</div>
            </div>
          </div>
        </Layer>
      </div>
    )
  }
}

export default Pay
