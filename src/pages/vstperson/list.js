import React, { Component } from 'react'
import { Modal, Toast } from 'antd-mobile'
import { documentTitle, getAge, getSex } from '../../utils/utils'
import API from '../../api/api'
import radios from '../../style/radio.module.css'
import icons from '../../style/icon.module.css'
import styles from './list.module.css'

class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refreshing: false,
      down: true,
      list: []
    }
  }

  radioChange(item, index) {
    let { visitorId, cardName, gender, mobilePhone, birthDate, cardNo } = item
    let params = {
      visitorId,
      cardNo,
      operate: 'upd',
      name: cardName,
      sex: gender,
      mobilePhone,
      birthday: birthDate,
      isDefault: '1'
    }
    API.operateVisitor(params).then(res => {
      let { list } = this.state
      for (let i = 0, len = list.length; i < len; i++) {
        if (i === index) {
          list[i].isdefault = '1'
        } else {
          list[i].isdefault = '0'
        }
      }
      Toast.info('已设为默认就诊人', 1)
      this.setState({list})
    })
  }

  editList(item) {
    this.props.history.push({
      pathname: '/vstpersonedit',
      search: `params=${JSON.stringify(item)}`
    })
  }

  deleteList({visitorId}, index) {
    Modal.alert('提示', '确定删除该就诊人？', [{
      text: '取消',
    }, {
      text: '确定',
      onPress: () => {
        API.operateVisitor({
          operate: 'del',
          visitorId: visitorId
        }).then(res => {
          let { list } = this.state
          for (let i = 0, len = list.length; i < len; i++) {
            if (i === index) {
              list.splice(i, 1)
            }
          }
          Toast.success('已删除', 1)
          this.setState({list})
        })
      }
    }])
  }

  addSubmit() {
    if (this.state.list.length < 5) {
      this.props.history.push('/vstpersonedit')
    } else {
      Toast.info('最多添加5个就诊人！', 1)
    }
  }

  init() {
    Toast.loading('加载中..', 0)
    // 获取就诊人列表
    API.getVisitorList().then(data => {
      Toast.hide()
      this.setState({
        list: data,
        refreshing: false
      })
    })
  }

  componentDidMount() {
    documentTitle('就诊人管理')
    this.init()
  }

  render() {
    const { list } = this.state

    return (
      <div className={styles.listbox}>
        <ul>
          {
            list.length ? list.map((item, index) => {
              return (
                <li className={styles.listli} key={index}>
                  <div className={styles.user}><span>{item.cardName}</span><span>{getSex(item.gender)}</span><span>{getAge(item.birthDate)}岁</span></div>
                  <div className={styles.phone}>手机号码：{item.mobilePhone}</div>
                  <div className={styles.listli_foot}>
                    <label className={radios.checkboxWrapper}>
                      <div className={radios.leftCheck}>
                        <input className={radios.checkboxInput} name="vstperson" type="radio" checked={item.isdefault === '1'} onChange={this.radioChange.bind(this, item, index)} />
                        <span className={radios.checkboxInner}></span>
                        <span className={radios.checkboxText}>{item.isdefault === '1' ? '默认就诊人' : '设置默认'}</span>
                      </div>
                    </label>
                    <div className={styles.listli_foot_right}>
                      <div onClick={this.editList.bind(this, item)}><i className={icons.edit_icon}></i>编辑</div>
                      <div onClick={this.deleteList.bind(this, item, index)}><i className={icons.delete_icon}></i>删除</div>
                    </div>
                  </div>
                </li>
              )
            }) : <div className="no-result">暂无就诊人</div>
          }
        </ul>
        <div className={styles.foot_btn} onClick={this.addSubmit.bind(this)}>添加就诊人</div>
      </div>
    )
  }
}

export default List
