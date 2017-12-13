<template>
	<div class="numControl">
		<div class="block">
			<!--用来占位-->
			<span class="space" v-show="!food.dishesCount"></span>
			<span class="space-num" v-show="!food.dishesCount"></span>
			<img src="../../../assets/icons/减去商品@3x.png" class="icon iconfont icon-jian" v-show="food.dishesCount>0" @click="decreaseCart"/>
			<span v-show="food.dishesCount>0" class="numCount">{{food.dishesCount}}</span>
			<img src="../../../assets/icons/加上商品@3x.png" class="icon iconfont icon-plus" @click="addCart"/>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
	export default{
		data(){
			return{
			}
		}
		,
		props:['food','otherAdd']
		,
	    	methods:{
	    		//加菜
		    addCart(){
		 	   	this.$store.state.addCart = false
		    		this.food.dishesCount ++
		    		for(let i=0;i<this.$store.state.originList.length;i++){
		    			if(this.food.dishesId == this.$store.state.originList[i].id){
		    				this.$store.state.originList[i].count++
		    			}
		    		}
			},
		    //减菜
		    decreaseCart(){
		    		this.$store.state.addCart = false
		    		this.$store.state.delCart = true
		  	  	this.food.dishesCount --
		  	  	if(this.food.dishesCount<1){
		  	  		for(let i=0;i<this.$store.state.saveCartList.length;i++){
		  	  			if(this.food.cartId == this.$store.state.saveCartList[i].cartId){
		  	  				this.$store.state.saveCartList.splice(i,1)
		  	  			}
		  	  		}
		  	  	}

	    			for(let i=0;i<this.$store.state.originList.length;i++){
	    				if(this.food.dishesId == this.$store.state.originList[i].id){ 
	    					this.$store.state.originList[i].count--
	    				}
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
	.block{
		display:flex;
		align-items: center;
		width:100%;
		height:100%;
	}
</style>