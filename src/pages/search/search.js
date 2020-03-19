import React, { Component } from 'react'
import { Modal, Toast } from 'antd-mobile'
import API from '../../api/api'
import {
  documentTitle,
  searchData,
  saveToLocal,
  loadFromLocal
} from '../../utils/utils'
import DoctorItem from '../../components/doctoritem/doctoritem'
import styles from './search.module.css'
import icons from '../../style/icon.module.css'

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startNormalStatus: false,
      searchValue: '',
      searchList: loadFromLocal('h5', 'searchList') || [],
      doctorList: [],
      deleteBool: false
    }
  }

  deleteText() {
    this.setState({ 
      searchValue: '', 
      deleteBool: false ,
      startNormalStatus: false,
      doctorList: []
    })
    this.inputRef.focus()
  }

  searchChange(e) {
    let deleteBool = false
    let val = e.target.value
    if (val) {
      deleteBool = true
      this.toSearch()
    } else {
      deleteBool = false
      this.setState({
        startNormalStatus: false,
        doctorList: []
      })
    }
    this.setState({ 
      searchValue: val,
      deleteBool
    })
  }

  upSearch(e) {
    if (e.keyCode === 13) {
      this.toSearch()
    }
  }

  toSearch(text) {
    let value = text || this.inputRef.value
    if (value) {
      searchData(value)
    }
    Toast.loading('加载中..', 0)
    API.getScheduleInfo({
      docName: value
    }).then(res => {
      Toast.hide()
      this.setState({
        doctorList: res,
        startNormalStatus: true
      })
    })
  }

  deleteListItem() {
    Modal.alert('提示', '您确定要删除吗？', [{
      text: '取消',
    }, {
      text: '确定',
      onPress: () => {
        let { searchList } = this.state
        searchList = []
        saveToLocal('h5', 'searchList', [])
        this.setState({
          searchList
        })
      }
    }])
  }

  componentDidMount() {
    documentTitle('医生搜索')
    this.inputRef.focus()
  }

  render() {
    let { searchValue, searchList, doctorList, deleteBool, startNormalStatus } = this.state

    return (
      <React.Fragment>
        <div className={styles.box}>
          <i className={icons.search_icon}></i>
          <input
            ref={(input) => { this.inputRef = input }}
            type="text"
            value={searchValue}
            onChange={this.searchChange.bind(this)}
            onKeyUp={this.upSearch.bind(this)}
            placeholder="搜索医生"
          />
          {
            deleteBool && <span className={styles.input_delete} onClick={this.deleteText.bind(this)}>x</span>
          }
        </div>
        <div className={styles.main}>
          {
            !deleteBool && searchList.length > 0 ? (
              <div className={styles.search_list}>
                <div className={styles.search_list_head}>
                  <div>历史搜索</div>
                  <div onClick={this.deleteListItem.bind(this)}><i className={icons.delete_icon}></i></div>
                </div>
                <ul className={styles.search_list_ul}>
                  {
                    searchList.map((searchItem, index) => {
                      return <li className={styles.search_list_item} onClick={() => {
                        this.setState({
                          deleteBool: true,
                          searchValue: searchItem
                        })
                        this.toSearch(searchItem)
                      }} key={index}>{searchItem}</li>
                    })
                  }
                </ul>
              </div>
            ) : null
          }
          <div className={styles.doctor_wrap}>
            {
              doctorList.map((doctor, index) => {
                return <DoctorItem {...doctor} {...this.props} key={index} />
              })
            }
          </div>
          {
            (doctorList.length === 0 && startNormalStatus) && (
              <div className={styles.search_result_none}>
                <div className={styles.search_txt1}>没有相关搜索结果</div>
                <div className={styles.search_txt2}>换个关键词试试吧</div>
              </div>
            )
          }
        </div>  
      </React.Fragment>
    )
  }
}

export default Search
