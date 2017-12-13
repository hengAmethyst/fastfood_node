<template>
	<div class="affirm">
		<!--nav-->
		<div class="navs">
			<router-link to="/order/buy">
				<p>
					<i class='iconfont icon-zuojiantou'></i>
					<span>菜单</span>
				</p>
			</router-link>
			<p>
				{{information.name}}
			</p>
			<p>
				<span>
					<a>
						<!--<img src="../../../assets/icons/刷新@3x.png" v-show="information.ifShowReload"/>-->
					</a>
				</span>
				<span>
					<router-link to="/order/indent">
						<img src="../../../assets/icons/订单@3x.png" v-show="information.ifShowMenu"/>
					</router-link>
				</span>
			</p>
		</div>
		<!--就餐方式-->
		<div class="dinnerWay">
			<p class="way-title">
				<span>就餐方式</span>
			</p>
			<p class="dinnerHere">
				<span>堂吃</span>
				<img src='../../../assets/icons/就餐方式-未选中.png' v-show="!chooseWay" @click="dinnerWay0(chooseWay)"/>
				<img src='../../../assets/icons/就餐方式-选中.png' v-show="chooseWay" @click="dinnerWay0(chooseWay)"/>
			</p>
			<p class="makeBag">
				<span>外带</span>
				<img src='../../../assets/icons/就餐方式-未选中.png' v-show="!chooseWay1" @click="dinnerWay1(chooseWay1)"/>
				<img src='../../../assets/icons/就餐方式-选中.png' v-show="chooseWay1" @click="dinnerWay1(chooseWay1)"/>
			</p>
		</div>
		<!--菜品明细-->
		<div class="dishesDetail">
			<p class="info-1">
				<span>
					菜品明细
				</span>
				<span>
					(待付款)
				</span>
			</p>
			<p class="info-2">
				<span>
					共<i>{{totalCount}}</i>份
				</span>
			</p>
		</div>
		<div class="wrapper">
		<!--选的菜品-->
			<div class="orderd" v-for="(item,index) in catesList" v-show="item.length>0">
				<div class="category">
					<span>{{catesName[index]}}</span>
					<span>共<i>{{catesNum[index]}}</i>份</span>
				</div>
				<ul>
					<li v-for="(food,order) in item">
						<div class="food-info">
							<p class="foodImg">
								<img :src="food.dishPicUrl"/>
							</p>
							<p class="foodName">
								<span>{{food.dishesName}}</span>
								<span>{{food.foodTip}}</span>
								<span>{{food.foodAttrName}}</span>
							</p>
							<p class="foodNum">
								<span class="num">
									x{{food.dishesCount}}
								</span>
								<span class="price" ref="price">
									￥{{food.oneAllPrice}}/{{food.unitName}}
								</span>
								<span class="memberPrice">
									<i>会员:</i>￥{{food.oneAllMemberPrice}}/{{food.unitName}}
								</span>
							</p>
						</div>
					</li>
				</ul>
			</div>
			<!--附加费-->
			<div class="elseFee" v-show="this.$store.state.boxWay.showTip">
				<div class="title">
					<span>附加费</span>
				</div>
				<div class="elseInfo">
					<p>
						<span>
							<i>餐盒费</i>
						</span>
					</p>
					<p>
						<span>
							<i>￥</i>{{boxMoney}}
						</span>
					</p>
				</div>
			</div>
			<!--备注-->
			<div class="forTips" @click="gotoTips">
				<span>备注</span>
				<span>{{this.$store.state.gotoTipsWords}}</span>
			</div>
		</div>
		<!--底部-->
		<div class="footer">
			<p>
				<span ref="totalPrice">原价:￥{{cartPrice}}</span>
				<span class="ifMember" v-if="this.$store.state.phoneNumber!=null"><i>会员:￥</i>{{cartMemberPrice}}</span>
			</p>
			<p v-if="this.$store.state.phoneNumber==null">
				<span>会员￥{{cartMemberPrice}}</span>
				<span @click="toBeMember">成为会员</span>
			</p>
			<router-link to="/order/buy/finished" @click.native="submitOrder">
				<p class="order">确认下单</p>
			</router-link>
		</div>
		<alert :showMsg="showMsg" v-if="this.$store.state.showAlert"></alert>
		<!--加菜时候的加载蒙版-->
		<div class="adding" v-show="this.$store.state.addingIndex">
			<img class="Rotation img" src="../../../../static/imgs/1.png" width="50px" height="50px"/>
		</div>
	</div>
