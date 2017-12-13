<template>
	<div class="indent">
		<!--nav-->
		<div class="navs">
			<p href="javascript:" onclick="history.back()">
				<i class='iconfont icon-zuojiantou'></i>
				<span>菜单</span>
			</p>
			<p>
				{{information.name}}
			</p>
			<p>
				<span>
					<a></a>
				</span>
			</p>
		</div>
		<!--选项卡-->
		<div class='tab'>
			<ul>
				<li @click="willBill=true,hadBill=false" ref="first" class="active-indent">待付款</li>
				<li @click="willBill=false,hadBill=true">已付款</li>
			</ul>
		</div>
		<!--待结账-->
		<div class="willBill" v-show="willBill">
			<ul>
				<li v-for = "(item,index) in this.$store.state.tempWillPayList" @click="chooseOrder(item,index)">
					<div class="orderTime">
						<div class="orderTime-show">
							<span>{{item.createTime}}</span>
						</div>
						<countTime :item="item"></counTtime>
					</div>
					<div class="goodsList">
						<p v-for="(food,index) in item.dishesList">
							<span>{{food.dishesName}}</span>
							<span>x{{food.dishesCount}}</span>
						</p>
					</div>
					<div class="num">
						<p>
							<i>共{{item.totalCount}}份，</i>应付￥{{item.totalPrice}}
						</p>
					</div>
					<p class="goPay" @click.stop.prevent="goPay(item)">
						去支付
					</p>
				</li>
			</ul>
		</div>
		<!--已付款-->
		<div class="hadBill" v-show="hadBill">
			<ul>
				<!-- v-if="item.payStatus==3"-->
				<li v-for="item in historyList">
					<div class="orderTime">
						<span>{{item.orderTime}}</span>
						<span>取餐号:{{item.serialNumber}}</span>
					</div>
					<div class="goodsList">
						<p v-for="(food,index) in item.snackOrderDishes" v-show="index<2">
							<span>{{food.dishesName}}</span>
							<span>x{{food.dishesCount}}</span>
						</p>
					</div>
					<div class="num">
						<p>
							<i>共{{item.orderCount}}份，</i>已付￥{{item.orderPayAmount/100}}
						</p>
					</div>
					<p class="buyAgain" @click="buyAgain(item)">
						再来一单
					</p>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
import {getCurrentTime} from '../../../js/getCurrentTime.js'
import countTime from './countTime.vue'
	export default{
		data(){
			return{
				information:{name:'我的订单',ifShowReload:true,ifShowMenu:false},
				willBill:true,
				willRating:false,
				hadBill:false
			}
		}
		,
		components:{
			countTime
		}
		,
		created(){
		}
		,
		methods:{
			//进入当前点击订单的支付页面
			goPay(target){
				this.$router.push({path:'/order/buy/pay'})
				this.$store.state.nowOrderInfo = target
			},
			//chooseOrder
			chooseOrder(item,target){
				this.$store.state.whichOrder = target
				this.$store.state.nowOrderInfo = item
				this.$router.push({path:'/order/buy/finished'})
			},
			//点击再来一单
			buyAgain(target){
				//先把以前的数据清空
				for(let k=0;k<this.$store.state.originList.length;k++){
					this.$store.state.originList[k].count = 0
	    			}
				this.$store.state.catesList = []
				this.$store.state.saveCartList = []
				this.$store.state.localCart = []
				this.$store.state.selectFoods = []
				this.$store.state.showShadow = true
				for(let i=0;i<target.snackOrderDishes.length;i++){
					//计算菜品的foodTip
					if(target.snackOrderDishes[i].sideDishes){
						let tempSideName = ''
						for(let j=0;j<target.snackOrderDishes[i].sideDishes.length;j++){
							tempSideName += target.snackOrderDishes[i].sideDishes[j].dishesName+' '
						}
						target.snackOrderDishes[i].foodTip = target.snackOrderDishes[i].cuisineName+' '+tempSideName+target.snackOrderDishes[i].unitName
					}
					else{
						target.snackOrderDishes[i].foodTip = target.snackOrderDishes[i].cuisineName+ ' ' +target.snackOrderDishes[i].unitName
					}
					//购物车显示的价格
					console.log(target.snackOrderDishes[i])
					target.snackOrderDishes[i].oneAllPrice = target.snackOrderDishes[i].dishesPrice
					target.snackOrderDishes[i].oneAllMemberPrice = target.snackOrderDishes[i].memberPrice
					
					
					this.$store.state.saveCartList.push(target.snackOrderDishes[i])
					//选菜数据同步
					for(let k=0;k<this.$store.state.originList.length;k++){
						if(this.$store.state.originList[k].id == target.snackOrderDishes[i].dishesId){
							this.$store.state.originList[k].count = target.snackOrderDishes[i].dishesCount
						}
		    			}
				}
				this.$router.push({path:'/order/buy'})
			}
		}
		,
		mounted(){
			var obj = document.getElementsByClassName('indent')[0]
			var obj1 = document.getElementsByClassName('tab')[0]
			var oLi = obj.getElementsByTagName('li')
				for(var i=0;i<oLi.length;i++){
					oLi[i].onclick = function(){
						for(var j=0;j<oLi.length;j++){
							oLi[j].className = ''
						}
						this.className = 'active-indent'
					}
				}
		}
		,
		computed:{
			//总数量
			totalCount(){
				let count = 0
				this.$store.state.orderList.forEach((food) => {
					food.forEach((item) => {
						count += item.dishesCount
					})
				})
				return count
			},
			//历史订单
			historyList(){
				return this.$store.state.historyList
			}
		}
	}
