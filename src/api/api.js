import { Toast } from 'antd-mobile'
import Server from './server'
import { loadFromLocal, formateObjToParamStr } from '../utils/utils'

const psUrl = function(par) {
  const hosCode = 'kmzyg'
  const accessToken = loadFromLocal('h5', 'accessToken')
  const userId = loadFromLocal('h5', 'userId')
  let t = `?hosCode=${hosCode}&userId=${userId}&accessToken=${accessToken}`
  if (par) {
    return `${t}&${formateObjToParamStr(par)}`
  }
  return t
}

class API extends Server {
  /**
   *  用途：获取就诊人列表
   *  @method get
   *  @return {promise}
   */
  async getVisitorList() {
    try {
      let result = await this.axios('get', `/app/user/getVisitorList${psUrl()}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取就诊人列表失败',
          response: result,
          url: '/app/user/getVisitorList'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：更新就诊人
   *  @method post
   *  @return {promise}
   */
  async operateVisitor(params) {

    try {
      let result = await this.axios('post', `/app/user/operateVisitor${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result
      } else {
        let err = {
          tip: '更新就诊人失败',
          response: result,
          url: '/app/user/operateVisitor'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：新增就诊人
   *  @method post
   *  @return {promise}
   */
  async insertVisitor(params) {
    try {
      let result = await this.axios('post', `/app/user/insertVisitor${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result
      } else {
        let err = {
          tip: '新增就诊人失败',
          response: result,
          url: '/app/user/insertVisitor'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取手机验证码
   *  @method post
   *  @return {promise}
   */
  async getSmsCode(params) {
    try {
      let result = await this.axios('post', `/app/sys/getSmsCode${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result
      } else {
        let err = {
          tip: '获取手机验证码失败',
          response: result,
          url: '/app/sys/getSmsCode'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：搜索医生
   *  @method get
   *  @return {promise}
   */
  async getScheduleInfo(params) {
    try {
      let result = await this.axios('get', `/app/register/getScheduleInfo${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取医生信息失败',
          response: result,
          url: '/app/register/getScheduleInfo'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取普通医生详情
   *  @method get
   *  @return {promise}
   */
  async getScheduleDetail(params) {
    try {
      let result = await this.axios('get', `app/register/getScheduleDetail${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取医生详情失败',
          response: result,
          url: 'app/register/getScheduleDetail'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

    /**
   *  用途：获取预约理疗医生详情
   *  @method get
   *  @return {promise}
   */
  async getPhysioScheduleDetail(params) {
    try {
      let result = await this.axios('get', `app/register/getPhysioScheduleDetail${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取医生详情失败',
          response: result,
          url: 'app/register/getPhysioScheduleDetail'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：确认预约
   *  @method post
   *  @return {promise}
   */
  async pushRegister(params) {
    try {
      let result = await this.axios('post', `app/register/pushRegister${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '确认预约失败',
          response: result,
          url: 'app/register/pushRegister'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：取消预约挂号
   *  @method post
   *  @return {promise}
   */
  async cancalRegister(params) {
    try {
      let result = await this.axios('post', `app/register/cancalRegister${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '取消预约挂号失败',
          response: result,
          url: 'app/register/cancalRegister'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取预约记录
   *  @method get
   *  @return {promise}
   */
  async getPayRegInfo(params) {
    try {
      let result = await this.axios('get', `app/register/getPayRegInfo${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取预约记录失败',
          response: result,
          url: 'app/register/getPayRegInfo'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取首页banner
   *  @method get
   *  @return {promise}
   */
  async getBanner(params) {
    try {
      let result = await this.axios('get', `app/hosbase/getBanner${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取首页轮播图失败',
          response: result,
          url: 'app/hosbase/getBanner'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取首页科室
   *  @method get
   *  @return {promise}
   */
  async getDept(params) {
    try {
      let result = await this.axios('get', `app/hosbase/getDept${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取首页科室失败',
          response: result,
          url: 'app/hosbase/getDept'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取历史预约记录
   *  @method get
   *  @return {promise}
   */
  async getDocHistory(params) {
    try {
      let result = await this.axios('get', `app/hosbase/getDocHistory${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取历史预约记录失败',
          response: result,
          url: 'app/hosbase/getDocHistory'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取名医
   *  @method get
   *  @return {promise}
   */
  async getHotDoc(params) {
    try {
      let result = await this.axios('get', `app/hosbase/getHotDoc${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取获取名医失败',
          response: result,
          url: 'app/hosbase/getHotDoc'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取订单微信支付预支付信息
   *  @method post
   *  @return {promise}
   */
  async getWxPrepayInfo(params) {
    try {
      let result = await this.axios('post', `app/sys/getWxPrepayInfo${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取订单微信支付预支付信息失败',
          response: result,
          url: 'app/sys/getWxPrepayInfo'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：我的预约退费
   *  @method post
   *  @return {promise}
   */
  async cancelRegist(params) {
    try {
      let result = await this.axios('post', `app/register/cancelRegist${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result
      } else {
        let err = {
          tip: '我的预约退费失败',
          response: result,
          url: 'app/register/cancelRegist'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：绑定会员卡
   *  @method get
   *  @return {promise}
   */
  async bindVIP(params) {
    try {
      let result = await this.axios('get', `app/VIP/bindVIP${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result
      } else {
        let err = {
          tip: '绑定会员卡失败',
          response: result,
          url: 'app/VIP/bindVIP'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取会员卡信息
   *  @method get
   *  @return {promise}
   */
  async getVIPInfo(params) {
    try {
      let result = await this.axios('get', `app/VIP/getVIPInfo${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result
      } else {
        let err = {
          tip: '获取会员卡信息失败',
          response: result,
          url: 'app/VIP/getVIPInfo'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取会员卡充值优惠信息
   *  @method get
   *  @return {promise}
   */
  async VIPReChargeDiscount(params) {
    try {
      let result = await this.axios('get', `app/VIP/VIPReChargeDiscount${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取会员卡充值优惠信息失败',
          response: result,
          url: 'app/VIP/VIPReChargeDiscount'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：生成会员卡充值订单
   *  @method post
   *  @return {promise}
   */
  async getVIPOrder(params) {
    try {
      let result = await this.axios('post', `app/VIP/getVIPOrder${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '生成会员卡充值订单失败',
          response: result,
          url: 'app/VIP/getVIPOrder'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取会员卡消费折扣
   *  @method get
   *  @return {promise}
   */
  async getVIPDiscount(params) {
    try {
      let result = await this.axios('get', `app/VIP/getVIPDiscount${psUrl(params)}`)
      if (result) {
        return result.resultData
      } else {
        let err = {
          tip: '获取会员卡消费折扣失败',
          response: result,
          url: 'app/VIP/getVIPDiscount'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：会员卡支付
   *  @method get
   *  @return {promise}
   */
  async VIPPay(params) {
    try {
      let result = await this.axios('get', `app/VIP/VIPPay${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result
      } else {
        let err = {
          tip: '会员卡支付失败',
          response: result,
          url: 'app/VIP/VIPPay'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：会员卡支付验证
   *  @method get
   *  @return {promise}
   */
  async VIPVereify(params) {
    try {
      let result = await this.axios('post', `app/VIP/VIPVerify${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result
      } else {
        let err = {
          tip: '会员卡支付验证失败',
          response: result,
          url: 'app/VIP/VIPVereify'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：验证医生是否关注了
   *  @method get
   *  @return {promise}
   */
  async getUserDocConcern(params) {
    try {
      let result = await this.axios('get', `app/user/getUserDocConcern${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '验证医生是否关注失败',
          response: result,
          url: 'app/user/getUserDocConcern'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：关注(取消)医生
   *  @method get
   *  @return {promise}
   */
  async docConcern(params) {
    try {
      let result = await this.axios('get', `app/user/docConcern${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '关注(取消)医生失败',
          response: result,
          url: 'app/user/docConcern'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取关注医生列表
   *  @method get
   *  @return {promise}
   */
  async getDocConcernList(params) {
    try {
      let result = await this.axios('get', `app/user/getDocConcernList${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取关注医生列表失败',
          response: result,
          url: 'app/user/getDocConcernList'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：支付金额为0支付
   *  @method get
   *  @return {promise}
   */
  async zeroPay(params) {
    try {
      let result = await this.axios('get', `app/sys/zeroPay${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '支付金额为0支付失败',
          response: result,
          url: 'app/sys/zeroPay'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取会员卡积分、金额记录
   *  @method get
   *  @return {promise}
   */
  async getVIPRecord(params) {
    try {
      let result = await this.axios('get', `app/VIP/getVIPRecord${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取会员卡积分、金额记录失败',
          response: result,
          url: 'app/VIP/getVIPRecord'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取预约理疗套餐
   *  @method get
   *  @return {promise}
   */
  async getPhysioList(params) {
    try {
      let result = await this.axios('get', `app/register/getPhysioList${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取预约理疗套餐失败',
          response: result,
          url: 'app/register/getPhysioList'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：查询理疗项目医生排班
   *  @method get
   *  @return {promise}
   */
  async getPhysioScheduleInfo(params) {
    try {
      let result = await this.axios('get', `app/register/getPhysioScheduleInfo${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '查询理疗项目医生排班失败',
          response: result,
          url: 'app/register/getPhysioScheduleInfo'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取处方单列表
   *  @method get
   *  @return {promise}
   */
  async getVIPRecipeList(params) {
    try {
      let result = await this.axios('get', `app/VIP/getVIPRecipeList${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取处方单列表失败',
          response: result,
          url: 'app/VIP/getVIPRecipeList'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：获取处方单详情
   *  @method post
   *  @return {promise}
   */
  async getVIPRecipe(params) {
    try {
      let result = await this.axios('post', `app/VIP/getVIPRecipe${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取处方单详情失败',
          response: result,
          url: 'app/VIP/getVIPRecipe'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：生成账单订单
   *  @method get
   *  @return {promise}
   */
  async orderBill(params) {
    try {
      let result = await this.axios('get', `app/user/orderBill${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '生成账单订单失败',
          response: result,
          url: 'app/user/orderBill'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：我的报告-检验
   *  @method get
   *  @return {promise}
   */
  async getLisList(params) {
    try {
      let result = await this.axios('get', `app/user/getLisList${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取我的报告-检验失败',
          response: result,
          url: 'app/user/getLisList'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

  /**
   *  用途：我的报告-检验详情
   *  @method get
   *  @return {promise}
   */
  async getLisDetail(params) {
    try {
      let result = await this.axios('get', `app/user/getLisDetail${psUrl(params)}`)
      if (result && result.resultCode === '1') {
        return result.resultData
      } else {
        let err = {
          tip: '获取我的报告-检验详情失败',
          response: result,
          url: 'app/user/getLisDetail'
        }
        if (result === undefined) {
          Toast.info(err.tip, 1)
        }
        throw err
      }
    } catch (err) {
      throw err
    }
  }

}

export default new API()
