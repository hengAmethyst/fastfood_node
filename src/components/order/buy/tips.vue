<template>
	<div class="tips">
		<div class="nav">
			<p @click="goback">
				<i class='iconfont icon-zuojiantou'></i>
				<span>返回</span>
			</p>
			<p>
				确认订单
			</p>
			<p>
				<span>
					<router-link to="/order/indent">
						<img src="../../../assets/icons/订单@3x.png"/>
					</router-link>
				</span>
			</p>
		</div>
		<div class="label">
			<p class="label-title">
				<span>备注<i>(可多选)</i></span>
			</p>
			<p class="label-inner">
				<span v-for="item in tipLabels" class="tip-inner">{{item.value}}</span>
			</p>
		</div>
		<!--输入框-->
		<div class="inputArea">
			<textarea v-model="input" maxlength="50"></textarea>
			<span>{{input.length}}/50</span>
		</div>
		<!--确定按钮-->
		<div class="submitBtn">
			<p @click="submit">
				确定
			</p>
		</div>
	</div>
</template>
<script>
	import {findTipsId} from '../../../js/memoJoin.js'
	export default {
		data(){
			return{
				input:'',
				tipLabels:[]
			}
		}
		,
		methods:{
			goback(){
				this.$router.push({path:'/order/affirm'})
			},
			submit(){
				let tipsName = ''
				let tipsId = ''
				//备注标签
				for(let i=0;i<$('.label-inner span').length;i++){
        				if($('.label-inner').find('span').eq(i).hasClass('label-active')){
        					tipsName += $('.label-inner span').eq(i).html() + ','
        					tipsId += findTipsId($('.label-inner span').eq(i).html(),this.tipLabels) + ','
        				}
        			}
				//去掉最后的逗号
				this.$store.state.tipsName = tipsName.substr(0,tipsName.length-1)
				this.$store.state.tipsId = tipsId.substr(0,tipsId.length-1)
				this.$store.state.tipsInput = this.input
				this.$store.state.allTipsName = this.$store.state.tipsName +' ' + this.$store.state.tipsInput
				this.$store.state.gotoTipsWords = this.$store.state.allTipsName
				this.$router.push({path:'/order/affirm'})
			}
		}
		,
		created(){
			//备注list
			this.$http.post(this.$store.state.merchantHttp+"/flavorList",
					JSON.stringify({"merchantId":this.$store.state.merchantId})
				,{
					emulateJSON:true  //必须设置这个头文件
				}).then(function(res){
					console.log(res)
					this.tipLabels = res.body.data
				})
		}
		,
		updated(){
			let oSpan = document.getElementsByClassName('tip-inner')
			for(let i=0;i<oSpan.length;i++){
				oSpan[i].onclick = function(){
					if(this.className=='label-active'){
						this.className = 'tip-inner'
					}
					else{
						this.className = 'label-active'
					}
				}
			}
		}
	}
</script>
<style lang="scss">
	.tips{
		width:100%;
		height:100%;
		.nav{
			display: flex;
			align-items:center;
			justify-content: space-between;
			width:100%;
			height:0.6rem;
			p:nth-child(1){
				margin-left:0.15rem;
				i{
					font-size:0.16rem;
				}
				span{
					font-size:0.16rem;
					color:#282828;
				}
			}
			p:nth-child(2){
				font-size:0.2rem;
				color:#282828;
			}
			p{
				img{
					width:0.21rem;
					height:0.23rem;
					margin-right:0.16rem;
				}
			}
		}
		/*标签栏*/
		.label{
			width:100%;
			.label-title{
				display:flex;
				align-items:center;
				width:100%;
				height:0.4rem;
				border-top:solid 0.03rem #F9F9F9;
				span{
					margin-left:0.15rem;
					font-size:0.14rem;
					color:#282828;
					i{
						margin-left:0.04rem;
						font-style:normal;
						font-size:0.13rem;
						color:#F00;
					}
				}
			}
			.label-inner{
				width:100%;
				display: flex;
				flex-wrap:wrap;
				span{
					display:flex;
					align-items:center;
					justify-content:center;
					width:0.7rem;
					height:0.3rem;
					margin-left:0.18rem;
					margin-top:0.18rem;
					font-size:0.16rem;
					color: #A0A0A0;
					border: 1px solid #E4E4E4;
				}
				.label-active{
					color: #31C4C4;
					border: 1px solid #31C4C4;
				}
			}
		}
		.inputArea{
			position:relative;
			display: flex;
			justify-content: center;
			width:100%;
			margin-top:0.15rem;
			textarea{
				width:3.15rem;
				height:0.9rem;
				padding-top:0.15rem;
				padding-left:0.1rem;
				padding-right:0.1rem;
				color: #282828;
				background: #FDFDFD;
				border-radius: 4px;
				border: 1px solid #E4E4E4;
				resize : none;
		  		-webkit-appearance: none;
			}
			span{
				position:absolute;
				bottom:0.06rem;
				right:0.28rem;
				color: #A0A0A0;
			}
		}
		.submitBtn{
			display: flex;
			justify-content: center;
			width:100%;
			margin-top:0.5rem;
			p{
				display:flex;
				justify-content: center;
				align-items: center;
				width:2.2rem;
				height:0.41rem;
				font-size:0.18rem;
				color:#fff;
				background: #30BFBE;
				border-radius: 6px;
			}
		}
	}
</style>