//做法Id
function findMakeWayId(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].itemName)>-1){
			var temp = data[i].id
		}
	}
	return temp
}
//做法价格
function findMakeWayPrice(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].itemName)>-1){
			var temp = data[i].itemPrice
		}
	}
	return temp
}
//配菜
function findSideDishesId(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			var temp = data[i].sideDishesId
		}
	}
	return temp
}
function findSideDishesName(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			var temp = data[i].dishesName
		}
	}
	return temp
}
function findSideDishesPrice(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			var temp = data[i].sidePrice
		}
	}
	return temp
}
function findSideDishesUnitName(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			var temp = data[i].sideDishesUnitName
		}
	}
	return temp
}
function findSideDishesUnitId(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			var temp = data[i].sideDishesUnitId
		}
	}
	return temp
}
//配菜categoryId
function findSideDishesCategoryId(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			var temp = data[i].sideCategoryId
		}
	}
	return temp
}
//配菜categoryName
function findSideDishesCategoryName(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			var temp = data[i].sideCategoryName
		}
	}
	return temp
}
//配菜的图片
function findSideDishesPicUrl(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			var temp = data[i].sidePicUrl
		}
	}
	return temp
}
//配菜会员价
function findSideMemberPrice(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			if( data[i].sideMemberPrice){
				var temp = data[i].sideMemberPrice
			}
			else{
				var temp = 0
			}
		}
	}
	return temp
}
//配菜规格名字
function findSideScaleName(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			if(data[i].sideDishesSpecName){
				var temp = data[i].sideDishesSpecName
			}
		}
	}
	return temp
}
//配菜规格Id
function findSideScaleId(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			if(data[i].sideDishesSpecId){
				var temp = data[i].sideDishesSpecId
			}
		}
	}
	return temp
}
//配菜规格价格
function findSideScalePrice(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			if(data[i].sidePrice){
				var temp = data[i].sidePrice
			}
		}
	}
	return temp
}
//配菜规格会员价
function findSideScaleMemberPrice(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			if(data[i].sideMemberPrice){
				var temp = data[i].sideMemberPrice
			}
		}
	}
	return temp
}

//规格Id
function findScaleId(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].itemName)>-1){
			var temp = data[i].id
		}
	}
	return temp
}
//规格价格
function findScalePrice(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].itemName)>-1){
			var temp = data[i].itemPrice
		}
	}
	return temp
}
//规格会员价格
function findScaleMemberPrice(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].itemName)>-1){
			if(data[i].itemMemberPrice){
				var temp = data[i].itemMemberPrice
			}
			else{
				var temp = 0
			}
		}
	}
	return temp
}
//备注Id
function findTipsId(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].value)>-1){
			var temp = data[i].id
		}
	}
	return temp
}
//配菜做法的name
function findSideMakeName(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			if(data[i].sideDishesMakingName){
				var temp = data[i].sideDishesMakingName
			}
			else{
				var temp = null
			}
		}
	}
	return temp
}
//配菜做法的Id
function findSideMakeId(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			if(data[i].sideDishesMakingId){
				var temp = data[i].sideDishesMakingId
			}
			else{
				var temp = null
			}
		}
	}
	return temp
}
//配菜做法的价格
function findSideMakePrice(choose,data){
	for(let i=0;i<data.length;i++){
		if(choose.indexOf(data[i].dishesName)>-1){
			if(data[i].sideDishesMakingPrice){
				var temp = data[i].sideDishesMakingPrice
			}
			else{
				var temp = null
			}
		}
	}
	return temp
}

export {
	findAddedDishesPrice,
	findAddedDishesName,
	findAddedDishesId,
	findMemoId,
	findFlavorId,
	findMakeWayId,
	findMakeWayPrice,
	findSideDishesUnitName,
	findSideDishesUnitId,
	findSideDishesId,
	findSideDishesName,
	findSideDishesPrice,
	findSideDishesCategoryId,
	findSideDishesCategoryName,
	findSideDishesPicUrl,
	findSideMemberPrice,
	findSideScaleName,
	findSideScaleId,
	findSideScalePrice,
	findSideScaleMemberPrice,
	findScaleId,
	findScalePrice,
	findScaleMemberPrice,
	findTipsId,
	findSideMakeName,
	findSideMakeId,
	findSideMakePrice
}