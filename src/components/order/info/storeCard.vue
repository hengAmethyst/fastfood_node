<template>
	<div class="storeCard">
		<div class="header">
			<ul>
				<li @click="back">
					<i class='iconfont icon-zuojiantou'></i>
					<span>
						会员中心
					</span>
				</li>
				<li>
					<span>储值卡</span>
				</li>
				<li>
					<span @click="showRecord">记录</span>
				</li>
			</ul>
		</div>
		<!--余额-->
		<div class="restMoney">
			<span>余额</span>
			<span>￥ {{this.$store.state.memberBalance}}</span>
		</div>
		<!--充值金额-->
		<div class="storeMoney">
			<ul>
				<li v-for="(item,index) in chargeLabel" ref="cards" @click="choose(item,index)">
					<span>￥{{item.money}}</span>
					<span>送 ￥{{item.giveMoney}}</span>
				</li>
			</ul>
			<div class="defined" v-show="showDefined">
				<span class="defined-text" v-show="showDefined">自定义充值:</span>
				<input type="text" placeholder="输入充值金额" v-model="definedMoney" v-show="showDefined" @blur="defined"/>
			</div>
		</div>
		<!--支付方式-->
		<div class="payWay">
			<p>
				<img src="../../../assets/icons/wechatPay.png" v-if="showWhich=='weixin'"/>
				<img src="../../../assets/icons/aliPay.png" v-else/>
				<span>
					{{showText}}支付
				</span>
			</p>
			<p>
				<img src="../../../assets/icons/就餐方式-选中.png" />
			</p>
		</div>
		<!--支付按钮-->
		<div class="payBtn">
			<!--灰按钮-->
			<p class="btnSilence" v-if="!btnActive">
				立即充值
			</p>
			<p class="btn" v-if="btnActive" @click="goCharge">
				立即充值
			</p>
			
			<p class="money">
				<span>应付金额<i>￥{{chargeMoney}}</i></span>
				<span>到账金额<i>￥{{actualMoney}}</i></span>
			</p>
		</div>
		<!--记录-->
		<div class="record" v-if="isRecord">
			<div class="recordHeader">
				<p class="center">
					储值卡收支记录
				</p>
				<p class="left" @click="isRecord=false">
					<i class='iconfont icon-zuojiantou'></i>
					<span>储值卡</span>
				</p>
			</div>
			<div class="recordInner">
				<ul>
					<li v-for="(item,index) in this.$store.state.memberChargeRecord" v-if="index<20">
						<span>{{item.createTime}}</span>
						<span :class="item.class">￥ {{item.rechargeMoney}}</span>
					</li>
				</ul>
			</div>
		</div>
		<!--提示框-->
		<div class="warnBox" v-if="warnBox">
			<p>
				<span>你即将充值{{chargeMoney/100}}元</span>
			</p>
			<p>
				<span @click="warnBox=false">取消</span>
				<a :href="this.$store.state.paymentHttp+'/jinghan-payment/api/ali/wapPay?orderNo='+ chargeId +'&merchantId=' + this.$store.state.merchantId + '&billType=11&returnUrl='+this.$store.state.returnUrl+'/jh/order/info'">
					<span>确定</span>
				</a>
			</p>
		</div>
		<!--弹框-->
		<alert :showMsg="showMsg" v-if="showAlert"></alert>
	</div>
