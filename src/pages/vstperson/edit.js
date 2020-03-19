import React, { Component } from 'react'
import { Toast, DatePicker, List, Modal, } from 'antd-mobile'
import API from '../../api/api'
import Code from '../../components/code/code'
import { documentTitle, urlParse, formatDate } from '../../utils/utils'
import radios from '../../style/radio.module.css'
import styles from './edit.module.css'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        name: '',
        sex: '1',
        born: new Date(),
        phone: '',
        code: '',
        setnormal: false
      },
      codeVisible: false
    }
  }

  inputChange(name, e) {
    let { form } = this.state
    let codeVisible = false
    form[name] = e.target.value
    if (name === 'phone') {
      if (form[name] !== this.phone) {
        codeVisible = true
      } else {
        codeVisible = false
      }
      this.setState({codeVisible})
    }
    this.setState({form})
  }

  setnormalChange() {
    let { form } = this.state
    form.setnormal = !form.setnormal
    this.setState({form})
  }

  setbornChange(date) {
    let { form } = this.state
    form['born'] = date
    this.setState({form})
  }

  deleteList() {
    Modal.alert('提示', '确定删除该就诊人？', [{
      text: '取消',
    }, {
      text: '确定',
      onPress: () => {
        Toast.loading('删除中..', 0)
        API.operateVisitor({
          operate: 'del',
          visitorId: this.params.visitorId
        }).then(res => {
          Toast.hide()
          this.props.history.push('/vstpersonlist')
        })
      }
    }])
  }

  addSubmit() {
    const { form, codeVisible } = this.state
    const { name, born, phone, code } = form
    let params = {}
    if (name === '') {
      Toast.info('请输入姓名', 1)
      return
    }
    if (born === '') {
      Toast.info('请选择出生日期', 1)
      return
    }
    if (phone === '') {
      Toast.info('请输入手机号码', 1)
      return
    } else {
      let reg = /^[1][3,4,5,7,8][0-9]{9}$/
      if (!reg.test(phone)) {
        Toast.info('请输入正确的手机号码', 1)
        return
      }
    }
    /* 新增或者电话号码发生改变出现验证码 */
    if (codeVisible && code === '') {
      Toast.info('请输入验证码', 1)
      return
    }
    
    params.name = form.name
    params.sex = form.sex
    params.mobilePhone = form.phone
    params.birthday = formatDate(form.born, 'YYYY-MM-DD')
    params.smsCode = form.code
    params.isDefault = form.setnormal ? '1' : '0'
    Toast.loading('保存中..', 0)
    if (this.params) {
      params.visitorId = this.params.visitorId
      params.cardNo = this.params.cardNo
      params.operate = 'upd'
      API.operateVisitor(params).then(res => {
        Toast.hide()
        this.props.history.goBack()
      })
    } else {
      API.insertVisitor(params).then(res => {
        Toast.hide()
        this.props.history.goBack()
      })
    }
  }

  componentDidMount() {
    let { params } = urlParse()
    let { form } = this.state
    if (params) {
      params = JSON.parse(params)
      this.params = params
      this.phone = params.mobilePhone
      form.name = params.cardName
      form.sex = params.gender
      form.born = new Date(params.birthDate)
      form.phone = params.mobilePhone
      form.setnormal = params.isdefault === '1' ? true : false
      this.setState({
        form
      })
    }
    documentTitle(params ? '编辑就诊人' : '添加就诊人')
  }

  render() {
    const { form, codeVisible } = this.state

    return (
      <div className={styles.editbox}>
        <ul>
          <li className={styles.listItem_li}>
            <div className={styles.leftText}>姓名</div>
            <input
              type="text"
              onChange={this.inputChange.bind(this, 'name')}
              value={form.name}
              placeholder="请输入姓名"
              maxLength="10"
            />
          </li>
          <li className={styles.listItem_li}>
            <div className={styles.leftText}>性别</div>
            <div className={styles.sex}>
              <label className={radios.checkboxWrapper}>
                <div className={radios.leftCheck}>
                  <input className={radios.checkboxInput} name="sex" type="radio" value="1" checked={form.sex === '1'} onChange={this.inputChange.bind(this, 'sex')} />
                  <span className={radios.checkboxInner}></span>
                  <span className={radios.checkboxText}>男</span>
                </div>
              </label>
              <label className={radios.checkboxWrapper}>
                <div className={radios.leftCheck}>
                  <input className={radios.checkboxInput} name="sex" type="radio" value="2" checked={form.sex === '2'} onChange={this.inputChange.bind(this, 'sex')} />
                  <span className={radios.checkboxInner}></span>
                  <span className={radios.checkboxText}>女</span>
                </div>
              </label>
            </div>
          </li>
          <li className={styles.listItem_li}>
            <div className="date-form">
              <DatePicker
                mode="date"
                title="选择日期"
                extra="请选择出生日期"
                minDate={new Date('1900-01-01')}
                maxDate={new Date()}
                value={form.born}
                onChange={date => this.setbornChange(date)}
              >
                <List.Item arrow="horizontal">出生日期</List.Item>
              </DatePicker>
            </div>  
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
          {
            /* 新增或者电话号码发生改变出现验证码 */
            this.params && !codeVisible ? null : (
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
            )
          }
        </ul>
        <label className={styles.set_normal}>
          <div className={styles.leftText}>设置成默认就诊人</div>
          <div className={radios.checkboxWrapper}>
            <div className={radios.leftCheck}>
              <input className={radios.checkboxInput} type="checkbox" checked={form.setnormal} onChange={this.setnormalChange.bind(this)} />
              <span className={radios.checkboxInner}></span>
            </div>
          </div>
        </label>
        {
          this.params ? <div className={styles.delete_btn} onClick={this.deleteList.bind(this)}>删除就诊人</div> : null
        }
        <div className={styles.foot_btn} onClick={this.addSubmit.bind(this)}>保存</div>
      </div>
    )
  }
}

export default Edit
