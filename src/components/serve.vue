<template>
	<div class='serve'>
<!--服务员蒙版-->
	<div class="bg-serve" v-show="showMB" @click="iFlag1=false,iFlag2=false,iFlag3=false,showMB=!showMB"></div>
	<!--加菜时候的加载蒙版-->
	<div class="addings" v-show="this.$store.state.addingIndex">
		<img class="Rotation img" src="../../static/imgs/1.png" width="50px" height="50px"/>
	</div>
<!--用户头像-->
		<div class='server-info'>
			<img :src="this.$store.state.headImgUrl"/>
			<span ref="userName">{{this.$store.state.nickName}}</span>
			<img src="../assets/icons/会员.png" v-show="this.$store.state.phoneNumber!=null"/>
		</div>
<!--刷新，搜索，菜单-->
		<div class='server-menu'>
			<ul>
				<!--菜品检索-->
				<li>
					<router-link to="/order/search">
						<img src="../assets/icons/搜索@3x.png"/>
					</router-link>
				</li>
				<!--我的订单-->
				<li>
					<router-link to="/order/indent">
						<img src="../assets/icons/订单@3x.png"/>
					</router-link>
				</li>
			</ul>
		</div>
		<div></div>
	</div>
</template>
<script>
import {mergeDishes,reloadShopCart} from '../js/merge.js'
import Vue from 'vue'
	export default{
		data(){
			return{
				iFlag1:false,
				iFlag2:false,
				iFlag3:false,
				showMB:false,
				// search的开关
				search:false,
				showTipBox:false,
				//发消息的时间
				msgTime:''
			}
		},
		methods:{
			//控制提示框弹出
			tipBox(){
				var that = this
				this.showTipBox = true
				setTimeout(function(){
					that.showTipBox = false
				},3000)
			},
			reload(){
				this.$store.state.addingIndex = true
				//引入刷新购物车的外部js函数
				var tempVue = Vue
				reloadShopCart(this,tempVue)
						
			},
			clickSever1(){
				if(!this.iFlag1){
					this.showMB=true;
				}
				else{
					this.showMB=false;
				}
				this.iFlag1=!this.iFlag1,
				this.iFlag2=false,
				this.iFlag3=false
			},
			clickSever2(){
				if(!this.iFlag2){
					this.showMB=true;
				}
				else{
					this.showMB=false;
				}
				this.iFlag1=false,
				this.iFlag2=!this.iFlag2,
				this.iFlag3=false
			},
			clickSever3(){
				if(!this.iFlag3){
					this.showMB=true;
				}
				else{
					this.showMB=false;
				}
				this.iFlag1=false,
				this.iFlag2=false,
				this.iFlag3=!this.iFlag3
			},
			//呼叫服务员
			forHelp(){
				this.msgTime = Date.parse(new Date())
				this.tipBox()
				this.$http.post(this.$store.state.orderHttp+"/jinghan-order/serviceMsg/api/order/sendMsgToWaiter",
					JSON.stringify({"param":{"merchantId":this.$store.state.merchantId,"tableId":this.$store.state.tableId,"userId":this.$store.state.userId,"userName":this.$store.state.nickName,"tableName":this.$store.state.tableName,"msgType":1,"callingMsgType":1,"callingTime":this.msgTime},"channel":1})
				,{
					emulateJSON:true  //必须设置这个头文件
				}).then(function(res){
					console.log(res)
				})
			},
			//催菜
			hurry(){
				this.msgTime = Date.parse(new Date())
				this.tipBox()
				this.$http.post(this.$store.state.orderHttp+"/jinghan-order/serviceMsg/api/order/sendMsgToWaiter",
					JSON.stringify({"param":{"merchantId":this.$store.state.merchantId,"tableId":this.$store.state.tableId,"userId":this.$store.state.userId,"userName":this.$store.state.nickName,"tableName":this.$store.state.tableName,"msgType":2,"callingMsgType":1,"callingTime":this.msgTime},"channel":1})
				,{
					emulateJSON:true  //必须设置这个头文件
				}).then(function(res){
				})
			},
			//加水
			addWater(){
				this.msgTime = Date.parse(new Date())
				this.tipBox()
				this.$http.post(this.$store.state.orderHttp+"/jinghan-order/serviceMsg/api/order/sendMsgToWaiter",
					JSON.stringify({"param":{"merchantId":this.$store.state.merchantId,"tableId":this.$store.state.tableId,"userId":this.$store.state.userId,"userName":this.$store.state.nickName,"tableName":this.$store.state.tableName,"msgType":3,"callingMsgType":1,"callingTime":this.msgTime},"channel":1})
				,{
					emulateJSON:true  //必须设置这个头文件
				}).then(function(res){
				})
			},
			//买单
			pay(){
				this.msgTime = Date.parse(new Date())
				this.tipBox()
				this.$http.post(this.$store.state.orderHttp+"/jinghan-order/serviceMsg/api/order/sendMsgToWaiter",
					JSON.stringify({"param":{"merchantId":this.$store.state.merchantId,"tableId":this.$store.state.tableId,"userId":this.$store.state.userId,"userName":this.$store.state.nickName,"tableName":this.$store.state.tableName,"msgType":4,"callingMsgType":1,"callingTime":this.msgTime},"channel":1})
				,{
					emulateJSON:true  //必须设置这个头文件
				}).then(function(res){
				})
			}
		}
		,
		mounted(){
			if(this.$store.state.phoneNumber!=null){
				this.$refs.userName.className = 'memberUser'
			}
			//服务员点击选项
			$('.options1').find('span').click(function(){
				var now = $(this).html()
					$('.shade1').css('display','block')
					$('.shade1').html(now)
				setTimeout(function(){
					$('.shade1').css("display","none")
				},3000)
			})
			$('.options2').find('span').click(function(){
				var now = $(this).html()
					$('.shade2').css('display','block')
					$('.shade2').html(now)
				setTimeout(function(){
					$('.shade2').css("display","none")
				},3000)
			})
			$('.options3').find('span').click(function(){
				var now = $(this).html()
					$('.shade3').css('display','block')
					$('.shade3').html(now)
				setTimeout(function(){
					$('.shade3').css("display","none")
				},3000)
			})
		}
	}