</template>
<script>
import saveLocal from '../../../js/saveLocal.js'
	export default{
		data(){
			return{
				isRecord:false,
				btnActive:false,
				//充值的Id
				chargeId:0,
				//充值提示框
				warnBox:false,
				//充值标签list
				chargeLabel:null,
				//微信支付宝字段
				showText:'微信',
				//显示微信还是支付宝图片
				showWhich:'',
				//充值金额
				chargeMoney:null,
				//实际的金额
				actualMoney:0,
				//自定义金额
				definedMoney:null,
				//弹框显示信息
        			showMsg:'订单支付失败',
        			//是否显示alert框
        			showAlert:false,
        			//展示自定义输入框
        			showDefined:false
			}
		}
		,
		methods:{
			//返回info
			back(){
				this.$router.push({path:'/order/info'})	
			},
			//显示记录页
			showRecord(){
				this.isRecord = true
			},
			//选中充值的金额
			choose(target,index){
				this.btnActive = true
				this.$refs.cards.forEach((item) => {item.className = ''})
				this.$refs.cards[index].className = 'active'
				this.chargeMoney = target.money
				this.actualMoney = target.giveMoney
			},
			//自定义金额判断
			defined(){
				if(this.definedMoney>0){
					this.btnActive = true
				}
			},
			//点击active的充值按钮
			goCharge(){
				//如果是自定义的充值
				if(this.showDefined){
					this.chargeMoney = this.definedMoney*100
					this.actualMoney = this.definedMoney*100
				}
				//存储当前储存的金额
				this.$store.state.actualMoney = this.actualMoney
				this.$store.state.chargeMoney = this.chargeMoney
				//存储信息到本地
				saveLocal(this,'chargeInfo')
				this.$http.post(this.$store.state.accountHttp+"/jinghan-account/api/user/memberRecharge",
				JSON.stringify({"param":{"userId": this.$store.state.memberUserId,
										"merchantId": this.$store.state.merchantId,
										"rechargeMoney":this.chargeMoney,
										"accountMoney":this.actualMoney,
										"source":2,
										"type":2}
								})
				,{emulateJSON:true})
				.then(function(res){
					console.log(res)
					this.chargeId = res.body.data.memberRecharge.id
					//如果是微信支付
					if(this.showWhich =='weixin'){
						this.$http.post(this.$store.state.paymentHttp+"/jinghan-payment/api/pay/router",
						JSON.stringify({"param":{
											"merchantId":this.$store.state.merchantId,
										    "orderNo": this.chargeId,
										    "billType": 11,
										    "openid": this.$store.state.openId,
										    "tradeType": "JSAPI",
										    "payChannel": "WXPAY",
										    "operateSystem": "2",
										    "authCode":"0217RqXh0h8V9A1yB1Yh04QAXh07RqX",
											"code":"001CjoP02mfUmX053nP020uyP02CjoP5"
										  }})
						,{emulateJSON:true})
						.then(
							function(ret){
								//后台给出的提示信息
								this.showMsg = ret.body.showMsg
								if(ret.body.code != 0) {
									//展示弹出框
									this.showAlert = true
									let that = this
									setTimeout(function(){
										that.showAlert = false
									},3000)
									return
								}else{
									var appId = ret.body.data.appId
									var nonceStr = ret.body.data.nonceStr
									var packageStr = ret.body.data.package
									var paySign = ret.body.data.paySign
									var signType = ret.body.data.signType
									var timeStamp = ret.body.data.timeStamp
									var that = this
									WeixinJSBridge.invoke(
								    		"getBrandWCPayRequest",{
								        "appId": appId,     //公众号名称，由商户传入     
								        "timeStamp": timeStamp,         //时间戳，自1970年以来的秒数     
								        "nonceStr": nonceStr, //随机串     
								        "package": packageStr,     
								        "signType": signType,         //微信签名方式：     
								        "paySign": paySign //微信签名 
								        },
								        function(res){ 
								           if(res.err_msg != "get_brand_wcpay_request:ok" ) {
								        	  	 alert('支付错误,请再次尝试');    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
								           }else{
								           	let tempChargeMoney = (that.chargeMoney/100).toFixed(2)
								           	let tempActualMoney = (that.actualMoney/100).toFixed(2)
								           	//充值成功后发送短信
								           	that.$http.post(that.$store.state.accountHttp+"/jinghan-account/api/user/sendSmsCodeByMerchant",
											JSON.stringify({"reqId":1,"param":{
																	"phone":that.$store.state.phoneNumber,
																	"merchantId":that.$store.state.merchantId,
																	"type":1,
																	"childType":112,
																	//你的取餐码
																	"context":'您的充值'+tempChargeMoney+'元,实际到账'+tempActualMoney+'元'}})
											,{emulateJSON:true})
											.then(function(res){
												console.log(res)
											})
											//当前余额
											that.$store.state.memberBalance = tempActualMoney
								           	//显示支付成功界面
									        	that.$store.state.paySucceed = true
									        	//显示pay的支付按钮
									        	that.$store.state.showPayBtn = true
											that.$store.state.payResult = '充值成功'
								           	that.$router.push({path:'/order/storeCard'})
								           }
								        }
									)
								}
							})
					}
					//如果不是微信支付
					else{
						this.warnBox = true
					}
				})
			}
		}
		,
		created(){
			//获取充值标签
			this.$http.post(this.$store.state.merchantHttp+"/storeCard",
				JSON.stringify({"merchantId":this.$store.state.merchantId})
				,{emulateJSON:true})
				.then(function(res){
					console.log(res)
					if(res.body.data){
						this.chargeLabel = res.body.data.cardList
						this.showDefined = false
						this.chargeLabel.forEach(item => {
							item.money = item.money/100
							item.giveMoney = item.giveMoney/100
						})
					}
					else{
						this.showDefined = true
					}
				})
			//判断用什么浏览器方式打开
			var userWay = navigator.userAgent
			if(userWay.indexOf('MicroMessenger') >= 0){
				this.showWhich = 'weixin'
				this.showText = '微信'
			}
			else if(userWay.indexOf('AlipayClient') >= 0){
				this.showWhich = 'alipay'
				this.showText = '支付宝'
			}
		}
	}
