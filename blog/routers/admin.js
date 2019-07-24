/** 
 *Created by modo on 2018/12/26.
 */

let express = require('express');
let router = express.Router();
//加载body-parser，用来处理post提交过来的数据
let bodyParser = require('body-parser');
let User = require('../models/User')
let Category = require('../models/Category')
let Content = require('../models/Content')

router.use((req, res, next) => {
    if (!req.userInfo.isAdmin) {
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next()
})
// 首页
router.get('/', (req, res, next) => {
    // res.send('后台管理首页');
    res.json({
        userInfo: req.userInfo
    })
    // res.render('admin/index', {
    //     userInfo: req.userInfo
    // });
})
/*
 *用户首页
 **/
router.get('/user', (req, res, next) => {
    /*
     *从数据库中读取所有的用户数据
     *
     *limit(Number):限制获取的数据条数
     *skip(2):忽略数据的条数
     *
     *每页显示2条
     *1：1-2 skip:0 -> (当前页-1)*limit
     *2：3-4 skip:2 
     **/

    let page = Number(req.query.page || 1);
    let limit = 5;
    let pages = 0

    User.countDocuments().then((count) => {
        //计算总页数
        pages = Math.ceil(count / limit)
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then((users) => {
            let data = {
                userInfo: req.userInfo,
                users: users,
                page: page,
                pages: pages,
                count: count,
                limit: limit
            }
            res.json(data)
            // res.render('admin/user_index', data);
        })
    })


})
/*
 *分类首页
 **/
router.get('/category', (req, res, next) => {
    let page = Number(req.query.page || 1);
    let limit = 5;
    let pages = 0;

    Category.countDocuments().then((count) => {
        //计算总页数
        pages = Math.ceil(count / limit)
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;
        /*
         *1：升序
         *-1：降序
         **/
        Category.find().sort({ _id: -1 }).limit(limit).skip(skip).then((categories) => {
            let data = {
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                pages: pages,
                count: count,
                limit: limit
            }
            res.json(data)
            // res.render('admin/category_index', data);
        })
    })
})
/*
 *分类的添加
 **/
router.get('/category/add', (req, res, next) => {
    res.json({
        userInfo: req.userInfo
    })
    // res.render('admin/category_add', {
    //     userInfo: req.userInfo
    // });
})
/*
 *分类的保存
 **/
router.post('/category/add', (req, res, next) => {
    let name = req.body.name || '';
    let resData = '';
    if (name == '') {
        resData = {
            userInfo: req.userInfo,
            message: '名称不能为空'
        }
        // res.render('admin/error', resData);
        res.json(resData);
        return;
    }
    //数据库中是否已经存在同名分类名称
    Category.findOne({
        name: name
    }).then((rs) => {
        if (rs) {
            resData = {
                userInfo: req.userInfo,
                message: '分类已经存在了'
            }
            // res.render('admin/error',resData)
            res.json(resData);
            return Promise.reject();
        } else {
            //数据库中不存在该分类，可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then((newCategory) => {
        resData = {
            userInfo: req.userInfo,
            message: '分类保存成功',
            url: '/admin/category'
        }
        // res.render('admin/success', resData);
        res.json(resData);
    })
})
/*
 *分类的修改
 **/
router.get('/category/edit', (req, res) => {
    //获取要修改的信息，并且用表单的形式展现出来
    let id = req.query.id || '';
    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then((category) => {
        if (!category) {
            // res.render('admin/error', {
            //     userInfo: req.userInfo,
            //     message: '分类信息不存在'
            // })
            res.json({
                userInfo: req.userInfo,
                message: '分类信息不存在'
            })
        } else {
            // res.render('admin/category_edit', {
            //     userInfo: req.userInfo,
            //     category: category
            // })
            res.json({
                userInfo: req.userInfo,
                category: category
            })
        }
    })
})
/*
 *分类的修改保存
 **/
router.post('/category/edit', (req, res) => {
    //获取要修改的分类的信息，并且用表单的形式展示出来
    let id = req.body.id;
    //获取Post提交过来的名称
    let name = req.body.name || '';
    let resData = '';
    Category.findOne({
        _id: id
    }).then((category) => {
        if (!category) {
            resData = {
                userInfo: req.userInfo,
                message: '分类信息不存在'
            }
            // res.render('admin/error', resData);
            res.json(resData);
            return Promise.reject();
        } else {
            //当用户没有做任何的修改提交的时候
            if (name == category.name) {
                resData = {
                    userInfo: req.userInfo,
                    message: '修改成功',
                    url: '/admin/category'
                }
                // res.render('admin/success', resData);
                res.json(resData);
                return Promise.reject();
            } else {
                //要修改的分类名称是否已经在数据库中存在
                return Category.findOne({
                    _id: { $ne: id },
                    name: name
                })
            }
        }
    }).then((sameCategory) => {
        if (sameCategory) {
            resData = {
                userInfo: req.userInfo,
                message: '数据库中已经存在同名分类'
            }
            // res.render('admin/error', resData);
            res.json(resData);
            return Promise.reject();
        } else {
            return Category.updateOne({
                _id: id
            }, {
                name: name
            });
        }
    }).then(() => {
        resData = {
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/category'
        }
        // res.render('admin/success', resData)
        res.json(resData);
    })
})
/*
 *分类的删除
 **/
router.get('/category/delete', (req, res, next) => {
    //获取要删除的分类的id
    let id = req.query.id;
    Category.deleteOne({
        _id: id
    }).then(() => {
        // res.render('admin/success', {
        //     userInfo: req.userInfo,
        //     message: '删除成功',
        //     url: '/admin/category'
        // })
        res.json({
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/category'
        })
    })
})
/*
 *内容首页
 **/
router.get('/content', (req, res) => {
    let page = Number(req.query.page || 1);
    let limit = 5;
    let pages = 0;

    Content.countDocuments().then((count) => {
        //计算总页数
        pages = Math.ceil(count / limit)
        //取值不能超过pages
        page = Math.min(page, pages);
        //取值不能小于1
        page = Math.max(page, 1);
        let skip = (page - 1) * limit;

        Content.find().sort({ _id: -1 }).limit(limit).skip(skip).populate(['category','user']).sort({
        	addTime:-1
        }).then((contents) => {
            // res.render('admin/content_index', {
            //     userInfo: req.userInfo,
            //     contents: contents,
            //     page: page,
            //     pages: pages,
            //     count: count,
            //     limit: limit
            // });
            res.json({
                userInfo: req.userInfo,
                contents: contents,
                page: page,
                pages: pages,
                count: count,
                limit: limit
            })
        })
    })
})
/*
 *内容添加页面
 **/
router.get('/content/add', (req, res) => {

    Category.find().sort({ _id: -1 }).then((categories) => {
        // res.render('admin/content_add', {
        //     userInfo: req.userInfo,
        //     categories: categories
        // })
        res.json({
            userInfo: req.userInfo,
            categories: categories
        })
    })
})
/*
 *内容保存
 **/
router.post('/content/add', (req, res) => {
    if (req.body.category == '') {
        // res.render('admin/error', {
        //     userInfo: req.userInfo,
        //     message: '内容分类不能为空'
        // });
        res.json({
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if (req.body.title == '') {
        // res.render('admin/error', {
        //     userInfo: req.userInfo,
        //     message: '内容标题不能为空'
        // });
        res.json({
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    //保存数据到数据库
    new Content({
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content,
        user: req.userInfo._id.toString()
    }).save().then((rs) => {
        // res.render('admin/success', {
        //     userInfo: req.userInfo,
        //     message: '内容保存成功',
        //     url: '/admin/content'
        // });
        res.json({
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content'
        })
    })
})
/*
 *内容的修改
 **/
router.get('/content/edit', (req, res) => {
    let id = req.query.id || '';
    //获取要修改的分类信息
    let categories;
    Category.find().sort({ _id: -1 }).then((rs) => {
        categories = rs;
        return Content.findOne({
            _id: id
        }).populate('category').then((content) => {
            if (!content) {
                // res.render('admin/error', {
                //     userInfo: req.userInfo,
                //     message: '指定内容不存在'
                // })
                res.json({
                    userInfo: req.userInfo,
                    message: '指定内容不存在'
                })
                return Promise.reject();
            } else {
                // res.render('admin/content_edit', {
                //     userInfo: req.userInfo,
                //     content: content,
                //     categories: categories
                // })
                res.json({
                    userInfo: req.userInfo,
                    content: content,
                    categories: categories
                })
            }
        })
    })
})
/*
 *内容的修改保存
 **/
router.post('/content/edit', (req, res) => {
    //获取要修改的分类的信息，并且用表单的形式展示出来
    let id = req.body.id;

    if (req.body.category == '') {
        // res.render('admin/error', {
        //     userInfo: req.userInfo,
        //     message: '内容分类不能为空'
        // });
        res.json({
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }
    if (req.body.title == '') {
        // res.render('admin/error', {
        //     userInfo: req.userInfo,
        //     message: '内容标题不能为空'
        // });
        res.json({
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }
    Content.updateOne({
        _id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(() => {
        // res.render('admin/success', {
        //     userInfo: req.userInfo,
        //     message: '修改成功',
        //     url: '/admin/content/edit?id=' + id
        // })
        res.json({
            userInfo: req.userInfo,
            message: '修改成功',
            url: '/admin/content/edit?id=' + id
        })
    })
})
/*
 *分类的删除
 **/
router.get('/content/delete', (req, res, next) => {
    //获取要删除的分类的id
    let id = req.query.id;
    Content.deleteOne({
        _id: id
    }).then(() => {
        // res.render('admin/success', {
        //     userInfo: req.userInfo,
        //     message: '删除成功',
        //     url: '/admin/content'
        // })
        res.json({
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        })
    })
})
module.exports = router;