</template>
<script>
import {getCurrentTime} from '../../../js/getCurrentTime.js'
import Vue from 'vue'
	export default{
		data(){
			return{
				iFlag:false,
				food:{},
				//用来存储已经选中的菜品
				foods:[],
				inputValue:'',
				personNum:0,
				information:{name:'确认订单',ifShowReload:true,ifShowMenu:true},
				custom:0,
				isTips:false,
				showMsg:'已经有人下单了',
				//chooseDinnerWay
				chooseWay:true,
				chooseWay1:false,
				backCartList:[],
				dinnerWay:0,
				//用来传输boxWay的数组
				boxWayArry:[]
			}
		}
		,
		methods:{
			formatSeconds(target){
				let sec = 2401
				let secs = ''
				let min = 0
				setInterval(()=>{ 
					sec -= 1
				    min = parseInt(sec / 60)
				     secs = sec % 60
				    if(min<10){
				    		min = "0" + min
				    }
				    if(secs<10){
				    		 secs = "0" +  secs
				    }
				    target = min+':'+ secs
				},1000)
			},
			//跳转到备注页面
			gotoTips(){
				this.$router.push({path:'/order/buy/tips'})
			},
			//选择就餐方式
			dinnerWay0(target){
				if(target){
					this.chooseWay = false
					this.chooseWay1 = true
				}
				else{
					this.chooseWay = true
					this.chooseWay1 = false
				}
				//如果选中外带
				if(target){
					if(this.$store.state.boxWay.categoryId == 3){
						//餐盒总个数
						this.$store.state.boxWay.requireCount = this.totalCount
						//展示价格
						this.$store.state.cartPrice = (Number(this.$store.state.cartPrice) + Number(this.$store.state.boxWay.price*this.totalCount)).toFixed(2)
						//展示会员价
						this.$store.state.cartMemberPrice = (Number(this.$store.state.cartMemberPrice) + Number(this.$store.state.boxWay.price*this.totalCount)).toFixed(2)
						this.$store.state.boxWay.showTip = true
						this.boxWayArry.push(this.$store.state.boxWay)
					}
					if(this.$store.state.boxWay.categoryId == 4){
						this.$store.state.boxWay.requireCount = 1
						//展示价格
						this.$store.state.cartPrice = (Number(this.$store.state.cartPrice) + Number(this.$store.state.boxWay.price)).toFixed(2)
						//展示会员价
						this.$store.state.cartMemberPrice = (Number(this.$store.state.cartMemberPrice) + Number(this.$store.state.boxWay.price)).toFixed(2)
						this.$store.state.boxWay.showTip = true
						this.boxWayArry.push(this.$store.state.boxWay)
					}
				}
				else{
					if(this.$store.state.boxWay.categoryId == 3){
						this.$store.state.boxWay.requireCount = this.totalCount
						this.$store.state.cartPrice = (Number(this.$store.state.cartPrice) - Number(this.$store.state.boxWay.price*this.totalCount)).toFixed(2)
						this.$store.state.cartMemberPrice = (Number(this.$store.state.cartMemberPrice) - Number(this.$store.state.boxWay.price*this.totalCount)).toFixed(2)
						this.$store.state.boxWay.showTip = false
						this.boxWayArry.pop()
					}
					if(this.$store.state.boxWay.categoryId == 4){
						this.$store.state.boxWay.requireCount = 1
						this.$store.state.cartPrice = (Number(this.$store.state.cartPrice) - Number(this.$store.state.boxWay.price)).toFixed(2)
						this.$store.state.cartMemberPrice = (Number(this.$store.state.cartMemberPrice) - Number(this.$store.state.boxWay.price)).toFixed(2)
						this.$store.state.boxWay.showTip = false
						this.boxWayArry.pop()
					}
				}
			},
			dinnerWay1(target){
				if(target){
					this.chooseWay = true
					this.chooseWay1 = false
				}
				else{
					this.chooseWay = false
					this.chooseWay1 = true
				}
				//如果选中外带
				if(!target){
					if(this.$store.state.boxWay.categoryId == 3){
						//餐盒总个数
						this.$store.state.boxWay.requireCount = this.totalCount
						//展示价格
						this.$store.state.cartPrice = (Number(this.$store.state.cartPrice) + Number(this.$store.state.boxWay.price*this.totalCount)).toFixed(2)
						//展示会员价
						this.$store.state.cartMemberPrice = (Number(this.$store.state.cartMemberPrice) + Number(this.$store.state.boxWay.price*this.totalCount)).toFixed(2)
						this.$store.state.boxWay.showTip = true
						this.boxWayArry.push(this.$store.state.boxWay)
					}
					if(this.$store.state.boxWay.categoryId == 4){
						this.$store.state.boxWay.requireCount = 1
						//展示价格
						this.$store.state.cartPrice = (Number(this.$store.state.cartPrice) + Number(this.$store.state.boxWay.price)).toFixed(2)
						//展示会员价
						this.$store.state.cartMemberPrice = (Number(this.$store.state.cartMemberPrice) + Number(this.$store.state.boxWay.price)).toFixed(2)
						this.$store.state.boxWay.showTip = true
						this.boxWayArry.push(this.$store.state.boxWay)
					}
				}
				else{
					if(this.$store.state.boxWay.categoryId == 3){
						this.$store.state.boxWay.requireCount = this.totalCount
						this.$store.state.cartPrice = (Number(this.$store.state.cartPrice) - Number(this.$store.state.boxWay.price*this.totalCount)).toFixed(2)
						this.$store.state.cartMemberPrice = (Number(this.$store.state.cartMemberPrice) - Number(this.$store.state.boxWay.price*this.totalCount)).toFixed(2)
						this.$store.state.boxWay.showTip = false
						this.boxWayArry.pop()
					}
					if(this.$store.state.boxWay.categoryId == 4){
						this.$store.state.boxWay.requireCount = 1
						this.$store.state.cartPrice = (Number(this.$store.state.cartPrice) - Number(this.$store.state.boxWay.price)).toFixed(2)
						this.$store.state.cartMemberPrice = (Number(this.$store.state.cartMemberPrice) - Number(this.$store.state.boxWay.price)).toFixed(2)
						this.$store.state.boxWay.showTip = false
						this.boxWayArry.pop()
					}
				}
			},
			//成为会员
			toBeMember(){
				this.$router.push({path:'/order/register'})
			},
			//改变菜品备注栏的箭头
			changeArrow(target){
				if(target.className == "icon iconfont icon-yqfxiajiantou"){
					target.className = "icon iconfont icon-yqfshangjiantou"
				}
				else if(target.className == "icon iconfont icon-yqfshangjiantou"){
					target.className = "icon iconfont icon-yqfxiajiantou"
				}
			},
			//提交购物车
			submitOrder(){
				for(let i=0;i<this.$store.state.originList.length;i++){
	    				this.$store.state.originList[i].count = 0
	    			}
				for(let i=0;i<this.$store.state.boughtList.length;i++){
	    				this.$store.state.boughtList[i].dishesCount = 0
	    			}
				//清空备注
				this.$store.state.gotoTipsWords = ''
				//判断用餐方式
				if(this.chooseWay){
					this.dinnerWay = 1
				}
				else{
					this.dinnerWay = 2
				}
				let backCartList = []
				let tempIndex = true
				//合并购物车
				for(let i=0;i<this.$store.state.saveCartList.length;i++){
					//价格
					this.$store.state.saveCartList[i].dishesPrice = this.$store.state.saveCartList[i].dishesPrice*100
					this.$store.state.saveCartList[i].memberPrice = this.$store.state.saveCartList[i].memberPrice*100 
					this.$store.state.saveCartList[i].cuisinePrice = this.$store.state.saveCartList[i].cuisinePrice*100
					this.$store.state.saveCartList[i].dishesAttrs = this.$store.state.saveCartList[i].foodAttrName
					//配菜价格,如果配菜存在
					if(this.$store.state.saveCartList[i].sideDishes){
						for(let k=0;k<this.$store.state.saveCartList[i].sideDishes.length;k++){
							this.$store.state.saveCartList[i].sideDishes[k].dishesPrice = this.$store.state.saveCartList[i].sideDishes[k].dishesPrice
							this.$store.state.saveCartList[i].sideDishes[k].memberPrice = this.$store.state.saveCartList[i].sideDishes[k].memberPrice
							this.$store.state.saveCartList[i].sideDishes[k].dishesCount = 1
						}
					}
				}
				this.backCartList = this.$store.state.saveCartList
				//清除dishesCount为0菜品
				for(let i=0;i<this.backCartList.length;i++){
					if(this.backCartList[i].dishesCount<1){
						this.backCartList.splice(i,1)
					}
				}
				//制造数据给后台
				let backData = {
					//channel
					"channel":1,
					//openId
					"openId":this.$store.state.openId,
					//店铺Id
					"merchantId":this.$store.state.merchantId,
					//堂吃1,外带2,外卖3
					"orderType":this.dinnerWay,
					//餐盒费
					"requires":this.boxWayArry,
					//订单菜品
					"snackOrderDishes":this.backCartList,
					//memo
					"memo":this.$store.state.allTipsName,
					"dictSetIdList":this.$store.state.tipsId,
					"dictSetNameList":this.$store.state.tipsName
				}
				//提交购物车返回list
				this.$http.post(this.$store.state.orderHttp+"/submitOrder",
					JSON.stringify(backData)
				,{emulateJSON:true})
				.then(function(res){
					console.log(res)
					//该张订单信息
					let willPay = {}
					//菜品list
					this.$store.state.orderList = res.body.data.order.snackOrderDishes
					//orderId
					this.$store.state.orderId = res.body.data.order.id
					//菜品信息处理
					for(let i=0;i<this.$store.state.orderList.length;i++){
						this.$store.state.orderList[i].dishesPrice = (this.$store.state.orderList[i].dishesPrice/100).toFixed(2)
						this.$store.state.orderList[i].memberPrice = (this.$store.state.orderList[i].memberPrice/100).toFixed(2)
						this.$store.state.orderList[i].cuisinePrice = (this.$store.state.orderList[i].cuisinePrice/100).toFixed(2)
						//计算foodTip
						let tempSideName = ''
						let sideDishesPrice = 0 
						let sideMemberPrice = 0
						if(this.$store.state.orderList[i].sideDishes){
							for(let j=0;j<this.$store.state.orderList[i].sideDishes.length;j++){
								tempSideName += this.$store.state.orderList[i].sideDishes[j].dishesName + ' '
							}
						}
						let tempCuisineName = ''
						if(this.$store.state.orderList[i].cuisineName){
							tempCuisineName = this.$store.state.orderList[i].cuisineName
						}
						//foodTip按照顺序排列   做法，配菜，规格
						let tempFoodTip = tempCuisineName+' '+tempSideName+this.$store.state.orderList[i].unitName
						this.$store.state.orderList[i].foodTip = tempFoodTip
					}
				//创造未付款订单数据list
					//取餐号
					willPay.serialNumber =  res.body.data.order.serialNumber
					//下单时间
					willPay.createTime = getCurrentTime(res.body.data.order.createTime)
					//菜品列表
					willPay.dishesList = res.body.data.order.snackOrderDishes
					//订单Id
					willPay.orderId = res.body.data.order.id
					//订单号
					willPay.orderCode = res.body.data.order.orderCode
					//总价格
					willPay.totalPrice = (res.body.data.order.orderTotalAmount/100).toFixed(2)
					//会员价格
					willPay.memberPrice = (res.body.data.order.memberAmount/100).toFixed(2)
					//菜品总数
					willPay.totalCount = 0
					for(let k=0;k<res.body.data.order.snackOrderDishes.length;k++){
						willPay.totalCount += res.body.data.order.snackOrderDishes[k].dishesCount
					}
					//就餐方式
					if(res.body.data.order.orderType == 1){
						willPay.orderType  = "堂吃"
					}
					if(res.body.data.order.orderType == 2){
						willPay.orderType = "外带"
					}
					//显示餐盒费
					willPay.showTip = this.$store.state.boxWay.showTip
					//备注信息
					willPay.memo = this.$store.state.allTipsName
					//处理菜品的数据,按种类组合
					let tempCates = []
					for(let i=0;i<this.$store.state.kinds.length;i++){
						tempCates.push([])
					}
					for(let i=0;i<this.$store.state.orderList.length;i++){
						let tempSidePrice = 0
						let tempSideMemberPrice = 0
						//如果配菜存在计算配菜的价格
						if(this.$store.state.orderList[i].sideDishes){
							for(let k=0;k<this.$store.state.orderList[i].sideDishes.length;k++){
								tempSidePrice += Number(this.$store.state.orderList[i].sideDishes[k].dishesPrice) + Number(this.$store.state.orderList[i].sideDishes[k].cuisinePrice)
								tempSideMemberPrice += Number(this.$store.state.orderList[i].sideDishes[k].memberPrice) + Number(this.$store.state.orderList[i].sideDishes[k].cuisinePrice)
							}
						}
						//计算显示的菜品价格
						this.$store.state.orderList[i].oneAllPrice = Number(this.$store.state.orderList[i].cuisinePrice) + Number(this.$store.state.orderList[i].dishesPrice) + Number(tempSidePrice/100)
						this.$store.state.orderList[i].oneAllMemberPrice = Number(this.$store.state.orderList[i].cuisinePrice) + Number(this.$store.state.orderList[i].memberPrice) + Number(tempSideMemberPrice/100)
						for(let j=0;j<this.$store.state.kinds.length;j++){
							if(this.$store.state.orderList[i].categoryId == this.$store.state.kinds[j].id){
								tempCates[j].push(this.$store.state.orderList[i])
							}
						}
					}
					willPay.cateList = tempCates
					//菜品种类的名字
					willPay.catesName = []
					for(let i=0;i<willPay.cateList.length;i++){
						if(willPay.cateList[i].length>0){
							willPay.catesName.push(willPay.cateList[i][0].categoryName)
						}
						else{
							willPay.catesName.push(null)
						}
					}
					//菜品种类数量
					let catesNum = []
					for(let i=0;i<willPay.cateList.length;i++){
						catesNum.push(0)
					}
					//每个种类菜品的数量
					for(let i=0;i<willPay.cateList.length;i++){
						for(let j=0;j<willPay.cateList[i].length;j++){
							catesNum[i] += willPay.cateList[i][j].dishesCount
						}
					}
					willPay.catesNum = catesNum
					//如果时间消失或者已被支付
					willPay.timeOut = false
					//时间倒计时
					willPay.time = ''
					let sec = 1800
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
					    if(sec == 0){
					    		willPay.timeOut = true
					    		clearInterval(timer)
							//如果在规定时间内没有支付,移除改订单
							this.$store.state.tempWillPayList.pop()
					    }
					},1000)
					//添加的到数组的第一个
					this.$store.state.tempWillPayList.unshift(willPay)
					this.$store.state.nowOrderInfo = willPay
				})
				//将价格变回来
				for(let i=0;i<this.$store.state.saveCartList.length;i++){
					//价格
					this.$store.state.saveCartList[i].dishesPrice = (this.$store.state.saveCartList[i].dishesPrice/100).toFixed(2)
					this.$store.state.saveCartList[i].memberPrice = (this.$store.state.saveCartList[i].memberPrice/100).toFixed(2)
					this.$store.state.saveCartList[i].cuisinePrice = (this.$store.state.saveCartList[i].cuisinePrice/100).toFixed(2)
					//配菜价格,如果配菜存在
					if(this.$store.state.saveCartList[i].sideDishes){
						for(let k=0;k<this.$store.state.saveCartList[i].sideDishes.length;k++){
							this.$store.state.saveCartList[i].sideDishes[k].dishesPrice = this.$store.state.saveCartList[i].sideDishes[k].dishesPrice
						}
					}
				}
				//清空购物车
				//清空本地的购物车信息
				this.$store.state.catesList = []
				this.$store.state.saveCartList = []
				this.$store.state.localCart = []
				this.$store.state.selectFoods = []
			}
		}
		,
		mounted(){
			//会员价被划
			if(this.$store.state.phoneNumber!=null){
				for(let i=0;i<this.$refs.price.length;i++){
					this.$refs.price[i].className = 'lineThrough'
				}
			}
			//会员价总价被划
			if(this.$store.state.phoneNumber!=null){
				this.$refs.totalPrice.className = 'lineThroughPrice'
			}
		}
		,
		computed:{
			//购物车总价
			cartPrice(){
				return Number(this.$store.state.cartPrice)
			},
			//购物车会员价
			cartMemberPrice(){
				return Number(this.$store.state.cartMemberPrice)
			},
			//总数量
			totalCount(){
				let count = 0
				this.$store.state.catesList.forEach((food) => {
					food.forEach((item) => {
						count += item.dishesCount
					})
				})
				return count
			},
			//菜种的数量
			catesNum(){
				//生成一个长度为种类长度的数组
				let tempCatesNums = []
				for(let i=0;i<this.$store.state.catesList.length;i++){
					tempCatesNums.push(0)
				}
				//每个种类菜品的数量
				for(let i=0;i<this.$store.state.catesList.length;i++){
					for(let j=0;j<this.$store.state.catesList[i].length;j++){
						tempCatesNums[i] += this.$store.state.catesList[i][j].dishesCount
					}
				}
				return tempCatesNums
			},
			//菜品种类名字
			catesName(){
				let newArry = []
				for(let i=0;i<this.$store.state.catesList.length;i++){
					if(this.$store.state.catesList[i].length>0){
						newArry.push(this.$store.state.catesList[i][0].categoryName)
					}
					else{
						newArry.push(null)
					}
				}
				return newArry
			},
			//购物车按种类分
			catesList(){
				return this.$store.state.catesList
			},
			//餐盒费
			boxMoney(){
				return Number(this.$store.state.boxWay.price*this.totalCount).toFixed(2)
			}
		}
	}