</script>
<style lang="scss">
	.storeCard{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		background:#f6f6f6;
		.header{
			width:100%;
			height:0.6rem;
			margin-bottom:2px;
			background:#fff;
			ul{
				display:flex;
				justify-content:space-between;
				align-items:center;
				width:100%;
				height:100%;
				li:nth-child(1){
					display:flex;
					align-items: center;
					width:1.2rem;
					i{
						margin-left:0.15rem;
						font-size:0.2rem;
					}
					span{
						font-size:0.16rem;
						color:#282828;
					}
				}
				li:nth-child(2){
					span{
						font-size:0.18rem;
						color:#282828;
					}
				}
				li:nth-child(3){
					display:flex;
					justify-content: flex-end;
					width:1.2rem;
					span{
						margin-right:0.2rem;
						font-size:0.16rem;
						color:#282828;
						opacity: 0.5;
					}
				}
			}
		}
		/*余额*/
		.restMoney{
			display:flex;
			justify-content: space-between;
			align-items:center;
			width:100%;
			height:0.68rem;
			background:#fff;
			span:nth-child(1){
				margin-left:0.3rem;
				font-size:0.14rem;
				color:#A1A1A1;
			}
			span:nth-child(2){
				margin-right:0.3rem;
				font-size:0.33rem;
				color:#282828;
			}
		}
		/*充值金额*/
		.storeMoney{
			position:relative;
			display: flex;
			justify-content: center;
			width:100%;
			margin-bottom:0.1rem;
			background:#fff;
			ul{
				display:flex;
				flex-wrap: wrap;
				width:95%;
				li{
					display:flex;
					flex-direction:column;
					width:0.88rem;
					height:0.53rem;
					margin-top:0.2rem;
					margin-left:0.225rem;
					margin-bottom:0.1rem;
					border:2px solid #B4B4B4;
					span:nth-child(1){
						display: flex;
						justify-content: center;
						align-items: center;
						width:100%;
						height:50%;
						font-size:0.17rem;
						color:#B4B4B4;
						background:#fff;
					}
					span:nth-child(2){
						display: flex;
						justify-content: center;
						align-items: center;
						width:100%;
						height:50%;
						font-size:0.17rem;
						color:#fff;
						background:#B4B4B4;
					}
				}
				.active{
					border:2px solid #30bfbe;
					span:nth-child(1){
						color: #30bfbe;
					}
					span:nth-child(2){
						background:#30bfbe;
					}
				}
			}
			/*自定义框*/
			.defined{
				width:100%;
				height:0.4rem;
				.defined-text{
					position:absolute;
					top:10%;
					left:3%;
					font-size:0.16rem;
					color:#282828;
				}
				input{
					position:absolute;
					top:-10%;
					left:40%;
					width:50%;
					height:0.4rem;
					padding-left:0.1rem;
					font-size:0.16rem;
					transform: translateX(-20%);
				}
			}
		}
		/*支付方式*/
		.payWay{
			display:flex;
			justify-content: space-between;
			align-items:center;
			width:100%;
			height:0.7rem;
			margin-top:0.1rem;
			background:#fff;
			p:nth-child(1){
				display:flex;
				align-items:center;
				margin-left:0.3rem;
				span{
					margin-left:0.15rem;
					font-size:0.16rem;
					color: #6e6e6e;
				}
				img{
					width:0.25rem;
					height:0.22rem;
				}
			}
			p:nth-child(2){
				display: flex;
				align-items:center;
				margin-right:0.25rem;
				img{
					width:0.2rem;
					height:0.2rem;
				}
			}
		}
		/*支付按钮*/
		.payBtn{
			display: flex;
			flex-direction: column;
			align-items: center;
			width:100%;
			height:0.7rem;
			margin-top:0.2rem;
			.btn{
				display: flex;
				justify-content: center;
				align-items: center;
				width:2.2rem;
				height:0.41rem;
				font-size:0.18rem;
				color:#fff;
				background:#30bfbe;
				border-radius: 6px;
			}
			.btnSilence{
				display: flex;
				justify-content: center;
				align-items: center;
				width:2.2rem;
				height:0.41rem;
				font-size:0.18rem;
				color:#fff;
				background:#ccc;
				border-radius: 6px;
			}
			.money{
				display: flex;
				justify-content: space-between;
				width:2.2rem;
				margin-top:0.1rem;
				span:nth-child(1){
					color:#282828;
					i{
						margin-left:0.05rem;
						font-style:normal;
						color: #30bfbe;
					}
				}
				span:nth-child(2){
					color:#282828;
					i{
						margin-left:0.05rem;
						font-style:normal;
						color: #30bfbe;
					}
				}
			}
		}
		/*出入记录*/
		.record{
			position:fixed;
			top:0;
			left:0;
			display: flex;
			flex-direction: column;
			width:100%;
			height:100%;
			background:#f6f6f6;
			.recordHeader{
				position:relative;
				display: flex;
				justify-content: center;
				align-items: center;
				width:100%;
				height:0.6rem;
				background:#fff;
				.center{
					font-size:0.18rem;
					color: #282828;
				}
				.left{
					position:absolute;
					left:0.15rem;
					top:0.19rem;
					display: flex;
					align-items: center;
					i{
						font-size:0.2rem;
					}
					span{
						font-size:0.16rem;
					}
				}
			}
			/*内容*/
			.recordInner{
				flex:1;
				/*苹果滚动*/
				-webkit-overflow-scrolling : touch;
				overflow: scroll;
				margin-top:0.1rem;
				ul{
					width:100%;
					li{
						display:flex;
						justify-content: space-between;
						align-items: center;
						width:100%;
						height:0.4rem;
						margin-bottom:2px;
						background:#fff;
						span:nth-child(1){
							margin-left:0.25rem;
							font-size:0.14rem;
							color: #6a6a6a;
						}
						.add{
							margin-right:0.2rem;
							font-size:0.14rem;
							color:#f00;
						}
						.del{
							margin-right:0.2rem;
							font-size:0.14rem;
							color:yellowgreen;
						}
					}
				}
			}
		}
		/*提示框*/
		.warnBox{
			position:fixed;
			top:25%;
			left:50%;
			transform: translateX(-50%);
			display:flex;
			flex-direction: column;
			width:2.2rem;
			height:1.2rem;
			background:plum;
			border-radius:10px;
			background:#31C4C3;
			p:nth-child(1){
				display: flex;
				justify-content: center;
				align-items:center;
				width:100%;
				height:50%;
				span{
					font-size:0.17rem;
					color:#fff;
				}
			}
			p:nth-child(2){
				display: flex;
				justify-content: space-around;
				align-items: center;
				width:100%;
				height:50%;
				/*取消按钮*/
				span:nth-child(1){
					display: flex;
					justify-content: center;
					align-items: center;
					width:0.8rem;
					height:0.4rem;
					font-size:0.15rem;
					color:#fff;
					background:#f00;
					border-radius:6px;
				}
				a{
					/*确认安妮*/
					span:nth-child(1){
						display: flex;
						justify-content: center;
						align-items: center;
						width:0.8rem;
						height:0.4rem;
						font-size:0.15rem;
						background:#fff;
						color:#000;
						border-radius:6px;
					}
				}
			}
		}
	}
</style>