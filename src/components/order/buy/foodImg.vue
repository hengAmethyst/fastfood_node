<template>
	<div class="foodImgs" v-show="showFoodImg">
		<!--背景蒙版-->
		<div class="backShadow"></div>
		<!--内容区域-->
		<div class="imgContent">
			<img class="cancel" @click="cancel" src="../../../assets/icons/取消.png"/>
			<!--图片-->
			<div class="bigImg">
				<img :src="food.picUrl"/>
			</div>
			<div class="foodInfo">
				<p class="foodName">
					<span>{{food.name}}</span>
				</p>
				<p class="foodPrice">
					<span><i>￥</i>{{food.price}}</span>
				</p>
				<p class="foodMemberPrice">
					<span>会员<i>￥</i>{{food.memberPrice}}</span>
					<span @click="showDetailPage">选规格</span>
				</p>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data(){
			return{
				showFoodImg:false
			}
		}
		,
		props:['food']
		,
		methods:{
			//点X取消
			cancel(){
				this.showFoodImg = false	
			},
			//来自父组件的方法
			show(){
				this.showFoodImg = true
			},
			showDetailPage(){
				this.showFoodImg = false
				this.$store.state.showDetailPage = true
				this.$store.state.imgToDetail = true
			}
		}
	}
</script>
<style lang="scss">
	.foodImgs{
		position:fixed;
		top:0;
		left:0;
		width:100%;
		height:100%;
		z-index:2001;
		.backShadow{
			width:100%;
			height:100%;
			opacity: 0.5;
			background:#000;
		}
		.imgContent{
			position:fixed;
			top:0.61rem;
			left:5%;
			width:3.4rem;
			height:72%;
			background:#fff;
			border-radius:6px;
			.foodInfo{
				width:100%;
				.foodName{
					margin-top:0.4rem;
					span{
						margin-left:0.15rem;
						font-size:0.2rem;
						color: #282828;
					}
					
				}
				.foodPrice{
					margin-top:0.1rem;
					span{
						margin-left:0.15rem;
						font-size:0.2rem;
						color:#000;
					}
					i{
						font-style:normal;
						font-size:0.16rem;
					}
				}
				.foodMemberPrice{
					display:flex;
					justify-content: space-between;
					align-items: center;
					margin-top:0.08rem;
					span:nth-child(1){
						margin-left:0.15rem;
						font-size:0.14rem;
						color:#f00;
					}
					i{
						font-style:normal;
						font-size:0.12rem;
					}
					span:nth-child(2){
						display: flex;
						justify-content: center;
						align-items: center;
						width:0.6rem;
						height:0.3rem;
						margin-right:0.15rem;
						color:#fff;
						background-color: #31c4c4;
						border-radius: 6px;
					}
				}
				
			}
			/*大图*/
			.bigImg{
				display: flex;
				justify-content:center;
				margin-top:0.5rem;
				img{
					width:3.1rem;
					height:2.3rem;
					border-radius:6px;
				}
			}
			/*取消按钮*/
			.cancel{
				position:absolute;
				top:0.1rem;
				right:0.1rem;
				width:0.15rem;
				height:0.15rem;
			}
		}
	}
</style>