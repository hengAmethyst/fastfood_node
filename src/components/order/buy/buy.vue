<template>
<div class="detailBox">
	<div class='buyDetail'>
		
<!--左边菜单list-->
		<div class='menu-wrapper'>
			<ul class='louti_nav'>
				<li style="position:relative" v-if="this.$store.state.boughtList.length>0">
					买过
					<img src="../../../assets/icons/买过.png" style="position:absolute;left:0.08rem;top:50%;transform: translateY(-50%);width:0.15rem;height:0.15rem;"/>
				</li>
				<li style="position:relative">
					热销
					<img src="../../../assets/icons/热销.png" style="position:absolute;left:0.08rem;top:50%;transform: translateY(-50%);width:0.15rem;height:0.15rem;"/>
				</li>
				<li v-for="(item,index) in kind">
					{{item.name}}
					<p v-show="cates[index]">
						<span>{{cates[index]}}</span>
					</p>
				</li>
			</ul>
		</div>
<!--右边食物list-->
		<div class='goods-wrapper'>
			<!--买过的菜品栏-->
			<div class="bought louti" v-if="this.$store.state.boughtList.length>0">
				<ul>
					<div v-for = "item in this.$store.state.boughtList" class="divBox">
						<p class="name">
							<span>{{item.dishesName}}</span>							
						</p>
						<p class="price">
							<span><i>￥</i>{{item.dishesPrice}}/{{food.defaultScaleName}}</span>
							<!--按钮-->
							<boughtNumCon :food="item"></boughtNumCon>
						</p>
					</div>
				</ul>
			</div>
			<!--热销-->
			<div class='louti'>
				<p class="kindName">
					<span>热销</span>
				</p>
				<ul>
					<li v-for="food in this.$store.state.hotList">
						<img class="img" :src="food.picUrl" @click="showFoodImg(food)"/>
						<p>
							<span>
								{{food.name}}
							</span>
							<span>{{food.sellNum}}</span>
							<span>￥{{food.price}}/{{food.defaultScaleName}}</span>
							<span>会员价:￥{{food.memberPrice}}/{{food.defaultScaleName}}</span>
						</p>
						<!--菜品加减按钮-->
						<p @click="showTips(food)">
							<numControl :food="food"  :otherAdd="otherAdd"></numControl> 
						</p>
					</li>
				</ul>
			</div>
			<!--常规按菜品分类-->
			<div class='louti' v-for="(good,index) in foodsList">
				<p class="kindName" v-show="good.length>0">
					<span>{{kind[index].name}}</span>
				</p>
				<ul>
					<li v-for="food in good" v-show="food.categoryName!='套餐'&food.categoryName!='餐具'">
						<img class="img" :src="food.picUrl" @click="showFoodImg(food)"/>
						<p>
							<span>
								{{food.name}}
							</span>
							<span>{{food.sellNum}}</span>
							<span>￥{{food.price}}/{{food.defaultScaleName}}</span>
							<span>会员价:￥{{food.memberPrice}}/{{food.defaultScaleName}}</span>
						</p>
						<!--菜品加减按钮-->
						<p @click="showTips(food)">
							<numControl :food="food"  :otherAdd="otherAdd"></numControl> 
						</p>
						<i class="foodType" v-show="false">{{food.type}}</i>
					</li>
				</ul>
			</div>
		</div>
		<!-- 详情页组件 -->
		<detailPage class="detail" :food="selectedFood" ref="food"></detailPage>
		<!--菜品大图-->
		<foodImg class="foodImg" :food="selectedFood" ref="foodImg"></foodImg>
		<!--加菜时候的加载蒙版-->
		<div class="adding" v-show="this.$store.state.addingIndex">
			<img class="Rotation img" src="../../../../static/imgs/1.png" width="50px" height="50px"/>
		</div>
	</div>
	<!-- 购物车组件 -->
	<shopCart class="shopCart" :selectFoods="selectFoods" :catesList="catesList" :iFlag="iFlag" :affirmToggle="affirmToggle"></shopCart>
