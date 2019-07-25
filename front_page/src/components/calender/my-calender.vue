<template>
	<div class="date-picker__time-header" ref="datePicker">
		<div class="clock"><strong>{{curClock}}</strong></div>
		<div class="date-event active">
			<input type="text" v-show="options.text" class="calender-input" v-model="dateText" @click="openDate($event)">
		</div>
		<div class="date-pos" ref="datePos" v-clickoutside="() => showMenu = true">
			<template v-if="showMenu">
				<full-date 
				:dateType="options.dateType" 
				:events="options.events" 
				:compareTime="options.compareTime" 
				:styles="options.styles"
				:initOptions="initOptions"
				@new-initOptions="newinitOptions"
				></full-date>
			</template>
		</div>
	</div>
</template>

<script>
	// import clickoutside from 'element-ui/src/utils/clickoutside';
	import clickoutside from '../utils/clickoutside';
	import fullDate from './fullDate'
	import moment from 'moment'
	export default {
		name: 'my-calender',
		data: function() {
			return {
				curClock:'',
				showMenu: true,
				initOptions:{
					curnow: new Date(),
					initnow: new Date(),
					inittype: false
				}
			}
		},
		props: {
			'options': {
				type: Object,
				default: {
					dateType: 'day',
					events: '',
					compareTime: [],
					text:'',
					styles:''
				}
			},
		},
		directives: {
			clickoutside
		},
		computed: {
			curNow() {
				return this.initOptions.curnow
			},
			dateText() {
				let valueMoment = this.curNow
				if(this.options.dateType == 'year') { //年
					return moment(valueMoment).format('YYYY年')
				} else if(this.options.dateType == 'month') { //月份
					return moment(valueMoment).format('YYYY年M月')
				} else if(this.options.dateType == 'day') { //天
					return moment(valueMoment).format('YYYY年M月D日')
				} else if(this.options.dateType == 'quarter') { //季度
					let newM = moment(valueMoment).format('Q') * 3 - 3
					return moment(valueMoment).format('YYYY年第Q季度')
				} else if(this.options.dateType == 'week') { //周
					var s_week = moment(this.getRangeWeek[0]).format('M月D日')
					var e_week = moment(this.getRangeWeek[1]).format('M月D日')
					return s_week + '-' + e_week;
				}
			},
			getRangeWeek() {
				var startStop = []
				var currentDate = this.curNow;
				var week = moment(currentDate).format('E');
				var minusDay = week != 0 ? week - 1 : 6;
				var monday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - minusDay);
				var sunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + (6 - minusDay));
				startStop.push(monday); //本周起始时间
				startStop.push(sunday); //本周终止时间
				return startStop;
			},
		},
		components: {
			fullDate
		},
		mounted() {
			this.getDate()
		},
		methods: {
			getDate() {
		      setInterval(()=>{
		        let oldDate = new Date('1970/1/1 00:00:00');
		        let oldTime = oldDate.getTime();
		        let newDate = new Date();
		        let newTime = newDate.getTime();//现在的毫秒数
		        let second = Math.floor((newTime - oldTime) / 1000);//现在距离1970年的毫秒数
		        let day = Math.floor(second / 86400);//整数部分代表的是天；一天有24*60*60=86400秒 ；
		        second = second % 86400;//余数代表剩下的秒数；
		        let hour = Math.floor(second / 3600);//整数部分代表小时；
		        second %= 3600; //余数代表 剩下的秒数；
		        let minute = Math.floor(second / 60);
		        second %= 60;
		        this.curClock = this.$formatDate(newDate)+' '+hour+':'+minute+':'+second;
		      }, 1000)
		    },
			newinitOptions(msg){
				this.initOptions.curnow = msg.curnow
				this.initOptions.initnow = msg.initnow
				this.initOptions.inittype = msg.inittype
            },
			openDate: function(e) {
				this.showMenu = true
				var _this = this
				window.setTimeout(function() {
					var datePos = _this.$refs.datePos;
					var left = e.target.offsetLeft;
					var top = e.clientY;
					var maxHeight = document.getElementsByTagName("body")[0].offsetHeight + document.documentElement.scrollTop;
					var bodywidth = document.getElementsByTagName("body")[0].offsetWidth
					var targetHeight = datePos.offsetHeight;
					top = top + targetHeight > maxHeight ? maxHeight - targetHeight - 10 : top;
					datePos.style.left = (e.clientX - bodywidth/1920 * 150) + 'px';
					datePos.style.top = top + 'px'; // 指定创建的DIV在文档中距离顶部的位置
					datePos.style.position = 'absolute'; // 为新创建的DIV指定绝对定位
				},10)
				//重置日历组件数据
				if(!this.options.text) {
					this.initOptions.curnow = new Date()
					this.initOptions.initnow = new Date()
					this.initOptions.inittype = false
				}
			}
		}
	}
</script>
<style>
	.calender-input {
		background: #ececec;
		text-indent: 15px;
		height: 30px;
		max-width: 220px;
		border-radius: 15px;
		outline: none;
		border: none;
	}
	
	.calender-see {
		display: inline-block;
		width: 30px;
		height: 28px;
		margin: 0 7px;
		cursor: pointer;
		border-radius: 2px;
		background: #ececec;
		outline: none;
		border: none;
	}
	.date-picker__time-header{
		display:inline-block
	}
</style>