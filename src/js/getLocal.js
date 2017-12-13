//为防止支付宝跳转数据消失,获取本地的数据
import cookie from './cookie.js'
export default (that,localName) => {
	let temp = JSON.parse($.fn.cookie(localName))
	//分发数据
	//个人信息
	that.$store.state.openId = temp.openId
	that.$store.state.nickName = temp.nickName
	that.$store.state.headImgUrl = temp.headImgUrl
	//店铺信息
	that.$store.state.merchantId = temp.merchantId
	that.$store.state.merchantName = temp.merchantName
	//当前订单信息
	that.$store.state.orderNo = temp.orderNo
	that.$store.state.orderId = temp.orderId
	that.$store.state.hasPhoneNumber = temp.hasPhoneNumber
	that.$store.state.serialNumber = temp.serialNumber
}