</script>
<style lang="scss">
	.indent{
		position:fixed;
		top:0;
		left:0;
		display: flex;
		flex-direction: column;
		width:100%;
		height:100%;
		background:#eee;
		z-index:2000;
		/*头部导航栏*/
		.navs {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 0.6rem;
			background: #fff;
			border-bottom:1px solid #F9F9F9;
			p:nth-child(1) {
				width: 0.8rem;
				margin-left: 0.15rem;
				color: #282828;
				i {
					font-size: 0.16rem;
				}
				span {
					font-size: 0.16rem;
				}
			}
			p:nth-child(2) {
				width: 1.4rem;
				margin-left: 0.25rem;
				text-align: center;
				color: #282828;
				font-size: 0.20rem;
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
							width: 0.24rem;
							height: 0.22rem;
							margin-right: 0.05rem;
						}
					}
				}
				span:nth-child(2) {
					img {
						width: 0.4rem;
						height: 0.4rem
					}
				}
			}
		}
		/*选项卡*/
		.tab{
			width:100%;
			height:0.4rem;
			border-bottom: 1px solid #F0F0F0;
			background:#fff;
			ul{
				display:flex;
				justify-content: space-around;
				width:100%;
				li{
					width:0.5rem;
					line-height:0.4rem;
					border-bottom: 2px solid transparent;
					text-align: center;
					font-size: 0.16rem;
					color: #A0A0A0;
				}
				.active-indent{
					border-bottom: 2px solid #31C4C3;
					color: #31C4C4;
				}
			}
		}
		/*未结账*/
		.willBill{
			width:100%;
			flex:1;
			overflow: scroll;
			ul{
				width:100%;
				li{
					position:relative;
					width:100%;
					border-bottom:1px solid #f9f9f9;
					.orderTime{
							display:flex;
							justify-content: space-between;
							background:#fff;
						.orderTime-show{
							display:flex;
							align-items: center;
							width:100%;
							height:0.5rem;
							background:#fff;
							span{
								margin-left:0.15rem;
								font-size:0.14rem;
								color: #282828;
							}
						}
					}
					.goodsList{
						width:100%;
						margin-top:0.01rem;
						p{
							display:flex;
							justify-content: space-between;
							align-items: center;
							width:100%;
							height:0.3rem;
							background:#fff;
							span:nth-child(1){
								margin-left:0.15rem;
								font-size:0.14rem;
								color: #787878;
							}
							span:nth-child(2){
								margin-right:0.15rem;
								font-size:0.14rem;
								color: #787878;
							}
						}
					}
					.num{
						width:100%;
						height:0.4rem;
						background:#fff;
						p{
							margin-left:0.15rem;
							font-size:0.17rem;
							color:#000;
							i{
								font-style: normal;
								font-size:0.14rem;
								color: #787878;
							}
						}
					}
					/*去支付*/
					.goPay{
						position:absolute;
						bottom:0.08rem;
						right:0.15rem;
						width:0.8rem;
						height:0.33rem;
						line-height:0.33rem;
						text-align:center;
						font-size: 0.16rem;
						color: #31C4C3;
						background:#fff;
						border: 2px solid rgba(49,196,195,0.50);
					}
				}
			}
		}
		/*已结账*/
		.hadBill{
			width:100%;
			flex:1;
			overflow: scroll;
			ul{
				width:100%;
				li{
					position:relative;
					width:100%;
					border-bottom:1px solid #F0F0F0;
					.orderTime{
						display:flex;
						justify-content: space-between;
						width:100%;
						height:0.5rem;
						line-height: 0.5rem;
						background:#fff;
						span:nth-child(1){
							margin-left:0.15rem;
							font-size:0.14rem;
							color: #282828;
						}
						span:nth-child(2){
							margin-right:0.15rem;
							font-size:0.18rem;
							color: #000;
						}
					}
					.goodsList{
						width:100%;
						margin-top:0.01rem;
						p{
							display:flex;
							justify-content: space-between;
							align-items: center;
							width:100%;
							height:0.3rem;
							background:#fff;
							span:nth-child(1){
								margin-left:0.15rem;
								font-size:0.14rem;
								color: #787878;
							}
							span:nth-child(2){
								margin-right:0.15rem;
								font-size:0.14rem;
								color: #787878;
							}
						}
					}
					.num{
						width:100%;
						height:0.4rem;
						background:#fff;
						p{
							margin-left:0.15rem;
							font-size:0.17rem;
							color:#000;
							i{
								font-style: normal;
								font-size:0.14rem;
								color: #787878;
							}
						}
					}
					/*去支付*/
					.buyAgain{
						position:absolute;
						bottom:0.08rem;
						right:0.15rem;
						width:0.8rem;
						height:0.33rem;
						line-height:0.33rem;
						text-align:center;
						font-size: 0.16rem;
						color: #31C4C3;
						background:#fff;
						border: 2px solid rgba(49,196,195,0.50);
					}
				}
			}
		}
	}
</style>