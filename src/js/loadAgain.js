//加载基本信息，菜品list等所有需要的基本的信息均使用此函数
import {getCurrentTime,getCurrentDay} from './getCurrentTime.js'
import orderList from './orderList.js'
let loadAgain = (that,tempVue) => {
	//必选项查询
	that.$http.post(that.$store.state.merchantHttp+"/merchantMustChoose",
	JSON.stringify({"merchantId":that.$store.state.merchantId})
	,{emulateJSON:true})
	.then(function(res){
		console.log(res)
		if(res.body.data){
			if(res.body.data.categoryId ==3){
				//categoryId
				that.$store.state.boxWay.categoryId = 3
				//计算时单价
				that.$store.state.boxWay.price = (res.body.data.cost/100).toFixed(2)
				//传给后台单价
				that.$store.state.boxWay.cost = res.body.data.cost
				//是否展示必选项
				that.$store.state.boxWay.showTip = false
			}
			if(res.body.data.categoryId == 4){
				//categoryId
				that.$store.state.boxWay.categoryId = 4
				//计算时单价
				that.$store.state.boxWay.price = (res.body.data.cost/100).toFixed(2)
				//传给后台单价
				that.$store.state.boxWay.cost = res.body.data.cost
				that.$store.state.boxWay.showTip = false
			}
		}
	})
	
	//根据openId获取手机号，判断是否为会员
	that.$http.post(that.$store.state.accountHttp+'/queryById',
		JSON.stringify({"openId":that.$store.state.openId,
						"merchantId":that.$store.state.merchantId})
	,{emulateJSON:true})
	.then(
		function(res){
			console.log(res)
			if(res.body.data.phone == 0){
					that.$store.state.phoneNumber = null
			}
			else{
				//会员电话
				that.$store.state.phoneNumber = res.body.data.phone
//				if(typeof(res.body.data.member.balance)=='undefined' | typeof(res.body.data.member.balance)==null){
//					that.$store.state.memberBalance = 0
//				}
//				else{
//					//会员余额
//					that.$store.state.memberBalance = res.body.data.member.balance/100
//				}
//				//用户性别
//				that.$store.state.userGender = res.body.data.member.sex
//				//会员生日
//				that.$store.state.memberBir = res.body.data.member.birthday
//				//会员名字
//				that.$store.state.memberName = res.body.data.member.name
//				//会员region
//				if(res.body.data.member.region){
//					that.$store.state.memberRegion = res.body.data.member.region
//				}
//				//会员memberAddress
//				that.$store.state.memberAddress = res.body.data.member.address
//				//查询充值和消费记录
//				that.$http.post(that.$store.state.accountHttp+"/jinghan-account/api/user/queryMemberRecharge",
//				JSON.stringify({"param":{"userId":that.$store.state.memberUserId,"merchantId":that.$store.state.merchantId}})
//				,{emulateJSON:true})
//				.then(function(res){
//					console.log(res)
//					if(res.body.data){
//						that.$store.state.memberChargeRecord = res.body.data.memberRechargeList
//						//时间转换
//						for(let i=0;i<that.$store.state.memberChargeRecord.length;i++){
//							//type=0消费，type!=0 充值
//							if(that.$store.state.memberChargeRecord[i].type==0){
//								that.$store.state.memberChargeRecord[i].rechargeMoney = '-' + (that.$store.state.memberChargeRecord[i].rechargeMoney/100)
//								that.$store.state.memberChargeRecord[i].class = 'del' 
//							}
//							else{
//								that.$store.state.memberChargeRecord[i].rechargeMoney = '+' + (that.$store.state.memberChargeRecord[i].rechargeMoney/100)
//								that.$store.state.memberChargeRecord[i].class = 'add'
//							}
//							//如果createTime存在
//							if(that.$store.state.memberChargeRecord[i].createTime){
//								that.$store.state.memberChargeRecord[i].createTime = getCurrentTime(that.$store.state.memberChargeRecord[i].createTime)
//							}
//							else{
//								that.$store.state.memberChargeRecord[i].createTime = 0
//							}
//						}
//					}
//				})
			}
		})
	//查询这个openId是否有绑定的电话
//	that.$http.post(that.$store.state.accountHttp+"/jinghan-account/api/user/insertUserByOpenId",
//	JSON.stringify({"param":{"openId":that.$store.state.openId,"kind":1}})
//	,{emulateJSON:true})
//	.then(function(res){
//		console.log(res)
//		if(res.body.data.phone){
//			that.$store.state.hasPhoneNumber = res.body.data.phone
//			if(res.body.data.phone==0){
//				that.$store.state.hasPhoneNumber = null
//			}
//		}
//	})
	
	
	//买过的菜,用于indent订单,已结账
//	that.$http.post(that.$store.state.orderHttp+"/jinghan-order/api/snack/v2/order/searchOrder",
//		JSON.stringify({"param":{"merchantId":that.$store.state.merchantId,"openId":that.$store.state.openId,"orderStatus":2,"queryDetail":1,"page":{"currentPage":1,"pageSize":5}},"channel":1})
//	,{emulateJSON:true})
//	.then(function(res){
//		console.log(res)
//		//历史的订单list
//		that.$store.state.historyList = res.body.data.orderList
//		for(let i=0;i<that.$store.state.historyList.length;i++){
//			//计算该订单的总数量
//			that.$store.state.historyList[i].orderCount = 0
//			//订单的时间
//			that.$store.state.historyList[i].orderTime = getCurrentTime(that.$store.state.historyList[i].createTime)
//			for(let j=0;j<that.$store.state.historyList[i].snackOrderDishes.length;j++){
//				//每个菜的价格/100
//				that.$store.state.historyList[i].snackOrderDishes[j].dishesPrice = (that.$store.state.historyList[i].snackOrderDishes[j].dishesPrice/100).toFixed(2)
//				that.$store.state.historyList[i].snackOrderDishes[j].memberPrice = (that.$store.state.historyList[i].snackOrderDishes[j].memberPrice/100).toFixed(2)
//				//做法价格/100
//				that.$store.state.historyList[i].snackOrderDishes[j].cuisinePrice = (that.$store.state.historyList[i].snackOrderDishes[j].cuisinePrice/100).toFixed(2)
//				//每个订单每个菜品的小菜价格
//				if(that.$store.state.historyList[i].snackOrderDishes[j].sideDishes){
//					let sideDishesPrice = 0 
//					let sideMemberPrice = 0
//					for(let k=0;k<that.$store.state.historyList[i].snackOrderDishes[j].sideDishes.length;k++){
//						sideDishesPrice += that.$store.state.historyList[i].snackOrderDishes[j].sideDishes[k].dishesPrice + that.$store.state.historyList[i].snackOrderDishes[j].sideDishes[k].cuisinePrice
//						sideMemberPrice += that.$store.state.historyList[i].snackOrderDishes[j].sideDishes[k].memberPrice + that.$store.state.historyList[i].snackOrderDishes[j].sideDishes[k].cuisinePrice
//					}
//					that.$store.state.historyList[i].snackOrderDishes[j].sideDishesPrice = (sideDishesPrice/100).toFixed(2)
//					that.$store.state.historyList[i].snackOrderDishes[j].sideMemberPrice = (sideMemberPrice/100).toFixed(2)
//				}
//				else{
//					that.$store.state.historyList[i].snackOrderDishes[j].sideDishesPrice = 0
//					that.$store.state.historyList[i].snackOrderDishes[j].sideMemberPrice = 0
//				}
//				that.$store.state.historyList[i].orderCount += that.$store.state.historyList[i].snackOrderDishes[j].dishesCount
//			}
//		}
//	})
				
	//买过的菜,用点过的菜一栏
//	that.$http.post(that.$store.state.orderHttp+"/jinghan-order/api/snack/v2/order/searchOrder",
//		JSON.stringify({"param":{"merchantId":that.$store.state.merchantId,"openId":that.$store.state.openId,"queryDetail":2,"page":{"currentPage":1,"pageSize":5}},"channel":1})
//	,{emulateJSON:true})
//	.then(function(res){
//		console.log(res)
//		//用于买过栏的加减菜，处理相关的数据
//		for(let i=0;i<res.body.data.orderList.length;i++){
//			for(let j=0;j<res.body.data.orderList[i].snackOrderDishes.length;j++){
//				//数量置为1
//				res.body.data.orderList[i].snackOrderDishes[j].dishesCount = 1
//				//价格除于100
//				res.body.data.orderList[i].snackOrderDishes[j].dishesPrice = (res.body.data.orderList[i].snackOrderDishes[j].dishesPrice/100).toFixed(2)
//				res.body.data.orderList[i].snackOrderDishes[j].memberPrice = (res.body.data.orderList[i].snackOrderDishes[j].memberPrice/100).toFixed(2)
//				res.body.data.orderList[i].snackOrderDishes[j].cuisinePrice = (res.body.data.orderList[i].snackOrderDishes[j].cuisinePrice/100).toFixed(2)
//				var tempSideName = ''
//				var sideDishesPrice = 0
//				var sideMemberPrice = 0
//				//如果有配菜
//				if(res.body.data.orderList[i].snackOrderDishes[j].sideDishes){
//					var tempSideName = ''
//					var sideDishesPrice = 0 
//					var sideMemberPrice = 0
//					//配菜名字·价格
//					for(let k=0;k<res.body.data.orderList[i].snackOrderDishes[j].sideDishes.length;k++){
//						tempSideName += res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].dishesName+' '
//						sideDishesPrice += Number((res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].dishesPrice + res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].cuisinePrice)/100)
//							sideMemberPrice += Number((res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].memberPrice + res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].cuisinePrice)/100)
//							res.body.data.orderList[i].snackOrderDishes[j].sideDishes[k].dishesCount = 1
//					}
//				}
//				let tempData = res.body.data.orderList[i].snackOrderDishes[j]
//				//foodTip按照顺序排列   做法，配菜，规格
//				res.body.data.orderList[i].snackOrderDishes[j].foodTip = tempData.cuisineName+' '+tempSideName+tempData.unitName
//				res.body.data.orderList[i].snackOrderDishes[j].sideDishesPrice = sideDishesPrice
//				res.body.data.orderList[i].snackOrderDishes[j].sideMemberPrice = sideMemberPrice
//				//该菜品的全部总价
//				res.body.data.orderList[i].snackOrderDishes[j].oneAllPrice = (Number(sideDishesPrice) + Number(res.body.data.orderList[i].snackOrderDishes[j].cuisinePrice) + Number(res.body.data.orderList[i].snackOrderDishes[j].dishesPrice)).toFixed(2)
//				//该菜品的会员总价
//				res.body.data.orderList[i].snackOrderDishes[j].oneAllMemberPrice = (Number(sideMemberPrice) + Number(res.body.data.orderList[i].snackOrderDishes[j].cuisinePrice) + Number(res.body.data.orderList[i].snackOrderDishes[j].memberPrice)).toFixed(2)
//				
//				that.$store.state.boughtList.push(res.body.data.orderList[i].snackOrderDishes[j])
//			}
//		}
//		//去重
//		let newArry = []
//		for(let i=0;i<that.$store.state.boughtList.length;i++){
//			if(newArry.length>0){
//				for(let j=0;j<newArry.length;j++){
//					if(that.$store.state.boughtList[i].foodTip == newArry[j].foodTip){
//						break;
//					}
//					else{
//						newArry.push(that.$store.state.boughtList[i])
//					}
//				}
//			}
//			else{
//				newArry.push(that.$store.state.boughtList[i])
//			}
//		}
//		that.$store.state.boughtList = newArry
//	})
				
	//菜品list信息
	var cateList = () => {
			//获取菜品的种类信息
			var p = new Promise( (resolve,reject) => {
				that.$http.post(that.$store.state.merchantHttp+"/dishesCates",
				JSON.stringify({"merchantId":that.$store.state.merchantId})
			,{emulateJSON:true})
			.then(function(res){
					console.log(res)
					that.kind = res.body.data
					that.$store.state.kinds = res.body.data
					resolve()
				})
			})
			return p
		}
	var dishesList = () => {
		//获取菜品list信息
		var p = new Promise( (resolve,reject) => {
			that.$http.post(that.$store.state.merchantHttp+"/dishesList",
			JSON.stringify({"merchantId":that.$store.state.merchantId})
			,{emulateJSON:true})
			.then(function(res){
				console.log(res)
				//初始菜品list
				that.$store.state.originList = res.body.data
				//给菜品添加默认属性
				for(let i=0;i<that.$store.state.originList.length;i++){
					//价格
					that.$store.state.originList[i].price = that.$store.state.originList[i].dishesPrice
					//名字
					that.$store.state.originList[i].name = that.$store.state.originList[i].dishesName
					//英文搜索简写
					if(that.$store.state.originList[i].shortcutCode){
						that.$store.state.originList[i].shortcutCode = that.$store.state.originList[i].shortcutCode.toLowerCase()
					}
					//菜品属性
					//给菜品加一个值来控制菜品的属性
					that.$store.state.originList[i].dishAttr = []
					let attr = that.$store.state.originList[i].dishAttribute;
					if (attr) {
						that.$store.state.originList[i].dishAttribute = JSON.parse(attr)
						for(let j=0;j<that.$store.state.originList[i].dishAttribute.length;j++){
							let param = {
								id:j,
								index:null
							}
							that.$store.state.originList[i].dishAttr.push(param)
						}
					}
					
					tempVue.set(that.$store.state.originList[i],'count', 0)
					//设置一个属性来保存某个菜品的上一次选中的规格/配菜/做法的class
					tempVue.set(that.$store.state.originList[i],'lastFoodClass', {})
				}
				//给nowDetailFood一个初始值,防止空值detail页面渲染报错
				that.$store.state.nowDetailFood = that.$store.state.originList[0]
				//生成一个用来按菜品种类保存的空数组
				for(let i=0;i<that.kind.length;i++){
					that.$store.state.foodsList.push([])
				}
				
				//菜品按种类list
				for(let i=0;i<that.$store.state.originList.length;i++){
					for(let j=0;j<that.$store.state.kinds.length;j++){
						if(that.$store.state.originList[i].categoryId==that.$store.state.kinds[j].id){
							that.$store.state.foodsList[j].push(that.$store.state.originList[i])
						}
					}
				}
				//计算菜品的菜种类名
				var cateName = []
				for(let i=0;i<that.$store.state.foodsList.length;i++){
					if(that.$store.state.foodsList[i].length>0){
						cateName.push(that.$store.state.foodsList[i][0].categoryName)
					}
					else{
						cateName.push('')
					}
				}
				that.$store.state.beforeCateName = cateName
				
				resolve()
			})
		})
		return p
	}
	//查询热销时间
	let fromDate = getCurrentDay(new Date().getTime()-86400000*7)
	let toDate = getCurrentDay(new Date().getTime())
	//查询热销
	var hotList = () => {
		var p = new Promise( (resolve,reject) => {
			that.$http.post(that.$store.state.orderHttp+"/jinghan-order/api/order/report/v2/hotSaleRank",
			JSON.stringify({"param":{"merchantId":that.$store.state.merchantId,
									"openId":that.$store.state.openId,
									"fromDate":fromDate,
									"toDate":toDate,
									"fromTime":"00:00",
									"toTime":"00:00"
									},
									"channel":1})
									
			,{emulateJSON:true})
			.then(function(res){
				console.log(res)
				that.$store.state.hotList = res.body.data
				for(let i=0;i<that.$store.state.originList.length;i++){
					for(let j=0;j<that.$store.state.hotList.length;j++){
						if(that.$store.state.originList[i].id == that.$store.state.hotList[j].dishesId){
							that.$store.state.hotList[j] = that.$store.state.originList[i]
						}
					}
				}
			})
			resolve()
		})
		return p
	}
	cateList().then(dishesList).then(orderList(that))
}
export default loadAgain