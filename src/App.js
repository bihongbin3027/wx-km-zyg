import {
  HashRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import React, { Component } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

// 首页
import Home from './pages/home/home'
// 启动跳转页
import Startup from './pages/startup/startup'
// 菜单
import NavBar from './pages/navbar/navbar'
// 搜索页
import Search from './pages/search/search'
// 就诊人列表
import VstpersonList from './pages/vstperson/list'
// 就诊人编辑&新增
import VstpersonEdit from './pages/vstperson/edit'
// 科室医生
import Department from './pages/department/department'
// 科室列表
import DeptList from './pages/department/list'
// 医生详情
import DoctorDetails from './pages/doctordetails/doctordetails'
// 确认预约
import ConfirmReservation from './pages/reservation/confirm'
// 我的预约
import Reserve from './pages/reservation/reserve'
// 预约详情
import ReserveDetails from './pages/reservation/reservedetails'
// 订单支付
import Pay from './pages/pay/pay'
// 个人中心
import Personal from './pages/personal/personal'
// 会员卡
import Member from './pages/member/member'
// 绑定会员卡
import AddMember from './pages/member/add'
// 会员卡充值
import ChargeMember from './pages/member/charge'
// 预约理疗
import Physiotherapy from './pages/physiotherapy/physiotherapy'
// 预约理疗详情
import PshpDetails from './pages/physiotherapy/details'
// 我的积分
import Integral from './pages/intalbalance/integral'
// 我的余额
import Balance from './pages/intalbalance/balance'
// 我的关注医生
import Attention from './pages/attention/attention'
// 门诊缴费
import Order from './pages/order/order'
// 订单详情
import OrderDetails from './pages/order/details'
// 我的报告-检验
import Report from './pages/report/report'
// 我的报告-检验详情
import ReportDetails from './pages/report/details'

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Fragment>
          <Route
            render={({ location }) => (
              <TransitionGroup>
                <CSSTransition
                  // location.key无作用，如果要打开路由动画，改为location.pathname
                  key={location.key}
                  classNames="fade"
                  timeout={300}
                >
                  <div className="router-transition">
                    <Switch location={location}>
                      <Route exact path="/" component={Home} />
                      <Route path="/page" component={Startup} />
                      <Route path="/search" component={Search} />
                      <Route path="/vstpersonlist" component={VstpersonList} />
                      <Route path="/vstpersonedit" component={VstpersonEdit} />
                      <Route path="/department" component={Department} />
                      <Route path="/deptlist" component={DeptList} />
                      <Route path="/doctordetails" component={DoctorDetails} />
                      <Route path="/confirmreservation" component={ConfirmReservation} />
                      <Route path="/reserve" component={Reserve} />
                      <Route path="/reservedetails" component={ReserveDetails} />
                      <Route path="/pay" component={Pay} />
                      <Route path="/personal" component={Personal} />
                      <Route path="/member" component={Member} />
                      <Route path="/addmember" component={AddMember} />
                      <Route path="/chargemember" component={ChargeMember} />
                      <Route path="/physiotherapy" component={Physiotherapy} />
                      <Route path="/pshpdetails" component={PshpDetails} />
                      <Route path="/integral" component={Integral} />
                      <Route path="/balance" component={Balance} />
                      <Route path="/attention" component={Attention} />
                      <Route path="/order" component={Order} />
                      <Route path="/orderdetail" component={OrderDetails} />
                      <Route path="/report" component={Report} />
                      <Route path="/reportdetails" component={ReportDetails} />
                      <Redirect to="/" />
                    </Switch>
                  </div>  
                </CSSTransition>
              </TransitionGroup>
            )}
          />
          <NavBar />
        </React.Fragment>
      </HashRouter>
    )
  }
}

export default App
