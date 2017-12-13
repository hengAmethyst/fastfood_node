<template>
	<div class="chargeSucceed">
		<div class="header">
			<span>支 付</span>
		</div>
		<div class="img">
			<img src="../../../assets/icons/支付成功@3x.png"/>
			<span>充值成功</span>
		</div>
		<div class="btn">
			<p @click="goInfo">继续点餐</p>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import loadAgain from '../../../js/loadAgain.js'
	import getLocal from '../../../js/getLocal.js'
	export default {
		methods:{
			goInfo(){
				this.$router.push({path:'/order/info'})
			}
		}
		,
		created(){
			//取本地数据
			getLocal(this,'chargeInfo')
			//重新加载数据
			loadAgain(this,Vue)
			//充值成功后发送短信
			let tempChargeMoney = (this.$store.state.chargeMoney/100).toFixed(2)
			let tempActualMoney = (this.$store.state.actualMoney/100).toFixed(2)
           	this.$http.post(this.$store.state.accountHttp+"/jinghan-account/api/user/sendSmsCodeByMerchant",
			JSON.stringify({"reqId":1,"param":{
									"phone":this.$store.state.phoneNumber,
									"merchantId":this.$store.state.merchantId,
									"type":1,
									"childType":112,
									//你的取餐码
									"context":'您的充值'+tempChargeMoney+'元,实际到账'+tempActualMoney+'元'}})
			,{emulateJSON:true})
			.then(function(res){
				console.log(res)
			})
		}
	}
	
</script>
<style lang="scss">
	.chargeSucceed{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		.header{
			display: flex;
			justify-content: center;
			align-items: center;
			width:100%;
			height:0.6rem;
			background:#fff;
			border-bottom:1px solid #f0f0f0;
			span{
				font-size:0.18rem;
				color:#282828;
			}
		}
		.img{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			width:100%;
			height:2.2rem;
			margin-top:0.3rem;
			img{
				width:1.3rem;
				height:1.3rem;
			}
			span{
				margin-left:0.1rem;
				margin-top:0.15rem;
				font-size:0.18rem;
				color:#000;
			}
		}
		/*按钮*/
		.btn{
			display: flex;
			justify-content: center;
			width:100%;
			margin-top:0.2rem;
			p{
				display: flex;
				justify-content: center;
				align-items: center;
				width:2.2rem;
				height:0.41rem;
				font-size:0.2rem;
				color:#fff;
				background:#31C4C3;
				border-radius: 6px;
			}
		}
	}
</style>
