<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-setting',
                        index: '1',
                        title: '管理员专用',
                        subs: [
                            /*{
                                index: 'login',
                                title: '新界面'
                            },*/
                            {
                                index: 'user',
                                title: '用户管理'
                            },
                            {
                                index: 'service',
                                title: '服务状态'
                            },
                            {
                                index: 'sts_import',
                                title: '音频标注导入'
                            },
                            {
                                index: 'sts_export',
                                title: '音频标注导出'
                            },
                            {
                                index: 'qa_list',
                                title: '问答测试列表'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '2',
                        title: '功能列表',
                        subs: [
                            {
                                index: 'stt',
                                title: '语音识别'
                            },
                            {
                                index: 'face',
                                title: '人脸识别'
                            },
                            {
                                index: 'voice',
                                title: '声纹识别'
                            },
                            {
                                index: 'question',
                                title: '问答'
                            },
                            {
                                index: 'recommend',
                                title: '问答-推荐'
                            },
                            {
                                index: 'graph',
                                title: '问答-知识图谱'
                            },
                            /*{
                                index: 'picDescribe',
                                title: '图像自动描述'
                            },*/
                            {
                                index: 'picTarget',
                                title: '图像信息提取'
                            },
                            {
                                index: 'videoFrame',
                                title: '视频信息提取'
                            },
                            {
                                index: 'da',
                                title: '动态数据采集'
                            },
                            /*{
                                index: 'doc',
                                title: '文档录入'
                            },*/
                            {
                                index: 'videoInfo',
                                title: '视频信息列表'
                            },
                            /*{
                                index: 'tree',
                                title: '层级目录'
                            },*/
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '3',
                        title: '工具集',
                        subs: [
                            {
                                index: 'pedia_list',
                                title: '百科录入'
                            },
                            {
                                index: 'sts_new',
                                title: '语音分片标注'
                            },
                            {
                                index: 'sts_list',
                                title: '语音标注列表'
                            },
                            {
                                index: 'qa',
                                title: '问答测试'
                            },

                        ]
                    },
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
        overflow: auto;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
