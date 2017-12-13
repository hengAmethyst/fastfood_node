<template>
	<div class="finished">
		<!--导航栏-->
		<div class="navs">
			<router-link to="/order/affirm" @click.native="backMenu">
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
				<!--我的订单-->
				<span>
					<router-link to="/order/indent">
						<img src="../../../assets/icons/订单@3x.png" v-show="information.ifShowMenu"/>
					</router-link>
				</span>
			</p>
		</div>
		<div class="innerBox" v-for="(aim,index) in tempWillPayList" v-show="index == whichOrder">
			<!--可以滑动区域-->
			<div class="ableFlow">
				<!--支付剩余时间-->
				<div class="payTime">
					<p>支付剩余时间</p>
					<p>
						<span v-for="item in splitTiem">
							{{item}}
						</span>
					</p>
				</div>
				<!--订单明细-->
				<div class="detail-title">
					<span>菜品明细<i>(待付款)</i></span>
					<span>共<i>{{aim.totalCount}}</i>份</span>
				</div>
				<!--点菜菜品-->
				<div class="detail-goods">
					<div class="for-cates" v-for="(item,index) in aim.cateList" v-show="item.length>0">
						<!--每种菜的种类-->
						<div class="cates">
							<span>{{aim.catesName[index]}}</span>
							<span>共<i>{{aim.catesNum[index]}}</i>份</span>
						</div>
						<!--具体的菜单list-->
						<ul>
							<li v-for="(food,order) in item">
								<div class="food-info">
									<p class="foodImg">
										<img :src="food.dishPicUrl"/>
									</p>
									<p class="foodName">
										<span>{{food.dishesName}}</span>
										<span>{{food.foodTip}}</span>
										<span>{{food.dishesAttrs}}</span>
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
					<div class="elseFee" v-show="aim.showTip">
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
				</div>
				<!--其他信息-->
				<div class="otherInfo">
					<p class="otherInfo-title">
						<span>其他信息</span>
					</p>
					<p class="dinnerWay">
						<span>就餐方式：<i>{{aim.orderType}}</i></span>
					</p>
					<p class="orderNo">
						<span>订单号:{{aim.orderCode}}</span>
					</p>
					<p class="orderTime">
						<span>下单时间: {{aim.createTime}}</span>
					</p>
					<div class="tips">
						<p class="orderTips">
							<span>备注信息：<i>{{aim.memo}}</i></span>
						</p>
					</div>
				</div>
			</div>
			<!--底部-->
			<div class="footer">
				<div class="forBtn">
					<p class="pay" @click="gotoPay">支付</p>
				</div>
				<p class="totalPrice">
					<span ref="totalPrice"><b>原价:</b><i>￥</i>{{aim.totalPrice}}</span>
					<span class="memberTotalPrice"><b>会员:￥</b>{{aim.memberPrice}}</span>
				</p>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
