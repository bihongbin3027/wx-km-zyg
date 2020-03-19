import React, { Component } from 'react'
import { Picker, List, Toast } from 'antd-mobile'
import API from '../../api/api'
import { documentTitle, urlParse, doctorPhoto } from '../../utils/utils'
import styles from './reservation.module.css'

class Confirm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      doctorInfo: {},
      name: '',
      // 选中第几个就诊人
      personIndex: '',
      visitingPerson: [],
      phyInfo: urlParse()
    }
  }

  pickerFormat(v) {
    if (v.length) {
      return v[0].split(' ')[0]
    }
  }

  setbornChange(v, ) {
    this.setState({
      name: v,
      personIndex: v[0].split('-')[1]
    })
  }

  errorImg(e) {
    e.target.src = doctorPhoto()
  }

  init() {
    // 获取就诊人列表
    API.getVisitorList().then(res => {
      let nameArr = []
      let personIndex = 0
      let newData = res.map((a, index) => {
        if (a.isdefault === '1') {
          personIndex = `${index}`
          nameArr.push(`${a.cardName}-${index}`)
        }
        return {
          label: `${a.cardName} ${a.mobilePhone}`,
          value: `${a.cardName}-${index}`,
          cardNo: a.cardNo
        }
      })
      this.setState({
        name: nameArr.length ? nameArr : '',
        personIndex,
        visitingPerson: newData
      })
    })
  }

  // 添加就诊人
  addvst() {
    this.props.history.push('/vstpersonedit')
  }

  submit() {
    const { doctorInfo, phyInfo, name, visitingPerson, personIndex } = this.state
    const { itemId, PhysioName, PhysioMoney } = phyInfo
    const { 
      scheduleId, 
      timeRange, 
      docId, 
      docName, 
      deptId, 
      deptName, 
      scheduleDate, 
      regMoney 
    } = doctorInfo
    if (!name) {
      Toast.info('请选择就诊人', 1)
      return
    }
    Toast.loading('预约中..', 0)
    let params = {
      cardNo: visitingPerson[personIndex].cardNo,
      scheduleId,
      timeRange,
      isPay: 1,
      docId,
      myDocId: docId,
      docName,
      deptId,
      deptName,
      regDate: scheduleDate,
      regMoney,
      regType: 'A',
      regWay: 2
    }
    if (itemId) {
      params.itemId = itemId
      params.remark = PhysioName
      params.regMoney = PhysioMoney
    }
    API.pushRegister(params).then(res => {
      let to = ''
      Toast.hide()
      if (itemId) {
        to = '?tag=2'
      }
      this.props.history.replace(`/reserve${to}`)
    })
  }

  componentDidMount() {
    const params = urlParse().params
    documentTitle('确认预约')
    if (params) {
      this.init()
      this.setState({
        doctorInfo: JSON.parse(params)
      })
    }
  }

  render() {
    let { doctorInfo, phyInfo, name, visitingPerson } = this.state
    let { docName, hisDocId, portait, title, deptName, regMoney, scheduleDate, timeRange } = doctorInfo

    return (
      <React.Fragment>
        <div className={styles.doctor_info}>
          <div className={styles.doctor_box}>
            <div className={styles.doctor_img}>
              <img src={doctorPhoto(portait, hisDocId)} onError={this.errorImg.bind(this)} alt="" />
            </div>
            <div>
              <div className={styles.doctor_name}>{docName}<span>{title}</span></div>
              <div className={styles.doctor_department}>弘德分馆<span>{deptName}</span></div>
            </div>
          </div>
        </div>
        {
          phyInfo.itemId ? (
            <div className="list-item borderBottom">
              <div className="list-line">
                <div className="list-content just-between">
                  <div className="dt">预约套餐</div>
                  <div>{phyInfo.PhysioName}</div>
                </div>
              </div>
            </div>
          ) : null
        }
        <div className="list-item borderBottom">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt">预约费用</div>
              <div className={styles.color2}>&yen; {phyInfo.PhysioMoney ? phyInfo.PhysioMoney : regMoney}</div>
            </div>
          </div>
        </div>
        <div className="list-item borderBottom">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt">就诊时间</div>
              <div className={styles.color1}>{scheduleDate} {timeRange}</div>
            </div>
          </div>
        </div>
        <div className="list-item borderBottom">
          <div className="list-line">
            <div className="list-content just-between">
              <div className="dt">就诊地点</div>
              <div className={styles.color1}>康美中医馆-深圳弘德分馆</div>
            </div>
          </div>
        </div>
        <div className="date-form style1">
          {
            visitingPerson.length ? (
              <Picker
                data={visitingPerson}
                value={name}
                cols={1}
                format={this.pickerFormat}
                onChange={this.setbornChange.bind(this)}
              >
                <List.Item arrow="horizontal">就诊人</List.Item>
              </Picker>
            ) : (
              <div className="list-item borderBottom">
                <div className="list-line">
                  <div className="list-content just-between">
                    <div className="dt">就诊人</div>
                    <div className={styles.color4} onClick={this.addvst.bind(this)}>点击添加就诊人</div>
                  </div>
                </div>
              </div>
            )
          }
        </div>
        <div className={styles.foot_btn} onClick={this.submit.bind(this)}>立即预约</div>
      </React.Fragment>
    )
  }
}

export default Confirm
