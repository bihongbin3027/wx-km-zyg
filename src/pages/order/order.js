import React, { Component } from 'react'
import { Tabs, Toast } from 'antd-mobile'
import { documentTitle, urlParse } from '../../utils/utils'
import API from '../../api/api'
import styles from './order.module.css'

class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tabIndex: urlParse().tag - 1 || 0,
      tabs: [{
        title: '未支付'
      }, {
        title: '已支付'
      }],
      unpaidList: [],
      paidList: []
    }
  }

  timePriceStyle(chargeStatus) {
    if (chargeStatus !== 'Y') {
      return {
        paddingTop: '5px',
        marginBottom: '-5px'
      }
    }
  }

  async getVIPRecipeList() {
    const { tabIndex } = this.state
    let params = {}
    let resetData = {}
    Toast.loading('加载中..', 0)
    if (tabIndex === 0) {
      params.status = 'N'
    }
    if (tabIndex === 1) {
      params.status = 'Y'
    }
    let list = await API.getVIPRecipeList({
      status: params.status
    })
    Toast.hide()
    if (tabIndex === 0) {
      resetData.unpaidList = list
    }
    if (tabIndex === 1) {
      resetData.paidList = list
    }
    this.setState(resetData)
  }

  userCard(item, index) {
    return <div className={styles.orderbox} key={index} onClick={() => {
      window.location.href = `#/orderdetail?item=${JSON.stringify(item)}`
    }}>
      <div className={styles.numbering}>
        <div>编号：{item.billsNo}</div>
        <div className={(item.chargeStatus === 'Y') ? '' : styles.orange}>{item.chargeStatus === 'Y' ? '已支付' : '未支付'}</div>
      </div>
      <div className={styles.userinfo}>
        <div>就诊人：{item.patientName}</div>
        <div className={styles.doctortxt}>订单金额：<span className={styles.orange}>&yen;{item.charge}</span></div>
        <div className={styles.arrowIcon}></div>
      </div>
      <div className={styles.timeprice} style={this.timePriceStyle(item.chargeStatus)}>
        <div className={styles.date}>日期：{item.chargeDate}</div>
        {
          (item.chargeStatus === 'N') && <div className={styles.pay} onClick={this.pay.bind(this, item)}>支付</div>
        }
      </div>
    </div>
  }

  pay({billsNo, cardNo, charge}, e) {
    e.stopPropagation()
    Toast.loading('正在生成订单，请稍后', 0)
    API.orderBill({
      billsNo,
      cardNo
    }).then(res => {
      Toast.hide()
      this.props.history.push({
        pathname: '/pay',
        search: `orderNo=${res.orderId}&regMoney=${charge}&type=3`
      })
    })
  }

  onTabClick(tab, index) {
    this.setState({
      tabIndex: index
    }, () => {
      this.getVIPRecipeList()
    })
  }

  componentDidMount() {
    documentTitle('门诊缴费')
    this.getVIPRecipeList()
  }

  render() {
    const {tabIndex, tabs, unpaidList, paidList} = this.state

    return (
      <Tabs tabs={tabs} initialPage={tabIndex} swipeable={false} onChange={this.onTabClick.bind(this)}>
        <div className={styles.orderleft}>
          {
            unpaidList.length ? (
              <ul className={styles.orderul}>
                {
                  unpaidList.map((item, index) => {
                    return this.userCard(item, index)
                  })
                }
              </ul>
            ) : <div className="no-result">没有订单</div>
          }
        </div>
        <div className={styles.orderright}>
          {
            paidList.length ? (
              <ul className={styles.orderul}>
                {
                  paidList.map((item, index) => {
                    return this.userCard(item, index)
                  })
                }
              </ul>
            ) : <div className="no-result">没有订单</div>
          }
        </div>
      </Tabs>
    )
  }
}

export default Order
