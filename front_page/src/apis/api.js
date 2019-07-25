import req from './http.js'

//定义接口

//注册登录接口
export const REGISTER = params => req('post','api/user/register',params)
export const LOGIN = params => req('post','api/user/login',params)
export const LOGOUT = params => req('get','api/user/logout',params)
//评论区接口
export const GETCOMMENT = params => req('get','api/comment',params)
export const POSTCOMMENT = params => req('post','api/comment/post',params)