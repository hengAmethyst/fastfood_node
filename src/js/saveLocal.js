//存储信息到本地
import cookie from './cookie.js'
let save = (that,localName) => {
	let chargeAfter = {
		//个人信息
			//openId
			openId:that.$store.state.openId,
			//昵称
			nickName:that.$store.state.nickName,
			//头像
			headImgUrl:that.$store.state.headImgUrl,
		//店铺信息
			//店铺Id
			merchantId:that.$store.state.merchantId,
			//店铺名字
			merchantName:that.$store.state.merchantName,
		//订单信息
			//支付时候预留的电话
			hasPhoneNumber:that.$store.state.hasPhoneNumber,
			//当前订单的orderNo
			orderNo:that.$store.state.nowOrderInfo.orderCode,
			//获取账单号需要的Id
			orderId:that.$store.state.orderId,
			//取餐号
			serialNumber:that.$store.state.serialNumber
		}
		chargeAfter = JSON.stringify(chargeAfter)
		//保存到本地cookie
		$.fn.cookie(localName,chargeAfter, { expires: 1 })
}
export default save