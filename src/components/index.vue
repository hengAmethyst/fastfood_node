<template>
	<div class='index'>
		<div class="orderBox" v-show="!showMember">
			<!--welcome-->
			<div class='welcome' ref="div">
				<div class='welcome-1'>欢迎光临</span></div>
				<div class='restaurant'>{{this.$store.state.merchantName}}</div>
			</div>
			<!--头像-->
			<div class="headImg">
				<div class='touxiang'>
					<img :src="this.$store.state.headImgUrl"/>
					<span>{{this.$store.state.nickName}}</span>
				</div>
			</div>
			<!--按钮-->
			<div class='beforeOrder'>
				<router-link to='/order/buy'>
					<el-button class='order' type='primary'>我要点餐</el-button>
				</router-link>
			</div>
			<!--背景-->
			<div class="bg"></div>
			<!--会员按钮-->
			<div class="beforeRegister">
				<router-link to='/order/indent'>
					<el-button class='register' type='primary'>我要取餐</el-button>
				</router-link>
			</div>
			<!--version-->
			<div class="version">
				<p>晶彩自助点餐系统V2.0</p>
			</div>
			<!--成为会员入口-->
			<div class="toBeMember" v-if="this.$store.state.phoneNumber==null">
				<p @click="toBeMember">激活会员>></p>
			</div>
			<div class="memberCenter" v-else>
				<p @click="toMemberCenter">
					<img src="../assets/icons/huiyuan.png" alt="会员中心" />
					<span>会员中心</span>
				</p>
			</div>
		</div>
		<div class="memberBox" v-show="showMember">
			<div class="header">
				<span>{{header}}</span>
			</div>
			<!--图片-->
			<div class="img">
				<img src="../assets/icons/支付成功@3x.png" alt="" />
				<span>{{status}}</span>
			</div>
			<div class="gotoMemberCenter">
				<p @click="gotoMemberCenter">会员中心</p>
			</div>
		</div>
	</div>
