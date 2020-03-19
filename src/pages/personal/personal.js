import React, { Component } from 'react'
import { List, Toast } from 'antd-mobile'
import API from '../../api/api'
import { documentTitle, loadFromLocal } from '../../utils/utils'
import icons from '../../style/icon.module.css'
import styles from './personal.module.css'

class Personal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      vipInfo: '',
      portait: loadFromLocal('h5', 'portait'),
      userName: loadFromLocal('h5', 'userName')
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
    documentTitle('个人中心')
    this.init()
  }

  render() {
    const { portait, userName, vipInfo } = this.state

    return (
      <React.Fragment>
        <div className={styles.user}>
          <div>
            <div className={styles.doc_img}><img src={portait} alt="" />{vipInfo ? <i className={icons.personal_img_icon}></i> : null}</div>
            <div className={styles.doc_name}>{userName}</div>
          </div>
        </div>
        {
          vipInfo ? (
            <div className={styles.remaining}>
              <div onClick={() => {this.props.history.push({pathname: '/balance', search: `memberId=${vipInfo.memberId}`})}}>
                <div>
                  <div className={styles.balance}><span>&yen;</span>{vipInfo.memberBalance}</div>
                  <div className={styleMedia.rig_txt}>我的余额</div>
                </div>
              </div>
              <div onClick={() => { this.props.history.push({pathname: '/integral', search: `memberId=${vipInfo.memberId}`})}}>
                <div>
                  <div className={styles.integral}><span>{vipInfo.memberScore}</span>分</div>
                  <div className={styleMedia.rig_txt}>我的积分</div>
                </div>
              </div>
            </div>
          ) : null
        }
        <div className="date-form style1 text-max" style={{ marginTop: 10 }}>
          <List>
            <List.Item
              className={styles.icon_style2}
              thumb={require('../../images/personal_list_yuyue.png')}
              onClick={() => {
                this.props.history.push('/reserve')
              }}
              arrow="horizontal"
            >
              我的预约
            </List.Item>
            <List.Item
              className={styles.icon_style2}
              thumb={require('../../images/personal_list_jzgl.png')}
              onClick={() => {
                this.props.history.push('/vstpersonlist')
              }}
              arrow="horizontal"
            >
              就诊人管理
            </List.Item>  
          </List>
        </div>
        <div className="date-form style1 text-max" style={{ marginTop: 10 }}>
          <List>
            <List.Item
              className={styles.icon_style2}
              thumb={require('../../images/personal_doctor.png')}
              onClick={() => {
                this.props.history.push('/attention')
              }}
              arrow="horizontal"
            >
              我的医生
            </List.Item>
          </List>    
        </div>
        <div className="date-form style1 text-max" style={{ marginTop: 10 }}>
          <List>
            <List.Item
              className={styles.icon_style1}
              thumb={require('../../images/personal_list_vip.png')}
              onClick={() => {
                if (vipInfo) {
                  this.props.history.push('/member')
                } else {
                  Toast.info('请先绑定会员卡', 1)
                  this.props.history.push('/addmember')
                }
              }}
              arrow="horizontal"
            >
              会员卡
            </List.Item>
            <List.Item
              className={styles.icon_style2}
              thumb={require('../../images/personal_list_chong.png')}
              onClick={() => {
                if (vipInfo) {
                  this.props.history.push('/chargemember')
                } else {
                  Toast.info('请先绑定会员卡', 1)
                  this.props.history.push('/addmember')
                }
              }}
              arrow="horizontal"
            >
              会员卡充值
            </List.Item>
            {/* <List.Item
              className={styles.icon_style3}
              thumb={require('../../images/personal_baogao.png')}
              onClick={() => {
                // this.props.history.push('/reserve')
              }}
              arrow="horizontal"
            >
              我的报告
            </List.Item> */}
          </List>
        </div>
      </React.Fragment>
    )
  }
}

export default Personal
