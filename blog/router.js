var express = require("express");
var http = require("http");
var router = express.Router();

router.get("/search",function(req,res){
	var searchString = req.query.searchString,
		_html= '',
		_list = [],
		result = {};

		console.log(searchString)
	http.get("http://m.wufazhuce.com/search?fromUrl=http%3A%2F%2Fm.wufazhuce.com%2F&searchString="+searchString,function(response){
		response.on("data",function(chunk){
			_html += chunk;
		});
		response.on("end",function(){
			// console.log(_html)
			// var $ = cheerio.load(_html),
			// 	dateList = $(".search_result .date").text(),
			// 	authoreList = $(".search_result .text-author").text(),
			// 	contentShortList = $(".search_result .text-content-short").text(),
			// 	linkList = $(".search_result").toArray();
			res.send({result:"ok"})
		});
	}).on("error",function(error){
		console.log(err);
	});

})
module.exports = router;