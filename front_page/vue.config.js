//模拟数据
const appIn = require('../blog/app')
const apiRoutes = require('../blog/routers/api')
const mainRoutes = require('../blog/routers/main')
const adminRoutes = require('../blog/routers/admin')
const path = require('path')

function resolve(dir){
	return path.join(__dirname,'./',dir)
}

module.exports = {
    // 基本路径
    publicPath: './',
    // 输出文件目录
    outputDir: 'dist',
    // eslint-loader 是否在保存的时候检查
    lintOnSave: true,
    pwa: {
    // 一些基础配置
    name: 'Browsing-Exp',
    themeColor: '#6476DB',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

	/*
	* 两个模式，GenerateSW（默认）和 InjectManifest
	* GenerateSW 在我们build项目时候，每次都会新建一个service worker文件
	* InjectManifest 可以让我们编辑一个自定义的service worker文件，实现更多的功能，并且可以
	* 拿到预缓存列表
	*/
	    workboxPluginMode: 'InjectManifest',
	    workboxOptions: {
	      // 自定义的service worker文件的位置
	      swSrc: 'src/serviceWorker.js',
	      // ...other Workbox options...
	    }
	},
    chainWebpack: config => {
    	//svg loader
    	const svgRule = config.module.rule('svg')
    	svgRule.uses.clear()
    	svgRule.exclude.add(/node_modules/)
    	svgRule
    		.test(/\.svg$/)
    		.use('svg-sprite-loader')
    		.loader('svg-sprite-loader')
    		.options({
    			symbolId: 'icon-[name]'
    		})

    	//修改images loader 添加svg处理
    	const imagesRule = config.module.rule('images')
    	imagesRule.exclude.add(resolve('src/icons'))
    	config.module
    		.rule('images')
    		.test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
    },
    // webpack-dev-server 相关配置
    devServer: {
	    host: "localhost",
	    port: 8080,
	    https: false,
	    open: true,
	    hotOnly: false,
	    proxy: null,// 设置代理
	    before: app => {
	  		// app.use('/admin',adminRoutes);
			// app.use('/api',apiRoutes);
			app.use(appIn);
			app.use('/main',mainRoutes);
	    }
    },
 }