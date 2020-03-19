import React, { Component } from 'react'
import { Accordion, Toast, Picker } from 'antd-mobile'
import API from '../../api/api'
import DoctorItem from '../../components/doctoritem/doctoritem'
import { documentTitle, urlParse, formatDate, doctorPhoto } from '../../utils/utils'
import styles from './doctordetails.module.css'

class DoctorDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      params: urlParse(),
      // 0未关注 1已关注
      isConcern: '0',
      doctorDetail: [],
      doctorList: []
    }
  }

  refresh() {
    this.init()
  }

  isHasRegFormat({ regLeftNum }) {
    if (regLeftNum === 0) {
      return {
        color: '#999',
        backgroundColor: '#eaeaea'
      }
    } else {
      return {
        backgroundColor: '#f7d550'
      }
    }
  }

  errorImg(e) {
    e.target.src = doctorPhoto()
  }

  onChangeColor(el, val) {
    const urlInfo = this.state.params
    const { doctorDetail } = this.state
    const { docId, 
      docName,
      deptId,
      deptName,
      hisDocId,
      portait,
      title 
    } = doctorDetail[0]
    const index = val[0]
    let params = {
      docId,
      docName,
      deptId,
      deptName,
      hisDocId,
      portait,
      title,
      scheduleId: el.scheduDetail[index].scheduleId,
      regMoney: el.scheduDetail[index].regMoney,
      scheduleDate: el.scheduDetail[index].scheduleDate,
      timeRange: el.scheduDetail[index].timeRange
    }
    let search = ''
    if (urlInfo.itemId) {
      search = `&itemId=${urlInfo.itemId}&PhysioName=${urlInfo.PhysioName}&PhysioMoney=${urlInfo.PhysioMoney}`
    }
    window.location.href = `#/confirmreservation?params=${JSON.stringify(params)}${search}`
  }

  async init() {
    const { params } = this.state
    Toast.loading('加载中..', 0)
    // 获取医生详情
    let getScheduleDetail = null
    if (params.itemId) {
      getScheduleDetail = await API.getPhysioScheduleDetail({
        docId: params.docId,
        hisDeptId: params.deptId,
        itemId: params.itemId
      })
    } else {
      getScheduleDetail = await API.getScheduleDetail({
        docId: params.docId
      })
    }
    // 验证医生是否关注
    let getUserDocConcern = await API.getUserDocConcern({
      hisDocId: getScheduleDetail.hisDocId
    })
    let newData = [getScheduleDetail].map(a => {
      return {
        docId: a.docId,
        docName: a.docName,
        deptId: a.deptId,
        hisDeptId: a.hisDeptId,
        deptName: a.deptName,
        hisDocId: a.hisDocId,
        portait: a.portait,
        title: a.title,
        specialist: a.specialist,
        docDesc: a.docDesc.split('@@@@'),
        regMoney: params.itemId ? params.PhysioMoney : a.regMoney,
        scheduDate: a.scheduDate.map(b => {
          return {
            name: `${formatDate(b.scheduleDate, 'WW')} ${formatDate(b.scheduleDate, 'MM-DD')}`,
            regNum: b.regNum,
            regLeftNum: b.regLeftNum,
            sourceValue: '',
            scheduDetail: b.scheduDetail.map((c, i) => {
              const label = `${c.startTime}-${c.endTime} （可选）`
              return {
                label,
                value: i,
                scheduleId: c.scheduleId,
                regMoney: c.regMoney,
                scheduleDate: c.scheduleDate,
                timeRange: c.timeRange
              }
            })
          }
        })
      }
    })
    let getScheduleInfo = await API.getScheduleInfo({
      hisParentId: 1,
      hisDeptId: newData[0].hisDeptId
    })
    getScheduleInfo = getScheduleInfo.filter((doc) => {
      return doc.docId !== newData[0].docId
    })
    Toast.hide()
    this.setState({
      isConcern: getUserDocConcern.isConcern,
      doctorDetail: newData,
      doctorList: getScheduleInfo
    })
  }

  isConcern() {
    const { isConcern, doctorDetail } = this.state
    if (isConcern === '0') {
      return <div className={styles.doctor_attention} onClick={() => {
        API.docConcern({
          docId: doctorDetail[0].docId,
          hisDocId: doctorDetail[0].hisDocId,
          type: 'add'
        }).then((res) => {
          Toast.info('已关注', 1)
          this.setState({
            isConcern: '1'
          })
        })
      }}><em></em>关注</div>
    }
    if (isConcern === '1') {
      return <div className={styles.doctor_attention} onClick={() => {
        API.docConcern({
          docId: doctorDetail[0].docId,
          hisDocId: doctorDetail[0].hisDocId,
          type: 'del'
        }).then((res) => {
          Toast.info('已取消', 1)
          this.setState({
            isConcern: '0'
          })
        })
      }}>已关注</div>
    }
  }

  componentDidMount() {
    documentTitle('医生详情')
    this.init()
  }

  componentWillReceiveProps() {
    window.location.reload()
  }

  render() {
    const { doctorDetail, doctorList, params } = this.state
    let doctorphy = {}
    if (params.itemId) {
      doctorphy = {
        physiotherapy: {
          itemId: params.itemId,
          deptId: params.deptId,
          PhysioMoney: params.PhysioMoney,
          PhysioName: params.PhysioName
        }
      }
    }
    return (
      <React.Fragment>
        {
          doctorDetail.length ? (
            <div>
              <div className={styles.doctor_info}>
                <div className={styles.doctor_box}>
                  <div className={styles.doctor_img}><img src={doctorPhoto(doctorDetail[0].portait, doctorDetail[0].hisDocId)} onError={this.errorImg.bind(this)} alt="" /></div>
                  <div>
                    <div className={styles.doctor_name}>{doctorDetail[0].docName}<span className={styles.doctor_title}>{doctorDetail[0].title}</span></div>
                    <div className={styles.doctor_department}>弘德分馆<span>{doctorDetail[0].deptName}</span></div>
                  </div>
                </div>
                {
                  this.isConcern()
                }
              </div>
              <div className={styles.doctor_goodat}><b>擅长</b><span>{doctorDetail[0].docDesc[0] || '无'}</span></div>
              <div className={styles.acc_box}>
                <Accordion className="doctor_detail_g" defaultActiveKey="0">
                  <Accordion.Panel header={params.PhysioName ? `弘德分馆-${params.PhysioName}` : '弘德分馆'}>
                    {
                      doctorDetail[0].scheduDate.length ? doctorDetail[0].scheduDate.map((el, index) => {
                        return (
                          <Picker
                            data={el.scheduDetail}
                            value={el.sourceValue}
                            cols={1}
                            disabled={el.regLeftNum === 0 ? true : false}
                            key={index}
                            onChange={this.onChangeColor.bind(this, el)}
                          >
                            <span className={`${styles.haoyuan} haoyuan-row`}>
                              <span className={styles.haoyuan_num}><b>{el.name}</b><span>剩余号源{el.regLeftNum}个</span><em className={styles.hao_price}>&yen;{doctorDetail[0].regMoney}</em></span>
                              <div className={styles.haoyuan_btn} style={this.isHasRegFormat(el)}>{el.regLeftNum === 0 ? '约满' : '预约'}</div>
                            </span>
                          </Picker>
                        )
                      }) : <div className={styles.introduction}>无</div>
                    }
                  </Accordion.Panel>
                </Accordion>
                <div className={styles.refresh} onClick={this.refresh.bind(this)}>刷新</div>
              </div>
              <Accordion className="doctor_detail_g" defaultActiveKey="0">
                <Accordion.Panel header="医生简介">
                  <div className={styles.introduction}>{doctorDetail[0].docDesc[1] || '无'}</div>
                </Accordion.Panel>
              </Accordion>
            </div>
          ) : null
        }
        {
          doctorList.length ? (
            <dl className="list-card">
              <dt className="icon">您可能还想了解</dt>
              <dd>
                {
                  doctorList.map((doctor, index) => {
                    return <DoctorItem {...doctor} {...doctorphy} {...this.props} key={index} />
                  })
                }
              </dd>
            </dl>
          ) : null
        }
      </React.Fragment>
    )
  }
}

export default DoctorDetails
