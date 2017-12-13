<template>
	<div class="countTime">
		<p>
			{{item.time}}
		</p>
		<p>
			支付剩余时间
		</p>
	</div>
</template>
<script>
import Vue from 'vue'
	export default{
		data(){
			return{
				time:''
			}
		}
		,
		props:['item']
	}
</script>
<style lang="scss">
	.countTime{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		align-items:center;
		width:1rem;
		height:0.5rem;
		margin-right:0.15rem;
		p:nth-child(1){
			font-size:0.2rem;
			color:#f00;
		}
		p:nth-child(2){
			color: #A0A0A0;
		}
	}
</style>