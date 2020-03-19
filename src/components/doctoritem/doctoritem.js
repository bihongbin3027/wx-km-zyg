import React from 'react'
import { doctorPhoto } from '../../utils/utils'
import styles from './doctoritem.module.css'

const DoctorItem = (props) => {
  let { docId, docName, hisDocId, portait, title, deptName, docDesc, isHasReg, regLeftNum, source, physiotherapy } = props
  const isHasRegFormat = function(isHasReg) {
    if (isHasReg === 'N') {
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
  const doctordetails = function() {
    let search = ''
    if (physiotherapy) {
      search = `docId=${docId}&itemId=${physiotherapy.itemId}&deptId=${physiotherapy.deptId}&PhysioName=${physiotherapy.PhysioName}&PhysioMoney=${physiotherapy.PhysioMoney}`
    } else {
      search = `docId=${docId}`
    }
    props.history.push({
      pathname: '/doctordetails',
      search
    })
  }

  return (
    <div className={styles.doctor_item} onClick={doctordetails}>
      <div className={styles.doctor_img}>
        <img src={doctorPhoto(portait, hisDocId)} onError={(event) => {
          event.target.src = doctorPhoto()
        }} alt="" />
      </div>
      <div className={styles.doctor_dec}>
        <div className={styles.doctor_name}>{docName}<span>{title}</span></div>
        <div className={styles.doctor_department}>弘德分馆<em>{deptName}</em></div>
        <div className={styles.doctor_goodat}><div className={styles.doctor_goodat_txt}>擅长：</div><b>{docDesc.split('@@@@')[0] || '无'}</b></div>
      </div>
      {
        (source && regLeftNum < 10) ? <p className={styles.doctor_mark1}>仅剩{regLeftNum}个号源</p> : <p className={styles.doctor_mark} style={isHasRegFormat(isHasReg)}>{isHasReg === 'Y' ? '有号' : '约满'}</p>
      }
    </div>
  )
}

export default DoctorItem
