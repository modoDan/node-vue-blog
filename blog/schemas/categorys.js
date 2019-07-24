/** 
*Created by modo on 2018/01/07.
*/

let mongoose = require('mongoose');

//分类的表结构
module.exports = new mongoose.Schema({
	//分类名称
	name:String,
});