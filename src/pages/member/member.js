import React, { Component } from 'react'
import { List, Toast } from 'antd-mobile'
import { documentTitle } from '../../utils/utils'
import API from '../../api/api'
import styles from './member.module.css'

class Member extends Component {
  constructor(props) {
    super(props)
    this.state = {
      vipInfo: {
        memberName: '',
        memberNo: 0,
        memberBalance: 0,
        memberScore: 0
      }
    }
  }

  init() {
    Toast.loading('加载中..', 0)
    API.getVIPInfo().then(res => {
      Toast.hide()
      if (res.resultData) {
        this.setState({
          vipInfo: res.resultData
        })
      } else {
        this.setState({
          vipInfo: false
        })
      }
    })
  }

  componentDidMount() {
    documentTitle('会员卡')
    this.init()
  }
  render() {
    const { memberId, memberName, memberNo, memberBalance, memberScore, mobilePhone } = this.state.vipInfo

    return (
      <React.Fragment>
        <div className={styles.card}>
          <div className={styles.card_img}>
            <div className={styles.user}>
              <div>NO.{memberNo}</div>
            </div>
          </div>
        </div>
        <div className="date-form style1 prl text-max" style={{ marginTop: 10 }}>
          <List>
            <List.Item
              thumb={require('../../images/member-rw.png')}
              extra={memberName}
            >
              持卡人
            </List.Item>
            <List.Item
              className={styles.icon_style3}
              thumb={require('../../images/member-sj.png')}
              extra={mobilePhone}
            >
              手机号
            </List.Item>
            <List.Item
              className={styles.icon_style2}
              thumb={require('../../images/member_ye.png')}
              extra={`￥${memberBalance}`}
              onClick={() => {
                this.props.history.push({
                  pathname: '/balance',
                  search: `memberId=${memberId}`
                })
              }}
            >
              余额
            </List.Item>
            <List.Item
              thumb={require('../../images/member_jf.png')}
              extra={`${memberScore} 分`}
              onClick={() => {
                this.props.history.push({
                  pathname: '/integral',
                  search: `memberId=${memberId}`
                })
              }}
            >
              积分
            </List.Item>
            <List.Item
              thumb={require('../../images/personal_list_chong.png')}
              onClick={() => {
                this.props.history.push('/chargemember')
              }}
              arrow="horizontal"
            >
              会员卡充值
            </List.Item>
          </List>
        </div>
      </React.Fragment>
    )
  }
}

export default Member
