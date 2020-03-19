import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { documentTitle, urlParse } from '../../utils/utils'
import API from '../../api/api'
import styles from './integral.module.css'

class Integral extends Component {
  constructor(props) {
    super(props)
    this.state = {
      urlInfo: urlParse(),
      list: [],
      balance: 0
    }
  }

  async init() {
    const { urlInfo } = this.state
    Toast.loading('加载中..', 0)
    let list = await API.getVIPRecord({ memberId: urlInfo.memberId, type: 1})
    this.setState({
      list: list.itemList,
      balance: list.memberItem
    })
    Toast.hide()
  }

  componentDidMount() {
    documentTitle('我的积分')
    this.init()
  }

  render() {
    const { list, balance } = this.state

    return (
      <React.Fragment>
        <div className={styles.integralbg}>
          <div>
            <div className={styles.intergranum}>{balance}</div>
            <div>我的积分（分）</div>
          </div>
        </div>
        <div className="list-title">积分记录</div>
        {
          list.length ? (
            list.map((item, index) => {
              return <div className="list-item borderBottom" key={index}>
                <div className="list-line large">
                  <div className="list-content just-between">
                    <div className="dt">
                      <div>
                        <div className={styles.logname}>{item.hosName}</div>
                        <p className={styles.logtime}>{item.itemDate} {item.item}</p>
                      </div>
                    </div>
                    <div>{item.record}</div>
                  </div>
                </div>
              </div>
            })
          ) : <div className="no-result">没有积分记录</div>
        }
      </React.Fragment>
    )
  }
}

export default Integral
