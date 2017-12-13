<template>
	<div class="attr">
		<div class="attr-name">
			<span>{{attrs.name}}</span>
		</div>
		<div class="attr-item" ref="attr">
			<span v-for="(item,index) in attrs.items" @touchstart="active($event.currentTarget,index)">
				{{item}}
			</span>
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
		props:["attrs","index","food",'name',"judge"]
		,
		methods:{
			active(e,index){
				let item = this.$refs.attr.children
				let tempIndex = this.index
				let ifHasClass = false
				if(e.className != 'attr-active'){
					this.food.dishAttr[tempIndex].index = index
				}
				else{
					this.food.dishAttr[tempIndex].index = null
				}
				console.log(this.food.dishAttr)
				if(e.className == 'attr-active'){
					ifHasClass = true
				}
				for(var j=0;j<item.length;j++){
						item[j].className = ''
					}
				if(ifHasClass){
					e.className = ''
				}
				else{
					e.className = 'attr-active'
				}
				this.judge()
			}
		}
		,
		mounted(){
			
		}
		,
		updated(){
		}
	}
</script>
<style lang="scss">
	.attr{
		width:100%;
		.attr-name{
			display:flex;
			align-items: center;
			width:100%;
			height:0.3rem;
			span{
				margin-left:0.18rem;
				font-size:0.13rem;
				color:#282828;
			}
		}
		.attr-item{
			display: flex;
			flex-wrap: wrap;
			width:100%;
			span{
				display: flex;
				justify-content: center;
				align-items: center;
				width:0.7rem;
				height:0.3rem;
				margin-left:0.1rem;
				font-size:0.12rem;
				color:#A0A0A0;
				border:1px solid #E4E4E4;
			}
			.attr-active{
			    color: #31C4C3;
				border: 1px solid #31C4C4;
			}
		}
	}
</style>