//未结账订单
//加载基本信息，菜品list等所有需要的基本的信息均使用此函数
import {getCurrentTime} from './getCurrentTime.js'
let orderList = (that) => {
	return new Promise((resolve,reject)=>{
	that.$http.post(that.$store.state.orderHttp+"/searchOrder",
		JSON.stringify({"merchantId":that.$store.state.merchantId,"openId":that.$store.state.openId})
	,{emulateJSON:true})
	.then(function(res){
		console.log(res)
		if(res.body.data.orderList)
		{
			//历史的订单list
			for(let i=0;i<res.body.data.orderList.length;i++){
				let willPay = res.body.data.orderList[i]
				//下单时间
				willPay.orderTime = willPay.createTime
				willPay.createTime = getCurrentTime(willPay.createTime)
				//菜品列表
				willPay.dishesList = willPay.snackOrderDishes
				//总价格
				willPay.totalPrice = (willPay.orderTotalAmount/100).toFixed(2)
				//会员价格
				willPay.memberPrice = (willPay.memberAmount/100).toFixed(2)
				//菜品总数
				willPay.totalCount = 0
				for(let item of willPay.snackOrderDishes){
					willPay.totalCount += item.dishesCount
				}
				//就餐方式
				if(willPay.orderType == 1){
					willPay.orderType  = "堂吃"
				}
				if(willPay.orderType == 2){
					willPay.orderType = "外带"
				}
				//备注信息
				willPay.memo = that.$store.state.tipsInput
				//处理菜品的数据,按种类组合
				//合并相同种类
				let tempCates = []
				for(let j=0;j<that.$store.state.kinds.length;j++){
					tempCates.push([])
				}
				for(let j=0;j<willPay.snackOrderDishes.length;j++){
					for(let k=0;k<that.$store.state.kinds.length;k++){
						if(willPay.snackOrderDishes[j].categoryId == that.$store.state.kinds[k].id){
							
							tempCates[k].push(willPay.snackOrderDishes[j])
						}
					}
				}
				
				willPay.cateList = tempCates
				//菜品种类的名字
				willPay.catesName = []
				for(let j=0;j<willPay.cateList.length;j++){
					if(willPay.cateList[j].length>0){
						willPay.catesName.push(willPay.cateList[j][0].categoryName)
					}
					else{
						willPay.catesName.push(null)
					}
				}
				//菜品种类数量
				let catesNum = []
				for(let j=0;j<willPay.cateList.length;j++){
					catesNum.push(0)
				}
				//每个种类菜品的数量
				for(let j=0;j<willPay.cateList.length;j++){
					for(let k=0;k<willPay.cateList[j].length;k++){
						catesNum[j] += willPay.cateList[j][k].dishesCount
					}
				}
				willPay.catesNum = catesNum
				//如果时间消失或者已被支付
				willPay.timeOut = false
				//时间倒计时
				willPay.time = ''
				let sec = 1800 - parseInt((new Date().getTime() - willPay.orderTime)/1000)
				let secs = ''
				let min = 0
				let timer = setInterval(()=>{
					sec -= 1
				    min = parseInt(sec / 60)
				     secs = sec % 60
				    if(min<10){
				    		min = "0" + min
				    }
				    if(secs<10){
				    		 secs = "0" +  secs
				    }
				    willPay.time = min+':'+ secs
				    if(sec <= 0){
				    		willPay.timeOut = true
				    		clearInterval(timer)
						//如果在规定时间内没有支付,移除改订单
						that.$store.state.willPayList.pop()
				    }
				},1000)
				if(sec>0){
					//添加到数组的第一个
					that.$store.state.willPayList.unshift(willPay)	
				}
			}
		}
		that.$store.state.tempWillPayList.push(...that.$store.state.willPayList)
		resolve()
		})
	})
}
export default orderList