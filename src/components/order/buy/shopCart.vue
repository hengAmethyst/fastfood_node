<template>
	<div class='orderedinfo'>
		<!--总金额-->
		<div class="numInfo">
			<span ref="totalPrice">
				￥{{totalPrice}}
			</span>
		</div>
		<!--成为会员部分-->
		<div class="member" ref="isMember">
			<span ref="memberPrice">会员￥<i>{{totalMemberPrice}}</i></span>
			<span v-show="this.$store.state.phoneNumber==null">
				<router-link to="/order/register">
					成为会员
				</router-link>
			</span>
		</div>
		<!--确认按钮-->
		<div class='checked'>
			<router-link to='/order/affirm'>
				<span>确认</span>
			</router-link>
		</div>
		<!--购物车显示控制按钮-->
		<div class="icons-num" @click="showCart">
			<img src="../../../assets/icons/厨师@3x.png"/>
			<span>{{totalCount}}</span>
		</div>
		<!--购物车蒙版-->
		<div class="shopCartShadow" v-show="this.$store.state.showShadow" @click="closeShadow">
		</div>
		<!--购物车详情-->
		<div class="shopCarDetail" v-show="this.$store.state.showShadow">
			<div class="readyGoods">
				<!--清空按钮部分-->
				<div class="clear">
					<p>
						<span>购物车<i>(共{{totalCount}}份)</i></span>
					</p>
					<p @click="clearOrderCart">
						<img src="../../../assets/icons/清空购物车@3x.png"/>
						<span>清空全部</span>
					</p>
				</div>
				<!--具体菜品-->
				<div class="scroll-area">
					<div class="divide-kinds" v-for="(item,index) in catesList">
						<!--菜品种类名-->
						<p class="kinds-title" v-show="item.length>0">
							<span>{{catesName[index]}}</span>
							<span>共<i>{{catesNum[index]}}</i>份</span>
						</p>
						<!--具体菜品list-->
						<ul v-show="item.length>0">
							<li v-for="(food,order) in item" v-show="food.dishesCount>0">
								<!--菜品名字-->
								<p>
									<span class="normalName">
										{{food.dishesName}}
									</span>
									<span class="foodTip">
										{{food.foodTip}}
									</span>
								</p>
								<!--菜品名称和价格-->
								<p>
									<span>
										￥{{food.oneAllPrice}}
									</span>
									<span>
										会员价￥{{food.oneAllMemberPrice}}
									</span>
								</p>
								<p class="num">
									<cartNumCon :food="food"></cartNumCon>
								</p>
								<!--重复-->
								<p class="moreTimes" v-show="food.count>1">
									<img src="../../../assets/icons/重复-左@3x.png"/>
								</p>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import {mergeDishes} from '../../../js/merge.js'
import Vue from 'vue'
	export default{
		data(){
			return{
			}
		},
		props:['affirmToggle','selectFoods']
		,
		methods:{
			//关闭购物车
			closeShadow(){
				this.$store.state.showShadow = false	
			},
			//显示购物车
			showCart(){
				this.$store.state.showShadow = !this.$store.state.showShadow
			},
			//清空购物车
			clearOrderCart(){
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
			}
		}
		,
		mounted(){
			//会员的名字颜色
			if(this.$store.state.phoneNumber!=null){
				this.$refs.memberPrice.className = 'registed'
			}
			//原价被划
			if(this.$store.state.phoneNumber!=null){
				this.$refs.totalPrice.className = 'lineThrough'
			}
			//会员价显示
			if(this.$store.state.phoneNumber!=null){
				this.$refs.isMember.className = 'isMember'
			}
		}
		,
		computed:{
			//总价
			totalPrice() {
				let total = 0
				this.$store.state.saveCartList.forEach((food) => {
					total += Number(food.dishesPrice*food.dishesCount+food.sideDishesPrice*food.dishesCount+food.cuisinePrice*food.dishesCount)
				})
				return total.toFixed(2)
			},
			//会员价
			totalMemberPrice(){
				let total = 0
				this.$store.state.saveCartList.forEach((food) => {
					total += Number(food.memberPrice*food.dishesCount+food.sideMemberPrice*food.dishesCount+food.cuisinePrice*food.dishesCount)
				})
				return total.toFixed(2)
			},
			//总数量
			totalCount(){
				let count = 0
				this.$store.state.catesList.forEach((food) => {
					food.forEach((item) => {
						count += item.dishesCount
					})
				})
				return count
			},
			//菜品种类名字
			catesName(){
				let newArry = []
				for(let i=0;i<this.$store.state.catesList.length;i++){
					if(this.$store.state.catesList[i].length>0){
						newArry.push(this.$store.state.catesList[i][0].categoryName)
					}
					else{
						newArry.push(null)
					}
				}
				return newArry
			},
			//菜种的数量
			catesNum(){
				//生成一个长度为种类长度的数组
				let tempCatesNums = []
				for(let i=0;i<this.$store.state.catesList.length;i++){
					tempCatesNums.push(0)
				}
				//每个种类菜品的数量
				for(let i=0;i<this.$store.state.catesList.length;i++){
					for(let j=0;j<this.$store.state.catesList[i].length;j++){
						tempCatesNums[i] += this.$store.state.catesList[i][j].dishesCount
					}
				}
				return tempCatesNums
			},
			//购物车中的菜品栏数量
			foodListNum(){
				let num = 0
				for(let i=0;i<this.$store.state.catesList.length;i++){
					num += this.$store.state.catesList[i].length
				}
				return num
			},
			//按种类购物车需要显示list
			catesList(){
				return this.$store.state.catesList
			}
		}
		,
		watch:{
			selectFoods:function(){
				if(this.foodListNum>5){
					$('.scroll-area').css({'height':'4.5rem','overflow':'scroll'})
         		}
				else{
					$('.scroll-area').css({'height':''})
				}
			},
			//购物车总价
			totalPrice(){
				this.$store.state.cartPrice = this.totalPrice
			},
			//购物车会员价
			totalMemberPrice(){
				this.$store.state.cartMemberPrice = this.totalMemberPrice
			}
		}
	}
