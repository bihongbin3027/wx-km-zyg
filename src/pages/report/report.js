import React, { useState, useEffect } from 'react'
import { Toast } from 'antd-mobile'
import API from '../../api/api'
import { documentTitle } from '../../utils/utils'
import styles from '../order/order.module.css'

function Report() {
  const [list, setList] = useState([])

  useEffect(() => {
    documentTitle('我的报告')
    Toast.loading('加载中..', 0)
    API.getLisList().then(res => {
      Toast.hide()
      setList(res)
    })
  }, [])

  const loolReport = function(item) {
    window.location.href = `#/reportdetails?item=${JSON.stringify(item)}`
  }

  const userCard = function(item, index) {
    return <div className={styles.orderbox} key={index}>
      <div className={styles.numbering}>
        <div>就诊人：{item.patName}</div>
        <div className={(item.status === 'N') ? '' : styles.orange}>{item.status === 'Y' ? '已出报告' : '未出报告'}</div>
      </div>
      <div className={`${styles.userinfo} ${styles.userflex}`}>
        <div>
          <div>{item.testName}</div>
          <div className={styles.doctortxt}>{item.testDate}</div>
        </div>
        {
          (item.status === 'Y') && <div className={styles.arrowBtn} onClick={loolReport.bind(this, item)}>查看报告</div>
        }
      </div>
      <div className={styles.timeprice}>
        <div className={styles.date}>送检医生：{item.docName}</div>
        <div>送检医馆：{item.deptName}</div>
      </div>
    </div>
  }

  return (
    <div>
      {
        list.length ? (
          <ul className={styles.orderul}>
            {
              list.map((item, index) => {
                return userCard(item, index)
              })
            }
          </ul>
        ) : <div className="no-result">暂无数据</div>
      }
    </div>
  )
}

export default Report