</script>
<style lang='scss'>
	.serve{
		position:relative;
		display:flex;
		justify-content: space-between;
		width:100%;
		height:0.6rem;
		border-bottom:1px solid #f9f9f9;
		background: #fff;
		.bg-serve{
			position: absolute;
			top:0;
			left:0;
			width:100%;
			height:1500%;
			z-index: 2000;
		}
		/*服务员呼叫块*/
		.server-info{
			display: flex;
			align-items:center;
			width:2rem;
			height:100%;
			img:nth-child(1){
				width:0.45rem;
				height:0.45rem;
				margin-left:0.1rem;
				border-radius: 100%;
			}
			span:nth-child(2){
				margin-left:0.1rem;
				font-size:0.16rem;
				color: #282828;
			}
			img:nth-child(3){
				width:0.14rem;
				height:0.11rem;
				margin-left:0.07rem;
			}
			/*会员名字*/
			.memberUser{
				color: #FF6223 !important;
			}
		}
		.tipBox{
			position:fixed;
			top:47%;
			left:36%;
			display:flex;
			align-items: center;
			justify-content: center;
			width:1.42rem;
			height:0.51rem;
			border-radius:6px;
			background:#000;
			opacity:0.7;
			z-index:3001;
			span{
				font-size:0.16rem;
				color:#fff;
			}
		}
		/*功能菜单*/
		.server-menu{
			width:1.7rem;
			height:0.6rem;
			ul{
				width:1.7rem;
				height:0.6rem;
				display:flex;
				justify-content:flex-end;
				align-items:center;
				li{
					display:flex;
					width:0.4rem;
					height:0.4rem;
					margin-left:0.26rem;
					text-align: center;
					line-height:0.4rem;
					a{
						display:flex;
						align-items:center;
						img{
							width:0.24rem;
							height:0.23rem;
						}
					}
				}
			}
		}
	}
</style>