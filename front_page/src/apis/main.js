import req from './http.js'

//定义接口

export const MAIN = params => req('get','main',params)
export const VIEW = params => req('get','main/view',params)