import req from './http.js'

//定义接口

export const ADMIN = params => req('get','admin',params)
export const USERINDEX = params => req('get','admin/user',params)
//分类接口
export const CATEGORYINDEX = params => req('get','admin/category',params)
export const GETCATEADD = params => req('get','admin/category/add',params)
export const POSTCATEADD = params => req('post','admin/category/add',params)
export const GETCATEEDIT = params => req('get','admin/category/edit',params)
export const POSTCATEEDIT = params => req('post','admin/category/edit',params)
export const CATEDELETE = params => req('get','admin/category/delete',params)
//内容接口
export const CONTENTINDEX = params => req('get','admin/content',params)
export const GETCONTENTADD = params => req('get','admin/content/add',params)
export const POSTCONTENTADD = params => req('post','admin/content/add',params)
export const GETCONTENTEDIT = params => req('get','admin/content/edit',params)
export const POSTCONTENTEDIT = params => req('post','admin/content/edit',params)
export const CONTENTDELETE = params => req('get','admin/content/delete',params)