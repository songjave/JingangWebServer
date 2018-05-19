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
                <el-col :span="16" class="qa-answer-row" v-if="answerText">
                    <span class="qa-label">答案：</span>
                    <span class="qa-answer" v-html="answerText"></span>
                </el-col>
                <el-col :span="16" class="qa-answer-row" v-if="answerList.length">
                    <span class="qa-label">答案：</span>
                    <span class="qa-answer-list" v-for="(item, index) in answerList" @click="onAnswerList(item, index)">{{ item }}</span>
                </el-col>

                <el-col :span="16" class="qa-image-box" v-if="images.length">
                    <span class="qa-label">图片：</span>
                    <!--<img  v-for="item in images" src="../../assets/imgs/logo2.png">-->
                    <div class="qa-images">
                        <img class="qa-image" :src="item.url" :title="item.label" v-for="item in images">
                    </div>
                </el-col>

                <el-col :span="16" class="qa-answer-row" v-if="videos.length">
                    <div class="qa-label">视频：</div>
                    <!--<video class="qa-video" v-for="item in videos"></video>-->
                    <div class="qa-videos">
                        <video class="qa-video" :src="item.url" :title="item.label" controls="controls" v-for="item in videos"></video>
                    </div>
                </el-col>

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
                answerList: [],
                images: [],
                videos: [],
                display: false,
                tagDisplay: false
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            checkInput() {
                this.answerText = '';
                this.answerList = '';
                if (!this.question) {
                    return this.$message.error('未输入内容');
                }
            },
            onAnswerList(item, index) {
                console.log(index);
                const question = (index + 1).toString();
                this.question = item;
                this.checkInput();
                this.doQuery(question);
            },
            getData(jsonAnswer) {
                console.log('jsonAnswer.answer:', jsonAnswer.answer);
                jsonAnswer.answer.length === 1 && (this.answerText = jsonAnswer.answer[0].replace(/\n/g, '<br />'));
                console.log('this.answerText:', this.answerText);
                if (jsonAnswer.answer.length > 1) {
                    this.answerList = jsonAnswer.answer;
                }

                if (jsonAnswer && jsonAnswer.images && jsonAnswer.images.length) {
                    this.images = [];
                    jsonAnswer.images.forEach((item) => {
                        this.images.push({
                            label: item.label,
                            url: item.url
                        });
                    });
                }
                if (jsonAnswer && jsonAnswer.videos && jsonAnswer.videos.length) {
                    this.videos = [];
                    jsonAnswer.videos.forEach((item) => {
                        this.videos.push({
                            label: item.label,
                            url: item.url
                        });
                    });
                }
            },
            doQuery(question) {
                const formData = new FormData();
                //formData.append('json', JSON.stringify({question: this.question, context: '',role: this.role}));
                formData.append('json', JSON.stringify({question: this.question}));

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
                this.checkInput();
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
    .qa-answer, .qa-answer-list {
        display: block;
        width: fit-content;
        margin-left: 47px;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 20px;
        padding: 5px 10px;
        border-radius: 4px;
        background-color: #e4e8f1;
        transform: translateY(-23px);
    }
    .qa-answer-list {
        cursor: pointer;
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
    .qa-videos {
        width: 520px
    }
    .qa-image, .qa-video {
        width: 500px;
        height: auto;
        margin: 0 5px 5px 0;
        box-shadow: 0 1px 3px #beb9b9;
    }
    .qa-tag {
        margin-top: 10px;
        margin-left: 0 !important;
    }
</style>