</div>
</template>
<script>
import Vue from 'vue'
import shopCart from './shopCart.vue'
import detailPage from './detailPage.vue'
import foodImg from './foodImg.vue'
import boughtNumCon from './boughtNumCon.vue'
export default{
	data(){
		return{
			//存菜品数据
			goods:[],
			//详情页控制开关
			iFlag:false,
			//选中的菜品
			selectedFood:{},
			//是否可以进入确认订单页面
			affirmToggle:{'show':false},
			menuList:[],
			//其他人点菜传入
			otherAdd:0,
			data:{},
			//观察定时器
			setTimeOut:false,
			showIndex:true,
			//购物车数据
			cartItemList:[],
			//图片前缀
			beforeImgUrl:'http://106.15.40.150:9000',
			//存储当前的菜品
			nowFoodsList:[],
			tempCartList:[]
		}
	}
	,
	components:{
		shopCart,
		detailPage,
		foodImg,
		boughtNumCon
	}
	,
    methods:{
    		//展示大图
    		showFoodImg(target){
    			this.selectedFood = target
    			this.$refs.foodImg.show()
    		},
    		showTips(target){
    			this.$store.state.nowFood = target
    			this.selectedFood = target
    			this.$refs.food.show()
    		}
    }
    ,
	created:function(){
		this.nowFoodsList = this.$store.state.foodsList
	}
	,
	updated(){
		let ifFirst = true
		for(let i=0;i<$('.louti_nav li').length;i++){
			if($('.louti_nav li').eq(i).hasClass('active_louti')){
				ifFirst = false
			}
		}
		if(ifFirst){
			$('.louti_nav li').eq(0).addClass('active_louti')
		}
		
		$(".louti_nav li").on("touchstart",(function(){
			//给菜单楼梯加一个高亮样式
			$(this).addClass("active_louti").siblings().removeClass("active_louti");
			//计算距离父元素的高度
			var iTop=$(".louti").eq($(this).index()).position().top;
			//计算前面兄弟元素的滚动高度
			var scrollTop = $(".goods-wrapper").scrollTop();
				$(".goods-wrapper").scrollTop(iTop+scrollTop);
		}))
		//food滚动menu栏跟着变化
		$('.goods-wrapper').scroll(function(){
			$('.louti').each(function(){
				var Top = $(this).position().top;
				if(Top>=-50&&Top<50)
				{
					$('.louti_nav li').eq($(this).index()).addClass('active_louti').siblings().removeClass('active_louti')
				}
			})	
		})
		//如果是套餐li变高
		for(let i=0;i<$('.foodType').length;i++){
			if($('.foodType').eq(i).html()==9){
				$('.foodType').eq(i).parents().eq(0).css("height","1.3rem")
			}
		}
	},
	computed:{
		//菜品展示list
		foodsList(){
			return this.$store.state.foodsList
		},
		//计算选中的商品
		selectFoods(){
			var foods = []
			for(var i=0;i<this.nowFoodsList.length;i++){
				for(var j=0;j<this.nowFoodsList[i].length;j++){
					if(this.nowFoodsList[i][j].count>0){
						foods.push(this.nowFoodsList[i][j])
					}
				}
			}
			return foods
		},
		//总的菜品数量
		allCounts(){
			var foodsCount = 0
			for(var i=0;i<this.$store.state.foodsList.length;i++){
				for(var j=0;j<this.$store.state.foodsList[i].length;j++){
					if(this.$store.state.foodsList[i][j].count>0){
						foodsCount += this.$store.state.foodsList[i][j].count
					}
				}
			}
			return foodsCount
		},
		//菜品数量
		cates(){
			//生成一个长度为种类长度的数组
			var tempCates = []
			for(var i=0;i<this.$store.state.kinds.length;i++){
				tempCates.push(0)
			}
			//每个种类菜品的数量
			for(var i=0;i<this.$store.state.selectFoods.length;i++){
				for(var j=0;j<this.$store.state.kinds.length;j++){
					if(this.$store.state.selectFoods[i].categoryId==this.$store.state.kinds[j].id){
						tempCates[j]+=this.$store.state.selectFoods[i].count
					}
				}
			}
			return tempCates
		},
		//选中菜品分种类
		catesList(){
			var tempCates = []
			let tempIndex = true
			//合并相同菜品相同备注
			if(this.$store.state.localCart.length>0){
				for(let i=this.$store.state.localCart.length-1;i<this.$store.state.localCart.length;i++){
					if(this.$store.state.saveCartList.length>0){
						//当前菜品和购物车中菜品比较，判断是否应该合并
						for(let j=0;j<this.$store.state.saveCartList.length;j++){
							if(this.$store.state.localCart[i].dishesId == this.$store.state.saveCartList[j].dishesId){
								//如果是加菜
								if(this.$store.state.addCart){
									if(this.$store.state.localCart[i].foodTip == this.$store.state.saveCartList[j].foodTip&this.$store.state.localCart[i].foodAttr == this.$store.state.saveCartList[j].foodAttr){
										this.$store.state.saveCartList[j].dishesCount += this.$store.state.localCart[i].dishesCount
										tempIndex = false
										break;
									}
								}
								//如果是减菜
								if(!this.$store.state.addCart){
									if(this.$store.state.localCart[i].foodTip == this.$store.state.saveCartList[j].foodTip&this.$store.state.localCart[i].foodAttr == this.$store.state.saveCartList[j].foodAttr){
										tempIndex = false
										break;
									}
								}
							}
						}
						//如果不满足合并条件,就新建一项
						if(tempIndex){
							if(!this.$store.state.delCart){
								this.$store.state.saveCartList.push(this.$store.state.localCart[i])
							}
						}
					}
					else{
						if(!this.$store.state.delCart){
							this.$store.state.saveCartList.push(this.$store.state.localCart[i])
						}
					}
				}
			}
			//合并相同种类
			for(let i=0;i<this.$store.state.kinds.length;i++){
				tempCates.push([])
			}
			for(let i=0;i<this.$store.state.saveCartList.length;i++){
				if(typeof(this.$store.state.saveCartList[i])!='undefined')
				{
					for(let j=0;j<this.$store.state.kinds.length;j++){
						if(this.$store.state.saveCartList[i].categoryId == this.$store.state.kinds[j].id&this.$store.state.saveCartList[i].dishesCount>0){
							tempCates[j].push(this.$store.state.saveCartList[i])
						}
					}
				}
			}
			return tempCates
		},
		//菜品种类
		kind(){
			return this.$store.state.kinds
		}
	}
	,
	watch:{
		selectFoods(){
			this.$store.state.selectFoods = this.selectFoods 
		},
		allCounts(){
			this.$store.state.allCounts = this.allCounts
		},
		//菜品种类名字
 		beforeCateName(){
	 		this.$store.state.beforeCateName = this.beforeCateName
		},
		//按种类分的cartList
		catesList(){
		 	this.$store.state.catesList = this.catesList
		}
	}
}
</script>
<style scope lang='scss'>
	.detailBox{
		position: relative;
		display: flex;
		flex-direction: column;
		width:100%;
		height:83%;
		flex:1;
	}
	.buyDetail{
		position:relative;
		display:flex;
		width:100%;
		flex:1;
		.menu-wrapper{
			width:0.85rem;
			background:#F9F9F9;
			overflow:scroll;
			/*苹果滚动*/
			-webkit-overflow-scrolling : touch;
			ul{
				li{
					position:relative;
					display: flex;
					flex-direction: column;
					justify-content: center;
					height:0.8rem;
					text-align: center;
					font-size: 0.17rem;
					color: #6A6A6A;
					border-left: 4px solid transparent !important;
					p{
						position:absolute;
						top:18%;
						right:15%;
						width:0.21rem;
						height:0.21rem;
						text-align: center;
						line-height:0.21rem;
						background: #FF0001;
						border-radius:100%;
						span{
							color:#fff;
						}
					}
				}
				.active_louti{
					background:white !important;
					border-left: 4px solid #31C4C3 !important;
					font-weight: bold;
					color: #282828 !important;
				}
			}
		}
		.goods-wrapper{
			/*此处的position用于scroll滚动的定位*/
			position:relative;
			overflow:scroll;
			/*苹果滚动*/
			-webkit-overflow-scrolling : touch;
			flex:1;
			background:#fff;
			/*买过的菜品*/
			.bought{
				width:100%;
				height:0.8rem;
				display: flex;
				align-items:center;
				background: #F0F0F0;
				/*overflow:scroll;*/
				ul{
					display: flex;
					align-items:center;
					width:100%;
					overflow:scroll;
					.divBox{
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						width:1.84rem;
						height:0.64rem;
						margin-right:0.1rem;
						background: #FFFFFF;
						box-shadow: 0 2px 4px 0 rgba(214,207,207,0.50);
						border-radius: 4px;
						/*菜名*/
						.name{
							span{
								margin-left:0.1rem;
								font-size:0.15rem;
								color: #282828;
							}
						}
						/*价格和数量*/
						.price{
							display: flex;
							justify-content: space-around;
							align-items: center;
							span{
								margin-left:0.1rem;
								font-size:0.14;
								color:#f00;
								i{
									font-style:normal;
									font-size:0.12rem;
								}
							}
						}
					}
				}
			}
			/*循环的菜品列表*/
			.louti{
				width:100%;
				/*菜品种类名*/
				.kindName{
					width:100%;
					height:0.3rem;
					line-height:0.3rem;
					background:#f7f7f7;
					span{
						margin-left:0.2rem;
						font-size: 0.13rem;
						color: #6A6A6A;
					}
				}
				li{
					position:relative;
					display:flex;
					height:1rem;
					border-bottom:1px solid #F9F9F9;
					.img{
						width:0.7rem;
						height:0.7rem;
						margin-top:0.15rem;
						margin-left: 0.1rem;
					}
					p:nth-child(2){
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						height:0.7rem;
						margin-top:0.15rem;
						margin-left:0.05rem;
						font-size: 0.16rem;
						color: #282828;
						/*故事书*/
						span:nth-child(1){
							display:block;
							width:1.8rem;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							font-size:0.16rem;
							.book{
								width:0.1rem;
								height:0.1rem;
							}
						}
						/*菜品销售数量*/
						span:nth-child(2){
							display:block;
							margin-top:0.04rem;
							font-size:0.11rem;
							color:#b4b4b4;
						}
						/*原价*/
						span:nth-child(3){
							display:block;
							font-size:0.16rem;
							color:#282828;
						}
						/*会员价*/
						span:nth-child(4){
							display: block;
							font-size:0.12rem;
							color:#ff2c2c;
						}
					}
					p:nth-child(3){
						position:absolute;
						top:0.6rem;
						right:0;
						font-size: 32px;
						color: #282828;
					}
					p:nth-child(4){
						position:absolute;
						bottom:0.1rem;
						left:5%;
						color: #A0A0A0;
					}
				}
			}
			/*按钮加减之后的动画效果*/
			.fold-enter-active{
				/*定义动画延迟的不同时间效果*/
			    transition:bottom 0.5s ease,opacity 8s linear;
			}
			.fold-enter{
				bottom:-10%;
				right:3%;
				width:2.8rem;
				height:0.46rem;
				opacity:0.9;
			}
		}
		/*加菜提示*/
		.addTip{
			position:fixed;
			bottom:9%;
			left:19%;
			display:flex;
			width:2.8rem;
			height:0.6rem;
			background:#fff;
			border-radius:100px;
			line-height: 0.6rem;
			background-size: 100% 100%;
			opacity: 1;
			/*头像*/
			span:nth-child(1){
				display:flex;
				align-items: center;
				width:0.4rem;
				height:100%;
				img{
					width:0.47rem;
					height:0.47rem;
					margin-left:0.05rem;
					border-radius: 100%;
				}
			}
			/*名字*/
			span:nth-child(2){
				display:flex;
				width:0.7rem;
				margin-left:0.15rem;
				font-size:0.13rem;
				color:#282828;
			}
			/*斜杠*/
			span:nth-child(3){
				display: flex;
				justify-content: center;
				width:0.3rem;
				font-size:0.16rem;
				color:#ccc;
			}
			/*菜名*/
			span:nth-child(4){
				display: flex;
				width:0.7rem;
				font-size:0.17rem;
			}
			/*+1or-1*/
			span:nth-child(5){
				font-size:0.17rem;
				color:#EE5A32;
			}
		}
	}
	/*详情页*/
	.detail{
		position:fixed;
		top:0;
		left:0;
	}
	/*加载蒙版*/
	.adding{
		position:fixed;
		left:0;
		top:0;
		display:flex;
		align-items: center;
		justify-content: center;
		width:100%;
		height:100%;
		background:black;
		opacity: 0.2;
		z-index:3000;
		@-webkit-keyframes rotation{
			from {-webkit-transform: rotate(0deg);}
			to {-webkit-transform: rotate(360deg);}
		}
		.Rotation{
			-webkit-transform: rotate(360deg);
			animation: rotation 1.5s linear infinite;
			/*-moz-animation: rotation 1.5s linear infinite;
			-webkit-animation: rotation 1.5s linear infinite;
			-o-animation: rotation 1.5s linear infinite;*/
			border-radius: 100%;
		}
	}
	
	.showChange{
			position:absolute;
			bottom:9%;
			right:0;
			display:flex;
			align-items: center;
			width:2.8rem;
			height:0.46rem;
			opacity:0;
			background: #444E88;
			box-shadow: 0 2px 4px 0 rgba(220,220,220,0.50);
			border-radius: 100px;
			z-index:4;
			img{
				margin-left:0.03rem;
				width:0.4rem;
				height:0.4rem;
				border-radius: 100%;
			}
			.customName{
				margin-left:0.05rem;
				font-size: 0.13rem;
				color: #FFFFFF;
			}
			span:nth-child(3){
				margin-left:0.1rem;
				font-size: 0.17rem;
				color: #FFFFFF;
				b{
					margin-right:0.13rem;
					font-weight: 100;
				}
			}
	}
	
</style>