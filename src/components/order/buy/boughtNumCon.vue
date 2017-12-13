<template>
	<div class="numControl">
		<div class="block">
			<!--用来占位-->
			<p>
				<span v-show="food.dishesCount>0" class="numCount">
					<img src="../../../assets/icons/减去商品@3x.png" class="icon iconfont icon-jian" @click="decreaseCart"/>
					<i>{{food.dishesCount}}</i>
				</span>
			</p>
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
		 	   	let tempIndex = false
		 	   	//初次加入的时候先加
		 	   	if(this.food.dishesCount<1){
		 	   		this.food.dishesCount++
		 	   	}
		    		//判断购物车中是否有相同菜品,有则加，无则push
		    		if(this.$store.state.saveCartList.length>0){
			    		for(let i=0;i<this.$store.state.saveCartList.length;i++){
			    			if(this.food.dishesId == this.$store.state.saveCartList[i].dishesId){
			    				if(this.food.foodTip == this.$store.state.saveCartList[i].foodTip){
			    					this.$store.state.saveCartList[i].dishesCount ++
			    					tempIndex = true
			    				}
			    			}
			    		}
			    		if(!tempIndex){
			    			this.$store.state.saveCartList.push(this.food)
			    		}
			    }
		    		else{
		    			this.$store.state.saveCartList.push(this.food)
		    		}
		    		//点餐页面数量改变
		    		for(let i=0;i<this.$store.state.originList.length;i++){
		    			if(this.food.dishesId == this.$store.state.originList[i].id){
		    				this.$store.state.originList[i].count++
		    			}
		    		}
			},
		    //减菜
		    decreaseCart(){
		 	   	this.$store.state.addCart = false
		    		//判断购物车中是否有相同菜品,有则加，无则push
		    		for(let i=0;i<this.$store.state.saveCartList.length;i++){
		    			if(this.food.dishesId == this.$store.state.saveCartList[i].dishesId){
		    				if(this.food.foodTip == this.$store.state.saveCartList[i].foodTip){
		    					this.$store.state.saveCartList[i].dishesCount --
		    					//如果减为零，就把这项从购物车list中删除
		    					if(this.$store.state.saveCartList[i].dishesCount==0){
		    						this.$store.state.saveCartList.splice(i,1)
		    					}
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
	    	created(){
	    		this.food.dishesCount = 0
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
		.icon-plus{
			color:#F5A623;
			background:white;
			padding:6px;
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
		justify-content: space-around;
		align-items: center;
		width:100%;
		height:100%;
		p{
			display: flex;
			justify-content: space-around;
			width:0.8rem;
			.numCount{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width:100%;
				height:0.28rem;
				text-align: center;
				font-size: 0.16rem;
				color:#000 !important;
				i{
					margin-right:0.13rem;
					font-style:normal;
					font-size: 0.16rem !important;
				}
			}
		}
	}
</style>