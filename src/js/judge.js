import {
		findMakeWayId,findMakeWayPrice,
		findScaleMemberPrice,findScaleId,findScalePrice,
		findSideDishesUnitName,findSideDishesUnitId,findSideDishesId,findSideDishesName,findSideDishesPrice,findSideDishesCategoryId,findSideDishesCategoryName,findSideDishesPicUrl,findSideMemberPrice,findSideScaleName,findSideScaleId,findSideScalePrice,findSideScaleMemberPrice,findSideMakeName,findSideMakeId,findSideMakePrice
		} from '../js/memoJoin.js'


let judge = (that) => {
		//规格
		for(let i=0;i<$('.scaleLabel span').length;i++){
				if($('.scaleLabel').find('span').eq(i).hasClass('scaleActive')){
					that.scaleName = $('.scaleLabel span').eq(i).html()
					that.scaleId = findScaleId(that.scaleName,that.food.specificationList)
					//规格价
				that.scalePrice = (findScalePrice(that.scaleName,that.food.specificationList)/100).toFixed(2)
				that.$store.state.initSomePrice.scalePrice = that.scalePrice
				//会员规格价
				that.scaleMemberPrice = findScaleMemberPrice(that.scaleName,that.food.specificationList)
					that.scaleName = that.scaleName.replace(/\n/g,'').replace(/\t/g,'')
				}
			}
		let sideDishesPrice = 0
		let sideDishesNameArry = []
		//配菜
		for(let i=0;i<$('.sideDishesLabel span').length;i++){
				if($('.sideDishesLabel').find('span').eq(i).hasClass('sideDishesActive')){
					//配菜的name
					let tempSideDishesName = findSideDishesName($('.sideDishesLabel span').eq(i).html(),that.food.sideDishesInfoList)
					//配菜的价格
					let tempSideDishesPrice = findSideDishesPrice($('.sideDishesLabel span').eq(i).html(),that.food.sideDishesInfoList)
					//配菜会员价
					let tempSideMemberPrice = findSideMemberPrice($('.sideDishesLabel span').eq(i).html(),that.food.sideDishesInfoList)
					//配菜的默认规格价格
					let sideScalePrice = findSideScalePrice($('.sideDishesLabel span').eq(i).html(),that.food.sideDishesInfoList)
					//配菜的默认规格会员价格
					let sideScaleMemberPrice = findSideScaleMemberPrice($('.sideDishesLabel span').eq(i).html(),that.food.sideDishesInfoList)
					//配菜的默认做法
					let sideMakeName = findSideMakeName($('.sideDishesLabel span').eq(i).html(),that.food.sideDishesInfoList)
					//配菜的默认做法Id
					let sideMakeId = findSideMakeId($('.sideDishesLabel span').eq(i).html(),that.food.sideDishesInfoList)
					//配菜的默认做法价格
					let sideMakePrice = findSideMakePrice($('.sideDishesLabel span').eq(i).html(),that.food.sideDishesInfoList)
					//计算配菜总价
					sideDishesPrice += Number((sideScalePrice+sideMakePrice)/100)
					//affirm页面需要展示的配菜字段
					that.sideDishesName += $('.sideDishesLabel span').eq(i).html() + ' '
					//选中的配菜的名字组成的数组
					let temp = $('.sideDishesLabel span').eq(i).html().replace(/\t/g,'').replace(/\n/g,'')
					//把选中的配菜的名字放进数组
					sideDishesNameArry.push(temp)
				}
		}
		if($('.sideDishesLabel span').length>0){
			that.nowSideDishesPrice = sideDishesPrice
			that.sideDishesName = that.sideDishesName.replace(/\t/g,'').replace(/\n/g,'')
		}
		//做法
		if($('.makeWaysLabel span').length>0){
			that.food.showCuisineIndex = true
			for(let i=0;i<$('.makeWaysLabel span').length;i++){
    				if($('.makeWaysLabel').find('span').eq(i).hasClass('makeWaysActive')){
    					that.cuisineName = $('.makeWaysLabel span').eq(i).html()
    					that.cuisineName = that.cuisineName.replace(/\t/g,'').replace(/\n/g,'')
    					that.$store.state.initSomePrice.cuisinePrice = findMakeWayPrice(that.cuisineName,that.food.makingList)/100
    					that.cuisinePrice = findMakeWayPrice(that.cuisineName,that.food.makingList)/100
    				}
    			}
		}
		else{
			that.food.showCuisineIndex = false
			that.$store.state.initSomePrice.cuisinePrice = 0
		}
		//现在规格的单价
		that.nowPrice = (Number(that.nowSideDishesPrice) + Number(that.cuisinePrice) + Number(that.scalePrice)).toFixed(2)
		//如果存在
		let tempTips = that.cuisineName + that.sideDishesName + that.scaleName
		that.food.lastFoodClass.cuisineName = that.cuisineName
		that.food.lastFoodClass.sideDishesName = sideDishesNameArry
		that.food.lastFoodClass.scaleName = that.scaleName
		that.food.lastFoodClass.id = that.food.id
		that.food.lastFoodClass.nowPrice = that.nowPrice
		//计算出当前属性的list
		let nowAttrList = ''
		for(let i=0;i<that.food.dishAttr.length;i++){
			nowAttrList += that.food.dishAttr[i].index + ','
		}
		nowAttrList = nowAttrList.substr(0,nowAttrList.length-1)
		//判断当前选择的类型组合是否在购物车中有,有便加上
		let showNowNumIndex = false
		for(let i=0;i<that.$store.state.saveCartList.length;i++){
			that.$store.state.saveCartList[i].foodTip=that.$store.state.saveCartList[i].foodTip.replace(/\t/g,'').replace(/\n/g,'')
			if(that.$store.state.saveCartList[i].foodTip == tempTips&that.$store.state.saveCartList[i].dishesId == that.food.id&nowAttrList == that.$store.state.saveCartList[i].foodAttr){
				that.nowNum = that.$store.state.saveCartList[i].dishesCount
				showNowNumIndex = true
			}
		}
		if(!showNowNumIndex){
			that.nowNum = 0 
		}
		that.cuisineName = ''
		that.sideDishesName = ''
		that.scaleName = ''
}
export default judge