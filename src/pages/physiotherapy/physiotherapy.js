import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { documentTitle } from '../../utils/utils'
import envconfig from '../../envconfig/envconfig'
import API from '../../api/api'
import styles from './physiotherapy.module.css'

const PHOTOERROR = require('../../images/phyaleft.png')

class Physiotherapy extends Component {
  constructor(props) {
    super(props)
    this.toDetail = this.toDetail.bind(this)
    this.state = {
      list: []
    }
  }

  toDetail(item) {
    window.location.href = `#/pshpdetails?params=${JSON.stringify(item)}`
  }

  async init() {
    Toast.loading('加载中..', 0)
    let list = await API.getPhysioList()
    Toast.hide()
    this.setState({
      list
    })
  }

  photoError(e) {
    e.target.src = PHOTOERROR
  }

  componentDidMount() {
    documentTitle('预约理疗')
    this.init()
  }

  render() {
    const { list } = this.state
    return (
      <ul>
        {
          list.length ? list.map((item, index) => {
            return <li className={styles.li} onClick={this.toDetail.bind(this, item)} key={index}>
              <div className={styles.img}>
                <img src={`${envconfig.bannerUrl}/upload/kmzyg/physio/${item.itemId}.jpg`} onError={this.photoError.bind(this)} alt="" />
              </div>
              <div>
                <div className={styles.title}>{item.PhysioName}</div>
                <div className={styles.price}>&yen;{item.PhysioMoney}</div>
                <div className={styles.dec}>套餐内容：{item.PhysioContent || '无'}</div>
              </div>
            </li>
          }) : <div className="no-result">暂无数据</div>
        }
      </ul>
    )
  }
}

export default Physiotherapy
