<template>
    <el-row class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 服务管理</el-breadcrumb-item>
                <el-breadcrumb-item>问答测试</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row class="my-box">
            <el-row :gutter="20">
                <el-col :span="16"><el-input size="large" placeholder="请输入内容" v-model="form.question" @keyup.enter.native="onQuery" class="query-input"> </el-input></el-col>
                <el-col :span="5"><el-button type="primary" size="large" @click="onQuery" class="query-btn">咨询</el-button></el-col>
            </el-row>

            <el-row :gutter="20">
                <el-tag v-if="tagDisplay" type="gray">{{text}}</el-tag>
            </el-row>


            <el-row :gutter="20" v-if="display">
                <!--<el-col :span="16" class="qa-answer-row">
                    <span class="qa-label">答案：</span>
                    <span class="qa-answer" v-html="form.answer"></span>
                    <p></p>
                </el-col>-->

                <el-col :span="16" class="qa-answer-row" v-if="answerText">
                    <span class="qa-label">答案：</span>
                    <span class="qa-answer" v-html="answerText"></span>
                </el-col>
                <el-col :span="16" class="qa-answer-row" v-if="answerList.length">
                    <span class="qa-label">答案：</span>
                    <span class="qa-answer-list" v-for="(item, index) in answerList" @click="onAnswerList(item, index)">{{ item }}</span>
                </el-col>

                <el-col :span="16">
                    <span class="qa-label">版本：</span>
                    <el-tag>{{ form.version }}</el-tag>
                </el-col>

                <el-col :span="16">
                    <span class="qa-label">评级：</span>
                    <el-rate class="qa-rate" v-model="form.rate"></el-rate>
                </el-col>

                <el-col :span="16">
                    <span class="qa-label">问题：</span>
                    <el-select v-model="form.problem" placeholder="选填">
                        <el-option
                            v-for="item in problemOption"
                            :key="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>

                <el-col :span="16">
                    <span class="qa-label">备注：</span>
                    <el-input id="qa-textarea" type="textarea" :rows="3" placeholder="选填" v-model="form.remarks">
                    </el-input>
                </el-col>

                <el-col :span="16">
                    <span class="qa-label">姓名：</span>
                    <el-input class="editor-input" v-model="form.iEditor" placeholder="测试人员姓名"></el-input>
                </el-col>

                <el-col :span="16" class="qa-submit">
                    <el-button type="success" size="large" @click="onSubmit">提交反馈</el-button>
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
                submitUrl: '/api/tools/qa_test',
                text: '暂无回答',
                tagDisplay: false,
                answerText: '',
                answerList: [],
                problemOption: [{
                    value: '答案准确'
                }, {
                    value: '答案错误（答非所问）'
                }, {
                    value: '答案不恰当（有待提高）'
                }, {
                    value: '无答案返回'
                }, {
                    value: '其它'
                }],
                form: {
                    iEditor: '',
                    question: '',
                    answer: '',
                    version: '',
                    rate: 0,
                    problem: '',
                    remarks: '',
                    id: ''
                },
                display: false
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
                if (!this.form.question) {
                    return this.$message.error('未输入内容');
                }
            },
            onAnswerList(item, index) {
                const question = (index + 1).toString();
                this.form.question = item;
                this.checkInput();
                this.doQuery(question);
            },
            initForm() {
                this.form = {
                    iEditor: '',
                        question: '',
                        answer: '',
                        version: '',
                        rate: 0,
                        problem: '',
                        remarks: '',
                        id: ''
                }
            },
            doQuery(question) {
                const formData = new FormData();
                formData.append('question', question);

                this.$axios.post(this.url, formData).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        this.tagDisplay = true;
                        this.display = false;
                        return this.text = json.errMsg || json.errCode;
                    }
                    this.tagDisplay = false;
                    this.display = true;
                    this.text = JSON.stringify(json);
                    const jsonAnswer = json.data.jsonData;
                    jsonAnswer.answer.length === 1 && (this.answerText = jsonAnswer.answer[0].replace(/\n/g, '<br />'));
                    if (jsonAnswer.answer.length > 1) {
                        this.answerList = jsonAnswer.answer;
                    }
                    this.form.answer = json.data.jsonData.answer.join(',').replace(/\n/g, '<br />');
                    this.form.version = json.data.jsonData.version;
                });
            },
            onQuery() {
                if (!this.form.question) {
                    return this.$message.error('未输入内容');
                }
                this.doQuery(this.form.question);
            },
            onSubmit() {
                this.form.answer = this.form.answer.replace(/<br \/>/g, '\n');
                //this.form.rate = this.form.rate.toString(); // 搜索字段匹配字符串
                //console.log(this.form);
                this.$axios.post(this.submitUrl, this.form).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        return this.$message.error('提交失败: error ' + json.errCode);
                    }
                    this.display = false;
                    this.initForm();
                    this.$message.success('提交成功');
                });
            }
        }
    }

</script>

<style scoped>
    .handle-box{
        margin-bottom: 20px;
    }
    .handle-select{
        width: 120px;
    }
    .handle-input{
        width: 300px;
        display: inline-block;
    }
    .el-col {
        margin-bottom: 20px;
    }
    .query-btn {
        margin-left: -93px;
    }
    .query-input {
        width: calc(100% - 83px);
    }
    .qa-label, .qa-rate {
        display: inline;
        font-size: 14px;
    }
    .qa-answer-row {
        margin-bottom: 10px;
    }
    .qa-answer, .qa-answer-list {
        display: block;
        width: calc(100% - 68px);
        margin-left: 47px;
        font-size: 14px;
        line-height: 20px;
        padding: 5px 10px;
        border-radius: 4px;
        background-color: #e4e8f1;
        transform: translateY(-16px);
    }
    .qa-answer-list {
        cursor: pointer;
    }
    #qa-textarea .el-textarea .el-textarea__inner {
        display: inline;
        margin-left: 40px;
        transform: translateY(-14px);
    }
    #qa-textarea {
        width: calc(100% - 48px);
        vertical-align: top;
    }
    .qa-submit button {
        margin-left: 45px;
    }
    .editor-input {
        width: 178px;
    }
</style>
