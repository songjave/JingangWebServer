<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 服务管理</el-breadcrumb-item>
                <el-breadcrumb-item>百科全书词条列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <el-button type="success" icon="plus" class="handle-add mr10" @click="onAdd">添加</el-button>
            <el-select v-model="search_field" placeholder="搜索字段" class="handle-select mr10">
                <el-option key="1" label="条目名称" value="entryName"></el-option>
                <el-option key="2" label="编辑人" value="iEditor"></el-option>
                <el-option key="3" label="书名" value="bookName"></el-option>
            </el-select>
            <el-input v-model="search_key" placeholder="搜索关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="onSearch">搜索</el-button>
            <el-button type="primary" icon="circle-close" @click="onClear">重置</el-button>
        </div>
        <el-table :data="docs" border style="width: 100%" ref="singleTable" @current-change="">
            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" class="entry-detail">
                        <el-form-item label="名称">
                            <span>{{ props.row.entryName }}</span>
                        </el-form-item>
                        <el-form-item label="英文">
                            <span>{{ props.row.entryEnglish }}</span>
                        </el-form-item>
                        <el-form-item label="拼音">
                            <span>{{ props.row.entrySpell }}</span>
                        </el-form-item>
                        <el-form-item label="所属书目">
                            <span>{{ props.row.bookName }}</span>
                        </el-form-item>
                        <el-form-item label="层级">
                            <span>{{ props.row.wid }}</span>
                        </el-form-item>
                        <el-form-item label="描述">
                            <div v-html="format(props.row.entryContent)"></div>
                        </el-form-item>
                        <el-form-item label="子条目">
                            <div v-html="formatSubEntrys(props.row.subentrys)"></div>
                        </el-form-item>
                        <el-form-item label="图片">
                            <div v-html="formatImages(props.row.images)"></div>
                        </el-form-item>
                        <el-form-item label="备注">
                            <span>{{ props.row.iRemark}}</span>
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
            <el-table-column prop="entryName" label="名称" width="150"></el-table-column>
            <el-table-column prop="bookName" label="书名" width="150"></el-table-column>
            <el-table-column prop="iStatus" label="状态" width="50"></el-table-column>
            <el-table-column prop="iEditor" label="编辑人" width="100"></el-table-column>
            <el-table-column prop="iRemark" label="备注" width="100"></el-table-column>
            <el-table-column prop="wid" label="层级"></el-table-column>
            <el-table-column label="操作" width="140">
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
        <el-dialog :title="isAdd ? '添加' : '编辑'" :visible.sync="dialogVisible">
            <el-form label-width="80px">
                <el-form-item label="编辑人">
                    <el-input class="text-input" v-model="form.iEditor" placeholder="请输入编辑人姓名"></el-input>
                </el-form-item>

                <el-form-item label="书名">
                    <el-select v-model="form.bookName" filterable placeholder="请选择">
                        <el-option v-for="item in bookList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="词条名称">
                    <el-input class="text-input" v-model="form.entryName" placeholder="请输入词条名称"></el-input>
                </el-form-item>

                <el-form-item label="词条英文">
                    <el-input class="text-input" v-model="form.entryEnglish" placeholder="请输入词条英文"></el-input>
                </el-form-item>

                <el-form-item label="词条拼音">
                    <el-input class="text-input" v-model="form.entrySpell" placeholder="请输入词条拼音"></el-input>
                    <el-tag type="gray">保留原有格式，如：“军事环境研究”对应的拼音是 junshi huanjing yanjiu</el-tag>
                </el-form-item>

                <el-form-item label="词条内容">
                    <el-input class="line-input" type="textarea" :rows="10" placeholder="请输入词条内容" v-model="form.entryContent"></el-input>
                </el-form-item>

                <el-form-item label="子条目">
                    <template v-for="(subentry, index) in form.subentrys">
                        <el-button class="del-button" icon="circle-close" @click="delSubentry(index)">删除此条</el-button>
                        <el-input class="text-input" placeholder="请输入子条目名称" v-model="subentry.name"></el-input>
                        <el-input class="line-input" type="textarea" :rows="5" placeholder="请输入子条目内容" v-model="subentry.content"></el-input>
                        <br><br>
                    </template>
                    <el-button class="block" type="primary" size="small" @click="addSubentry"><i class="el-icon-plus"></i>添加</el-button>
                </el-form-item>
                <el-form-item label="图片">
                    <template v-for="(img, index) in form.images">
                        <el-row :gutter="0">
                            <el-col :span="3">
                                <el-button class="del-button" icon="circle-close" @click="delImg(index)">删除</el-button>
                            </el-col>
                            <el-col :span="8">
                                <el-input class="text-input" placeholder="请输入图片描述" v-model="img.describe"></el-input>
                            </el-col>
                            <el-col :span="8">
                                <el-input
                                    v-model="img.id"
                                    placeholder="请点击右侧按钮上传图片"
                                    label-width="100px"
                                    :readonly="true">
                                </el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-upload
                                    class="upload-demo"
                                    :on-success="onImageUploadSuccess"
                                    :show-file-list=false
                                    name="image"
                                    :data="{index:index}"
                                    :action="'/api/tools/baike_image_upload'">
                                    <el-button size="small" type="primary">点击上传图片</el-button>
                                </el-upload>
                            </el-col>
                        </el-row>
                    </template>
                    <el-button class="block" type="primary" size="small" @click="addImg"><i class="el-icon-plus"></i>添加</el-button>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input class="text-input" v-model="form.iRemark" placeholder="备注信息（选填）"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancleDialog">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
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
                url: '/api/tools/baike',
                docs: [],
                page: 1,
                limit: 10,
                total: 0,
                dialogFormLabelWidth: '120px',

                currentRow: null,
                select_cate: '',
                select_word: '',
                del_list: [],

                is_search: false,
                search_field: '',
                search_key: '',
                iEditor: '', //全局，在添加时使用,
                bookName: '',//全局，在添加时使用,
                form: {
                    bookName: '',
                    entryName: '',
                    entryEnglish: '',
                    entrySpell: '',
                    entryContent: '',
                    subentrys: [],
                    images: [],
                    iEditor: '',
                    iRemark: ''
                },
                isAdd: true,
                isAdmin: false,
                dialogVisible: false,
                checkVisible: false,
                bookList: [
                    { value: '国防建设', label: '国防建设(1)' },
                    { value: '国际军事', label: '国际军事(2)' },
                    { value: '军事法', label: '军事法(3)' },
                    { value: '军事工作', label: '军事工作(4)' },
                    { value: '军事后勤', label: '军事后勤(5)' },
                    { value: '军事环境', label: '军事环境(6)' },
                    { value: '军事技术', label: '军事技术(7)' },
                    { value: '军事历史', label: '军事历史(8)' },
                    { value: '军事思想', label: '军事思想(9)' },
                    { value: '军事著作', label: '军事著作(10)' },
                    { value: '军事装备', label: '军事装备(11)' },
                    { value: '战略', label: '战略(12)' },
                    { value: '中国人民解放军政治工作', label: '中国人民解放军政治工作(13)' },
                    { value: '作战', label: '作战(14)' }
                ]
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
            format(str) {
                const arr = str.split('\n');
                const ret = [];
                arr.forEach((line) => {
                    ret.push(`<p>${line}</p>`);
                });
                return ret.join('<br>');
            },
            formatSubEntrys(list) {
                const html = [];
                list.forEach((obj) => {
                    html.push(`<p><h4>${obj.name}</h4></p>`);
                    html.push(`<p>${obj.content}</p>`);
                });
                return html.join('') || '<空>';
            },
            formatImages(list) {
                const html = [];
                list.forEach((obj) => {
                    html.push(`<p><h4>${obj.describe}</h4></p>`);
                    html.push(`<p><img style="width: 80px" src="/baike/${obj.id}"</p>`);
                });
                return html.join('') || '<空>';
            },
            onImageUploadSuccess(res, file, fileList) {
                //console.log(res, file, fileList);
                if (res.errCode || !res.data.id) {
                    return this.$message.error('上传失败 ' + (res.errMsg || ''));
                }
                const index = res.data.index;
                this.form.images[index].id = res.data.id;
                return this.$message.success('图片上传成功');
            },
            initForm() {
                this.form = {
                    bookName: '',
                    entryName: '',
                    entryEnglish: '',
                    entrySpell: '',
                    entryContent: '',
                    subentrys: [],
                    images: [],
                    iEditor: '',
                    iRemark: ''
                };
                if (this.isAdd) {
                    this.form.bookName = this.bookName || '';
                    this.form.iEditor = this.iEditor || '';
                }
            },
            handleSizeChange(val) {
                this.limit = val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getData();
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
                    //console.log('gridDatas', gridDatas);
                    self.docs = gridDatas;
                    self.total = res.data.data.total || 0;
                });
            },
            delData(id) {
                let self = this;
                self.$axios.post(self.url + '/' + id + '?_op=del').then((res) => {
                    self.getData();
                });
            },
            onDelete(index, row) {
                this.$confirm('确认删除条目 ['+ row.entryName +'] 吗？一旦删除不可恢复！！！')
                    .then(_ => {
                        this.delData(row._id);
                    })
                    .catch(_ => {});
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
            onAdd() {
                this.initForm();
                this.isAdd = true;
                this.showDialog();
            },
            onEdit(index, row) {
                //console.log(index, row);
                this.isAdd = false;

                this.form.id = row._id  || '';
                this.form.iEditor = this.iEditor || '';
                this.form.bookName = row.bookName || '';
                this.form.entryName = row.entryName || '';
                this.form.entryEnglish = row.entryEnglish || '';
                this.form.entrySpell = row.entrySpell || '';
                this.form.entryContent = row.entryContent || '';
                this.form.subentrys = row.subentrys || [];
                this.form.images = row.images || [];
                this.form.iRemark = row.iRemark || [];
                this.form.iStatus = row.iStatus || 0;
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
                this.$refs['form'].resetFields();
            },
            addSubentry() {
                this.form.subentrys.push({
                    name: '',
                    content: ''
                });
            },
            delSubentry(index) {
                this.form.subentrys.splice(index, 1);
            },
            addImg() {
                this.form.images.push({
                    describe: '',
                    id: ''
                });
            },
            delImg(index) {
                this.form.images.splice(index, 1);
            },
            inputImg(index) {
                this.form.images[index].data = event.target.files[0];
            },
            onSubmit() {
                this.form.entryName = this.form.entryName.trim();
                this.form.entryEnglish = this.form.entryEnglish.trim();
                this.form.entrySpell = this.form.entrySpell.trim();
                this.form.entryContent = this.form.entryContent.trim();
                this.form.iEditor = this.form.iEditor.trim();

                if (!this.form.iEditor) {
                    return this.$message.error('编辑人必填！！');
                }

                if (!this.form.bookName) {
                    return this.$message.error('请选择书名');
                }
                if (!this.form.entryName) {
                    return this.$message.error('请输入词条名称');
                }
                if (!this.form.entryEnglish) {
                    return this.$message.error('请输入词条英文');
                }

                if (!this.form.entrySpell) {
                    return this.$message.error('请输入词条拼音');
                }

                if (!this.form.entryContent) {
                    return this.$message.error('请输入词条内容');
                }
                if (!this.form.entryEnglish.match(/^[《》<>\-’'"”（）()~\s\dA-Za-z]+$/g)) {
                    return this.$message.error('请输入正确格式的词条英文');
                }

                if (!this.form.entrySpell.match(/^[《》<>\-’'"”（）()~\s\dA-Za-z]+$/g)) {
                    return this.$message.error('请输入正确格式的词条拼音');
                }

                for (let i in this.form.subentrys) {
                    const sub = this.form.subentrys[i];
                    if (!sub.name && !sub.content) {
                        //this.form.subentrys.splice(i, 1); //最后一个空的删不掉
                        return this.$message.error('请删除空的子条目输入框');
                    }
                    if (sub.name && !sub.content) {
                        return this.$message.error('请输入子条目内容');
                    }
                    else if (!sub.name && sub.content) {
                        return this.$message.error('请输入子条目名称');
                    }
                    this.form.subentrys[i].name = sub.name.trim();
                    this.form.subentrys[i].content = sub.content.trim();
                }

                if (this.form.images.length) {
                    for (let i in this.form.images) {
                        const image = this.form.images[i];
                        if (!image.id) {
                            //this.form.images.splice(index, 1);
                            return this.$message.error('请删除未上传图片的图片输入框');
                        }
                        this.form.images[i].describe = image.describe.trim() || '';
                    }
                }

                this.iEditor = this.form.iEditor;
                if (this.isAdd) {
                    this.bookName = this.form.bookName;
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
            }
        }
    }
</script>

<style>
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
    .pedia .text-input {
        width: 33%;
        margin-bottom: 10px;
    }
    .pedia .line-input {
        width: 99.8%;
        margin-bottom: 10px;
    }
    .pedia .block {
        display: block;
        margin-bottom: 10px;
    }
    .pedia .block i {
        margin-right: 8px;
    }
    .pedia .del-button {
        border: none;
        color: #97a8be;
        padding: 5px;
    }
    .pedia .del-button:hover {
        color: #20a0ff;
    }
</style>
