/** 
*Created by modo on 2018/12/26.
*/

let express = require('express');
let router = express.Router();

let Category = require('../models/Category');
let Content = require('../models/Content');
/*
*处理通用数据
**/
let data;
router.use((req,res,next)=>{
	data = {
		userInfo:req.userInfo,
		categories:[],
		category:''
	}
	Category.find().then((categories)=>{
		data.categories = categories;
		next();
	})
})
/*
*首页
**/
router.get('/',(req,res,next) => {
	// res.send('首页');
	data.category = req.query.category || '';
	data.contents = [];
	data.count = 0;
	data.page = Number(req.query.page || 1);
	data.limit = 5;
	data.pages = 0;
	let where = {};
	if(data.category){
		where.category = data.category;
	}
	Category.find().then((categories)=>{
		data.categories = categories;
		return Content.where(where).countDocuments();
	}).then((count)=>{
		data.count = count;
		 //计算总页数
        data.pages = Math.ceil(data.count / data.limit)
        //取值不能超过pages
        data.page = Math.min(data.page, data.pages);
        //取值不能小于1
        data.page = Math.max(data.page, 1);
        let skip = (data.page - 1) * data.limit;
        return Content.find().where(where).limit(data.limit).skip(skip).populate(['category','user']).sort({
        	addTime:-1
        });
	}).then((contents)=>{
		data.contents = contents;
		res.json(data);
		// res.render('main/index',data)
	})
})

router.get('/view',(req,res)=>{
	let contentId = req.query.contentid || '';
	data.category = req.query.category || '';
	Content.findOne({
		_id:contentId
	}).then((content)=>{
		data.content = content;
		content.views++;
		content.save();
		res.json(data);
		// res.render('main/view',data);
	})
})
module.exports = router;