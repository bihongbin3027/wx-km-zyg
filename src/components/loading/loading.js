import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './loading.module.css'

export default class Loading extends Component {
  static propTypes = {
    loading: PropTypes.string.isRequired,
    loadingText: PropTypes.string
  }

  static defaultProps = {
    loading: false,
    loadingText: '暂无数据'
  }

  loadingHtml() {
    let { loading } = this.props
    if (loading === 'ready') {
      return (
        <div className={styles.loaderbox}>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      )
    }
    if (loading === 'none') {
      return <div>{this.props.loadingText}</div>
    }
    if (loading === 'ok') {
      return null
    }
  }

  render() {
    const { loading } = this.props
    let bool = loading === 'ready' || loading === 'none'

    return bool ? (
      <div className={styles.loaderinner}>
        {
          this.loadingHtml()
        }
      </div>
    ) : null
  }
}
