import React, { Component } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PropTypes from 'prop-types'

export default class Modal extends Component {
  static propTypes = {
    leftBtn: PropTypes.string,
    rightBtn: PropTypes.string,
    onLeftClick: PropTypes.func,
    onRightClick: PropTypes.func,
  }

  static defaultProps = {
    leftBtn: '取消',
    rightBtn: '确认'
  }

  constructor(props) {
    super(props)
    this.state = {
      status: false
    }
  }

  showModal(fn) {
    const body = document.getElementsByTagName('body')[0]
    body.style.overflowY = 'hidden'
    this.setState({
      status: true
    }, () => {
      if (fn) {
        fn()
      }
    })
  }

  hideModal(fn) {
    const body = document.getElementsByTagName('body')[0]
    body.removeAttribute('style')
    this.setState({
      status: false
    })
    if (fn) {
      fn()
    }
  }

  cancel() {
    this.hideModal(this.props.onLeftClick)
  }

  render() {
    let modal = null
    let { children, leftBtn, rightBtn, onRightClick } = this.props
    if (this.state.status) {
      modal = (
        <div className="confirm-modal-container">
          <div className="modal">
            <div className="modal-content">
              {children}
            </div>
            <div className="modal-footer">
              {leftBtn ? <span className="mf-btn modal-btn" onClick={this.cancel.bind(this)}>{leftBtn}</span> : null}
              {rightBtn ? <span className="mf-btn modal-button-primary" onClick={onRightClick}>{rightBtn}</span> : null}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="modal-view">
        <ReactCSSTransitionGroup
          transitionName="modal-transition"
          transitionEnterTimeout={200}
          transitionLeaveTimeout={200}
        >
          {modal}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}
