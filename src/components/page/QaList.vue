<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 服务管理</el-breadcrumb-item>
                <el-breadcrumb-item>问答测试列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <!--<el-button type="success" icon="plus" class="handle-add mr10" @click="onAdd">添加问答</el-button>-->
            <el-select v-model="search_field" placeholder="搜索字段" class="handle-select mr10">
                <el-option key="1" label="咨询问题" value="question"></el-option><!--为什么是value-->
                <el-option key="2" label="版本" value="version"></el-option>
                <el-option key="3" label="反馈问题" value="problem"></el-option>
                <el-option key="4" label="编辑人" value="iEditor"></el-option>
            </el-select>
            <el-input v-model="search_key" placeholder="搜索关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="onSearch">搜索</el-button>
            <el-button type="primary" icon="circle-close" @click="onClear">重置</el-button>
        </div>
        <el-table :data="docs" border style="width: 100%" ref="singleTable" @current-change="">
            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" class="entry-detail">
                        <el-form-item label="咨询问题">
                            <span>{{ props.row.question }}</span>
                        </el-form-item>
                        <el-form-item label="答案">
                            <span>{{ props.row.answer }}</span>
                        </el-form-item>
                        <el-form-item label="版本">
                            <span>{{ props.row.version }}</span>
                        </el-form-item>
                        <el-form-item label="评级">
                            <span>{{ props.row.rate }}</span>
                        </el-form-item>
                        <el-form-item label="反馈问题">
                            <span>{{ props.row.problem }}</span>
                        </el-form-item>
                        <el-form-item label="备注">
                            <div v-html="props.row.remarks"></div>
                        </el-form-item>
                        <el-form-item label="编辑人">
                            <div v-html="props.row.iEditor"></div>
                        </el-form-item>
                        <el-form-item label="更新时间">
                            <span>{{ props.row.iUpdateAt | getLocalDateStr}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <!--<el-table-column prop="_id" label="_id" width="100"></el-table-column> -->
            <el-table-column prop="question" label="咨询问题"></el-table-column>
            <el-table-column prop="answer" label="答案" width="400"></el-table-column>
            <el-table-column prop="version" label="版本"></el-table-column>
            <el-table-column prop="rate" label="评级" width="80"></el-table-column>
            <el-table-column prop="problem" label="反馈问题"></el-table-column>
            <el-table-column prop="remarks" label="备注"></el-table-column>
            <el-table-column prop="iEditor" label="编辑人"></el-table-column>
            <el-table-column prop="iUpdateAt" label="更新时间"></el-table-column>
            <el-table-column prop="iStatus" label="状态" width="80"></el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button size="small"
                               @click="onEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" v-show="isAdmin"
                               @click="onDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change ="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 30, 50, 100, 1000]"
                :page-size="limit"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog :title="isAdd ? '添加' : '编辑'" :visible.sync="dialogVisible" close="cancleDialog">
            <el-form label-width="80px">
                <el-form-item label="编辑人">
                    <el-input v-model="form.iEditor" placeholder="请输入编辑人姓名"></el-input>
                </el-form-item>

                <el-form-item label="咨询问题">
                    <input id="question-input" placeholder="请输入内容" v-model="form.question" @keyup.enter.native="onQuery"></input>
                    <el-button type="primary" @click="onQuery" class="query-btn">咨询</el-button>
                </el-form-item>

                <div v-if="form.answer">
                <el-form-item label="答案">
                    <span class="qa-answer" v-html="form.answer"></span>
                </el-form-item>

                <el-form-item label="版本">
                    <el-tag>{{ form.version }}</el-tag>
                </el-form-item>

                <el-form-item label="评级">
                    <el-rate class="qa-rate" v-model="form.rate"></el-rate>
                </el-form-item>

                <el-form-item label="反馈问题">
                    <el-select v-model="form.problem" placeholder="请选择">
                        <el-option
                            v-for="item in problemOption"
                            :key="item.value"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input id="qa-textarea" type="textarea" :rows="3" placeholder="请输入内容" v-model="form.remarks"></el-input>
                </el-form-item>
                </div>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancleDialog">取 消</el-button>
                <el-button type="primary" @click="onSubmit">提交反馈</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script scoped>
    import qbUpload from '../common/Upload.vue';
    import ElTag from "../../../node_modules/element-ui/packages/tag/src/tag";

    export default {
        components:{
            ElTag
        },
        data() {
            return {
                search_field: '', // 搜索字段
                search_key: '', // 关键字
                docs: [], // 表格
                page: 1,
                limit: 10,
                total: 0,
                isAdd: true,
                isAdmin: false,
                dialogVisible: false,
                answerVisible: false,
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
                problemOption: [{
                    value: '无答案返回'
                }, {
                    value: '答案错误（答非所问）'
                }, {
                    value: '答案不恰当（有待提高）'
                }, {
                    value: '其它'
                }],
                queryUrl: '/api/func/qa',
                url: '/api/tools/qa_test',
            }
        },
        created(){
            this.getData();
            this.isAdmin = this.$route.query.isAdmin || false;
        },
        computed: {},
        filters: {
            getLocalDateStr(str) {
                const getRelugarNumber = (d) => {
                    let dstr = ''+d;
                    while (dstr.length < 2) {
                        dstr = '0' + dstr;
                    }
                    return dstr;
                };

                let d1 = new Date(str);
                let year = d1.getFullYear();
                let month = d1.getMonth()+1;
                let day = d1.getDate();
                let hour = d1.getHours();
                let min = d1.getMinutes();
                return ''+year+'-'+ getRelugarNumber(month)+'-'+ getRelugarNumber(day)+' '+ getRelugarNumber(hour)+':'+ getRelugarNumber(min);
            }
        },
        methods: {
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
                };
                if (this.isAdd) {
                    this.form.question = this.question || '';
                    this.form.iEditor = this.iEditor || '';
                }
            },
            onAdd() {
                this.initForm();
                this.isAdd = true;
                this.showDialog();
            },
            onSearch() {
                // 搜索按钮
            },
            onClear() {
                // 重置按钮
            },
            handleSizeChange(val) {
                this.limit = val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getData();
            },
            onSearch() {
                if (!this.search_field) {
                    return this.$message.error('未指定搜索字段');
                }

                if (!this.search_key) {
                    return this.$message.error('未填写搜索词');
                }
                this.getData();
            },
            onClear() {
                this.search_field = '';
                this.search_key = '';
                this.page = 1;
                this.getData();
            },
            format(str) {
                const arr = str.split('\n');
                const ret = [];
                arr.forEach((line) => {
                    ret.push(`<p>${line}</p>`);
                });
                return ret.join('<br>');
            },
            onEdit(index, row) {
                //console.log(index, row);
                this.isAdd = false;

                this.form.id = row._id  || '';
                this.form.iEditor = row.iEditor || '';
                this.form.question = row.question || '';
                this.form.answer = row.answer || '';
                this.form.version = row.version || '';
                this.form.rate = row.rate || 0;
                this.form.problem = row.problem || '';
                this.form.remarks = row.remarks || [];
                this.form.iStatus = row.iStatus || 0;
                this.form.iRemark = row.iRemark || [];
                this.showDialog();
            },
            showDialog() {
                this.dialogVisible = true;
            },
            showComfirm() {
                this.comfirmVisible = true;
            },
            cancleDialog(){
                this.dialogVisible = false;
                //this.$refs['form'].resetFields();
                this.answerVisible = false;
            },
            getData() {
                let self = this;
                let params = {
                    offset: (self.page - 1) * self.limit,
                    limit: self.limit,
                    sort_field: 'iUpdateAt'
                };
                self.search_field && (params.search_field = self.search_field);
                self.search_key && (params.search_key = self.search_key);

                self.$axios.get(self.url, { params }).then((res) => {
                    const gridDatas = res.data.data.docs || [];
                    self.docs = gridDatas;
                    self.total = res.data.data.total || 0;
                });
            },
            doQuery(question) {
                const formData = new FormData();
                formData.append('question', question);

                this.$axios.post(this.queryUrl, formData).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        this.tagDisplay = true;
                        this.display = false;
                        return this.text = json.errMsg || json.errCode;
                    }
                    this.answerVisible = true;
                    this.tagDisplay = false;
                    this.display = true;
                    this.text = JSON.stringify(json);
                    this.form.answer = json.data.jsonData.answer.replace(/\n/g, '<br />');
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
                this.iEditor = this.form.iEditor;

                if (this.isAdd) {
                    this.question = this.form.question;
                    this.form.answer = this.form.answer.replace(/<br \/>/g, '\n');
                    //console.log(this.form);

                    return this.$axios.post(this.url, this.form).then((res) => {
                        const json = res.data;
                        if (json.errCode) {
                            return this.$message.error('提交失败: error ' + json.errCode);
                        }

                        this.dialogVisible = false;
                        this.$message.success('提交成功');
                        this.getData();
                    });
                }

                //update data
                return this.$axios.post(this.url + '/' + this.form.id, this.form).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        return this.$message.error('更新失败: error ' + json.errCode);
                    }

                    this.dialogVisible = false;
                    this.$message.success('更新成功');
                    this.getData();
                });
            },
        }
    }
</script>

<style scoped>
.el-alert {
    padding-top: 0;
    padding-bottom: 0;
}
.entry-detail .el-form-item{
    margin-bottom: 0;
}

.entry-detail .el-form-item .el-form-item__label{
    font-weight: bold;
}
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
#question-input {
    display: inline;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    font-size: inherit;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: calc(100% - 65px);
}
::-webkit-input-placeholder {
    color: #97a8be;
}
.qa-answer {
    display: block;
    font-size: 14px;
    line-height: 20px;
    padding: 5px 10px;
    border-radius: 4px;
    background-color: #e4e8f1;
}
.qa-rate {
    transform: translateY(8px);
}
#qa-textarea {
    transform: translateY(10px);
}
</style>
