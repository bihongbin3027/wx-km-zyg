import React, { Component } from 'react'
import { Toast, Modal, NoticeBar } from 'antd-mobile'
import { documentTitle } from '../../utils/utils'
import Code from '../../components/code/code'
import API from '../../api/api'
import styles from '../vstperson/edit.module.css'

class AddMember extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        name: '',
        card: '',
        password: '',
        phone: '',
        code: ''
      }
    }
  }

  inputChange(name, e) {
    let { form } = this.state
    form[name] = e.target.value
    this.setState({form})
  }

  addSubmit() {
    const { form } = this.state
    const { name, card, password, phone, code } = form
    let params = {}
    if (name === '') {
      Toast.info('请输入持卡人姓名', 1)
      return
    }
    if (card === '') {
      Toast.info('请输入会员卡号', 1)
      return
    }
    if (password === '') {
      Toast.info('请输入密码', 1)
      return
    }
    if (phone === '') {
      Toast.info('请输入手机号码', 1)
      return
    } else {
      let reg = /^1\d{10}$/
      if (!reg.test(phone)) {
        Toast.info('请输入正确的手机号码', 1)
        return
      }
    }
    if (code === '') {
      Toast.info('请输入验证码', 1)
      return
    }
    
    params.name = name
    params.memberNo = card
    params.password = password
    params.mobilePhone = phone
    params.smsCode = code
    API.bindVIP(params).then(res => {
      Toast.info('绑卡成功', 1.5)
      setTimeout(() => {
        this.props.history.goBack()
      }, 1500)
    })
  }

  componentDidMount() {
    documentTitle('绑定会员卡')
    this.alert = Modal.alert('温馨提示', '“绑定会员卡”功能需前往门店办理后方可操作，绑定会员卡后可通过会员卡在线充值支付；如期间未绑定会员卡，也将不会影响您预约挂号，如有疑问，详询4001009066。', [{text: '我知道了'}])
  }

  componentWillUnmount() {
    this.alert.close()
  }
  
  render() {
    const { form } = this.state

    return (
      <div className={styles.editbox} style={{marginTop: 0}}>
        <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}>
          “绑定会员卡”功能需前往门店办理后方可操作，绑定会员卡后可通过会员卡在线充值支付；如期间未绑定会员卡，也将不会影响您预约挂号，如有疑问，详询4001009066。
        </NoticeBar>
        <ul style={{marginTop: '10px'}}>
          <li className={styles.listItem_li}>
            <div className={styles.leftText}>持卡人</div>
            <input
              type="text"
              onChange={this.inputChange.bind(this, 'name')}
              value={form.name}
              placeholder="请输入持卡人姓名"
              maxLength="10"
            />
          </li>
          <li className={styles.listItem_li}>
            <div className={styles.leftText}>会员卡号</div>
            <input
              type="text"
              onChange={this.inputChange.bind(this, 'card')}
              value={form.card}
              placeholder="请输入会员卡号"
            />
          </li>
          <li className={styles.listItem_li}>
            <div className={styles.leftText}>密码</div>
            <input
              type="password"
              onChange={this.inputChange.bind(this, 'password')}
              value={form.password}
              placeholder="请输入密码"
            />
          </li>
          <li className={styles.listItem_li}>
            <div className={styles.leftText}>手机号码</div>
            <input
              type="text"
              onChange={this.inputChange.bind(this, 'phone')}
              value={form.phone}
              placeholder="请输入手机号码"
              maxLength="11"
            />
          </li>
          <li className={styles.listItem_li} style={{justifyContent: 'space-between'}}>
            <div className={styles.code_box}>
              <div className={styles.leftText}>验证码</div>
              <input
                type="text"
                onChange={this.inputChange.bind(this, 'code')}
                value={form.code}
                placeholder="请输入验证码"
                maxLength="4"
              />
            </div>
            <Code phone={form.phone} />
          </li>
        </ul>  
        <div className={styles.foot_btn} onClick={this.addSubmit.bind(this)}>绑定</div>
      </div>
    )
  }
}

export default AddMember
