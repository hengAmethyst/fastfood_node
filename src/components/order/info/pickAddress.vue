<template>
	<div class="pickAddress">
		<div class="pickInner">
			<div class="title">
				<span @click="clear">取消</span>
				<span @click="finish">确定</span>
			</div>
			<!---->
			<div class="options">
				<div class="nowOption">
					<input type="text" v-model="province" disabled/>
					<input type="text" v-model="city" disabled />
					<input type="text" v-model="area" disabled/>
				</div>
				<div class="willOptions">
					<!--省-->
					<ul class="province">
						<li v-for="item in proList"><span>{{item.name}}</span></li>
						<li ><span></span></li>
						<li ><span></span></li>
					</ul>
					<!--市-->
					<ul class="city">
						<li v-for="item in cityList"><span>{{item.name}}</span></li>
						<li ><span></span></li>
						<li ><span></span></li>
					</ul>
					<!--县/区-->
					<ul class="area">
						<li v-for="item in areaList"><span>{{item}}</span></li>
						<li ><span></span></li>
						<li ><span></span></li>
					</ul>
				</div>
			</div>
		</div>
		<div class="pickShadow">
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				province:'-',
				city:'-',
				area:'-',
				proList:[],
				cityList:[],
				areaList:[]
			}
		}
		,
		props:["showPA","areaInner","showArea"]
		,
		methods:{
			clear(){
				this.province = '-'
				this.city = '-'
				this.area = '-'
				this.showPA.show = false
				this.showArea.show = false
			},
			finish(){
				if(this.province=='-'|this.city=='-'|this.area=='-'){
					this.showPA.show = false
					this.showArea.show = false
				}
				else{
					this.showPA.show = false
					this.areaInner.inner = this.province+ " " + this.city + " " + this.area
					this.showArea.show = true
				}
				
			}
		}
		,
		created(){
			this.$http.get("fastfoodStatic/data/address.json").then(function(res){
				console.log(res)
				this.proList = res.body
			})
		}
		,
		mounted(){
			var that = this
			//监控省
			$('.province').scroll(function(){
				$('.province li').each(function(){
					var Top = $(this).position().top
					if(Top>=-20&&Top<20)
					{
						that.province = $(this).find('span').html()
						for(let i=0;i<that.proList.length;i++){
							if(that.province == that.proList[i].name){
								that.cityList = that.proList[i].city
								that.city = that.proList[i].city[0].name
								that.area = that.proList[i].city[0].area[0]
								that.areaList =  that.proList[i].city[0].area
							}
						}
					}
				})	
			})
			//监控市
			$('.city').scroll(function(){
				$('.city li').each(function(){
					var Top = $(this).position().top
					if(Top>=-20&&Top<20)
					{
						that.city = $(this).find('span').html()
						for(let i=0;i<that.cityList.length;i++){
							if(that.city == that.cityList[i].name){
								that.areaList = that.cityList[i].area
								that.area = that.cityList[i].area[0]
							}
						}
					}
				})	
			})
			//监控区/县
			$('.area').scroll(function(){
				$('.area li').each(function(){
					var Top = $(this).position().top
					if(Top>=-20&&Top<20)
					{
						that.area = $(this).find('span').html()
					}
				})	
			})
		}
	}
</script>
<style lang="scss">
	.pickAddress{
		.pickInner{
			position:fixed;
			left:0;
			bottom:0;
			width:100%;
			height:36%;
			z-index: 2000;
			background:#fff;
			.title{
				display: flex;
				justify-content: space-between;
				align-items: center;
				width:100%;
				height:0.43rem;
				border-bottom:1px solid #979797;
				span:nth-child(1){
					margin-left:0.25rem;
					font-size:0.17rem;
					color:#282828;
				}
				span:nth-child(2){
					margin-right:0.25rem;
					font-size:0.17rem;
					color:#282828;
				}
			}
			/*选项*/
			.options{
				position:absolute;
				bottom:0;
				left:0;
				width:100%;
				height:1.25rem;
				.nowOption{
					display: flex;
					justify-content: space-between;
					align-items: center;
					width:100%;
					height:0.4rem;
					border-top:1px solid #9797f7;
					border-bottom:1px solid #9797f7;
					input{
						height:100%;
						width:33.3%;
						text-align: center;
						font-size:0.18rem;
						color:#282828;
						border:none;
					}
				}
				.willOptions{
					display:flex;
					justify-content: space-between;
					width:100%;
					ul{
						display:flex;
						flex-direction: column;
						align-items: center;
						width:33.33%;
						height:0.8rem;
						overflow: scroll;
						opacity: 0.5;
						li{
							span{
								display: flex;
								align-items: center;
								height:0.4rem;
								font-size:0.18rem;
								color:#282828;
							}
						}
					}
				}
			}
		}
		.pickShadow{
			position: fixed;
			left:0;
			bottom:0;
			width:100%;
			height:300%;
			background:#000;
			opacity: 0.5;
		}
	}
</style>