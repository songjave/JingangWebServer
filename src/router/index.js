import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
const router = new Router({
    routes: [{
        path: '/login',
        meta: {
            title: '智能咨询系统登录'
        },
        component: resolve => require(['../components/page/Login.vue'], resolve),
    }, {
        path: '/',
        meta: {
            title: '智能咨询系统'
        },
        component: resolve => require(['../components/page/Qapage.vue'], resolve),
    }, {
        path: '/cms',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        children: [{
                path: '/service',
                component: resolve => require(['../components/page/ServiceStatus.vue'], resolve),
            }, {
                path: '/user',
                component: resolve => require(['../components/account/User.vue'], resolve),
            }, {
                path: '/stt',
                component: resolve => require(['../components/page/Stt.vue'], resolve),
            }, {
                path: '/face',
                component: resolve => require(['../components/page/Face.vue'], resolve),
            }, {
                path: '/voice',
                component: resolve => require(['../components/page/Voice.vue'], resolve),
            }, {
                path: '/stt2',
                component: resolve => require(['../components/page/Stt2.vue'], resolve),
            }, {
                path: '/qa',
                component: resolve => require(['../components/page/Qa.vue'], resolve),
            }, {
                path: '/qa_list',
                component: resolve => require(['../components/page/QaList.vue'], resolve),
            },
            /*{
                path: '/sts',
                component: resolve => require(['../components/page/Sts.vue'], resolve),
            },*/
            {
                path: '/sts_new',
                component: resolve => require(['../components/page/StsNew.vue'], resolve),
            }, {
                path: '/sts_list',
                component: resolve => require(['../components/page/StsList.vue'], resolve),
            }, {
                path: '/sts_export',
                component: resolve => require(['../components/page/StsExport.vue'], resolve),
            }, {
                path: '/sts_import',
                component: resolve => require(['../components/page/StsImport.vue'], resolve),
            },
            /*{
                path: '/pedia',
                component: resolve => require(['../components/page/Pedia.vue'], resolve),
            },*/
            {
                path: '/pedia_list',
                component: resolve => require(['../components/page/PediaList.vue'], resolve),
            }, {
                path: '/doc',
                component: resolve => require(['../components/page/Doc.vue'], resolve),
            }, {
                path: '/da',
                component: resolve => require(['../components/page/Da.vue'], resolve),
            }, {
                path: '/picDescribe',
                component: resolve => require(['../components/page/PicDescribe.vue'], resolve),
            }, {
                path: '/picTarget',
                component: resolve => require(['../components/page/PicTarget.vue'], resolve),
            }, {
                path: '/videoFrame',
                component: resolve => require(['../components/page/VideoFrame.vue'], resolve),
            }, {
                path: '/videoInfo',
                component: resolve => require(['../components/page/VideoInfo.vue'], resolve),
            }, {
                path: '/graph',
                component: resolve => require(['../components/page/Graph.vue'], resolve),
            }, {
                path: '/question',
                component: resolve => require(['../components/page/Question.vue'], resolve),
            }, {
                path: '/recommend',
                component: resolve => require(['../components/page/Recommend.vue'], resolve),
            }, {
                path: '/tree',
                component: resolve => require(['../components/page/Tree.vue'], resolve),
            },
        ]
    }, ]
});
router.beforeEach((to, from, next) => {
    /* 路由发生变化修改页面title */
    if (to.meta.title) {
        document.title = to.meta.title
    }
    if (from.path === '/') {
        window.speechSynthesis.cancel() && window.speechSynthesis.cancel();
    }
    next()
});
export default router
