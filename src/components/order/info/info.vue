<template>
	<div class='info-score'>
		<p class='space'></p>
		<div class="main-info">
			<img :src="this.$store.state.headImgUrl">
			<span class="nickName" v-if="this.$store.state.phoneNumber==null">
				{{this.$store.state.nickName}}
			</span>
			<span class="nickNameMember" v-else>
				{{this.$store.state.nickName}}
				<img src="../../../assets/icons/会员.png"/>
			</span>
		</div>
		<div class="scores-able" v-if="this.$store.state.phoneNumber==null">
			<span class="toBeMember" @click="goRegister">
				点击成为会员
			</span>
		</div>
		<!--两个选项-->
		<div class="twoChoose" v-else>
			<ul>
				<li @click="gotoStoreCard">
					<p>
						<img src="../../../assets/icons/储值卡.png" />
						<span>储值卡</span>
					</p>
					<p>
						<span>余额 ￥{{this.$store.state.memberBalance}}</span>
						<img src="../../../assets/icons/箭头.png" />
					</p>
				</li>
				<li @click="gotoYourInfo">
					<p>
						<img src="../../../assets/icons/个人资料.png"/>
						<span>个人资料</span>
					</p>
					<p>
						<img src="../../../assets/icons/箭头.png" />
					</p>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
	export default{
			data(){
				return{
					
				}
			}
			,
			methods:{
				//去注册页面
				goRegister(){
					this.$router.push({path:'/order/register'})
				},
				//去储值卡
				gotoStoreCard(){
					this.$router.push({path:'/order/storeCard'})
				},
				//去个人资料
				gotoYourInfo(){
					this.$router.push({path:'/order/yourInfo'})
				}
			}
		}
</script>
<style lang='scss'>
	.info-score{
		display: flex;
		flex-direction: column;
		flex:1;
		background:#f6f6f6;
		.space{
			width:100%;
			height:0.2rem;
			background:#f6f6f6;
		};
		.main-info{
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			
			width:100%;
			height:1.65rem;
			background:white;
			img{
				width:0.8rem;
				height:0.8rem;
				margin-top:0.1rem;
				border-radius: 100%;
			}
			.nickName{
				font-size:0.2rem;
				margin-top:0.1rem;
			}
			.nickNameMember{
				margin-left:0.2rem;
				font-size:0.2rem;
				margin-top:0.05rem;
				color: #ff6223;
				img{
					width:0.18rem;
					height:0.16rem;
				}
			}
		}
		.scores-able{
			display:flex;
			justify-content: center;
			width:100%;
			height:0.5rem;
			text-align: center;
			background:#fff;
			.toBeMember{
				display: inline-block;
				width:2.2rem;
				height:0.41rem;
				/*margin-top:0.1rem;*/
				line-height:0.41rem;
				text-align:center;
				font-size:0.2rem;
				color: #30BFBE;
				border: 2px solid #30BFBE;
				border-radius:6px;
			}
		}
		/*两个选项*/
		.twoChoose{
			margin-top:0.12rem;
			ul{
				li:nth-child(1){
					display:flex;
					justify-content: space-between;
					align-items:center;
					width:100%;
					height:0.45rem;
					background:#fff;
					p:nth-child(1){
						display:flex;
						justify-content: center;
						align-items: center;
						margin-left:0.2rem;
						img{
							width:0.16rem;
							height:0.18rem;
						}
						span{
							margin-left:0.09rem;
							font-size:0.15rem;
							color:#282828
						}
					}
					p:nth-child(2){
						display: flex;
						align-items:center;
						margin-right:0.15rem;
						span{
							margin-right:0.1rem;
							font-size:0.15rem;
							color:#A0A0A0;
						}
						img{
							width:0.1rem;
							height:0.16rem;
						}
					}
				}
				li:nth-child(2){
					display:flex;
					justify-content: space-between;
					align-items:center;
					width:100%;
					height:0.45rem;
					margin-top:2px;
					background:#fff;
					p:nth-child(1){
						margin-left:0.2rem;
						img{
							width:0.16rem;
							height:0.13rem;
						}
						span{
							margin-left:0.09rem;
							font-size:0.15rem;
							color:#282828
						}
					}
					p:nth-child(2){
						display: flex;
						align-items:center;
						margin-right:0.15rem;
						img{
							width:0.1rem;
							height:0.16rem;
						}
					}
				}
			}
		}
	}
</style>