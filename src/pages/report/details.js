import React, { useState, useEffect } from 'react'
import { Toast } from 'antd-mobile'
import { urlParse, documentTitle } from '../../utils/utils'
import API from '../../api/api'
import styles from '../order/order.module.css'

function ReportDetails() {
  const query = JSON.parse(urlParse().item)
  const [params] = useState(query)
  const [list, setList] = useState([])

  const switchHint = function({hint}) {
    if (hint === '↑') {
      return styles.red
    }
    if (hint === '↓') {
      return styles.blue
    }
  }

  useEffect(() => {
    documentTitle('检验详情')
    Toast.loading('加载中..', 0)
    API.getLisDetail({
      lisId: query.lisId
    }).then(res => {
      Toast.hide()
      setList(res)
    })
  }, [])

  return (
    <div className={styles.orderdbox}>
      <dl className={styles.reportTop}>
        <dt>{params.testName}</dt>
        <dd>
          <div className={styles.reportInfo}>
            <div>就诊人：{params.patName}</div>
            <div>时间：{params.testDate}</div>
          </div>
          <div className={styles.reportInfo}>
            <div>送检医生：{params.docName}</div>
            <div>送检医馆：{params.deptName}</div>
          </div>
        </dd>
      </dl>
      <dl className="list-card">
          <dt className="icon">检查项目</dt>
          {
            list.length ? (
              list.map((data, index) => {
                return <dd key={index}>
                  <div className="list-item borderBottom">
                    <div className="list-line large">
                      <div className="list-content just-between">
                        <div className="dt">
                          <div className="list-content-left">
                            <div>{data.itemName}</div>
                            <p className="dec">参考范围：{data.refexp}</p>
                          </div>
                        </div>
                        <div className="list-content-right">
                          <div className={switchHint(data)}>{data.hint} {data.itemValue}</div>
                          <p className="dec">单位：{data.itemUnit}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </dd>
              })
            ) : <div className="no-result">暂无数据</div>
          }
        </dl>
    </div>
  )
}

export default ReportDetails
