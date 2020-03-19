import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Toast } from 'antd-mobile'
import API from '../../api/api'
import styles from './code.module.css'

class Code extends Component {
  constructor(props) {
    super(props)
    this.state = {
      status: true,
      num: 60,
      txt: '获取验证码'
    }
  }

  countdown() {
    const { phone } = this.props
    let reg = /^[1][3,4,5,7,8][0-9]{9}$/
    if (!reg.test(phone)) {
      Toast.info('请输入正确的手机号码', 1)
      return
    }
    if (this.state.status) {
      this.setState({
        status: false
      })
      API.getSmsCode({
        mobilePhone: phone,
        smsType: '4'
      }).then(res => {
        this.setState({
          num: this.state.num - 1,
          txt: `${this.state.num - 1}秒`
        })
        this.timer = setInterval(() => {
          let { num } = this.state
          if (num === 1) {
            clearInterval(this.timer)
            this.setState({
              status: true,
              num: 60,
              txt: '获取验证码'
            })
          } else {
            this.setState({
              num: num - 1,
              txt: `${num - 1}秒`
            })
          }
        }, 1000)
      })
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const { status, txt } = this.state

    return <div className={styles.btn} onClick={this.countdown.bind(this)} style={{opacity: status ? '1' : '0.7'}}>{txt}</div>
  }
}

Code.propTypes = {
  phone: PropTypes.string.isRequired
}

export default Code