</script>
<style lang='scss'>
	.orderedinfo{
		position:relative;
		width:100%;
		height:0.5rem;
		background:white;
		border-top:1px solid #F6F6F6;
		.numInfo{
			position:relative;
			display:flex;
			margin-left:0.6rem;
			line-height:0.46rem;
			span:nth-child(1){
				font-size: 0.18rem;
				color: #282828;
			};
			/*会员就加下划线*/
			.lineThrough{
				font-size: 0.18rem;
				text-decoration:line-through;
				color:#6A6A6A;
			}
			span:nth-child(2){
				position:absolute;
				top:5%;
				right:40%;
				margin-left:0.8rem;
				font-family: PingFangSC-Regular;
				font-size: 0.15rem;
				color: #282828;
				i{
					display:inline-block;
					width:0.16rem;
					text-align: center;
					font-style:normal;
				}
			}
		}
		/*会员提醒*/
		.member{
			position:absolute;
			top:15%;
			left:40%;
			display:flex;
			flex-direction: column;
			align-items:center;
			justify-content: center;
			span:nth-child(1){
				font-size:0.12rem;
				color: #FF0001;
				i{
					font-style:normal;
				}
			}
			.registed{
				display: inline-block;
				margin-top:0.12rem;
				i{
					font-size:0.12rem !important;
				}
			}
			span:nth-child(2){
				display:flex;
				justify-content: center;
				align-items: center;
				width:0.7rem;
				height:0.15rem;
				text-align: center;
				color: #31C4C3;;
				border: 1px solid #31C4C3;
				border-radius: 80px;
				a{
					color: #31C4C3;
				}
			}
		}
		/*是会员时候会员价显示*/
		.isMember{
			position:absolute;
			top:-6%;
			left:40%;
			display:flex;
			flex-direction: column;
			align-items:center;
			span:nth-child(1){
				font-size:0.14rem;
				color: #FF0001;
				i{
					font-style:normal;
					font-size:0.16rem;
				}
			}
			.registed{
				display: inline-block;
				margin-left:0.05rem;
				margin-top:0.16rem;
			}
			span:nth-child(2){
				display:inline-block;
				width:0.7rem;
				height:0.15rem;
				text-align: center;
				line-height:0.15rem;
				margin-left:0.1rem;
				color: #31C4C3;;
				border: 1px solid #31C4C3;
				border-radius: 80px;
				a{
					color: #31C4C3;
				}
			}
		}
		.checked{
			position:absolute;
			right:0;
			bottom:0;
			display:inline-block;
			width:0.94rem;
			height:100%;
			text-align: center;
			background: #31C4C3;
			span{
				line-height: 0.45rem;
				text-align: center;
				font-family: PingFangSC-Regular;
				font-size:0.18rem;
				color:white;
			}
		};
		.icons-num{
			position:absolute;
			top:-16%;
			left:2%;
			z-index: 2000;
			img{
				width:0.48rem;
				height:0.48rem0000000;
			}
			span{
				position:absolute;
				top:-8%;
				left:78%;
				width:0.21rem;
				height:0.21rem;
				text-align: center;
				line-height:0.21rem;
				color:#fff;
				background:#FF0001;
				border-radius: 100%;
			}
		};
		.shopCartShadow{
			position:absolute;
			top:-1400%;
			left:0;
			width:100%;
			height:1400%;
			background:black;
			opacity:0.5;
		};
		/*购物车菜品详情*/
		.shopCarDetail{
				position:absolute;
				bottom:100%;
				left:0;
				width:100%;
				.warn{
					position:absolute;
					top:-0.6rem;
					width:100%;
					height:0.6rem;
					background:#F0F0F0;
					z-index:1999;
					p{
						position:absolute;
						top:0.1rem;
						display: flex;
						align-items: center;
						margin-left:0.2rem;
						span:nth-child(1){
							display:inline-block;
							width:0.18rem;
							height:0.18rem;
							background:#D8D8D8;;
							border-radius: 100%;
						}
						span:nth-child(2){
							display: inline-block;
							margin-left:0.1rem;
							font-family: PingFangSC-Regular;
							font-size: 0.16rem;
							color: #5A5A5A;
						}
					}
				};
				.readyGoods{
					.clear{
						display: flex;
						justify-content: space-between;
						align-items: center;
						width:100%;
						height:0.4rem;
						background: #F9F9F9;
						p:nth-child(1){
							span{
								margin-left:0.1rem;
								font-size:0.17rem;
								color: #282828;
								i{
									margin-left:0.08rem;
									font-style:normal;
									font-size:0.15rem;
									color:#6A6A6A;
								}
							}
						}
						p:nth-child(2){
							display: flex;
							align-items:center;
							span{
								margin-right:0.1rem;
								font-size:0.14rem;
								color:#6A6A6A;
							}
							img{
								width:0.16rem;
								height:0.16rem;
								margin-right:0.04rem;
							}
						}
					}
					.scroll-area{
						/*苹果滚动*/
						-webkit-overflow-scrolling : touch;
						.divide-kinds{
							width:100%;
							.kinds-title{
								display: flex;
								justify-content:space-between;
								width:100%;
								height:0.3rem;
								line-height:0.3rem;
								background: #F0F0F0;
								span:nth-child(1){
									margin-left:0.15rem;
									font-size:0.14rem;
									color:#6A6A6A;
								}
								span:nth-child(2){
									margin-right:0.2rem;
									font-size:0.14rem;
									color:#6A6A6A;
									i{
										display:inline-block;
										text-align: center;
										width:0.2rem;
										font-style:normal;
									}
								}
							}
							ul{
								width:100%;
								li{
									position:relative;
									display: flex;
									align-items: center;
									width:100%;
									height:0.7rem;
									background:#fff;
									border-bottom:1px solid #f6f6f6;
									/*菜品名字*/
									p:nth-child(1){
										display:flex;
										flex-direction:column;
										width:1.12rem;
										height:0.7rem;
										margin-left:0.1rem;
										.normalName{
											width:100%;
											margin-top:0.1rem;
											font-size:0.14rem;
											color: #282828;
											text-overflow: ellipsis;
										 	display: -webkit-box;
										  	-webkit-line-clamp: 2;
										 	-webkit-box-orient: vertical;
										  	overflow: hidden;
										}
										.foodTip{
											font-size:0.12rem;
											color: #A0A0A0;
											text-overflow: ellipsis;
										 	display: -webkit-box;
										  	-webkit-line-clamp: 2;
										 	-webkit-box-orient: vertical;
										  	overflow: hidden;
										}
										.overName{
											display:flex;
											width:100%;
											height:0.4rem;
											line-height:0.4rem;
											font-size:0.16rem;
											color: #282828;
										}
									}
									/*菜品价格*/
									p:nth-child(2){
										display:flex;
										flex-direction: column;
										justify-content: space-around;
										width:1.1rem;
										height:0.4rem;
										margin-left:0.42rem;
										span:nth-child(1){
											font-size:0.16rem;
											color: #282828;
										}
										span:nth-child(2){
											color:#f00;
										}
									}
									.moreTimes{
										position:absolute;
										top:0;
										left:0;
										img{
											width:0.27rem;
											height:0.27rem;
										}
									}
									.num{
										position:absolute;
										right:0;
										top:50%;
										transform:translateY(-50%)
									}
									/*小菜价格*/
									.cakes{
										position:absolute;
										top:70%;
										right:26%;
										span{
											font-size:0.14rem;
											color:#EE5A32;
										}
									}
								}
							}
						}
					}
				}
			}
	}
</style>