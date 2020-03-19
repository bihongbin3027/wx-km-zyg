import React, { Component } from 'react'
import { List, Toast } from 'antd-mobile'
import API from '../../api/api'
import { documentTitle } from '../../utils/utils'

class DeptList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  init() {
    Toast.loading('加载中..', 0)
    API.getDept().then(res => {
      Toast.hide()
      this.setState({
        list: res
      })
    })
  }

  componentDidMount() {
    documentTitle('科室列表')
    this.init()
  }

  render() {
    const { list } = this.state

    return (
      <div className="date-form style1 text-max" style={{marginTop: 10}}>
        <List>
          {
            list.map((tiem, index) => {
              return <List.Item key={index} arrow="horizontal" onClick={() => {
                window.location.href = `#/department?deptId=${tiem.deptId}&deptName=${tiem.deptName}&hisDeptId=${tiem.hisDeptId}&parentId=${tiem.parentId}`
              }}>{tiem.deptName}</List.Item>
            })
          }
        </List>
      </div>
    )
  }
}

export default DeptList
