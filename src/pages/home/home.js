import React, { Component } from 'react'
import { Carousel, WingBlank, Toast } from 'antd-mobile'
import base from '../../envconfig/envconfig'
import DoctorItem from '../../components/doctoritem/doctoritem'
import API from '../../api/api'
import { documentTitle, doctorPhoto } from '../../utils/utils'
import icons from '../../style/icon.module.css'
import styles from './home.module.css'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      carouselData: [],
      menuData: [],
      dochistory: [],
      hotdoc: []
    }
  }

  searchPage() {
    this.props.history.push('/search')
  }

  deptIcon({deptName}) {
    let imageUrl = ''
    switch (deptName) {
      case '中医科':
        imageUrl = require('../../images/ks1_icon.png')
        break
      case '传统疗法科':
        imageUrl = require('../../images/ks2_icon.png')
        break
      case '针灸推拿科':
        imageUrl = require('../../images/ks3_icon.png')
        break
      case '中医内科':
        imageUrl = require('../../images/ks4_icon.png')
        break
      case '中医妇科':
        imageUrl = require('../../images/ks5_icon.png')
        break
      case '中医儿科':
        imageUrl = require('../../images/ks6_icon.png')
        break  
      case '中医皮肤科':
        imageUrl = require('../../images/ks7_icon.png')
        break
      case '男科':
        imageUrl = require('../../images/ks8_icon.png')
        break
      case '更多':
        imageUrl = require('../../images/dept_more_icon.png')
        break    
      default:
        imageUrl = require('../../images/normal_dept_icon.png')
        break
    }
    return imageUrl
  }

  errorImg(e) {
    e.target.src = doctorPhoto()
  }

  async init() {
    Toast.loading('加载中..', 0)
    const banner = await API.getBanner()
    let dept = await API.getDept()
    let dochistory = await API.getDocHistory()
    let hotdoc = await API.getHotDoc()
    if (dept.length > 8) {
      dept.splice(7, 0, {
        deptName: '更多'
      })
    }
    dept = dept.filter((item, index) => {
      return index < 8
    })
    hotdoc = hotdoc.filter((doc) => {
      return doc.isHasReg === 'Y'
    })
    this.setState({
      loading: true,
      carouselData: banner,
      menuData: dept,
      dochistory,
      hotdoc
    })
    Toast.hide()
  }

  componentDidMount() {
    documentTitle('预约挂号')
    this.init()
  }

  render() {
    let { loading, carouselData, menuData, dochistory, hotdoc } = this.state

    return (
      <React.Fragment>
        <div className={styles.header}>
          <i className={icons.position_icon}></i>
          <div className={styles.header_city}>深圳</div>
          <div className={styles.input}>
            <i className={icons.search_icon}></i>
            <input type="text" placeholder="搜索医生" onClick={this.searchPage.bind(this)} />
          </div>
          <div className={styles.header_name}>弘德分馆</div>
        </div>
        <div className={styles.wrapper}>
          {
            carouselData.length ? (
              <WingBlank>
                <Carousel
                  autoplay={true}
                  infinite={true}
                  dots={false}
                  beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                  afterChange={index => console.log('slide to', index)}
                >
                  {
                    carouselData.map((val, inx) => (
                      <a
                        key={inx}
                        href={val.bannerUrl}
                        style={{ display: 'inline-block', width: '100%' }}
                      >
                        <img
                          src={base.bannerUrl + val.bannerPic}
                          alt={val.bannerName}
                          style={{ width: '100%', verticalAlign: 'top' }}
                          onLoad={() => {
                            // fire window resize event to change height
                            window.dispatchEvent(new Event('resize'))
                          }}
                        />
                      </a>
                    ))
                  }
                </Carousel>
              </WingBlank>
            ) : null
          }
          {
            loading && <ul className={styles.menu}>
              <li onClick={() => this.props.history.push('/deptlist')}>
                <div className={`${styles.menu_icon} ${styles.main_menu}`}>
                  <img src={require('../../images/gh_icon.png')} alt="" />
                </div>
                <div>预约挂号</div>
              </li>
              <li onClick={() => this.props.history.push('/physiotherapy')}>
                <div className={`${styles.menu_icon} ${styles.main_menu}`}>
                  <img src={require('../../images/ll_icon.png')} alt="" />
                </div>
                <div>预约理疗</div>
              </li>
              <li onClick={() => this.props.history.push('/order')}>
                <div className={`${styles.menu_icon} ${styles.main_menu}`}>
                  <img src={require('../../images/jf_icon.png')} alt="" />
                </div>
                <div>门诊缴费</div>
              </li>
              <li onClick={() => this.props.history.push('/report')}>
                <div className={`${styles.menu_icon} ${styles.main_menu}`}>
                  <img src={require('../../images/repot_icon.png')} alt="" />
                </div>
                <div>我的报告</div>
              </li>
            </ul>
          }
          {
            dochistory.length ? (
              <div className={styles.recording}>
                {
                  dochistory.map((dh, y) => {
                    return (
                      <div className={styles.recording_li} key={y}>
                        <div className={styles.recording_img}><img src={doctorPhoto(dh.portait, dh.hisDocId)} onError={this.errorImg.bind(this)} alt="" /></div>
                        <div>
                          <div className={styles.recording_user}><em>{dh.docName}</em><span>{dh.title}</span></div>
                          <div className={styles.recording_btn} onClick={() => {
                            this.props.history.push({
                              pathname: '/doctordetails',
                              search: `docId=${dh.docId}`
                            })
                          }}>预约复诊</div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            ) : null
          }
          {
            menuData.length > 0 ? (
              <dl className="list-card">
                <dt className="icon">科室推荐</dt>
                <dd>
                  <ul className={styles.menu}>
                    {
                      menuData.map((menu, k) => {
                        return (
                          <li onClick={() => {
                            if (menu.deptName === '更多') {
                              this.props.history.push('/deptlist')
                            } else {
                              window.location.href = `#/department?deptId=${menu.deptId}&deptName=${menu.deptName}&hisDeptId=${menu.hisDeptId}&parentId=${menu.parentId}`
                            }
                          }} key={k}>
                            <div className={styles.menu_icon}><img src={this.deptIcon(menu)} alt="" /></div>
                            <div>{menu.deptName}</div>
                          </li>
                        )
                      })
                    }
                  </ul>
                </dd>
              </dl>
            ) : null
          }
          {
            (hotdoc.length > 0) && <dl className="list-card">
              <dt className="icon">名医推荐</dt>
              <dd>
                {
                  hotdoc.map((doctor, index) => {
                    return <DoctorItem {...doctor} {...this.props} source={true} key={index} />
                  })
                }
              </dd>
            </dl>
          }
        </div>
      </React.Fragment>
    )
  }
}

export default Home