</script>
<style lang="scss">
	.affirm{
		position:fixed;
		top:0;
		left:0;
		display: flex;
		flex-direction: column;
		width:100%;
		height:100%;
		background:#F0F0F0;
		z-index:2000;
		/*用餐方式*/
		.dinnerWay{
			width:100%;
			.way-title{
				display:flex;
				align-items: center;
				width:100%;
				height:0.3rem;
				span{
					margin-left:0.15rem;
					font-size:0.14rem;
					color: #6A6A6A;
				}
				background: #F0F0F0;
			}
			.dinnerHere{
				display:flex;
				align-items:center;
				justify-content: space-between;
				width:100%;
				height:0.5rem;
				background:#fff;
				border-bottom:2px solid #F0F0F0;
				span{
					margin-left:0.15rem;
					font-size:0.16rem;
					color: #282828;
				}
				img{
					width:0.23rem;
					height:0.23rem;
					margin-right:0.15rem;
				}
			}
			.makeBag{
				display:flex;
				align-items:center;
				justify-content: space-between;
				width:100%;
				height:0.5rem;
				background:#fff;
				span{
					margin-left:0.15rem;
					font-size:0.16rem;
					color: #282828;
				}
				img{
					width:0.23rem;
					height:0.23rem;
					margin-right:0.15rem;
				}
			}
		}
		/*菜品明细*/
		.dishesDetail{
			display: flex;
			align-items: center;
			justify-content: space-between;
			width:100%;
			height:0.4rem;
			margin-top:0.05rem;
			background: #FCFCFC;
			.info-1{
				margin-left:0.15rem;
				span:nth-child(1){
					font-size:0.16rem;
					color: #282828;
				}
				span:nth-child(2){
					font-size:0.16rem;
					color: #FF0001;
				}
			}
			.info-2{
				margin-right:0.15rem;
				span{
					font-size:0.16rem;
					color: #282828;
				}
				i{
					display: inline-block;
					width:0.3rem;
					text-align: center;
					font-style:normal;
				}
			}
		}
		.wrapper{
			flex:1;
			overflow: scroll;
			/*苹果滚动*/
			-webkit-overflow-scrolling : touch;
			/*附加费*/
			.elseFee{
				width:100%;
				.title{
					display: flex;
					justify-content: space-between;
					align-items:center;
					width:100%;
					height:0.3rem;
					font-size:0.14rem;
					color: #6A6A6A;
					background: #F0F0F0;
					span:nth-child(1){
						margin-left:0.15rem;
					}
					span:nth-child(2){
						margin-right:0.15rem;
						i{
							display: inline-block;
							width:0.2rem;
							text-align: center;
							font-style:normal;
						}
					}
				}
				.elseInfo{
					display: flex;
					justify-content: space-between;
					align-items:center;
					width:100%;
					height:0.5rem;
					background:#fff;
					p:nth-child(1){
						display:flex;
						align-items:center;
						margin-left:0.165rem;
						span:nth-child(1){
							display: flex;
							flex-direction: column;
							justify-content: space-around;
							i{
								font-style:normal;
								font-size:0.16rem;
								color: #282828;
							}
							b{
								font-style:normal;
								color: #FF0000;
							}
						}
						span:nth-child(2){
							margin-left:0.28rem;
							font-size:0.16rem;
							color:#000;
						}
					}
					p:nth-child(2){
						margin-right:0.15rem;
						font-size:0.16rem;
						color: #6A6A6A;
						span{
							i{
								font-style:normal;
								font-size:0.12rem;
							}
							font-size:0.16rem;
						}
					}
				}
			}
			/*备注*/
			.forTips{
				display:flex;
				justify-content: space-between;
				align-items:center;
				width:100%;
				height:0.5rem;
				border-top:2px solid #F0F0F0;
				background:#fff;
				span:nth-child(1){
					margin-left:0.15rem;
					font-size:0.16rem;
					color: #282828;
				}
				span:nth-child(2){
					display: flex;
					justify-content: flex-end;
					align-items: center;
					width:1.2rem;
					height:0.5rem;
					margin-right:0.15rem;
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					color: #A0A0A0;
				}
			}
		}
		.navs {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 0.6rem;
			background: #fff;
			p:nth-child(1) {
				width: 0.8rem;
				margin-left: 0.15rem;
				font-size: 0.16rem;
				color: #282828;
			}
			p:nth-child(2) {
				width: 1.4rem;
				margin-left: 0.25rem;
				text-align: center;
				font-size: 0.20rem;
				color: #282828;
			}
			p:nth-child(3) {
				display: flex;
				justify-content: flex-end;
				width: 1rem;
				margin-right: 0.08rem;
				span:nth-child(1) {
					display: flex;
					justify-content: center;
					align-items: center;
					a {
						img {
							width: 0.23rem;
							height: 0.21rem;
							margin-right: 0.32rem;
						}
					}
				}
				span:nth-child(2) {
					img {
							width: 0.21rem;
							height: 0.23rem;
							margin-right: 0.05rem;
						}
				}
			}
		}
		.orderd{
			.goodsNum{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width:100%;
				height:0.3rem;
				background:#F0F0F0;
				span:nth-child(1){
					margin-left:0.15rem;
					font-size: 0.15rem;
					color:#6A6A6A;
				}
				span:nth-child(2){
					font-size:0.15rem;
					margin-right:0.2rem;
					color:#6A6A6A;
					i{
						display:inline-block;
						width:0.16rem;
						text-align: center;
						font-style:normal;
					}
				}
			}
			.category{
				display:flex;
				justify-content: space-between;
				width:100%;
				height:0.3rem;
				line-height:0.3rem;
				background: #F0F0F0;
				span:nth-child(1){
					margin-left:0.15rem;
					font-size:0.14rem;
					color: #6A6A6A;
				}
				span:nth-child(2){
					font-size:0.15rem;
					margin-right:0.2rem;
					color:#6A6A6A;
					i{
						display:inline-block;
						width:0.16rem;
						text-align: center;
						font-style:normal;
					}
				}
			}
			ul{
				width:100%;
				li{
					/*菜品详情*/
					.food-info{
						display: flex;
						align-items: center;
						width:100%;
						height:1rem;
						background:#fff;
						/*菜品img*/
						.foodImg{
							margin-left:0.15rem;
							img{
								width:0.65rem;
								height:0.65rem;
							}
						}
						/*菜品名字*/
						.foodName{
							display: flex;
							flex-direction: column;
							width:1.2rem;
							height:0.8rem;
							margin-left:0.1rem;
							/*菜名*/
							span:nth-child(1){
								margin-top:0.05rem;
								font-size:0.16rem;
								color: #282828;
							}
							/*备注*/
							span:nth-child(2){
								font-size:0.12rem;
								color: #A0A0A0;
								text-overflow: ellipsis;
							 	display: -webkit-box;
							  	-webkit-line-clamp: 2;
							 	-webkit-box-orient: vertical;
							  	overflow: hidden;
							}
						}
						/*菜品数量*/
						.foodNum{
							display: flex;
							flex-direction: column;
							align-items: flex-end;
							justify-content: space-around;
							width:100%;
							height:0.67rem;
							flex:1;
							.num{
								margin-right:0.15rem;
								font-size:0.14rem;
								color: #A0A0A0;
							}
							.price{
								margin-right:0.15rem;
								font-size: 0.14rem;
								color: #282828;
							}
							/*如果是会员的,原价需要被划*/
							.lineThrough{
								margin-right:0.15rem;
								color: #6A6A6A;
								text-decoration:line-through;
							}
							.memberPrice{
								margin-right:0.15rem;
								font-size:0.14rem;
								color: #FF0001;
								i{
									font-style:normal;
									font-size:0.12rem;
								}
							}
						}
					}
				}
			}
		}
		/*底部*/
		.footer{
			position:relative;
			display: flex;
			align-items: center;
			width:100%;
			height:0.5rem;
			background: #FFFFFF;
			box-shadow: inset 0 1px 1px 0 rgba(220,220,220,0.50);
			p:nth-child(1){
				position:relative;
				span:nth-child(1){
					margin-left:0.15rem;
					font-size: 0.18rem;
					color: #282828;
				}
				.lineThroughPrice{
					margin-left:0.15rem;
					font-size: 0.18rem;
					color: #6A6A6A;
					text-decoration:line-through;
				}
				.ifMember{
					margin-left:0.25rem;
					font-size: 0.2rem;
					color:#FF2C2C;
					i{
						font-style:normal;
						font-size:0.14rem;
					}
				}
			}
			/*成为会员*/
			p:nth-child(2){
				display:flex;
				flex-direction: column;
				align-items:center;
				margin-left:0.3rem;
				span:nth-child(1){
					font-size:0.14rem;
					color: #FF0001;
					i{
						font-style:normal;
					}
				}
				span:nth-child(2){
					display:flex;
					justify-content: center;
					align-items: center;
					width:0.7rem;
					height:0.15rem;
					text-align: center;
					color: #31C4C3;
					border: 1px solid #31C4C3;
					border-radius: 80px;
					a{
						color: #31C4C3;
					}
				}
			}
			/*确认按钮*/
			a{
				position:absolute;
				bottom:0;
				right:0;
				.order{
					width:0.9rem;
					height:0.5rem;
					font-size:0.16rem;
					color:#fff;
					text-align: center;
					line-height: 0.5rem;
					border-radius: 0;
					background: #31C4C4;
				}
			}
		}
		/*刷新或加菜*/
		.adding{
			position:fixed;
			left:0;
			top:0;
			display:flex;
			align-items: center;
			justify-content: center;
			width:100%;
			height:100%;
			background:black;
			opacity: 0.2;
			z-index:3000;
			@-webkit-keyframes rotation{
				from {-webkit-transform: rotate(0deg);}
				to {-webkit-transform: rotate(360deg);}
			}
			.Rotation{
				-webkit-transform: rotate(360deg);
				animation: rotation 1.5s linear infinite;
				/*-moz-animation: rotation 1.5s linear infinite;
				-webkit-animation: rotation 1.5s linear infinite;
				-o-animation: rotation 1.5s linear infinite;*/
				border-radius: 100%;
			}
		}
	}
</style>