import {getCurrentTime} from '../../../js/getCurrentTime.js'
import {reloadOrder} from '../../../js/reloadOrder.js'
	export default {
		data() {
				return {
					information: {
						name: '订单完成',
						ifShowReload: true,
						ifShowMenu: true
					}
				}
			}
		,
		methods:{
			//返回菜单
			backMenu(){
				//清空本地的购物车信息
				this.$store.state.catesList = []
				this.$store.state.saveCartList = []
				this.$store.state.localCart = []
				this.$store.state.selectFoods = []
				for(let i=0;i<this.$store.state.originList.length;i++){
	    				this.$store.state.originList[i].count = 0
	    			}
				for(let i=0;i<this.$store.state.boughtList.length;i++){
	    				this.$store.state.boughtList[i].dishesCount = 0
	    			}
			},
			gotoPay(){
				//当前取支付的订单的取餐号
				this.$store.state.serialNumber = this.$store.state.nowOrderInfo.serialNumber
				if(this.$store.state.nowOrderInfo.memberPrice<this.$store.state.memberBalance&this.$store.state.phoneNumber==null){
					this.$store.state.comparePrice = 1
				}
				if(this.$store.state.nowOrderInfo.totalPrice<this.$store.state.memberBalance&this.$store.state.phoneNumber!=null){
					this.$store.state.comparePrice = 2
				}
				
				//提交购物车返回list
				this.$http.post(this.$store.state.orderHttp+"/jinghan-order/api/snack/v2/bill/prepareBill",
				JSON.stringify({"param":{
					"openId":this.$store.state.openId,
					"orderId": this.$store.state.orderId,
				    "merchantId": this.$store.state.merchantId,
				    "memberPhoneNumber":this.$store.state.phoneNumber,
				    //是否启用会员,0是启用
				    "useMember":0
				},"channel":1})
				,{emulateJSON:true})
				.then(function(res){
					this.$store.state.orderNo = res.body.data.bill.orderCode
					this.$store.state.needPay = res.body.data.payActualAmount
				})
				this.$router.push({path:'/order/buy/pay'})
			}
		}
		,
		updated(){
			//是会员，总价被划
			if(this.$store.state.phoneNumber!=null){
				this.$refs.totalPrice[0].className = 'lineThrough'
			}
			//原价被划
			if(this.$store.state.phoneNumber!=null){
				for(let i=0;i<this.$refs.price.length;i++){
					this.$refs.price[i].className = 'lineThrough'
				}
			}
		}
		,
		computed: {
			//总list
			orderList(){
				return this.$store.state.orderList
			},
			//菜种的数量
			catesNum(){
				//生成一个长度为种类长度的数组
				let catesNum = []
				for(let i=0;i<this.$store.state.orderList.length;i++){
					catesNum.push(0)
				}
				//每个种类菜品的数量
				for(let i=0;i<this.$store.state.orderList.length;i++){
					for(let j=0;j<this.$store.state.orderList[i].length;j++){
						catesNum[i] += this.$store.state.orderList[i][j].dishesCount
					}
				}
				return catesNum
			},
			//菜品种类名字
			catesName(){
				let newArry = []
				for(let i=0;i<this.$store.state.orderList.length;i++){
					if(this.$store.state.orderList[i].length>0){
						newArry.push(this.$store.state.orderList[i][0].categoryName)
					}
					else{
						newArry.push(null)
					}
				}
				return newArry
			},
			//计算总价
			totalPrice(){
				return Number(this.$store.state.totalPrice).toFixed(2)
			},
			//会员价
			memberPrice(){
				return this.$store.state.memberPrice
			},
			tempWillPayList(){
				return this.$store.state.tempWillPayList
			},
			//选择查看的订单标号
			whichOrder(){
				return this.$store.state.whichOrder
			},
			//时间分割
			splitTiem(){
				let temp = []
				if(this.$store.state.nowOrderInfo.time){
					temp = this.$store.state.nowOrderInfo.time.split('')
				}
				return temp
			},
			nowOrderInfo(){
				return this.$store.state.nowOrderInfo
			},
			//餐盒费
			boxMoney(){
				return Number(this.$store.state.boxWay.price*this.$store.state.boxWay.requireCount).toFixed(2)
			}
		}
	}
