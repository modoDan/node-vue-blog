<template>
	<div class="vue-calendar-picker" :class="{'wider-calendar':dateType=='week'}">
		<div id="calendar" :type="dateType">
			<div class="month">
				<ul>
					<li class="arrow" @click="pickPre(currentYear,currentMonth,1)" v-if="dateType=='day'">&lt;&lt;</li>
					<li class="arrow" @click="pickPre(starYear,currentMonth)" v-if="dateType=='year'">&lt;</li>
					<li class="arrow" @click="pickPre(currentYear,currentMonth)" v-else>&lt;</li>
					<li class="year-month">
						<span class="choose-year" v-if="dateType=='year'">{{ rangYear }}</span>
						<span class="choose-year" v-else>{{ currentYear }}年</span>
						<span class="choose-month" v-if="dateType=='day'">{{ currentMonth }}月</span>
					</li>
					<li class="arrow" @click="pickNext(starYear,currentMonth)" v-if="dateType=='year'">&gt;</li>
					<li class="arrow" @click="pickNext(currentYear,currentMonth)" v-else>&gt;</li>
					<li class="arrow" @click="pickNext(currentYear,currentMonth,1)" v-if="dateType=='day'">&gt;&gt;</li>
				</ul>
			</div>
			<ul class="weekdays" v-if="dateType=='day'">
				<li>一</li>
				<li>二</li>
				<li>三</li>
				<li>四</li>
				<li>五</li>
				<li>六</li>
				<li>日</li>
			</ul>
			<ul class="days" v-if="dateType=='day'">
				<li @click="pick(day)" v-for="(day,index) in days" :key="index" :class="tickClass(day)?styles:''">
					<!--其他月-->
					<span v-if="day.getMonth()+1 != currentMonth" class="other-month">{{ day.getDate() }}</span>
					<span v-else>
   						<!--今天-->
   							<span v-if="day.getFullYear() == curNow.getFullYear() && day.getMonth() == curNow.getMonth() && day.getDate() == curNow.getDate()" class="active">{{ day.getDate() }}</span>
					<span v-else>{{ day.getDate() }}</span>
					</span>
				</li>
			</ul>
			<ul class="days" v-if="dateType=='month'" :class="'months'">
				<li @click="pick(month)" v-for="(month,index) in months" :key="index" :class="tickClass(month)?styles:''">
					<span v-if="month.getFullYear() == curNow.getFullYear() && month.getMonth() == curNow.getMonth()" class="active">{{ month.getMonth()+1 }}月</span>
					<span v-else>{{ month.getMonth()+1 }}月</span>
				</li>
			</ul>
			<ul class="days" v-if="dateType=='quarter'" :class="'quarters'">
				<li @click="pick(quarter)" v-for="(quarter,index) in quarters" :key="index" v-if="dateType=='quarter'" :class="tickClass(quarter)?styles:''">
					<span v-if="quarter.getFullYear() == curNow.getFullYear() && Math.floor((quarter.getMonth() + 3) / 3) == Math.floor((curNow.getMonth() + 3) / 3)" class="active">第{{ Math.floor((quarter.getMonth() + 3) / 3) }}季度</span>
					<span v-else>第{{ Math.floor((quarter.getMonth() + 3) / 3) }}季度</span>
				</li>
			</ul>
			<ul class="days" v-if="dateType=='week'" :class="'weeks'">
				<li @click="pick(week)" v-for="(week,index) in weeks" :key="index" v-if="dateType=='week'" :class="tickClass(week)?styles:''">
					<span v-if="getYearWeek(week)==getYearWeek(curNow)&&week.getFullYear() == curNow.getFullYear()" class="active">{{getweeks(week)}}</span>
					<span v-else>{{getweeks(week)}}</span>
				</li>
			</ul>
			<ul class="days" v-if="dateType=='year'" :class="'years'">
				<li @click="pick(year)" v-for="(year,index) in years" :key="index" v-if="dateType=='year'" :class="tickClass(year)?styles:''">
					<span v-if="year.getFullYear() == curNow.getFullYear()" class="active">{{ year.getFullYear() }}</span>
					<span v-else>{{ year.getFullYear() }}</span>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import moment from 'moment'
	export default {
		name: 'fullDate',
		data() {
			return {
				currentDay: 1,
				currentMonth: 1,
				currentYear: 1970,
				currentWeek: 1,
				days: [],
				weeks: [],
				years: [],
				months: [],
				quarters: [],
				rangYear: '1970年-1979年',
				starYear: '1970年',
				starWeek: '',
				endWeek: '',
				beforeWeekNum: 1,
				turnType: null,
                now: new Date(),
			}
		},
		props: {
			'dateType': {
				type: String,
				default: 'month'
			},
			'events': {
				default: ''
			},
			'compareTime': {
				type: Array,
				default: []
			},
			'styles': {
				type: String,
				default: ''
			},
			'initOptions': {
				type: Object,
				default: {
					curnow: new Date(),
					initnow: new Date(),
					inittype: false
				}
			},
		},
		computed: {
			curNow() {
				return this.initOptions.curnow
			},
			initNow() {
				return this.initOptions.initnow
			},
			inittype() {
				return this.initOptions.inittype
			},
			checkedDate() {
				let valueMoment = this.curNow
				if(this.dateType == 'year') { //年
					return moment(valueMoment).format("YYYY-01-01");
				} else if(this.dateType == 'month') { //月份
					return moment(valueMoment).format("YYYY-MM-01");
				} else if(this.dateType == 'day') { //天
					return moment(valueMoment).format("YYYY-MM-DD");
				} else if(this.dateType == 'quarter') { //季度
					let newM = moment(valueMoment).format('Q') * 3 - 3
        			return moment(new Date(moment(valueMoment).format('YYYY'),newM,1)).format('YYYY-MM-01')
				} else if(this.dateType == 'week') { //周
					let week = moment(valueMoment).format('E');
					let minusDay = week != 0 ? week - 1 : 6;
					let monday = new Date(valueMoment.getFullYear(), valueMoment.getMonth(), valueMoment.getDate() - minusDay);
					return moment(monday).format("YYYY-MM-DD");
				}
			},
			getCurrentWeek() {
				var startStop = [];
				var now = this.now
				//周一到周日
				var week = moment(now).format('E');
				var minusDay = week != 0 ? week - 1 : 6;
				var monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - minusDay);
				var sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - minusDay));
				startStop.push(monday); //本周起始时间
				startStop.push(sunday); //本周终止时间
				return startStop;
			},
        },
		created: function() {
			this.initData(this.initNow);
		},
		mounted() {
		},
		methods: {
			tickClass(item) {
				let times = moment(item).format('YYYY-MM-DD')
				var set = new Set(this.compareTime)
				if(set.has(times)) {
					return true
				}
			},
			//获得本季度的开端月份
			getQuarterStartMonth: function(nowMonth) {
				var quarterStartMonth = 0;
				if(nowMonth < 4) {
					quarterStartMonth = 0;
				}
				if(3 < nowMonth && nowMonth < 7) {
					quarterStartMonth = 3;
				}
				if(6 < nowMonth && nowMonth < 10) {
					quarterStartMonth = 6;
				}
				if(nowMonth > 9) {
					quarterStartMonth = 9;
				}
				return quarterStartMonth;
			},
			getYearWeek(date) { //获取当年第几周
				var date2 = new Date(date.getFullYear(), 0, 1);
				var day1 = date.getDay();
				if(day1 == 0) day1 = 7;
				var day2 = date2.getDay();
				if(day2 == 0) day2 = 7;
				var d = Math.round((date.getTime() - date2.getTime() + (day2 - day1) * (24 * 60 * 60 * 1000)) / 86400000);
				return Math.floor(d / 7) + 1;
			},
			getweeks(d) {
				var week = moment(d).format('E');
				var minusDay = week != 0 ? week - 1 : 6;
				var monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - minusDay);
				var sunday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (6 - minusDay));
				var s_week = moment(monday).format('M月D日')
				var e_week = moment(sunday).format('M月D日')
				return s_week + '-' + e_week;
            },
			pick: function(date) {
				if(this.dateType == 'week'){
					this.$emit('new-initOptions', {curnow:date,initnow:this.weeks[0],inittype:true})
				}else if(this.dateType == 'quarter'){
					this.$emit('new-initOptions', {curnow:date,initnow:this.quarters[0],inittype:true})
				}else{
					this.$emit('new-initOptions', {curnow:date,initnow:date,inittype:false})
				}
				if(this.events) {//自定义事件
					this.events(this.checkedDate)//传递点击的日历，以供外层需要传值
				}
			},
			pickPre: function(year, month, type) {
				// setDate(0); 上月最后一天
				// setDate(-1); 上月倒数第二天
				// setDate(dx) 参数dx为 上月最后一天的前后dx天
				if(type == 1) { //日历年切换
					var d = new Date(this.formatDate(year, month, 1));
					this.initData(this.formatDate(d.getFullYear() - 1, d.getMonth() + 1, 1));
				} else {
					if(this.dateType == 'day') { //日历月份切换
						var d = new Date(this.formatDate(year, month, 1));
						d.setDate(0);
						this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
					} else if(this.dateType == 'month' || this.dateType == 'quarter') { //月度/季度日历切换
						var d = new Date(this.formatDate(year, month, 1));
						this.initData(this.formatDate(d.getFullYear() - 1, d.getMonth() + 1, 1));
					} else if(this.dateType == 'year') {
						var d = new Date(this.formatDate(year, month, 1));
						this.initData(this.formatDate(d.getFullYear() - 10, d.getMonth() + 1, 1));
					} else if(this.dateType == 'week') {
						this.turnType = -1
						var d = new Date(this.getCurrentWeek[0]);
						d.setDate(this.getCurrentWeek[0].getDate() - 20 * 7);
						this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate()));
					}
				}
			},
			pickNext: function(year, month, type) {
				if(type == 1) {
					var d = new Date(this.formatDate(year, month, 1));
					this.initData(this.formatDate(d.getFullYear() + 1, d.getMonth() + 1, 1));
				} else {
					if(this.dateType == 'day') {
						var d = new Date(this.formatDate(year, month, 1));
						d.setDate(35);
						this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
					} else if(this.dateType == 'month' || this.dateType == 'quarter') {
						var d = new Date(this.formatDate(year, month, 1));
						this.initData(this.formatDate(d.getFullYear() + 1, d.getMonth() + 1, 1));
					} else if(this.dateType == 'year') {
						var d = new Date(this.formatDate(year, month, 1));
						this.initData(this.formatDate(d.getFullYear() + 10, d.getMonth() + 1, 1));
					} else if(this.dateType == 'week') {
						this.turnType = 1
						var d = new Date(this.getCurrentWeek[0]);
						d.setDate(this.getCurrentWeek[0].getDate() + 20 * 7);
						this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, d.getDate()));
					}
				}
			},
			// 返回 类似 2016-01-02 格式的字符串
			formatDate: function(year, month, day) {
				var y = year;
				var m = month;
				if(m < 10) m = "0" + m;
				var d = day;
				if(d < 10) d = "0" + d;
				let moment1 = moment(new Date(year, month-1, day)).format("YYYY-MM-DD")
				console.log('這兩種格式相同----》',y + "-" + m + "-" + d,moment1)
				// return y + "-" + m + "-" + d
				return moment1
			},
			initData: function(cur) {
				var date = new Date(cur);
				this.currentDay = date.getDate();
				this.currentYear = date.getFullYear();
				this.currentMonth = date.getMonth() + 1;
				this.currentQuarter = Math.floor((date.getMonth() + 3) / 3);
				var str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay);
				console.log("today:" + str + "," + moment(new Date()).format("YYYY-MM-DD"));
				if(this.dateType == 'day') {
					this.days.length = 0;
					var dstr = this.formatDate(this.currentYear, this.currentMonth, 1);
					var d = new Date(dstr);
					this.currentWeek = d.getDay(); // 1...6,0
					if(this.currentWeek == 0) {
						this.currentWeek = 7;
					}
					d.setDate(0);
					var pred = new Date(d.getFullYear(), d.getMonth(), d.getDate());//上月末
					for(var i = this.currentWeek - 2; i >= 0; i--) {
						var preT = new Date(pred);
						preT.setDate(preT.getDate() - i);
						this.days.push(preT);
					}
					for(var i = 0; i <= 35-this.currentWeek; i++) {//从每月1号开始起始
						var d = new Date(this.formatDate(this.currentYear, this.currentMonth, 1));
						d.setDate(d.getDate() + i);
						this.days.push(d);
					}
				} else if(this.dateType == 'month') {
					this.months.length = 0;
					for(var i = this.currentMonth - 1; i >= 0; i--) {
						var d = new Date(str);
						d.setFullYear(d.getFullYear(), d.getMonth() - i, 1);
						var mon = d.getMonth() + 1;
						console.log(d.getMonth())
						this.months.push(d);
					}
					for(var i = 1; i <= 12 - this.currentMonth; i++) {
						var d = new Date(str);
						d.setFullYear(d.getFullYear(), d.getMonth() + i, 1);
						this.months.push(d);
					}
				} else if(this.dateType == 'quarter') {
					this.quarters.length = 0;
					for(var i = this.currentQuarter - 1; i >= 0; i--) {
						var d = new Date(str);
						var startMonth = this.getQuarterStartMonth(d.getMonth())
						d.setFullYear(d.getFullYear(), startMonth - 3 * i, 1);
						this.quarters.push(d);
					}
					for(var i = 1; i <= 4 - this.currentQuarter; i++) {
						var d = new Date(str);
						var startMonth = this.getQuarterStartMonth(d.getMonth())
						d.setFullYear(d.getFullYear(), startMonth + 3 * i, 1);
						this.quarters.push(d);
					}
					this.quarters.sort(function(a, b) {
						return a.getMonth() - b.getMonth()
					});
				} else if(this.dateType == 'year') {
					this.years.length = 0;
					this.currentYear = moment(date).format('YY');
					if(this.currentYear < 10) { //00-09年期间
						for(var i = 0; i < 10 - this.currentYear; i++) {
							var d = new Date(str);
							d.setFullYear(d.getFullYear() + 1 * i, 0, 1);
							this.years.push(d);
						}
					} else if(this.currentYear > 10 && this.currentYear < 20) { //10-20年期间
						for(var i = this.currentYear - 10; i >= 0; i--) {
							var d = new Date(str);
							d.setFullYear(d.getFullYear() - 1 * i, 0, 1);
							this.years.push(d);
						}
						for(var i = 1; i < 10 - (this.currentYear - 10); i++) {
							var d = new Date(str);
							d.setFullYear(d.getFullYear() + 1 * i, 0, 1);
							this.years.push(d);
						}
					} else { //20年以后
						for(var i = (this.currentYear - 10) % 10; i >= 0; i--) {
							var d = new Date(str);
							d.setFullYear(d.getFullYear() - 1 * i, 1, 1);
							this.years.push(d);
						}
						for(var i = 1; i < 10 - (this.currentYear - 10) % 10; i++) {
							var d = new Date(str);
							d.setFullYear(d.getFullYear() + 1 * i, 0, 1);
							this.years.push(d);
						}
					}
					this.rangYear = this.years[0].getFullYear() + '年-' + this.years[9].getFullYear() + '年'
					this.starYear = this.years[0].getFullYear()
				} else if(this.dateType == 'week') {
					this.weeks.length = 0;
					this.currentWeekNum = this.getYearWeek(date)
					if(!this.turnType) {
						if(!this.inittype){//第一次默认加载
							if(this.currentWeekNum < 20) {
								for(var i = this.currentWeekNum - 1; i >= 0; i--) {
									this.now = new Date(str);
									var d = new Date(this.getCurrentWeek[0]);
									d.setDate(d.getDate() - 6 * i);
									this.weeks.push(d);
								}
								for(var i = 1; i <= 20 - this.currentWeekNum; i++) {
									this.now = new Date(str);
									var d = new Date(this.getCurrentWeek[0]);
									d.setDate(d.getDate() + 7 * i);
									this.weeks.push(d);
								}
							} else if(this.currentWeekNum > 20 && this.currentWeekNum < 40) {
								for(var i = this.currentWeekNum - 20 - 1; i >= 0; i--) {
									this.now = new Date(str);
									var d = new Date(this.getCurrentWeek[0]);
									d.setDate(d.getDate() - 7 * i);
									this.weeks.push(d);
								}
								for(var i = 1; i <= 20 - (this.currentWeekNum - 20); i++) {
									this.now = new Date(str);
									var d = new Date(this.getCurrentWeek[0]);
									d.setDate(d.getDate() + 7 * i);
									this.weeks.push(d);
								}
							} else {
								for(var i = this.currentWeekNum - 40 - 1; i >= 0; i--) {
									this.now = new Date(str);
									var d = new Date(this.getCurrentWeek[0]);
									d.setDate(d.getDate() - 7 * i);
									this.weeks.push(d);
								}
								for(var i = 1; i <= 20 - (this.currentWeekNum - 40); i++) {
									this.now = new Date(str);
									var d = new Date(this.getCurrentWeek[0]);
									d.setDate(d.getDate() + 7 * i);
									this.weeks.push(d);
								}
							}
						}else{//选中日历后再一次进入，从本页日历第一周开始
							var firstW = date;
							for(var i = 0; i < 20; i++) {
								var d = new Date(firstW)
								this.now = d;
								d.setDate(d.getDate() + 7 * i);
								this.weeks.push(d);
							}
						}
					} else if(this.turnType == -1) { //向前翻
						if(this.starWeek > this.currentWeekNum) {
							for(var i = 20 - (this.starWeek - this.currentWeekNum); i >= 0; i--) { //不包括自己33
								this.now = new Date(str);
								var d = new Date(this.getCurrentWeek[0]); //每个周的起始日期开始
								d.setDate(d.getDate() - 7 * i);
								this.weeks.push(d);
							}
							for(var i = 1; i <= this.starWeek - this.currentWeekNum - 1; i++) {
								this.now = new Date(str);
								var d = new Date(this.getCurrentWeek[0]);
								d.setDate(d.getDate() + 7 * i);
								this.weeks.push(d);
							}
						} else {
							var totalweek = 20 - this.beforeWeekNum + this.currentWeekNum; //前一年一共多少周
							console.log(totalweek)
							this.starWeek = this.starWeek + totalweek
							for(var i = 20 - (this.starWeek - this.currentWeekNum); i >= 0; i--) { //不包括自己33
								this.now = new Date(str);
								var d = new Date(this.getCurrentWeek[0]); //每个周的起始日期开始
								d.setDate(d.getDate() - 7 * i);
								this.weeks.push(d);
							}
							for(var i = 1; i <= this.starWeek - this.currentWeekNum - 1; i++) {
								this.now = new Date(str);
								var d = new Date(this.getCurrentWeek[0]);
								d.setDate(d.getDate() + 7 * i);
								this.weeks.push(d);
							}
						}
					} else { //向后翻
						if(this.endWeek < this.currentWeekNum) {
							for(var i = this.currentWeekNum - this.endWeek - 1; i > 0; i--) { //不包括自己33
								this.now = new Date(str);
								var d = new Date(this.getCurrentWeek[0]); //每个周的起始日期开始
								d.setDate(d.getDate() - 7 * i);
								this.weeks.push(d);
							}
							for(var i = 0; i <= 20 - (this.currentWeekNum - this.endWeek); i++) {
								this.now = new Date(str);
								var d = new Date(this.getCurrentWeek[0]);
								d.setDate(d.getDate() + 7 * i);
								this.weeks.push(d);
							}
						} else {
							var totalweek = 20 - this.currentWeekNum + this.beforeWeekNum; //前一年一共多少周
							console.log(totalweek)
							this.currentWeekNum = this.currentWeekNum + totalweek
							for(var i = this.currentWeekNum - this.endWeek - 1; i >= 0; i--) { //不包括自己33
								this.now = new Date(str);
								var d = new Date(this.getCurrentWeek[0]); //每个周的起始日期开始
								d.setDate(d.getDate() - 7 * i);
								this.weeks.push(d);
							}
							for(var i = 1; i <= 20 - (this.currentWeekNum - this.endWeek); i++) {
								this.now = new Date(str);
								var d = new Date(this.getCurrentWeek[0]);
								d.setDate(d.getDate() + 7 * i);
								this.weeks.push(d);
							}
						}
					}
					this.starWeek = this.getYearWeek(this.weeks[0])
					this.endWeek = this.getYearWeek(this.weeks[this.weeks.length - 1])
					this.beforeWeekNum = this.getYearWeek(date)
				}
			},
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	* {
		box-sizing: border-box;
	}

	ul {
		list-style-type: none;
	}

	body {
		font-family: Verdana, sans-serif;
		background: #E8F0F3;
	}

	.vue-calendar-picker {
		width: 370px;
		background: #fff;
	}
	.wider-calendar {
		width: 600px;
	}

	.date-text {
		text-align: left;
	}

	#calendar {
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.1), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
	}

	.month {
		width: 100%;
	}

	.month ul {
		margin: 0;
		padding: 0;
		display: flex;
		justify-content: space-between;
	}

	.year-month {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.year-month:hover {
		background: rgba(150, 2, 12, 0.1);
	}

	.choose-year {
		padding-left: 20px;
		padding-right: 20px;
	}

	.choose-month {
		text-align: center;
		font-size: 14px;
	}

	.arrow {
		padding: 20px;
		font-weight: bold;
	}

	.arrow:hover {
		background: rgba(100, 2, 12, 0.1);
	}

	.month ul li {
		font-size: 16px;
		text-transform: uppercase;
		letter-spacing: 3px;
	}

	.weekdays {
		margin: 0;
		padding: 10px 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.weekdays li {
		display: inline-block;
		width: 13.6%;
		text-align: center;
		font-size: 14px
	}

	.days {
		padding: 0;
		background: #FFFFFF;
		margin: 0;
		display: flex;
		flex-wrap: wrap;
		box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.1)
	}

	.days li {
		list-style-type: none;
		display: inline-block;
		width: 14.2%;
		text-align: center;
		padding-bottom: 15px;
		padding-top: 15px;
		font-size: 12px;
		color: #000;
	}

	.days li .active {
		padding: 5px;
		background: #00B8EC;
		color: #fff;
	}

	.days .tickClass:after {
		content: '√'
	}


	.days li .other-month {
		padding: 5px;
		color: gainsboro;
	}

	.months li {
		width: 25%;
	}

	.years li {
		width: 25%;
	}
	.weeks li {
		width: 20%;
	}

	.quarters li {
		width: 50%;
	}
	
</style>
