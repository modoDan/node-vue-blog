import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);
const view = () => import('../views/main/viewDetail.vue')
const mainIndex = () => import('../views/main/index.vue')
const adminIndex = () => import('../views/admin/index.vue')
const homePage = () => import('../views/admin/homePage.vue')
const userIndex = () => import('../views/admin/userIndex.vue')
const categoryIndex = () => import('../views/admin/categoryIndex.vue') 
const categoryEdit = () => import('../views/admin/categoryEdit.vue') 
const contentIndex = () => import('../views/admin/contentIndex.vue') 
const contentEdit = () => import('../views/admin/contentEdit.vue') 
const router = new Router({
    routes: [{
            path: "/",
            redirect: '/main_index',
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/main_index",
            name: "main_index",
            component: mainIndex,
            meta: {
                title: "blog",
                keepAlive: true
            }
        },
        {
            path: "/admin_index",
            name: "admin_index",
            component: adminIndex,
            meta: {
                title: "blog",
                keepAlive: true
            },
            children: [{
                path: "/home_page",
                name: "home_page",
                component: homePage,
            },{
                path: "/user_index",
                name: "user_index",
                component: userIndex,
            },{
                path: "/category_index",
                name: "category_index",
                component: categoryIndex,
            },{
                path: "/category_edit",
                name: "category_edit",
                component: categoryEdit,
            },{
                path: "/content_index",
                name: "content_index",
                component: contentIndex,
            },{
                path: "/content_edit",
                name: "content_edit",
                component: contentEdit,
            }]
        }
    ]
})
export default router