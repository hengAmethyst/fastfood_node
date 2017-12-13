<template>
	<div class="numControl">
		<div class="block">
			<!--用来占位-->
			<span class="space" v-show="!food.count"></span>
			<span class="space-num" v-show="!food.count"></span>
			<img src="../../../assets/icons/减去商品@3x.png" class="icon iconfont icon-jian" v-show="food.count>0" @click.stop.prevent="decreaseCart"/>
			<span v-show="food.count>0" class="numCount">{{food.count}}</span>
			<img src="../../../assets/icons/加上商品@3x.png" class="icon iconfont icon-plus" @click="addCart"/>
		</div>
		<div class="delTip" v-show="showDelTip">
			<span>多规格商品只能去购物车删除哦</span>
			<i></i>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
	export default{
		data(){
			return{
				showDelTip:false
			}
		}
		,
		props:['food','otherAdd']
		,
	    	methods:{
		    addCart(){
		    		this.$store.state.showDetailPage = true
		    		//判断当前选中菜品的默认项价格
		    		for(let i=0;i<this.food.specificationList.length;i++){
		    			if(this.food.specificationList[i].isDefault == 0){
		    				this.$store.state.initSomePrice.scalePrice = (this.food.specificationList[i].itemPrice/100).toFixed(2)
		    				this.$store.state.initSomePrice.scalePrice = (this.food.specificationList[i].itemPrice/100).toFixed(2)
		    			}
		    		}
		    		for(let i=0;i<this.food.makingList.length;i++){
		    			if(this.food.makingList[i].isDefault == 0){
		    				this.$store.state.initSomePrice.cuisinePrice = (this.food.makingList[i].itemPrice/100).toFixed(2)
		    				this.$store.state.initSomePrice.cuisinePrice = (this.food.makingList[i].itemPrice/100).toFixed(2)
		    			}
		    		}
			},
		    decreaseCart(){
		    		this.$store.state.addCart = false
		    		//判断当前菜品是否有不同规格
		    		let tempIndex = 0 
		    		for(let i=0;i<this.$store.state.saveCartList.length;i++){
		    			if(this.food.id == this.$store.state.saveCartList[i].dishesId&this.$store.state.saveCartList[i].dishesCount>0){
		    				tempIndex++
		    			}
		    		}
		    		//如果有不同就提示到购物车减商品
		    		if(tempIndex>1){
		    			this.showDelTip = true
		    			let timer = setTimeout(() => {
		    				this.showDelTip = false
		    				clearTimeout(timer)
		    			},2000)
		    		}
		    		else{
		    			//在点菜list去减去购物车的商品
		    			for(let i=0;i<this.$store.state.saveCartList.length;i++){
		    				if(this.food.id == this.$store.state.saveCartList[i].dishesId&this.$store.state.saveCartList[i].dishesCount>0){
		    					this.$store.state.saveCartList[i].dishesCount--
		    				}
		    				if(this.$store.state.saveCartList[i].dishesCount==0){
		    					this.$store.state.saveCartList.splice(i,1)
		    					this.$store.state.localCart.splice(i,1)
		    				}
		    			}
		    			this.food.count --
		    		}
		    }
	    }
	    	,
	    	computed:{
	    		otherAddMsg(){
	    			return this.$store.state.otherAddMsg
	    		}
	    	}
	}
</script>
<style lang="scss">
	.numControl{
		position:relative;
		display:flex;
		justify-content: space-between;
		align-items: center;   
		width:1rem;
		height:0.3rem;
		.iconfont{
			width:0.21rem;
			height:0.21rem;
		}
		.icon-jian{
			color:#F5A623;
			padding:6px;
		}
		.space{
			display:inline-block;
			width:0.21rem;
			height:0.21rem;
			padding:6px;
		}
		.space-num{
			display:inline-block;
			width:0.3rem;
			height:0.2rem;
		}
		.icon-plus{
			color:#F5A623;
			background:white;
			padding:6px;
		}
		.numCount{
			display:inline-block;
			width:0.3rem;
			height:0.2rem;
			text-align: center;
			font-size: 0.16rem;
			line-height:0.2rem;
			color:#000 !important;
		}
		.showChange{
			position:fixed;
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
	}
	.block{
		display:flex;
		align-items: center;
		width:100%;
		height:100%;
	}
	.delTip{
		position:absolute;
		top:-0.3rem;
		right:0.13rem;
		display:flex;
		justify-content: center;
		align-items: center;
		width:1.95rem;
		height:0.25rem;
		background:#000;
		color:#fff;
		border-radius:6px;
		i{
			display: flex;
			position:absolute;
			bottom:-0.1rem;
			left:60%;			
			font-style:normal;
			width: 0;
		    height: 0;
		    border-left: 0.07rem solid transparent;
		    border-right: 0.07rem solid transparent;
		    border-top: 0.08rem solid #000;
		}
	}
</style>