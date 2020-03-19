import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import API from '../../api/api'
import { documentTitle, urlParse } from '../../utils/utils'
import envconfig from '../../envconfig/envconfig'
import DoctorItem from '../../components/doctoritem/doctoritem'
import styles from './physiotherapy.module.css'

const PHOTOERROR = require('../../images/phyarow.png')

class PshpDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      params: JSON.parse(urlParse().params),
      doctorList: []
    }
  }

  async init() {
    let { params } = this.state
    Toast.loading('加载中..', 0)
    let getScheduleInfo = await API.getPhysioScheduleInfo({
      hisParentId: 1,
      itemId: params.itemId,
      hisDeptId: params.deptId // 此处要更改
    })
    Toast.hide()
    this.setState({
      doctorList: getScheduleInfo
    })
  }

  photoError(e) {
    e.target.src = PHOTOERROR
  }

  componentDidMount() {
    documentTitle(this.state.params.PhysioName)
    this.init()
  }

  render() {
    const { params, doctorList } = this.state
    let doctorphy = {
      physiotherapy: {
        itemId: params.itemId,
        deptId: params.deptId,
        PhysioMoney: params.PhysioMoney,
        PhysioName: params.PhysioName
      }
    }
    return (
      <React.Fragment>
        <div className={styles.phycart}>
          <div className={styles.phycartimg}>
            <img src={`${envconfig.bannerUrl}/upload/kmzyg/physio/${params.itemId}.jpg`} onError={this.photoError.bind(this)} alt="" />
          </div>
          <div className={styles.phycartprice}>
            <div>{params.PhysioName}</div>
            <div className={styles.phycartpricetext}>&yen;{params.PhysioMoney}</div>
          </div>
        </div>
        {
          doctorList.length ? (
            <dl className="list-card">
              <dt className="icon">相关医师</dt>
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
        <dl className="list-card">
          <dt className="icon">套餐内容</dt>
          <dd className="p">{params.PhysioContent || '无'}</dd>
        </dl>
      </React.Fragment>
    )
  }
}

export default PshpDetails
