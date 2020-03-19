import React, { Component } from 'react'
import { urlParse, saveToLocal } from '../../utils/utils'

class Startup extends Component {
  componentDidMount() {
    let { action, userInfo } = urlParse()
    if (userInfo) {
      const params = JSON.parse(userInfo)
      const { openId, accessToken, userId, portait, userName } = params
      saveToLocal('h5', 'openId', openId)
      saveToLocal('h5', 'accessToken', accessToken)
      saveToLocal('h5', 'userId', userId)
      saveToLocal('h5', 'portait', portait)
      saveToLocal('h5', 'userName', userName)
      this.props.history.push(`/${action}`)
    }
  }

  render() {
    return <div></div>
  }
}

export default Startup
