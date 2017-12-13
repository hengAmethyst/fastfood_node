<template>
	<div class="pay">
		<!--nav-->
		<navs :information="information"></navs>
		<!--支付剩余时间-->
		<div class="payTime" v-show="!this.$store.state.nowOrderInfo.timeOut">
			<p>支付剩余时间</p>
			<p>
				<span v-for="item in splitTiem">
					{{item}}
				</span>
			</p>
		</div>
		<!--支付剩余时间-->
		<div class="outPayTime" v-show="this.$store.state.nowOrderInfo.timeOut">
			<p>支付已超时,请重新下单</p>
		</div>
		<!--支付框-->
		<div class="payBox">
			<div class="payBoxInner">
				<p>
					<span>支付金额</span>
					<span v-if="this.$store.state.phoneNumber==null">￥{{this.$store.state.nowOrderInfo.totalPrice}}</span>
					<span v-else>￥{{this.$store.state.nowOrderInfo.memberPrice}}</span>
				</p>
				<p @click="payWayChange">
					<span>{{whichServer}}</span>
					<span>
						<img src="../../../assets/icons/就餐方式-选中.png" v-if="payWay"/>
						<img src="../../../assets/icons/就餐方式-未选中.png" v-if="!payWay"/>
					</span>
				</p>
				<p @click="payWayChange" v-if="this.$store.state.phoneNumber!=null">
					<span>会员卡</span>
					<span class="balance">
						<b>余额 ￥{{this.$store.state.memberBalance}}</b>
						<i v-if="this.$store.state.comparePrice==0">余额不足</i>
						<img src="../../../assets/icons/就餐方式-未选中.png" v-if="payWay&this.$store.state.comparePrice!=0"/>
						<img src="../../../assets/icons/就餐方式-选中.png" v-if="!payWay&this.$store.state.comparePrice!=0"/>
					</span>
				</p>
			</div>
		</div>
		<!--手机号,输入框-->
		<div class="phoneNumber">
			<p>
				<span>手机号码</span>
			</p>
			<input type="text" placeholder="请输入手机号 获取取餐码" v-model = "phoneNumber" maxlength="11"/>
		</div>
		<!--支付-->
		<div class="payBtn">
			<!--微信-->
			<p @click="enterPay" v-show="this.$store.state.payWeChat&showActiveBtn&payWay">支 付</p>
			<!--支付宝-->
			<a v-show='this.$store.state.payAliPay&showActiveBtn&payWay' :href="paymentHttp+'/jinghan-payment/api/ali/wapPay?orderNo=' + orderCode +'&merchantId=' + merchantId + '&billType=10&returnUrl='+this.$store.state.returnUrl+'/jh/order/buy/paySucceed'">
				<p>支 付</p>
			</a>
			<!--会员卡支付-->
			<p v-if="!payWay&showActiveBtn&this.$store.state.phoneNumber!=null" @click="cardPay">支付</p>
		</div>
		<div class="payBtnSlience" v-show="!showActiveBtn">
			<p>支 付</p>
		</div>
		<!--弹框-->
		<alert :showMsg="showMsg" v-if="showAlert"></alert>
	</div>
</template>
<script>
import cookie from '../../../js/cookie.js'
import saveLocal from '../../../js/saveLocal.js'
	export default{
		data(){
			return{
        			//nav组件的控制信息栏
        			information:{name:'支付',ifShowReload:false,ifShowMenu:true},
        			//弹框显示信息
        			showMsg:'订单支付失败',
        			//是否显示alert框
        			showAlert:false,
        			//显示微信或者支付宝图片
        			wayImgStatus:null,
        			//显示微信或者支付宝server
        			whichServer:null,
        			//电话号码
        			phoneNumber:null,
        			//显示active的支付按钮
        			showActiveBtn:false,
        			//支付方式,默认为支付宝和微信
        			payWay:true
			}
		}
		,
		methods:{
			show(){
				this.$store.state.isReward = !this.$store.state.isReward
			},
			payWayChange(){
				//仅当储值卡余额充足时能点
				if(this.$store.state.comparePrice!=0){
					this.payWay = !this.payWay
				}
			},
			//会员卡支付
			cardPay(){
				this.$http.post(this.$store.state.orderHttp+"/jinghan-order/api/snack/v2/bill/offlinePayment",
				JSON.stringify({"param":{
								"merchantId":this.$store.state.merchantId,
								"orderId":this.$store.state.orderId,
								"openId":this.$store.state.openId,
								"billItems":[{
									"channelId":7,
									"channelName":'会员卡',
									"payAmount":this.$store.state.nowOrderInfo.memberPrice*100,
									"changeAmount":0
								}],
								"memberUserId":this.$store.state.memberUserId
							  },'channel':1})
				,{emulateJSON:true})
				.then(function(res){
					console.log(res)
					//如果支付成功
					if(res.body.data){
						this.$store.state.payStatus = true
						this.$store.state.payResult = '支付成功'
					}
					this.$router.push({path:'/order/buy/paySucceed'})
				})
			},
			//微信支付请求
			enterPay(){
				this.$http.post(this.$store.state.paymentHttp+"/jinghan-payment/api/pay/router",
				JSON.stringify({"param":{
								"merchantId":this.$store.state.merchantId,
							    "orderNo": this.$store.state.orderNo,
							    "billType": 10,
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
						this.$store.state.payResult = '支付失败'
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
//					        	  	 alert(res.err_msg);    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
					           }else{
					           	
					           	//支付成功后发短信
					           	that.$http.post(that.$store.state.accountHttp+"/jinghan-account/api/user/sendSmsCodeByMerchant",
								JSON.stringify({"reqId":1,"param":{
														"phone":that.$store.state.hasPhoneNumber,
														"merchantId":that.$store.state.merchantId,
														"type":1,
														"childType":112,
														//你的取餐码
														"context":'您的取餐码是'+that.$store.state.serialNumber}})
								,{emulateJSON:true})
								.then(function(res){
									console.log(res)
								})
					           	//显示支付成功界面
						        	that.$store.state.paySucceed = true
						        	//显示pay的支付按钮
						        	that.$store.state.showPayBtn = true
								that.$store.state.payResult = '支付成功'
					           	that.$router.push({path:'/order/buy/paySucceed'})
					           }
					        }
						)
					}
				})
			}
		}
		,
		created(){
			//openId绑定的电话号码
			this.phoneNumber = this.$store.state.hasPhoneNumber
			//判断用什么浏览器方式打开
			var userWay = navigator.userAgent
			if(userWay.indexOf('MicroMessenger') >= 0){
				this.$store.state.payWeChat = true
				this.wayImgStatus = 1
				this.whichServer = '微信'
			}
			else if(userWay.indexOf('AlipayClient') >= 0){
				this.$store.state.payAliPay = true
				this.wayImgStatus = 2
				this.whichServer = '支付宝'
			}
			//存储信息到本地
			saveLocal(this,'needInfo')
		}
		,
		mounted(){
			console.log('123')
		}
		,
		computed:{
			//显示的总价
			totalPrice(){
				return Number(this.$store.state.needPay).toFixed(2)
			},
			//merchantId
			merchantId(){
				return this.$store.state.merchantId
			},
			//支付的http地址
			paymentHttp(){
				return this.$store.state.paymentHttp
			},
			//时间分割
			splitTiem(){
				let temp = []
				if(this.$store.state.nowOrderInfo.time){
					temp = this.$store.state.nowOrderInfo.time.split('')
				}
				return temp
			},
			//订单code
			orderCode(){
				return this.$store.state.nowOrderInfo.orderCode
			}
		},
		watch:{
			//监控电话号码的变动
			phoneNumber(){
				if(this.phoneNumber.length == 11){
					this.showActiveBtn = true
					this.$store.state.hasPhoneNumber = this.phoneNumber
					saveLocal(this,'needInfo')
				}
				else{
					this.showActiveBtn = false
				}
			}
		}
	}
