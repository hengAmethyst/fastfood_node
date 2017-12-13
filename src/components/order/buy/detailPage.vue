<template>
	<div class="topDetail" v-show="this.$store.state.showDetailPage">
		<!--蒙版-->
		<div class='detailPage' @click="cancel"></div>
		<!--蒙版里的内容-->
		<div class="detailPage-inner">
			<!--删除按钮-->
			<div class="delBtn">
				<img src="../../../assets/icons/取消.png" @click="cancel"/>
			</div>
			<!--菜品信息部分-->
			<div class="dishInfo">
				<div class="dishOtherInfo">
					<p>{{food.name}}</p>
					<p>
						<span>
							<i>￥</i>{{nowPrice}}
						</span>
					</p>
				</div>
			</div>
			<!--数量加减-->
			<div class="numBox">
				<div class="nowNum" v-show="nowNum>0">
					<img src="../../../assets/icons/减去商品@3x.png" class="icon iconfont icon-jian" v-show="nowNum>0" @click="delCart"/>
					<span v-show="nowNum>0" class='tempNum'>{{nowNum}}</span>
					<img src="../../../assets/icons/加上商品@3x.png" class="icon iconfont icon-plus" @click="addCart"/>
				</div>
			</div>
			<!--可滚动区域-->
			<div class="scroll-area">
				<!--规格-->
				<div class="scale-container">
					<div class="leftWords">
						<span>规格</span>
						<span><i>￥</i>{{this.$store.state.initSomePrice.scalePrice}}</span>
					</div>
					<div class="scaleLabel">
						<span v-for="item in food.specificationList" :class="item.isDefault==0 ? 'scaleActive':''">
							{{item.itemName}}
						</span>
					</div>
				</div>
				<!--做法-->
				<div class="makeWays-container" v-show="food.showCuisineIndex">
					<div class="leftWords">
						<span>做法</span>
						<span><i>￥</i>{{this.$store.state.initSomePrice.cuisinePrice}}</span>
					</div>
					<div class="makeWaysLabel">
						<span v-for="(item,index) in food.makingList" :class="item.isDefault==0 ? 'makeWaysActive':''">
							{{item.itemName}}
						</span>
					</div>
				</div>
				<!--加配菜-->
				<div class="sideDishes-container">
					<div class="leftWords">
						<span>配菜</span>
						<span><i>￥</i>{{nowSideDishesPrice}}</span>
					</div>
					<div class="sideDishesLabel">
						<span v-for="item in food.sideDishesInfoList">
							{{item.dishesName}}
						</span>
					</div>
				</div>
				<attr v-for="(item,index) in food.dishAttribute" :key="index" :attrs="item" :index="index" :food="food" :judge="judge"></attr>
			</div>
			<!--确认按钮-->
			<div class="affirmBtn" @click="affirm" v-show="nowNum<1">
				<span>加入购物车</span>
			</div>
		</div>
	</div>
</template>
<script>
import attr from './attr'
import {
		findMakeWayId,findMakeWayPrice,
		findScaleMemberPrice,findScaleId,findScalePrice,
		findSideDishesUnitName,findSideDishesUnitId,findSideDishesId,findSideDishesName,findSideDishesPrice,findSideDishesCategoryId,findSideDishesCategoryName,findSideDishesPicUrl,findSideMemberPrice,findSideScaleName,findSideScaleId,findSideScalePrice,findSideScaleMemberPrice,findSideMakeName,findSideMakeId,findSideMakePrice
		} from '../../../js/memoJoin.js'
