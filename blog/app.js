/** 
*Created by modo on 2018/12/26.
*应用程序的启动（入口）文件
*/
//加载express模块
let express = require('express');
//加载模板处理模块
let swig = require('swig');
//加载数据库模块
let mongoose = require('mongoose');
//加载body-parser，用来处理post提交过来的数据
let bodyParser = require('body-parser');
//加载cookies模块
let Cookies = require('cookies');
//创建app应用 => NodeJS Http.createServer();
let app = express();//实例化对象

let User = require('./models/User');

//设置静态文件托管
//当用户访问的url以/public开始，那么直接返回对应__dirname + '/public'下的文件
app.use('/public',express.static(__dirname + '/public'))
//配置应用模板
//定义当前应用所使用的模板引擎
//第一个参数：模板引擎的名称，同时也是模板文件的后缀，
//第二个参数：用于解析处理模板内容的方法
app.engine('html',swig.renderFile);
//设置模板文件存放的目录，第一个参数：必须是views，第二个参数：目录
app.set('views','./views');
//注册所使用的模板引擎，第一个参数：必须是view engine,第二个参数：和app.engine这个方法中定义的模板引擎的名称(第一个参数)是一致的
app.set('view engine','html');
//在开发过程中，需要取消模板缓存
swig.setDefaults({cache:false});

//bodyparser设置
app.use(bodyParser.urlencoded({extended:true}))

app.use(bodyParser.json());

//设置cookies
app.use((req,res,next)=>{
	req.cookies = new Cookies(req,res);
	//解析用户登录的cookie信息
	req.userInfo = {};
	if(req.cookies.get('userInfo')){
		try{
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));
			//获取当前用湖的类型，是否是管理员
			User.findById(req.userInfo._id).then((userInfo)=>{
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			})
			/*
			*Nodejs Error: Can't set headers after they are sent错误解决
			*在服务器返回响应时用return， 避免出现一次请求后，返回两次响应
			*/
			return;
		}catch(e){
			next();
		}
	}
	next();
})
/*
*根据不同的功能划分模块
*/
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
// app.use('/',require('./routers/main'));

//监听http请求
mongoose.connect('mongodb://127.0.0.1:27018/blog', {useNewUrlParser:true}, (err) => {
	console.log(err==true)
	if(err){
		console.log('数据库连接失败')
	}else{
		console.log('数据库连接成功')
		app.listen(8081);
	}
})
module.exports = app;
/*
*户发送http请求 -> url -> 解析匹配的规则 -> 
*行指定的绑定函数，返回对应内容至用户

*public -> 静态 -> 直接读取指定目录下的文件，返回给用户
*> 动态 -> 处理业务逻辑，加载模板 -> 返回数据给用户
*/
