import Vue from 'vue'
import Vuex from 'vuex'
import app from './App'
import VueRouter from 'vue-router'
import Resource from 'vue-resource'
import ElementUI from 'element-ui'
import $ from 'n-zepto'
import 'element-ui/lib/theme-default/index.css'
import index from './components/index'
import customNum from './components/customNum'
// ---------------------
import order from './components/order/order'
import orderDetail from './components/order/orderDetail'
import serve from './components/serve'
import buy from './components/order/buy/buy'
import info from './components/order/info/info'
import sAe from './components/order/sAe/sAe'
import search from './components/search'
import numControl from './components/order/buy/numControl'
import register from './components/register'
import registerSucceed from './components/registerSucceed'
import finished from './components/order/buy/finished'
import indent from './components/order/buy/indent'
import pay from './components/order/buy/pay'
import affirm from './components/order/buy/affirm'
import paySucceed from'./components/order/buy/paySucceed'
import navs from './components/order/buy/navs'
import alert from './components/order/buy/alert'
import cartNumCon from './components/order/buy/cartNumCon'
import tips from './components/order/buy/tips'
import storeCard from './components/order/info/storeCard'
import yourInfo from './components/order/info/yourInfo'
import chargeSucceed from './components/order/info/chargeSucceed'

Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.use(Resource)
Vue.use(Vuex)
//注册全局组件
Vue.component('serve',serve)
Vue.component('numControl',numControl)
Vue.component('cartNumCon',cartNumCon)
Vue.component('navs',navs)
Vue.component('alert',alert)
//路由
const router = new VueRouter({
//	mode:'history',
	routes:[
	{path:'/',component:index},
//	{path:'/index',component:index},
	{	
		path:'/order',component:orderDetail,
		children:[
		{path:'/order/buy',component:buy},
		{path:'/order/info',component:info},
		{path:'/order/sAe',component:sAe},
		{path:'/order/search',component:search},
		{path:'/order/customNum',component:customNum}
		]
	},
	{path:'/order/indent',component:indent},
	{path:'/order/affirm',component:affirm},
	{path:'/order/register',component:register},
	{path:'/order/registerSucceed',component:registerSucceed},
	{path:'/order/buy/finished',component:finished},
	{path:'/order/buy/pay',component:pay},
	{path:'/order/buy/tips',component:tips},
	{path:'/order/buy/paySucceed',component:paySucceed},
	{path:'/order/storeCard',component:storeCard},
	{path:'/order/yourInfo',component:yourInfo},
	{path:'/order/chargeSucceed',component:chargeSucceed}
	]
})
//vuex
const store = new Vuex.Store({
  state: {
//取openId返回的url
//	returnUrl:'http://fastfood.jinghanit.com',
	returnUrl:'http://h5test.jinghanit.com:8088/fastfood',
//商品有关的参数
//	orderHttp:'http://192.168.2.135:8080',
//	merchantHttp:'http://192.168.2.167:8080',
//	accountHttp:'http://192.168.2.148:8080',
//	paymentHttp:'http://192.168.2.203:8078',

//.6
//	orderHttp:'http://192.168.2.6:9085',
//	merchantHttp:'http://192.168.2.6:9084',
//	accountHttp:'http://192.168.2.6:9082',
//	paymentHttp:'http://paytest.jinghanit.com:9089',
	
//灰度环境
//	orderHttp:'http://192.168.2.9:9085',
//	merchantHttp:'http://192.168.2.9:9084',
//	accountHttp:'http://192.168.2.9:9081',
//	paymentHttp:'http://paytest.jinghanit.com:9089',
//.11	
	orderHttp:'http://192.168.2.120:3000/order',
	merchantHttp:'http://192.168.2.120:3000/merchant',
	accountHttp:'http://192.168.2.120:3000/user',
	paymentHttp:'http://paytest.jinghanit.com:50089',
	//线上环境
//	orderHttp:'https://order.jinghanit.com',
//	merchantHttp:'https://merchant.jinghanit.com',
//	accountHttp:'https://account.jinghanit.com',
//	paymentHttp:'https://pay.jinghanit.com',
	
	merchantId:117,
//	merchantId:1098,
  	merchantName:'',
  	merchantPicUrl:[],
  	//是否有图片
  	ifHasPic:true,
//用户信息、昵称、头像、userId、手机号
  	nickName:'',
  	headImgUrl:'',
  	userId:'',
  	userGender:0,
//是否为会员判断
	phoneNumber:1,
  	//openId绑定的phone
  	hasPhoneNumber:null,
  	//当前操作用户
  	nowImgUrl:'',
  	nowUserName:'',
  	//用户Id
  	userId:null,
  	//会员的Id
  	memberUserId:null,
  	//会员余额
  	memberBalance:0,
  	//会员生日
  	memberBir:null,
  	//会员名字
  	memberName:null,
  	//会员mberRegion
  	memberRegion:'请选择',
  	//会员address
  	memberAddress:null,
//订单信息
	//订单号
    orderNo:null,
	//下单时间
    orderTime:null,
//下单之前的各个list
	backCartList:[],
    saveCartList:[],
	catesList:[],
	localCart:[],
	boughtList:[],
	//热销list
	hotList:[],
	historyList:[],
	//未付款list暂存,由于直接操作此数据会出现找不到数组中的元素的问题，所以暂时用来存储
	willPayList:[],
	//未付款的列表
	tempWillPayList:[],
	//总的菜单列表信息
    foodsList:[],
	//选中的菜品
    selectFoods:[],
    //菜品种类
    kinds:[],
    cates:[],
    catesList:[],
    originList:[],
    catesNums:[],
     //购物车状态
    commandCode:0,
    //购物车list
    cartList:[],
    //选中菜品种类
    cateName:[],
    //现在正在操作的菜品,nowFood
    nowFood:{showIndex:false,name:null,addIndex:null},
//各种价格、数量
    //总价
    totalPrice:0,
    //需要付的钱
    needPay:0,
    //会员价
    memberPrice:0,
    //总数量
    allCount:0,
    //购物车总价格
    cartPrice:0,
    //购物车会员价
    cartMemberPrice:0,
//各类标记
	//就餐方式
	orderType:null,
	//展示菜品详情页
	showDetailPage:false,
    //支付方式
    payWeChat:false,
    payAliPay:false,
    //支付成功
    paySucceed:false,
    payResult:'支付失败',
    //会员从首页进
    memberIndex:false,
    //会员从buy进
    memberBuy:false,
    //会员从affirm进
    memberAffirm:false,
    //会员从fininshed进
    memberFinish:false,
    //如果是加菜
    addCart:true,
    //如果是减菜标记
    delCart:false,
    //提交订单后返回的list
    orderList:[],
    //订单提交后未按种类合并
    beforeOrderList:[],
    //备注
    tipsName:'',
    tipsId:'',
    tipsInput:'',
    allTipsName:'',
    //进入tips的说明文字
    gotoTipsWords:'口味、偏好等要求 >',
    //生成订单之前需要的
    orderId:0,
    //显示和隐藏购物车
    showShadow:false,
    //当前订单的标号
    whichOrder:0,
    //倒计时
    countTimeList:[],
    //当前点击的订单的信息,orderCode默认为0
    nowOrderInfo:{orderCode:0},
    //按照哪种餐盒费计算方案
    boxWay:{categoryId:0,obligatoryId:0,requireCount:0,cost:0,price:0,showTip:false},
    //初始化的菜品的规格价和做法价
    initSomePrice:{scalePrice:0,cuisinePrice:0},
    //当前支付的取餐号 
    serialNumber:0,
    //当前选中的详情菜品
    nowDetailFood:null,
    nowNum:0,
    //充值
    chargeMoney:0,
    //实际到账
    actualMoney:0,
    //会员充值记录
    memberChargeRecord:null,
    //大图页面进入详情页面的标记
    imgToDetail:false,
    //判断余额不足是否显示
    comparePrice:0,
    //支付状态
    payStatus:false
  },
  mutations: {
  	//清空原来已点数据
  	change(state){
  		//选中的菜清空
  		state.selectFoods = []
  		//加的菜清空
  		for(var i=0;i<state.foodsList.length;i++){
  			for(var j=0;j<state.foodsList[i].length;j++){
  				Vue.set(state.foodsList[i][j] , 'count' , 0)
				Vue.set(state.foodsList[i][j] , 'memoLists' , [])
  			}
  		}
  		//人数和餐具清空
  		state.customNum = 0
  	}
  	//计算菜品种类数量
  }
})

new Vue({ 
	router:router,
	store,
	render: h => h(app)
}).$mount('#app')




