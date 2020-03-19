import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import Draggable from 'react-draggable'
import icon from '../../style/icon.module.css'
import './navbar.css'

class NavBar extends Component {
  render() {
    return (
      <Draggable bounds="body">
        <div className="tabbar">
          <NavLink className="tabber-item" exact to="/">
            <i className={icon.home_navber_icon}>首页</i>
          </NavLink>
          <NavLink className="tabber-item" to="/personal">
            <i className={icon.personal_navber_icon}>个人中心</i>
          </NavLink>
          <a className="tabber-item" href="tel:4001009066">
            <i className={icon.phone_navber_icon}>客服电话</i>
          </a>
        </div>
      </Draggable>
    )
  }
}

export default NavBar