import Vue from 'vue'
	export default{
		data(){
			return{
				//详情显示页开关
				showFlag:false,
				//当前页面的数量
				nowNum:0,
				//规格
				scaleName:'',
				scaleId:0,
				scalePrice:0,
				//配菜
				sideDishesList:[],
				sideDishesName:'',
				//做法Id
				cuisineId:0,
				cuisineName:'',
				cuisinePrice:0,
				cartId:0,
				//配菜总价
				nowSideDishesPrice:0,
				//当前项的价格
				nowPrice:0,
				//展示配菜项
				showSideDishes:false,
				//attrList
				attrList:'',
				attrListName:''
			}
		}
		,
		components:{attr}
		,
		props:['food']
		,
		methods:{
			judge(){
				//规格
				for(let i=0;i<$('.scaleLabel span').length;i++){
						if($('.scaleLabel').find('span').eq(i).hasClass('scaleActive')){
							this.scaleName = $('.scaleLabel span').eq(i).html()
							this.scaleId = findScaleId(this.scaleName,this.food.specificationList)
							//规格价
						this.scalePrice = (findScalePrice(this.scaleName,this.food.specificationList)/100).toFixed(2)
						this.$store.state.initSomePrice.scalePrice = this.scalePrice
						//会员规格价
						this.scaleMemberPrice = findScaleMemberPrice(this.scaleName,this.food.specificationList)
							this.scaleName = this.scaleName.replace(/\n/g,'').replace(/\t/g,'')
						}
					}
				let sideDishesPrice = 0
				let sideDishesNameArry = []
				//配菜
				for(let i=0;i<$('.sideDishesLabel span').length;i++){
						if($('.sideDishesLabel').find('span').eq(i).hasClass('sideDishesActive')){
							//配菜的name
							let tempSideDishesName = findSideDishesName($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
							//配菜的价格
							let tempSideDishesPrice = findSideDishesPrice($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
							//配菜会员价
							let tempSideMemberPrice = findSideMemberPrice($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
							//配菜的默认规格价格
							let sideScalePrice = findSideScalePrice($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
							//配菜的默认规格会员价格
							let sideScaleMemberPrice = findSideScaleMemberPrice($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
							//配菜的默认做法
							let sideMakeName = findSideMakeName($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
							//配菜的默认做法Id
							let sideMakeId = findSideMakeId($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
							//配菜的默认做法价格
							let sideMakePrice = findSideMakePrice($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
							//计算配菜总价
							sideDishesPrice += Number((sideScalePrice+sideMakePrice)/100)
							//affirm页面需要展示的配菜字段
							this.sideDishesName += $('.sideDishesLabel span').eq(i).html() + ' '
							//选中的配菜的名字组成的数组
							let temp = $('.sideDishesLabel span').eq(i).html().replace(/\t/g,'').replace(/\n/g,'')
							//把选中的配菜的名字放进数组
							sideDishesNameArry.push(temp)
						}
				}
				if($('.sideDishesLabel span').length>0){
					this.nowSideDishesPrice = sideDishesPrice
					this.sideDishesName = this.sideDishesName.replace(/\t/g,'').replace(/\n/g,'')
				}
				//做法
				if($('.makeWaysLabel span').length>0){
					this.food.showCuisineIndex = true
					for(let i=0;i<$('.makeWaysLabel span').length;i++){
		    				if($('.makeWaysLabel').find('span').eq(i).hasClass('makeWaysActive')){
		    					this.cuisineName = $('.makeWaysLabel span').eq(i).html()
		    					this.cuisineName = this.cuisineName.replace(/\t/g,'').replace(/\n/g,'')
		    					this.$store.state.initSomePrice.cuisinePrice = findMakeWayPrice(this.cuisineName,this.food.makingList)/100
		    					this.cuisinePrice = findMakeWayPrice(this.cuisineName,this.food.makingList)/100
		    				}
		    			}
				}
				else{
					this.food.showCuisineIndex = false
					this.$store.state.initSomePrice.cuisinePrice = 0
				}
				//现在规格的单价
				this.nowPrice = (Number(this.nowSideDishesPrice) + Number(this.cuisinePrice) + Number(this.scalePrice)).toFixed(2)
				//如果存在
				let tempTips = this.cuisineName + this.sideDishesName + this.scaleName
				this.food.lastFoodClass.cuisineName = this.cuisineName
				this.food.lastFoodClass.sideDishesName = sideDishesNameArry
				this.food.lastFoodClass.scaleName = this.scaleName
				this.food.lastFoodClass.id = this.food.id
				this.food.lastFoodClass.nowPrice = this.nowPrice
				//计算出当前属性的list
				let nowAttrList = ''
				for(let i=0;i<this.food.dishAttr.length;i++){
					nowAttrList += this.food.dishAttr[i].index + ','
				}
				nowAttrList = nowAttrList.substr(0,nowAttrList.length-1)
				
				//判断当前选择的类型组合是否在购物车中有,有便加上
				let showNowNumIndex = false
				for(let i=0;i<this.$store.state.saveCartList.length;i++){
					this.$store.state.saveCartList[i].foodTip=this.$store.state.saveCartList[i].foodTip.replace(/\t/g,'').replace(/\n/g,'')
					if(this.$store.state.saveCartList[i].foodTip == tempTips&this.$store.state.saveCartList[i].dishesId == this.food.id&nowAttrList == this.$store.state.saveCartList[i].foodAttr){
						this.nowNum = this.$store.state.saveCartList[i].dishesCount
						showNowNumIndex = true
					}
				}
				if(!showNowNumIndex){
					this.nowNum = 0 
				}
				this.cuisineName = ''
				this.sideDishesName = ''
				this.scaleName = ''
			},
			//加菜
			addCart(){
				//防止计算的时候数量重复加
				this.$store.state.addCart = false
				//规格
				for(let i=0;i<$('.scaleLabel span').length;i++){
        				if($('.scaleLabel').find('span').eq(i).hasClass('scaleActive')){
        					this.scaleName = $('.scaleLabel span').eq(i).html()
        					this.scaleId = findScaleId(this.scaleName,this.food.specificationList)
        					//规格价
						this.scalePrice = findScalePrice(this.scaleName,this.food.specificationList)
						//会员规格价
						this.scaleMemberPrice = findScaleMemberPrice(this.scaleName,this.food.specificationList)
        					this.scaleName=this.scaleName.replace(/\t/g,'')
    						this.scaleName=this.scaleName.replace(/\n/g,'')
        				}
        			}
				//配菜
				for(let i=0;i<$('.sideDishesLabel span').length;i++){
        				if($('.sideDishesLabel').find('span').eq(i).hasClass('sideDishesActive')){
        					//配菜的name
        					let tempSideDishesName = findSideDishesName($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//affirm页面需要展示的配菜字段
        					this.sideDishesName += $('.sideDishesLabel span').eq(i).html()+' '
        				}
				}
				this.sideDishesName=this.sideDishesName.replace(/\t/g,'')
    				this.sideDishesName=this.sideDishesName.replace(/\n/g,'')
				//做法
				for(let i=0;i<$('.makeWaysLabel span').length;i++){
        				if($('.makeWaysLabel').find('span').eq(i).hasClass('makeWaysActive')){
        					this.cuisineName = $('.makeWaysLabel span').eq(i).html()
        					this.cuisineName=this.cuisineName.replace(/\t/g,'')
    						this.cuisineName=this.cuisineName.replace(/\n/g,'')
        				}
        			}
				let tempTips = this.cuisineName + this.sideDishesName + this.scaleName
				//判断当前选择的类型组合是否在购物车中有
				for(let i=0;i<this.$store.state.saveCartList.length;i++){
					this.$store.state.saveCartList[i].foodTip = this.$store.state.saveCartList[i].foodTip.replace(/\t/g,'')
    					this.$store.state.saveCartList[i].foodTip = this.$store.state.saveCartList[i].foodTip.replace(/\n/g,'')
    					//计算出当前属性的list
					let nowAttrList = ''
					for(let i=0;i<this.food.dishAttr.length;i++){
						nowAttrList += this.food.dishAttr[i].index + ','
					}
					nowAttrList = nowAttrList.substr(0,nowAttrList.length-1)
					//购物车原来有此组合
					if(this.$store.state.saveCartList[i].foodTip == tempTips&this.$store.state.saveCartList[i].dishesId==this.food.id&nowAttrList == this.$store.state.saveCartList[i].foodAttr){
						this.nowNum = this.$store.state.saveCartList[i].dishesCount + 1
						this.$store.state.saveCartList[i].dishesCount++
						//配菜
						for(let j=0;j<this.$store.state.saveCartList[i].sideDishes.length;j++){
							this.$store.state.saveCartList[i].sideDishes[j].dishesCount ++
						}
					}
				}
				this.cuisineName = ''
				this.sideDishesName = ''
				this.scaleName = ''
				//点餐的界面的数量的改变
				for(let i=0;i<this.$store.state.originList.length;i++){
	    				if(this.food.dishesId == this.$store.state.originList[i].dishesId){ 
	    					this.$store.state.originList[i].count++
	    				}
	    			}
			},
			//减菜
			delCart(){
				this.$store.state.addCart = false
				this.$store.state.delCart = true
				//规格
				for(let i=0;i<$('.scaleLabel span').length;i++){
        				if($('.scaleLabel').find('span').eq(i).hasClass('scaleActive')){
        					this.scaleName = $('.scaleLabel span').eq(i).html()
        					this.scaleId = findScaleId(this.scaleName,this.food.specificationList)
        					//规格价
						this.scalePrice = findScalePrice(this.scaleName,this.food.specificationList)
						//会员规格价
						this.scaleMemberPrice = findScaleMemberPrice(this.scaleName,this.food.specificationList)
        					this.scaleName=this.scaleName.replace(/\t/g,'')
    						this.scaleName=this.scaleName.replace(/\n/g,'')
        				}
        			}
				//配菜
				for(let i=0;i<$('.sideDishesLabel span').length;i++){
        				if($('.sideDishesLabel').find('span').eq(i).hasClass('sideDishesActive')){
        					//配菜的name
        					let tempSideDishesName = findSideDishesName($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//affirm页面需要展示的配菜字段
        					this.sideDishesName += $('.sideDishesLabel span').eq(i).html()+' '
        				}
				}
				this.sideDishesName=this.sideDishesName.replace(/\t/g,'')
    				this.sideDishesName=this.sideDishesName.replace(/\n/g,'')
				//做法
				for(let i=0;i<$('.makeWaysLabel span').length;i++){
        				if($('.makeWaysLabel').find('span').eq(i).hasClass('makeWaysActive')){
        					this.cuisineName = $('.makeWaysLabel span').eq(i).html()
        					this.cuisineName=this.cuisineName.replace(/\t/g,'')
    						this.cuisineName=this.cuisineName.replace(/\n/g,'')
        				}
        			}
				let tempTips = this.cuisineName + this.sideDishesName + this.scaleName
				//判断当前选择的类型组合是否在购物车中有
				for(let i=0;i<this.$store.state.saveCartList.length;i++){
					this.$store.state.saveCartList[i].foodTip=this.$store.state.saveCartList[i].foodTip.replace(/\t/g,'')
    					this.$store.state.saveCartList[i].foodTip=this.$store.state.saveCartList[i].foodTip.replace(/\n/g,'')
    					//计算出当前属性的list
					let nowAttrList = ''
					for(let i=0;i<this.food.dishAttr.length;i++){
						nowAttrList += this.food.dishAttr[i].index + ','
					}
					nowAttrList = nowAttrList.substr(0,nowAttrList.length-1)
					if(this.$store.state.saveCartList[i].foodTip == tempTips&this.$store.state.saveCartList[i].dishesId==this.food.id&nowAttrList == this.$store.state.saveCartList[i].foodAttr){
						this.nowNum = this.$store.state.saveCartList[i].dishesCount - 1
						this.$store.state.saveCartList[i].dishesCount--
						for(let j=0;j<this.$store.state.saveCartList[i].sideDishes.length;j++){
							this.$store.state.saveCartList[i].sideDishes[j].dishesCount --
						}
						if(this.$store.state.saveCartList[i].dishesCount == 0){
							this.$store.state.saveCartList.splice(i,1)
							this.nowNum == 0
						}
					}
				}
				this.cuisineName = ''
				this.sideDishesName = ''
				this.scaleName = ''
				for(let i=0;i<this.$store.state.originList.length;i++){
	    				if(this.food.dishesId == this.$store.state.originList[i].dishesId){ 
	    					this.$store.state.originList[i].count--
	    				}
	    			}
			},
			//进入详情页
			enterPage(){
				if(this.food.lastFoodClass){
					//给标签添加上一次访问的class
					if(this.food.lastFoodClass.scaleName){
						//规格
						for(let i=0;i<$('.scaleLabel span').length;i++){
							let temp = $('.scaleLabel span').eq(i).html().replace(/\n/g,'')
							 	temp = temp.replace(/\t/g,'')
							 	if(temp == this.food.lastFoodClass.scaleName){
							 		$('.scaleLabel span').eq(i).addClass('scaleActive')
							 		$('.scaleLabel span').eq(i).siblings().removeClass('scaleActive')
							 	}
						}
						//做法
						for(let i=0;i<$('.makeWaysLabel span').length;i++){
							let temp = $('.makeWaysLabel span').eq(i).html().replace(/\n/g,'')
							 	temp = temp.replace(/\t/g,'')
							 	if(temp == this.food.lastFoodClass.cuisineName){
							 		$('.makeWaysLabel span').eq(i).addClass('makeWaysActive')
							 		$('.makeWaysLabel span').eq(i).siblings().removeClass('makeWaysActive')
							 	}
						}
						//配菜
						for(let i=0;i<$('.sideDishesLabel span').length;i++){
							for(let j=0;j<this.food.lastFoodClass.sideDishesName.length;j++){
								let temp = $('.sideDishesLabel span').eq(i).html().replace(/\n/g,'').replace(/\t/g,'')
								if(temp==this.food.lastFoodClass.sideDishesName[j]){
									$('.sideDishesLabel span').eq(i).addClass('sideDishesActive')
								}
							}
						}
						//属性
						for(let i=0;i<$('.attr-item').length;i++){
							let temp = this.food.dishAttr[i].index
							$('.attr-item').eq(i).find('span').eq(temp).addClass('attr-active')
						}
					}
					else{
						//规格
						for(let i=0;i<$('.scaleLabel span').length;i++){
					 		$('.scaleLabel span').eq(0).addClass('scaleActive')
					 		$('.scaleLabel span').eq(0).siblings().removeClass('scaleActive')
						}
						//做法
						for(let i=0;i<$('.makeWaysLabel span').length;i++){
					 		$('.makeWaysLabel span').eq(0).addClass('makeWaysActive')
					 		$('.makeWaysLabel span').eq(0).siblings().removeClass('makeWaysActive')
						}
					}
				}
			},
			
			//点X取消更改
			cancel(){
				this.$store.state.showDetailPage = false	
				this.$store.state.imgToDetail = false
				//清除之前的class样式
				for(var i=0;i<$('.scaleLabel span').length;i++){
					if($('.scaleLabel').find('span').eq(i).hasClass('scaleActive')){
						$('.scaleLabel').find('span').eq(i).removeClass('scaleActive')
					}
				}
				for(var i=0;i<$('.makeWaysLabel span').length;i++){
					if($('.makeWaysLabel').find('span').eq(i).hasClass('makeWaysActive')){
						$('.makeWaysLabel').find('span').eq(i).removeClass('makeWaysActive')
					}
				}
				for(var i=0;i<$('.sideDishesLabel span').length;i++){
					if($('.sideDishesLabel').find('span').eq(i).hasClass('sideDishesActive')){
						$('.sideDishesLabel').find('span').eq(i).removeClass('sideDishesActive')
					}
				}
				//属性的所有样式清除
				$('.attr-item').find('span').removeClass('attr-active')
			},
			//来自父组件的show方法
			show() {
				this.$store.state.showDetailPage = true
				//如果有配菜,显示栏
				if(this.food.sideDishesInfoList){
					if(this.food.sideDishesInfoList.length>0)
					this.showSideDishes=true
				}
				else{
					this.showSideDishes=false
				}
				//dom更新完毕之后执行
				Vue.nextTick(() => {
					this.enterPage()
					this.judge()
				})
     		},
			//提交
			affirm(){
				this.$store.state.delCart = false
				this.nowNum = 1
				//规格
				let tempScaleIndex = false
				for(var i=0;i<$('.scaleLabel span').length;i++){
        				if($('.scaleLabel').find('span').eq(i).hasClass('scaleActive')){
        					tempScaleIndex = true
        					this.scaleName = $('.scaleLabel span').eq(i).html()
        					this.scaleId = findScaleId(this.scaleName,this.food.specificationList)
        					//规格价
						this.scalePrice = findScalePrice(this.scaleName,this.food.specificationList)
						//会员规格价
						this.scaleMemberPrice = findScaleMemberPrice(this.scaleName,this.food.specificationList)
        					this.scaleName=this.scaleName.replace(/\t/g,'')
    						this.scaleName=this.scaleName.replace(/\n/g,'')
        				}
        			}
				//如果没有规格
				if(!tempScaleIndex){
					this.scalePrice =  this.food.price*100
				}
				//配菜
				var sideDishesPrice = 0
				var sideMemberPrice = 0
				for(let i=0;i<$('.sideDishesLabel span').length;i++){
        				if($('.sideDishesLabel').find('span').eq(i).hasClass('sideDishesActive')){
        					//配菜的name
        					let tempSideDishesName = findSideDishesName($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的图片
        					let tempSidePicUrl = findSideDishesPicUrl($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的ID
        					let tempSideDishesId = findSideDishesId($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的单位
        					let tempUnitName = findSideDishesUnitName($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//单位Id
        					let tempUnitId = findSideDishesUnitId($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//种类Id
        					let tempCateId = findSideDishesCategoryId($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//种类Name
        					let tempCateName = findSideDishesCategoryName($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的价格
        					let tempSideDishesPrice = findSideDishesPrice($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜会员价
        					let tempSideMemberPrice = findSideMemberPrice($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的默认规格
        					let sideScaleName = findSideScaleName($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的默认规格Id
        					let sideScaleId = findSideScaleId($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的默认规格价格
        					let sideScalePrice = findSideScalePrice($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的默认规格会员价格
        					let sideScaleMemberPrice = findSideScaleMemberPrice($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的默认做法
        					let sideMakeName = findSideMakeName($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的默认做法Id
        					let sideMakeId = findSideMakeId($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					//配菜的默认做法价格
        					let sideMakePrice = findSideMakePrice($('.sideDishesLabel span').eq(i).html(),this.food.sideDishesInfoList)
        					
        					//计算配菜总价
        					sideDishesPrice += Number((sideScalePrice + sideMakePrice)/100)
        					sideMemberPrice += Number((sideScaleMemberPrice + sideMakePrice)/100)
        					//affirm页面需要展示的配菜字段
        					this.sideDishesName += $('.sideDishesLabel span').eq(i).html()+' '
        					//每次创建一个{}用来存配菜
        					this.sideDishesList.push({
    							"dishesId":tempSideDishesId,
							"dishesName":tempSideDishesName,
							"dishesCount":this.nowNum,
							"dishPicUrl":tempSidePicUrl,
							"categoryId":tempCateId,
							"categoryName":tempCateName,
							"unitId":sideScaleId,
							"unitName":sideScaleName,
							"dishesPrice":sideScalePrice,
							"mealsetPrice":tempSideDishesPrice,
							"memberPrice":sideScaleMemberPrice,
							//菜品做法
							'cuisineId':sideMakeId,
							'cuisineName':sideMakeName,
							'cuisinePrice':sideMakePrice
    						})
        				}
        			}
        			//做法
        			let tempCuisineIndex = false
        			for(var i=0;i<$('.makeWaysLabel span').length;i++){
        				if($('.makeWaysLabel').find('span').eq(i).hasClass('makeWaysActive')){
        					tempCuisineIndex = true
        					this.cuisineName = $('.makeWaysLabel span').eq(i).html()
        					this.cuisineId = findMakeWayId(this.cuisineName,this.food.makingList)
        					this.cuisinePrice = findMakeWayPrice(this.cuisineName,this.food.makingList)
        					this.cuisinePrice = (this.cuisinePrice/100).toFixed(2)
        				}
        			}
        			if(!tempCuisineIndex){
        				this.cuisinePrice =  0
        			}
        			//每个做法以逗号隔开，去掉最后的逗号
        			this.cuisineName = this.cuisineName.substr(0,this.cuisineName.length-1)
        			this.cuisineName = this.cuisineName.replace(/\t/g,'').replace(/\n/g,'')
        			let tempAttr = ''
        			let tempAttrName = ''
        			//属性
        			for(let i=0;i<this.food.dishAttr.length;i++){
        				console.log(this.food.dishAttr)
        				tempAttr += this.food.dishAttr[i].index +','
        				if(this.food.dishAttr[i].index != null){
	        				tempAttrName += this.food.dishAttribute[i].items[this.food.dishAttr[i].index] +'、'
        				}
        			}
        			this.attrList = tempAttr.substr(0,tempAttr.length-1)
        			this.attrListName = tempAttrName.substr(0,tempAttrName.length-1)
    				//数量改变
    				this.food.count += this.nowNum
    				//本地购物车数据
				this.cartId = this.cartId + 1
				let dishesPrice = (this.scalePrice/100).toFixed(2)
				//如果有会员价
				if(this.scaleMemberPrice){
					var memberPrice = (this.scaleMemberPrice/100).toFixed(2)
				}
				//没有会员价取0
				else{
					var memberPrice = 0
				}
				//添加到本地购物车
				this.$store.state.localCart.push(
					{
						//本地购物车Id
						cartId:this.cartId,
						//种类Id
						categoryId:this.food.categoryId,
						//种类名称
						categoryName:this.food.categoryName,
						//菜品Id
						dishesId:this.food.dishedId,
						//菜品数量
						dishesCount:this.nowNum,
						//单位
						unitId:this.scaleId,
						unitName:this.scaleName,
						//菜品名称
						dishesName:this.food.name,
						//菜品价格
						dishesPrice:dishesPrice,
						//菜品会员价
						memberPrice:memberPrice,
						//菜品图片Url
						dishPicUrl:this.food.picUrl,
						//菜品做法
						cuisineId:this.cuisineId,
						cuisineName:this.cuisineName,
						cuisinePrice:this.cuisinePrice,
						//菜品备注
						foodTip:this.cuisineName + this.sideDishesName + this.scaleName,
						//菜品属性
						foodAttr:this.attrList,
						//菜品属性名字
						foodAttrName:this.attrListName,
						//配菜
						sideDishes:this.sideDishesList,
						 //配菜价格
						sideDishesPrice:sideDishesPrice,
						//配菜会员价
						sideMemberPrice:sideMemberPrice,
						//该菜品的全部总价
						oneAllPrice: (Number(sideDishesPrice) + Number(dishesPrice) + Number(this.cuisinePrice)).toFixed(2),
						//该菜品的会员总价
						oneAllMemberPrice: (Number(sideMemberPrice) + Number(memberPrice) + Number(this.cuisinePrice)).toFixed(2)
					}
				)
				//reset参数
				this.scaleName=''
				this.scaleId=0
				this.scalePrice=0
				//配菜
				this.sideDishesList=[]
				this.sideDishesName=''
				//做法Id
				this.cuisineId=0
				this.cuisineName=''
				this.cuisinePrice=0
				this.attrListName = ''
				console.log()
			}
		}
		,
		updated(){
			//规格
			var obj1 = document.getElementsByClassName('scaleLabel')[0]
			var oSpan1 = obj1.getElementsByTagName('span')
				for(var i=0;i<oSpan1.length;i++){
					let that = this
					oSpan1[i].onclick = function(){
						for(var j=0;j<oSpan1.length;j++){
							oSpan1[j].className = ''
						}
						this.className = 'scaleActive'
						that.judge()
					}
				}
			//做法
			var obj = document.getElementsByClassName('makeWaysLabel')[0]
			var oSpan3 = obj.getElementsByTagName('span')
				for(var i=0;i<oSpan3.length;i++){
					oSpan3[i].index = i
					let that = this
					oSpan3[i].onclick = function(){
						for(var j=0;j<oSpan3.length;j++){
							oSpan3[j].className = ''
						}
						this.className = 'makeWaysActive'
						that.judge()
					}
				}
			//配菜
			var obj = document.getElementsByClassName('sideDishesLabel')[0]
			var oSpan0 = obj.getElementsByTagName('span')
			for(var i=0;i<oSpan0.length;i++){
				oSpan0[i].index = i
				let that = this
				oSpan0[i].ontouchstart = function(){
					if(this.className){
						var temp = true
					}
					if(temp){
						this.className = ''
					}
					if(!temp){
						this.className = 'sideDishesActive'
					}
					that.judge()
				}
			}
		}
		,
		computed:{
			imgToDetail(){
				return this.$store.state.imgToDetail
			}
		}
		,
		watch:{
			imgToDetail(){
				if(this.imgToDetail){
					//dom更新完毕之后执行
					Vue.nextTick(() => {
						this.enterPage()
						this.judge()
					})
				}
			}
		}
	}
</script>
<style lang="scss">
	.topDetail{
		width:100%;
		height:100%;
		z-index: 2001;
		.detailPage{
			width:100%;
			height:100%;
			opacity: 0.5;
			background:#000;
		}
		.detailPage-inner{
			position:fixed;
			top:0.61rem;
			left:5%;
			width:3.4rem;
			height:70%;
			border-radius:0.08rem;
			background:white;
			/*删除按钮*/
			.delBtn{
				position:absolute;
				right:0.1rem;
				top:0.1rem;
				img{
					width:0.15rem;
					height:0.15rem;
				}
			}
			/*菜品名字和价格*/
			.dishInfo{
				display: flex;
				width:100%;
				margin-top:0.25rem;
				.dishPic{
					margin-left:0.15rem;
					img{
						width:1.5rem;
						height:1rem;
						border-radius:4px;
					}
				}
				.dishOtherInfo{
					display:flex;
					flex-direction: column;
					justify-content: space-between;
					width:100%;
					margin-left:0.15rem;
					/*菜名*/
					p:nth-child(1){
						width:100%;
						overflow: hidden;
						text-overflow:ellipsis;
						white-space: nowrap;
						font-size: 0.2rem;
						color: #282828;
					}
					/*正常价*/
					p:nth-child(2){
						display:flex;
						justify-content: flex-end;
						width:100%;
						span{
							margin-right:0.15rem;
							font-size: 0.22rem;
							color: #FF0000;
							i{
								font-style:normal;
								font-size:0.15rem;
							}
						}
					}
				}
			}
			/*加减按钮盒子*/
			.numBox{
				position:absolute;
				bottom:0.1rem;
				right:0.8rem;
				display: flex;
				justify-content: flex-end;
				.nowNum{
					position:relative;
					width:1rem;
					height:0.3rem;
					.iconfont{
						width:0.27rem;
						height:0.27rem;
					}
					.icon-jian{
						color:#F5A623;
						padding:6px;
					}
					.icon-plus{
						position:absolute;
						top:0%;
						right:0.03rem;
						color:#F5A623;
						background:white;
						padding:6px;
					}
					.tempNum{
						position:absolute;
						top:32%;
						left:43%;
						font-size:0.16rem;
					}
				}
			}
			/*可以滚动区域*/
			.scroll-area{
				width:100%;
				height:65%;
				overflow: scroll;
				/*规格*/
				.scale-container{
					display: flex;
					flex-direction: column;
					width:100%;
					.leftWords{
						display: flex;
						align-items: center;
						width:1rem;
						height:0.3rem;
						margin-left:0.18rem;
						span:nth-child(1){
							font-size: 0.13rem;
							color: #282828;
						}
						span:nth-child(2){
							margin-left:0.1rem;
							font-size: 0.13rem;
							color: #282828;
							i{
								font-style:normal;
							}
						}
					}
					.scaleLabel{
						display: flex;
						justify-content: flex-start;
						width:100%;
						flex-wrap:wrap;
						span{
							display: flex;
							justify-content: center;
							align-items: center;
							width:0.7rem;
							height:0.3rem;
							margin-top:0.05rem;
							margin-left:0.1rem;
							font-size:0.12rem;
							color: #A0A0A0;
							border: 1px solid #E4E4E4;
						}
						.scaleActive{
							color: #31C4C3;
							border: 1px solid #31C4C4;
						}
					}
				}
				/*做法*/
				.makeWays-container{
					display: flex;
					flex-direction:column;
					width:100%;
					.leftWords{
						display: flex;
						align-items: center;
						width:1rem;
						height:0.3rem;
						margin-left:0.18rem;
						span:nth-child(1){
							font-size: 0.13rem;
							color: #282828;
						}
						span:nth-child(2){
							margin-left:0.1rem;
							font-size: 0.13rem;
							color: #282828;
							i{
								font-style:normal;
							}
						}
					}
					.makeWaysLabel{
						display: flex;
						justify-content: flex-start;
						width:100%;
						height:0.32rem;
						span{
							display: flex;
							justify-content: center;
							align-items: center;
							width:0.7rem;
							height:0.3rem;
							overflow: hidden;
							text-overflow:ellipsis;
							white-space: nowrap;
							margin-left:0.1rem;
							font-size:0.12rem;
							color: #A0A0A0;
							border: 1px solid #E4E4E4;
						}
						.makeWaysActive{
							color: #31C4C3;
							border: 1px solid #31C4C4;
						}
					}
				}
				/*配菜*/
				.sideDishes-container{
					display: flex;
					flex-direction: column;
					width:100%;
					.leftWords{
						display: flex;
						align-items: center;
						width:1rem;
						height:0.3rem;
						margin-left:0.18rem;
						span:nth-child(1){
							font-size: 0.13rem;
							color: #282828;
						}
						span:nth-child(2){
							margin-left:0.1rem;
							font-size: 0.13rem;
							color: #282828;
							i{
								font-style:normal;
							}
						}
					}
					.sideDishesLabel{
						display: flex;
						justify-content: flex-start;
						flex-wrap:wrap;
						width:100%;
						height:0.32rem;
						span{
							display: flex;
							justify-content: center;
							align-items: center;
							width:0.7rem;
							height:0.3rem;
							margin-top:0.05rem;
							margin-left:0.1rem;
							font-size:0.12rem;
							color: #A0A0A0;
							border: 1px solid #E4E4E4;
						}
						.sideDishesActive{
							color: #31C4C3;
							border: 1px solid #31C4C4;
						}
					}
				}
			}
			/*确认按钮*/
			.affirmBtn{
				position: absolute;
				bottom:0.1rem;
				right:0.8rem;
				span{
					display: inline-block;
					width:1rem;
					height:0.36rem;
					text-align: center;
					line-height: 0.36rem;
					font-size:0.18rem;
					color:#fff;
					background: #31C4C3;
					border-radius: 8px 8px 0 0;
				}
			}
		}
	}
</style>