import React, { Component } from 'react'
import { Toast } from 'antd-mobile'
import { documentTitle } from '../../utils/utils'
import DoctorItem from '../../components/doctoritem/doctoritem'
import API from '../../api/api'

export class attention extends Component {
  constructor(props) {
    super(props)
    this.state = {
      docTorData: []
    }
  }

  async init() {
    Toast.loading('加载中..', 0)
    let docTorData = await API.getDocConcernList()
    Toast.hide()
    this.setState({docTorData})
  }

  componentDidMount() {
    documentTitle('我的医生')
    this.init()
  }

  render() {
    const { docTorData } = this.state

    return (
      docTorData.length ? (
        docTorData.map((doctor, index) => {
          return <DoctorItem {...doctor} {...this.props} key={index} />
        })
      ) : <div className="no-result">没有关注医生</div>
    )
  }
}

export default attention
