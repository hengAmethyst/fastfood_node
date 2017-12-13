<template>
	<div class="yourInfo">
		<div class="header">
			<i class='iconfont icon-zuojiantou' @click="back"></i>
			<span>个人资料</span>
		</div>
		<!--生日赠礼提醒-->
		<div class="birTip">
			<span>{{birTip}}</span>
		</div>
		<!--选项-->
		<div class="itemList">
			<ul>
				<!--名字-->
				<li class="userName">
					<b>姓名</b>
					<input type="text" :placeholder="realName" v-model="realName"/>
				</li>
				<!--性别-->
				<li class="genders">
					<b>性别</b>
					<div class="gender">
						<div class="genderBox">
							<p class="boySilence" ref="boy" @click="chooseBoy">
								<span></span>
							</p>
							<p class="boyC">男</p>
							
							<p class="girlSilence" ref="girl" @click="chooseGirl">
								<span></span>
							</p>
							<p class="girlC">女</p>
						</div>
					</div>
				</li>
				<!--生日-->
				<li class="birthday">
					<b>生日</b>
					<input type="text" v-model="birthday" :placeholder="birthday" @focus="openPicker" ref="birTime"/>
				</li>
				<!--地址-->
				<li @click="showPA.show=!showPA.show" class="area">
					<b>地区</b>
					<b v-if="!showArea.show">
						<i>{{this.$store.state.memberRegion}}</i>
						<img src="../../../assets/icons/箭头.png"/>
					</b>
					<b v-else>
						{{areaInner.inner}}
					</b>
				</li>
				<!--详细地址-->
				<li class="detailAddress">
					<b>地址</b>
					<input type="text" :placeholder="address" style="text-align:right" v-model="address"/>
				</li>
			</ul>
		</div>
		<!--完成按钮-->
		<div class="btn">
			<p @click="submitModification">完 成</p>
		</div>
		<!--地区选择器-->
		<pickAddress v-show="showPA.show" :showPA="showPA" :areaInner="areaInner" :showArea="showArea"></pickAddress>
		<!--时间picker器-->
		<c-datetime-picker ref="picker" type="date" v-model="timepicker" @confirm="getBir(timepicker)" :startDate="beginDate"></c-datetime-picker>
	</div>
</template>
<script>
import Vue from 'vue'
import pickAddress from './pickAddress'
import {DatetimePicker} from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.component('c-datetime-picker',DatetimePicker)
	export default{
		data(){
			return{
				birTip:'填写生日信息将有机会获得生日赠礼!',
				//显示pickAddress组件
				showPA:{show:false},
				//选择的区域内容
				areaInner:{inner:null},
				//显示区域内容还是--请选择
				showArea:{show:false},
				//控制男女
				genderAllow:false,
				allow1:false,
				allow2:false,
				allow3:false,
				allow4:false,
				// timepicker组件
				timepicker:null,
				beginDate:new Date("1900/1/1"),
				birthday:null,
				realName:'完善姓名',
				//详细地址
				address:'请填写详细地址'
			}
		}
		,
		components:{
			pickAddress,
			'c-datetime-picker':DatetimePicker
		}
		,
		methods:{
			back(){
				this.$router.push({path:'/order/info'})
			},
			//选择男
			chooseBoy(){
				this.$refs.boy.className = 'boy'
				this.$refs.girl.className = 'girlSilence'
				this.radio = 1
			},
			//选择女
			chooseGirl(){
				this.$refs.girl.className = 'girl'
				this.$refs.boy.className = 'boySilence'
				this.radio = 0
			},
			//生日标准时间转换
			getBir(target){
				this.birthday = this.getTaskTime(target)
				console.log(this.birthday)
			},
			openPicker() {
				this.$refs.picker.open()
			},
			getTaskTime(strDate) {
		        let date = new Date(strDate);
		        let y = date.getFullYear();
		        let m = date.getMonth() + 1;
		        m = m < 10 ? ('0' + m) : m;
		        let d = date.getDate();
		        d = d < 10 ? ('0' + d) : d;
		
		        return y + "-" + m + "-" + d
    			},
    			//提交修改
    			submitModification(){
    				//提交参数
    				let tempParam = {
    					"name":this.realName,
    					"region":this.areaInner.inner,
    					"address":this.address,
    					"sex":this.radio,
    					"birthday":this.birthday,
    					"id":this.$store.state.memberUserId
    				}
    				this.$http.post(this.$store.state.accountHttp+"/jinghan-account/api/user/updateMember",
				JSON.stringify({"param":tempParam})
				,{emulateJSON:true})
				.then(function(res){
					console.log(res)
				})
    			}
		}
		,
		created(){
			Vue.nextTick(() => {
				//初始化生日
				this.birthday = this.getTaskTime(this.$store.state.memberBir)
				//名字
				this.realName = this.$store.state.memberName
				//address
				this.address = this.$store.state.memberAddress
				if(this.$store.state.userGender==0){
					this.$refs.girl.className = 'girl'
					this.$refs.boy.className = 'boySilence'
					this.radio = 0
				}
				else{
					this.$refs.boy.className = 'boy'
					this.$refs.girl.className = 'girlSilence'
					this.radio = 1
				}
			})
			
		}
	}
