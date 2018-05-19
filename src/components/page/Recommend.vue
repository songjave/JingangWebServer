<template>
    <el-row class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 功能</el-breadcrumb-item>
                <el-breadcrumb-item>问答</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row class="my-box">
            <el-row :gutter="20">
                <el-col :span="16"><el-input size="large" placeholder="请输入内容" v-model="question" @keyup.enter.native="onQuery" class="query-input"> </el-input></el-col>
                <el-col :span="5"><el-button type="primary" size="large" @click="onQuery" class="query-btn">咨询</el-button></el-col>
            </el-row>

            <el-row :gutter="20" class="qa-tag">
                <el-tag v-if="tagDisplay" type="gray">{{text}}</el-tag>
            </el-row>

            <el-row :gutter="20" v-if="display">
                <!--<el-col :span="16" class="qa-answer-row">
                    <span class="qa-label">答案：</span>
                    <span class="qa-answer" v-html="answerText"></span>
                </el-col>

                <el-col :span="16" class="qa-image-box">
                    <span class="qa-label">图片：</span>
                    <div class="qa-images">
                        <img class="qa-image" src="../../../static/img/img.jpg">
                        <img class="qa-image" src="../../../static/img/img.jpg">
                    </div>
                </el-col>

                <el-col :span="16" class="qa-answer-row">
                    <div class="qa-label">视频：</div>
                    <div class="qa-videos">
                        <video class="qa-video" src="../../../static/file/VID20171215153214.mp4" controls="controls"></video>
                    </div>
                </el-col>-->

                <!--推荐+++++++-->
                <el-col class="re-recommend-row">
                    <span class="qa-label">推荐：</span>
                    <div class="re-recommend-list">
                        <div class="re-recommend-li" v-for="item in recommendArr" @click="onClickLi(item)">{{ item }}</div>
                    </div>
                </el-col>
                <!--推荐++++++-->

            </el-row>
        </el-row>
    </el-row>
</template>

<script>
    export default {
        components:{
        },
        data() {
            return {
                url: '/api/func/qa',
                text: '暂无回答',
                question: '',
                answerText: '',
                images: null,
                videos: null,
                recommendArr: [],
                display: false,
                //recommendArr: ['推荐问题推荐问题推荐问题推荐问题推荐问题推荐问题1', '推荐问题推荐问题推荐问题推荐问题推荐问题推荐问题2', '推荐问题推荐问题推荐问题推荐问题推荐问题推荐问题', '推荐问题推荐问题推荐问题推荐问题推荐问题推荐问题', '推荐问题推荐问题推荐问题推荐问题推荐问题推荐问题'],
                //display: true,
                tagDisplay: false
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            onClickLi(item) {
                this.question = item;
                this.onQuery();
            },
            getData(jsonAnswer) {
                this.recommendArr = jsonAnswer.suggestions;
            },
            doQuery(question) {
                const formData = new FormData();
                //formData.append('json', JSON.stringify({question: this.question, context: '',role: this.role}));
                formData.append('json', JSON.stringify({question: this.question, op: 'recommend'}));

                this.$axios.post(this.url, formData).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        this.tagDisplay = true;
                        this.display = false;
                        return this.text = json.errMsg || json.errCode;
                    }
                    this.tagDisplay = false;
                    this.display = true;
                    this.getData(json.data.jsonData);
                });
            },
            onQuery() {
                if (!this.question) {
                    return this.$message.error('未输入内容');
                }
                this.doQuery(this.question);
            },
        }
    }

</script>

<style scoped>
    .query-btn {
        margin-left: -93px;
    }
    .query-input {
        width: calc(100% - 83px);
    }
    .qa-label {
        display: inline;
        font-size: 14px;
    }
    .qa-answer-row {
        margin-top: 25px;
    }
    .qa-answer {
        display: block;
        width: fit-content;
        margin-left: 47px;
        font-size: 14px;
        line-height: 20px;
        padding: 5px 10px;
        border-radius: 4px;
        background-color: #e4e8f1;
        transform: translateY(-23px);
    }
    .qa-image-box {
        width: 100%;
    }
    .qa-images, .qa-videos {
        display: inline-block;
        max-width: calc(100% - 80px);
        max-height: 370px;
        overflow: auto;
        vertical-align: top;
        padding: 10px 5px 5px 10px;
        background-color: #e4e9f1;
        border-radius: 5px;
    }
    .qa-image, .qa-video {
        width: auto;
        height: 270px;
        margin: 0 5px 5px 0;
        box-shadow: 0 1px 3px #beb9b9;
    }
    .qa-tag {
        margin-top: 10px;
        margin-left: 0 !important;
    }
    .re-recommend-row {
        margin-top: 25px;
    }
    .re-recommend-list {
        display: block;
        width: fit-content;
        margin-left: 47px;
        font-size: 14px;
        line-height: 20px;
        padding: 5px;
        border-radius: 5px;
        transform: translateY(-23px);
        border: 1px solid #ddd;
    }
    .re-recommend-li {
        padding: 20px;
        border-bottom: 1px solid #eef1f6;
        cursor: pointer;
    }
    .re-recommend-li:last-child {
        border-bottom: none;
    }
    .re-recommend-li:hover {
        background-color: #eef1f6;
    }
</style>
