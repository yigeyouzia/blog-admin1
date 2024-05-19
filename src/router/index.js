import { createRouter, createWebHistory } from "vue-router"
import VueCookies from "vue-cookies";

const routes = [
    // {
    //     path: "/",
    //     redirect: '/login'
    // },
    {
        name: '登录',
        path: '/login',
        component: () => import('../views/Login.vue')
    },
    {
        name: '框架页',
        path: '/',
        component: () => import('../views/Framework.vue'),
        redirect: "/blog/list",
        children: [
            {
                name: 'test ',
                path: '/blog/test',
                component: () => import('../views/blog/Test.vue'),
            },
            {
                name: '博客管理',
                path: '/blog/list',
                component: () => import('../views/blog/BlogList.vue'),
            },
            {
                name: '分类管理',
                path: '/blog/category',
                component: () => import('../views/blog/BlogCategory.vue'),
            },
            {
                name: '专题管理',
                path: '/special/list',
                component: () => import('../views/special/SpecialList.vue'),
            },
            {
                name: '个人信息',
                path: '/settings/my',
                component: () => import('../views/settings/MyInfo.vue'),
            },
            {
                name: '博客成员',
                path: '/settings/teamUser',
                component: () => import('../views/settings/TeamUser.vue'),
            },
            {
                name: "系统设置",
                path: "/settings/sysInfo",
                component: () => import('../views/settings/SysInfo.vue')
            }, {
                name: "回收站",
                path: "/recovery/list",
                component: () => import('../views/recovery/RecoveryList.vue')
            }
        ]
    },
]

const router = createRouter({
    routes,
    history: createWebHistory()
})

router.beforeEach((to, from, next) => {
    const uesrInfo = VueCookies.get("userInfo");
    if (!uesrInfo && to.path != "/login") {
        router.push("/login");
    }
    next();
})

export default router;