</script>
<style lang="scss">
	.yourInfo{
		width:100%;
		height:100%;
		.header{
			position:relative;
			display:flex;
			justify-content: center;
			align-items:center;
			width:100%;
			height:0.6rem;
			i{
				position:absolute;
				top:50%;
				left:0.15rem;
				transform: translateY(-50%);
				font-size:0.2rem;
			}
			span{
				font-size:0.18rem;
				color:#282828;
			}
		}
		/*生日赠礼提醒*/
		.birTip{
			display:flex;
			justify-content: center;
			align-items: center;
			width:100%;
			height:0.34rem;
			span{
				color:#30bfbe;
			}
		}
		/*选项*/
		.itemList{
			width:100%;
			ul{
				width:100%;
				li{
					display: flex;
					justify-content: space-between;
					align-items: center;
					width:100%;
					height:0.45rem;
					border-bottom:1px solid #F0F0F0;
					b:nth-child(1){
						margin-left:0.2rem;
						font-style:normal;
						font-weight: normal;
						font-size:0.15rem;
						color:#282828;
					}
					b:nth-child(2){
						margin-right:0.15rem;
						font-size:0.15rem;
					}
				}
				/*userName*/
				.userName{
					input{
						width:1rem;
						height:100%;
						text-align: center;
						font-size:0.16rem;
						border:none;
					}
				}
				/*生日*/
				.birthday{
					input{
						width:1rem;
						height:100%;
						font-size:0.15rem;
						color: #A0A0A0;
						padding-left:0.15rem;
						border:none;
					}
				}
			
				/*gender*/
				.genders{
					.gender{
						margin-right:0.2rem;
						.genderBox{
							display: flex;
							align-items: center;
							.boy{
								display: flex;
								justify-content: center;
								align-items: center;
								width:0.19rem;
								height:0.19rem;
								margin-left:0.15rem;
								border: 1px solid #30BFBE;
								border-radius: 100%;
								span{
									display: inline-block;
									width:0.11rem;
									height:0.11rem;
									border-radius: 100%;
									background: #30BFBE;
								}
							}
							.boySilence{
								display: flex;
								justify-content: center;
								align-items: center;
								width:0.19rem;
								height:0.19rem;
								margin-left:0.15rem;
								border: 1px solid #E4E4E4;
								border-radius: 100%;
							}
							/*男汉字*/
							.boyC{
								margin-left:0.1rem;
								font-size:0.16rem;
								color: #282828;
							}
							.girl{
								display: flex;
								justify-content: center;
								align-items: center;
								width:0.19rem;
								height:0.19rem;
								margin-left:0.4rem;
								border: 1px solid #30BFBE;
								border-radius: 100%;
								span{
									display: inline-block;
									width:0.11rem;
									height:0.11rem;
									border-radius: 100%;
									background: #30BFBE;
								}
							}
							/*女汉字*/
							.girlC{
								margin-left:0.1rem;
								font-size:0.16rem;
								color: #282828;
							}
							.girlSilence{
								display: flex;
								justify-content: center;
								align-items: center;
								width:0.19rem;
								height:0.19rem;
								margin-left:0.4rem;
								border: 1px solid #E4E4E4;
								border-radius: 100%;
							}
						}
					}
				}
				.area{
					b:nth-child(2){
						display:flex;
						align-items:center;
						i{
							margin-right:0.1rem;
							font-style:normal;
							font-size:0.15rem;
							color:#a0a0a0;
						}
						img{
							width:0.1rem;
							height:0.16rem;
						}
					}
				}
				/*详情地址*/
				.detailAddress{
					input{
						width:2.8rem;
						height:100%;
						padding-right:0.15rem;
						font-size:0.18rem;
						border:none;
					}
				}
			}
		}
		/*完成按钮*/
		.btn{
			display: flex;
			justify-content: center;
			align-items: center;
			width:100%;
			height:0.41rem;
			margin-top:0.75rem;
			p{
				display: flex;
				justify-content: center;
				align-items:center;
				width:2.2rem;
				height:0.41rem;
				font-size:0.18rem;
				color:#fff;
				border-radius:6px;
				background:#30bfbe;
			}
		}
	}
</style>