</template>
<script>
import {splitMerchantInfo,splitUserInfo} from '../js/splitInfo.js'
import {getURLParam} from '../js/splitInfo.js'
import Vue from 'vue'
import cookie from '../js/cookie.js'
import {getCurrentTime,getCurrentDay} from '../js/getCurrentTime.js'
//引入loadAgain
import loadAgain from '../js/loadAgain.js'

	export default{
		data(){
			return{
				// 菜品种类
				kind:[],
				showMember:false,
				header:'会员登录',
				status:'登录成功',
				uniquenessSign:null,
				orderId:null
			}
		}
		,
		methods:{
			//跳转到会员注册
			toBeMember(){
				this.$router.push({path:'/order/register'})
			},
			//跳转到会员中心
			toMemberCenter(){
				this.$router.push({path:'order/info'})
			},
			//会员登录后跳转到会员中心
			gotoMemberCenter(){
				//重新加载基础信息
				loadAgain(this,Vue)
				this.showMember = false
				this.$router.push({path:'order/info'})
			}
		}
		,
		created(){
				var localUrl = window.location.href
				//取本地存储，判断是不是PC端会员登录
				var tempVip = JSON.parse(sessionStorage.getItem('merchantInfo1'))
				//tempIndex暂时存储vip标记
				let tempIndex = '0'
				if(tempVip){
					tempIndex = tempVip.vip
				}
				else{
					tempIndex = '111'
				}
				//会员登录
				if(localUrl.indexOf('vip') > 0 | tempIndex=='vip'){
					//没有openId，即刚进入或者从本地拿到资源
					if(localUrl.indexOf('openId') < 0){
						//调用splitMerchantInfo函数分解url里面的ID值
						this.$store.state.merchantId = getURLParam('merchantId',localUrl)
						this.uniquenessSign = getURLParam('uniquenessSign',localUrl)
						this.orderId = getURLParam('orderId',localUrl)
						//获取商铺Name和商铺图片
						this.$http.post(this.$store.state.orderHttp+"/jinghan-order/api/order/merchantInfo/getMerchantRegisterInfoByMerchantId",
						JSON.stringify({"param":{"merchantId":this.$store.state.merchantId},"channel":1})
						,{emulateJSON:true})
						.then(function(res){
							//如果有商铺图片
							if(res.body.data.merchantPictureList){
								this.$store.state.merchantPicUrl = res.body.data.merchantPictureList
							}
							else{
								this.$store.state.ifHasPic = false
							}
						})
						//暂存店铺信息、设备号、订单Id、vip记号
						let merchantInfo = {
										merchantId:this.$store.state.merchantId,
										merchantPicUrl:this.$store.state.merchantPicUrl,
										uniquenessSign:this.uniquenessSign,
										orderId:this.orderId,
										vip:'vip'
									}
						merchantInfo = JSON.stringify(merchantInfo)
						//保存到本地localStorage
						sessionStorage.setItem('merchantInfo1',merchantInfo)
						//取本地openId
						let tempInfo = JSON.parse($.fn.cookie('openId1'))
						if(!tempInfo){
							window.location.href="https://pay.jinghanit.com/jinghan-payment/api/h5/index?merchantId="+this.$store.state.merchantId+"&returnUrl="+this.$store.state.returnUrl
						}
						else{
							this.$store.state.openId = tempInfo.openId
							this.$store.state.nickName = tempInfo.nickName
							this.$store.state.userId = tempInfo.nickName
							this.$store.state.headImgUrl = tempInfo.headImgUrl
							//根据openId获取手机号，用于接下来的order端的会员登录
							this.$http.post(this.$store.state.accountHttp+'/jinghan-account/api/user/queryByOpenId',
							JSON.stringify({"param":{"openId":this.$store.state.openId,"merchantId":this.$store.state.merchantId},"channel":1}),
							{emulateJSON:true})
							.then(function(res){
								console.log(res)
								//会员电话
								let phoneNumber = res.body.data.phone
								//是会员时
								if(phoneNumber!=0){
									this.showMember = true
									//参数
									let tempParam = {"param":
													{"merchantId":this.$store.state.merchantId,
													 "orderId":this.orderId,
													 "memberPhoneNumber":phoneNumber,
													 "openId":this.$store.state.openId,
													 "uniquenessSign":this.uniquenessSign},
													 "channel":1}
									//会员登录
									this.$http.post(this.$store.state.orderHttp+"/jinghan-order/api/snack/v2/account/memberLogin",
										JSON.stringify(tempParam)
									,{emulateJSON:true})
									.then(function(res){
										console.log(res)
									})
								}
								//非会员时，跳转到会员注册界面
								else{
									loadAgain(this,Vue)
									this.$router.push({path:'/order/register'})
								}
							})
						}
					}
					//有openId，从后台跳转过来
					else {
						//到本地取商铺信息
						let tempMerchant = JSON.parse(sessionStorage.getItem('merchantInfo1'))
							this.$store.state.merchantId = tempMerchant.merchantId
							this.$store.state.merchantPicUrl = tempMerchant.merchantPicUrl
							this.uniquenessSign = tempMerchant.uniquenessSign
							this.orderId = tempMerchant.orderId
						//分解用户信息
						//调用splitUserInfo函数分解url中的用户信息
						var tempUserInfo = splitUserInfo(localUrl)
							this.$store.state.openId = tempUserInfo.openId
							this.$store.state.nickName = tempUserInfo.nickName
							this.$store.state.userId = tempUserInfo.nickName
							this.$store.state.headImgUrl = tempUserInfo.headImgUrl
						//保存用户信息到本地local
						tempUserInfo = JSON.stringify(tempUserInfo)
						$.fn.cookie('openId1', tempUserInfo , { expires: 1 })
						//获取商铺Name和商铺图片
						this.$http.post(this.$store.state.orderHttp+"/jinghan-order/api/order/merchantInfo/getMerchantRegisterInfoByMerchantId",
							JSON.stringify({"param":{"merchantId":this.$store.state.merchantId},"channel":1})
						,{emulateJSON:true})
						.then(function(res){
							//如果商铺宣传图片存在
							if(res.body.data.merchantPictureList){
								this.$store.state.merchantPicUrl = res.body.data.merchantPictureList
							}
							else{
								this.$store.state.ifHasPic = false
							}
							this.$store.state.merchantName = res.body.data.name
						})
						//根据openId获取手机号
						this.$http.post(this.$store.state.accountHttp+'/jinghan-account/api/user/queryByOpenId',
						JSON.stringify({"param":{"openId":this.$store.state.openId,"merchantId":this.$store.state.merchantId},"channel":1}),
						{emulateJSON:true})
						.then(function(res){
							console.log(res)
							//会员电话
							let phoneNumber = res.body.data.phone
							if(phoneNumber != 0){
								this.showMember = true
								//参数
								let tempParam = {"param":
												{"merchantId":this.$store.state.merchantId,
												 "orderId":this.orderId,
												 "memberPhoneNumber":phoneNumber,
												 "openId":this.$store.state.openId,
												 "uniquenessSign":this.uniquenessSign},
												 "channel":1}
								//会员登录
								this.$http.post(this.$store.state.orderHttp+"/jinghan-order/api/snack/v2/account/memberLogin",
									JSON.stringify(tempParam)
								,{emulateJSON:true})
								.then(function(res){
									console.log(res)
								})
							}
							else{
								loadAgain(this,Vue)
								this.$router.push({path:'/order/register'})
							}
						})
					}
				}
				//点餐
				else{
					//判断是否为调试模式
					if(localUrl.indexOf('localhost') < 0 & localUrl.indexOf('192.168') < 0){
						//没有openId，即刚进入或者从本地拿到资源
						if(localUrl.indexOf('openId') < 0){
							//调用splitMerchantInfo函数分解url里面的ID值
							let saveMerchantInfo = splitMerchantInfo(localUrl)
							this.$store.state.merchantId = saveMerchantInfo.merchantId
							//获取商铺Name和商铺图片
							this.$http.post(this.$store.state.orderHttp+"/jinghan-order/api/order/merchantInfo/getMerchantRegisterInfoByMerchantId",
								JSON.stringify({"param":{"merchantId":this.$store.state.merchantId},"channel":1})
							,{emulateJSON:true})
							.then(function(res){
								if(res.body.data.merchantPictureList){
									this.$store.state.merchantPicUrl = res.body.data.merchantPictureList
								}else{
									this.$store.state.ifHasPic = false
								}
								this.$store.state.merchantName = res.body.data.name
							})
							var merchantInfo = {
												merchantId:this.$store.state.merchantId,
												merchantPicUrl:this.$store.state.merchantPicUrl
												}
							merchantInfo = JSON.stringify(merchantInfo)
							//保存到本地localStorage
							sessionStorage.setItem('merchantInfo',merchantInfo)
							//取本地openId
							var tempInfo = JSON.parse($.fn.cookie('openId'))
							if(!tempInfo){
								window.location.href="https://pay.jinghanit.com/jinghan-payment/api/h5/index?merchantId="+this.$store.state.merchantId+"&returnUrl="+this.$store.state.returnUrl           
							}
							else{
								this.$store.state.openId = tempInfo.openId
								this.$store.state.nickName = tempInfo.nickName
								this.$store.state.userId = tempInfo.nickName
								this.$store.state.headImgUrl = tempInfo.headImgUrl
							}
						}
						//有openId，从后台跳转过来
						else {
							//到本地取商铺信息
							var tempMerchant = JSON.parse(sessionStorage.getItem('merchantInfo'))
								this.$store.state.merchantId = tempMerchant.merchantId
								this.$store.state.merchantPicUrl = tempMerchant.merchantPicUrl
							//分解用户信息
							//调用splitUserInfo函数分解userInfo
							var tempUserInfo = splitUserInfo(localUrl)
								this.$store.state.openId = tempUserInfo.openId
								this.$store.state.nickName = tempUserInfo.nickName
								this.$store.state.userId = tempUserInfo.nickName
								this.$store.state.headImgUrl = tempUserInfo.headImgUrl
							//保存用户信息到本地local
							tempUserInfo = JSON.stringify(tempUserInfo)
							$.fn.cookie('openId', tempUserInfo , { expires: 1 })
							//获取商铺Name和商铺图片
							this.$http.post(this.$store.state.orderHttp+"/jinghan-order/api/order/merchantInfo/getMerchantRegisterInfoByMerchantId",
								JSON.stringify({"param":{"merchantId":this.$store.state.merchantId},"channel":1})
							,{emulateJSON:true})
							.then(function(res){
								if(res.body.data.merchantPictureList){
									this.$store.state.merchantPicUrl = res.body.data.merchantPictureList
								}
								else{
									this.$store.state.ifHasPic = false
								}
								this.$store.state.merchantName = res.body.data.name
							})
						}
					}
					//调试模式
					else{
						this.$store.state.merchantName = '晶汉'
						this.$store.state.tableName = '123456789'
						//处理url
						var tempStr = "http://192.168.2.120:8080/?openId=xc11oHixf1I3YSbysaNdeKPRNae60D90&nickName=Amethyst14&headimgurl=http://wx.qlogo.cn/mmopen/w74oVdmaFCpqjG86vAaGlal3z4mYDfo1wV2vsEV8HnO9cXwPjMZKfjWpXfYIcJBPEibFneaibsyp1WQic0raZr3CRQXycGKg5/0&sex=1"
						this.$store.state.openId = getURLParam('openId',tempStr)
						this.$store.state.nickName = getURLParam('nickName',tempStr)
						this.$store.state.headImgUrl = "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496731612415&di=2642c6b42fcb1c394e2384c3e25a9d25&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201604%2F07%2F20160407173608_fmN2B.thumb.700_0.jpeg"
						this.$store.state.userId = getURLParam('nickName',tempStr)
					}
					//加载信息
					loadAgain(this,Vue)
				}
		}
		,
		mounted(){
			
		}
	}
		