</script>
<style lang="scss">
	.finished {
		display: flex;
		flex-direction: column;
		width:100%;
		height: 100%;
		/*导航*/
		.navs {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 0.6rem;
			background: #fff;
			border-bottom:1px solid #f9f9f9;
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
							width: 0.24rem;
							height: 0.22rem;
							margin-right: 0.33rem;
						}
					}
				}
				span:nth-child(2) {
					img {
							width: 0.24rem;
							height: 0.22rem;
							margin-right: 0.05rem;
						}
				}
			}
		}
		/*获取的取餐号*/
		.getNo {
			display: flex;
			justify-content: space-between;
			width: 100%;
			height: 0.68rem;
			line-height: 0.28rem;
			background-image:url(../../../assets/icons/订单状态@3x.png);
			background-size: 100% 100%;
			p{
				display: flex;
				flex-direction: column;
				justify-content: center;
				width: 2rem;
				height: 100%;
				margin-left: 0.35rem;
				span:nth-child(1) {
					display: block;
					font-size: 0.14rem;
					color:#fff;
					i{
						font-style:normal;
						font-size:0.2rem;
						color:#f00;
					}
				}
				span:nth-child(2) {
					display: block;
					color: #fff;
				}
			}
		}
		/*正式内容区域*/
		.innerBox{
			display: flex;
			flex:1;
			flex-direction: column;
			width:100%;
			.ableFlow {
				flex:1;
				overflow: scroll;
				width: 100%;
				/*支付倒计时*/
				.payTime{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					width:100%;
					height:0.45rem;
					margin-top:0.05rem;
					p:nth-child(1){
						display: flex;
						justify-content: center;
						font-size:0.14rem;
						color:#282828;
					}
					p:nth-child(2){
						display: flex;
						justify-content: center;
						margin-top:0.08rem;
						margin-bottom:0.08rem;
						font-size:0.14rem;
						color:#f00;
						/*时间字的*/
						span{
							display: flex;
							justify-content: center;
							align-items: center;
							width:0.2rem;
							height:0.2rem;
							margin-left:0.05rem;
							color:#31C4C3;
							background:#fff;
							border:1px solid #31C4C3;
						}
						span:nth-child(3){
							width:0.1rem;
							height:0.2rem;
							background:#f9f9f9;
							border:none;
						}
					}
				}
				/*支付超时*/
				.outPayTime{
					display: flex;
					justify-content: center;
					align-items: center;
					width:100%;
					margin-top:0.2rem;
					p{
						font-size:0.16rem;
						color:#f00;
					}
				}
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
			}
			.footer {
				position: relative;
				width: 100%;
				height: 0.5rem;
				line-height: 0.5rem;
				border-top: 1px solid #eee;
				z-index: 2013;
				.forBtn{
					position:absolute;
					top:0;
					right:0;
					display: flex;
					justify-content: flex-end;
					width:2rem;
					height:0.5rem;
					.pay{
						width: 0.94rem;
						height: 100%;
						margin-left:0.05rem;
						text-align: center;
						background: #31C4C4;
						font-size: 0.18rem;
						color: #fff;
					}
				}
				.totalPrice{
					display: flex;
					align-items: center;
					/*原价*/
					span:nth-child(1){
						display: inline-block;
						margin-left: 0.18rem;
						font-size: 0.2rem;
						color: #282828;
						i{
							font-style:normal;
							font-size:0.16rem;
						}
						b{
							font-weight:normal;
							font-size:0.16rem;
						}
					}
					/*是会员的时候原价被划*/
					.lineThrough{
						display: inline-block;
						margin-left: 0.18rem;
						font-size: 0.2rem;
						color: #282828;
						i{
							font-style:normal;
							font-size:0.16rem;
						}
						b{
							font-weight:normal;
							font-size:0.16rem;
						}
						text-decoration:line-through;
					}
					/*会员价*/
					.memberTotalPrice{
						margin-left:0.28rem;
						font-size:0.2rem;
						color: #FF2C2C;
						b{
							font-size:0.12rem;
							font-weight:normal;
						}
					}
				}
				.toBeMember{
					position:absolute;
					top:-0.65rem;
					left:0;
					display: flex;
					width:100%;
					height:0.6rem;
					background-image: url('../../../assets/icons/Rectangle.png');
					background-size: 100% 100%;
					.toBeMember-1{
						display: flex;
						flex-direction: column;
						width:50%;
						height:100%;
						p:nth-child(1){
							width:100%;
							height:50%;
							margin-left:0.15rem;
							line-height: 0.3rem;
							span{
								font-size:0.16rem;
								color:#282828;
							}
							img{
								width:0.3rem;
								height:0.16rem;
							}
						}
						p:nth-child(2){
							height:50%;
							margin-left:0.15rem;
							line-height:0.3rem;
							span{
								color: #A7A7A7;
							}
						}
					}
					.toBeMember-2{
						display:flex;
						justify-content: center;
						align-items:center;
						width:50%;
						height:100%;
						p{
							font-size:0.16rem;
							color: #FF0001;
						}
					}
					.close{
						position:absolute;
						top:-30%;
						right:2%;
						width:0.3rem;
						height:0.3rem;
						img{
							width:0.3rem;
							height:0.3rem;
						}
					}
				}
				.continueAdd{
					position:absolute;
					top:50%;
					left:50%;
					transform: translate(-50%,-50%);
					width:2.2rem;
					height:0.41rem;
					line-height:0.41rem;
					text-align: center;
					font-size:0.2rem;
					color:#fff;
					background: #31C4C4;
					border-radius: 6px;
				}
			}
			/*菜品详情头部*/
			.detail-title {
				display: flex;
				justify-content: space-between;
				width: 100%;
				height: 0.4rem;
				line-height: 0.4rem;
				border-top: 1px solid #F6F6F6;
				background: #fff;
				span:nth-child(1) {
					margin-left: 0.15rem;
					font-size: 0.16rem;
					color: #282828;
					i{
						font-style:normal;
						font-size:0.16rem;
						color:#FF0000;
					}
				}
				span:nth-child(2) {
					margin-right: 0.15rem;
					font-size: 0.14rem;
					color: #282828;
					i {
						display: inline-block;
						text-align: center;
						width: 0.2rem;
						font-style: normal;
						}
				}
			}
			/*订单明细title*/
			.detail-goods {
				width: 100%;
				.cates {
					display: flex;
					justify-content: space-between;
					align-items: center;
					width: 100%;
					height: 0.3rem;
					background: #F0F0F0;
					span:nth-child(1) {
						margin-left: 0.15rem;
						font-size: 0.14rem;
						color: #6A6A6A;
					}
					span:nth-child(2) {
						margin-right: 0.15rem;
						font-size: 0.14rem;
						color: #A0A0A0;
						i {
							display: inline-block;
							text-align: center;
							width: 0.2rem;
							font-style: normal;
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
								margin-top:0.05rem;
								margin-left:0.1rem;
								/*菜名*/
								span:nth-child(1){
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
								/*数量*/
								.num{
									margin-right:0.15rem;
									font-size:0.15rem;
									color: #A0A0A0;
								}
								/*正常价*/
								.price{
									margin-right:0.15rem;
									font-size:0.14rem;
									color: #6A6A6A;
								}
								/*会员价*/
								.memberPrice{
									margin-right:0.15rem;
									font-size:0.14rem;
									color: #FF0001;
									i{
										font-style:normal;
										font-size:0.12rem;
									}
								}
								/*原单价被划*/
								.lineThrough{
									margin-right:0.15rem;
									font-size:0.12rem;
									color: #6A6A6A;
									text-decoration:line-through;
								}
							}
						}
					}
				}
			}
			.otherInfo {
				width: 100%;
				.otherInfo-title{
					width: 100%;
					height: 0.4rem;
					line-height: 0.4rem;
					color: #5A5A5A;
					background: #f0f0f0;
					span {
						margin-left: 0.15rem;
					}
				}
				.dinnerWay{
					width:100%;
					height:0.4rem;
					line-height: 0.4rem;
					border-bottom: 1px solid #F6F6F6;
					span{
						margin-left:0.15rem;
						font-size:0.13rem;
						color: #787878;
						i{
							font-style: normal;
							color:#000;
						}
					}
				}
				.orderNo{
					width: 100%;
					height: 0.38rem;
					line-height: 0.38rem;
					color: #787878;
					border-bottom: 1px solid #F6F6F6;
					span {
						margin-left: 0.15rem;
					}
				}
				.orderTime{
					width: 100%;
					height: 0.4rem;
					line-height: 0.4rem;
					color: #787878;
					border-bottom: 1px solid #F6F6F6;
					span {
						margin-left: 0.15rem;
					}
				}
				/*备注信息*/
				.tips{
					display: flex;
					justify-content: flex-start;
					width:100%;
					.orderTips{
						width: 92%;
						height: 0.4rem;
						line-height:0.4rem;
						margin-left:0.15rem;
						color: #787878;
						border-bottom: 1px solid #F6F6F6;
						span {
							i{
								font-style: normal;
								color:#000;
							}
						}
					}
				}
			}
		}
	}
</style>