</script>
<style lang="scss">
	.pay{
		width:100%;
		height:100%;
		background:#f9f9f9;
		/*支付倒计时*/
		.payTime{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width:100%;
			height:0.4rem;
			margin-top:0.1rem;
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
		.payBox{
			display: flex;
			justify-content: center;
			width:100%;
			.payBoxInner{
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: space-between;
				width:3.3rem;
				/*height:1.3rem;*/
				margin-top:0.41rem;
				background:url(../../../assets/icons/支付@3x.png);
				background-size: 100% 100%;
				p:nth-child(1){
					display: flex;
					justify-content: space-between;
					align-items: center;
					width:80%;
					height:0.64rem;
					margin-top:0.1rem;
					border-bottom:2px solid #F9F9F9;
					span:nth-child(1){
						font-size:0.16rem;
						color: #282828;
					}
					span:nth-child(2){
						font-size:0.2rem;
						color: #FF0000;
					}
				}
				p:nth-child(2){
					display: flex;
					justify-content: space-between;
					align-items: center;
					width:80%;
					height:0.64rem;
					span:nth-child(1){
						font-size:0.16rem;
						color: #282828;
					}
					span:nth-child(2){
						display: flex;
						width:0.7rem;
						justify-content: flex-end;
						align-items: center;
						img{
							width:0.18rem;
							height:0.18rem;
						}
					}
				}
				p:nth-child(3){
					display: flex;
					justify-content: space-between;
					align-items: center;
					width:80%;
					height:0.64rem;
					span:nth-child(1){
						font-size:0.16rem;
						color: #282828;
					}
					.balance{
						display: flex;
						justify-content: space-between;
						width:1.2rem;
						color: #A0A0A0;
						b{
							font-weight: normal;
						}
						i{
							margin-left:0.12rem;
							font-style:normal;
							font-size:0.12rem;
							color:#f00;
						}
						img{
							width:0.18rem;
							height:0.18rem;
						}
					}
				}
			}
		}
		/*手机号输入部分*/
		.phoneNumber{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: space-between;
			width:100%;
			height:0.7rem;
			margin-top:0.1rem;
			p{
				width:3rem;
				span{
					margin-left:0.18rem;
					font-size:0.16rem;
					color:#282828;
				}
			}
			input{
				width:2.75rem;
				height:0.35rem;
				padding-left:0.15rem;
				font-size:0.15rem;
				border:none;
			}
		}
		/*支付按钮*/
		.payBtn{
			position:relative;
			display: flex;
			justify-content: center;
			width:100%;
			p{
				position:absolute;
				top:0;
				left:50%;
				transform: translateX(-50%);
				width:2.2rem;
				height:0.41rem;
				margin-top:0.5rem;
				line-height:0.41rem;
				text-align: center;
				font-size:0.18rem;
				color:#fff;
				background: #31C4C3;
				border-radius: 4px;
			}
		}
		/*payBtnSlience*/
		.payBtnSlience{
			position:relative;
			display: flex;
			justify-content: center;
			width:100%;
			p{
				position:absolute;
				top:0;
				left:50%;
				transform: translateX(-50%);
				width:2.2rem;
				height:0.41rem;
				margin-top:0.5rem;
				line-height:0.41rem;
				text-align: center;
				font-size:0.18rem;
				color:#fff;
				background: #ccc;
				border-radius: 4px;
			}
		}
	}
</style>