</script>
<style lang='scss'>
	.index{
		position:relative;
		display:flex;
		flex-direction: column;
		width:100%;
		height:100%;
		.orderBox{
			.welcome{
				position:absolute;
				top:-3%;
				width:100%;
				.welcome-1{
					text-align: center;
					width:1.5rem;
					margin:0.88rem auto 0 auto;
					font-family: PingFangSC-Semibold;
					font-size: 0.24rem;
					color: #282828;
					span{
						color:orange;
					}
				};
				.restaurant{
					width:2rem;
					margin:0.1rem auto 0 auto;
					text-align: center;
					font-size:0.2rem;
					color: #5A5A5A;
				}
			}
			.headImg{
				position:absolute;
				top:48%;
				width:100%;
				display: flex;
				justify-content: center;
				.touxiang{
					display:flex;
					flex-direction:column;
					align-items:center;
					text-align: center;
					img{
						display:block;
						width:0.6rem;
						height:0.6rem;
						border-radius: 100%;
					}
					span{
						font-size: 0.16rem;
						color: #282828;
					}
				}
			}
			.beforeOrder{
				position:absolute;
				bottom:18%;
				width:100%;
				.order{
					display:block;
					width:2.2rem;
					height:0.41rem;
					margin:0 auto;
					line-height: 0.24rem;
					border:0;
					background: #EE5A32;
					span{
						font-size:0.18rem;
					}
				}
			}
			.wifiTop{
				position:absolute;
				bottom:18%;
				width:100%;
				display: flex;
				justify-content: center;
				.wifi{
					p{
						margin-top:0.1rem;
						font-size:0.16rem;
						color:#6A6A6A;
						span{
							display: flex;
							display:inline-block;
							justify-content: center;
							width:0.5rem;
							height:0.21rem;
							i{
								display: inline-block;
								width:100%;
								height:100%;
								font-style:normal;
								font-size:0.15rem;
							}
						}
					}
				}
			}
			.beforeOrder{
				position:absolute;
				bottom:28%;
				width:100%;
				.order{
					display:block;
					width:2.2rem;
					height:0.41rem;
					margin:0 auto;
					line-height: 0.24rem;
					border-radius:6px;
					background: #30BFBE;
					span{
						font-size:0.18rem;
					}
				}
			}
			.version{
				position:absolute;
				bottom:0;
				left:0;
				width:100%;
				p{
					width:100%;
					margin-bottom:0.1rem;
					text-align: center;
					color: #6A6A6A;
				}
			}
			/*register按钮*/
			.beforeRegister{
				position:absolute;
				bottom:20%;
				width:100%;
				height:0.41rem;
				.register{
					position: absolute;
					top:0;
					left:21%;
					display:block;
					width:2.2rem;
					height:0.41rem;
					line-height: 0.18rem;
					border: 1px solid rgba(49,196,195,0.5);
					border-radius:6px;
					background:#fff;
					span{
						font-size:0.18rem;
						color:#31C4C3;
					}
				}
			}
			/*成为会员入口*/
			.toBeMember{
				position:absolute;
				top:0.1rem;
				right:0.15rem;
				p{
					font-size:0.15rem;
					color: #FF6223;
				}
			}
			/*会员中心*/
			.memberCenter{
				position:absolute;
				top:0.1rem;
				right:0.15rem;
				p{
					display:flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					img{
						width:0.3rem;
						height:0.25rem;
					}
				}
			}
			/*背景*/
			.bg{
				width:100%;
				height:100%;
				background-image:url('../assets/imgs/background1.jpg');
				background-size: 100% 100%;
				opacity: 0.5;
				z-index: -1;
			}
		}
		.memberBox{
			position:relative;
			display:flex;
			flex-direction: column;
			width:100%;
			.header{
				display: flex;
				justify-content: center;
				align-items: center;
				width:100%;
				height:0.6rem;
				background:#fff;
				border-bottom:1px solid #F6F6F6;
				span{
					font-size:0.2rem;
					color:#282828;
				}
			}
			/*图片*/
			.img{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width:100%;
				margin-top:0.4rem;
				img{
					width:1.3rem;
					height:1.3rem;
				}
				span{
					margin-top:0.3rem;
					margin-left:0.05rem;
					font-size:0.2rem;
					color:#282828;
				}
			}
			.gotoMemberCenter{
				display: flex;
				justify-content: center;
				align-items: center;
				width:100%;
				margin-top:0.2rem;
				p{
					display: flex;
					justify-content: center;
					align-items: center;
					width:2.2rem;
					height:0.41rem;
					border-radius:6px;
					background: #30BFBE;
					color:#fff;
					font-size:0.18rem;
					border-radius: 6px;
				}
			}
		}
	}
</style>