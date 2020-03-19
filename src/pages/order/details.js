import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { documentTitle, urlParse, accMul } from '../../utils/utils'
import API from '../../api/api'
import styles from './order.module.css'

class OrderDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      urlInfo: urlParse(),
      list: []
    }
  }

  async init() {
    let { urlInfo } = this.state
    const { orderId } = urlInfo.item
    Toast.loading('加载中..', 0)
    let list = await API.getVIPRecipe({
      orderId
    })
    Toast.hide()
    this.setState({
      list
    })
  }

  pay({billsNo, cardNo, charge}) {
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

  componentDidMount() {
    documentTitle('订单详情')
    let { urlInfo } = this.state
    urlInfo.item = JSON.parse(urlInfo.item)
    this.setState({
      urlInfo
    }, () => {
      this.init()
    })
  }

  render() {
    const { urlInfo, list } = this.state
    const { item } = urlInfo

    return (
      <div className={styles.orderdbox}>
        <dl className="list-card">
          <dt className="icon">订单信息</dt>
          <dd>
            <ul className={styles.orderdul}>
              <li>
                <div>订单编号</div>
                <div>{item.billsNo}</div>
              </li>
              <li>
                <div>支付状态</div>
                <div className={styles.orange}>{item.chargeStatus === 'Y' ? '已支付' : '未支付'}</div>
              </li>
              <li>
                <div>就诊人</div>
                <div>{item.patientName}</div>
              </li>
              <li>
                <div>订单金额</div>
                <div className={styles.orange}>&yen;{item.charge}</div>
              </li>
              <li>
                <div>订单时间</div>
                <div>{item.chargeDate}</div>
              </li>
            </ul>
          </dd>
        </dl>
        <dl className="list-card">
          <dt className="icon">费用明细</dt>
          {
            list.length ? (
              list.map((data, index) => {
                return <dd key={index}>
                  <div className="list-item borderBottom">
                    <div className="list-line large">
                      <div className="list-content just-between">
                        <div className="dt">
                          <div className="list-content-left">
                            <div>{data.orderName}</div>
                            <p className="dec">单价：~</p>
                          </div>
                        </div>
                        <div className="list-content-right">
                          <div>&yen;{accMul(data.orderPrice, data.orderTotal)}</div>
                          <p className="dec">数量：~</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </dd>
              })
            ) : <div className="no-result">暂无数据</div>
          }
        </dl>
        {
          item.chargeStatus === 'N' && <div className={styles.footbtn} onClick={this.pay.bind(this, item)}>支付</div>
        }
      </div>
    )
  }
}

export default OrderDetails
