<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 功能</el-breadcrumb-item>
                <el-breadcrumb-item>视频信息列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="handle-box">
            <el-select v-model="search_field" placeholder="搜索字段" class="handle-select mr10">
                <el-option key="1" label="文件名" value="videoName"></el-option>
                <el-option key="2" label="时间" value="date"></el-option>
                <el-option key="3" label="地点" value="location"></el-option>
                <el-option key="4" label="视频描述" value="summary"></el-option>
            </el-select>
            <el-input v-model="search_key" placeholder="搜索关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="onSearch">搜索</el-button>
            <el-button type="primary" icon="circle-close" @click="onClear">重置</el-button>
        </div>
        <el-table :data="docs" border style="width: 100%" ref="singleTable" @current-change="">
            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" class="entry-detail">
                        <el-form-item label="文件名：">
                            <div>{{ props.row.videoName }}</div>
                        </el-form-item>
                        <el-form-item label="时间：">
                            <div>{{ props.row.date }}</div>
                        </el-form-item>
                        <el-form-item label="地点：">
                            <div>{{ props.row.location }}</div>
                        </el-form-item>
                        <el-form-item label="视频描述：">
                            <div>{{ props.row.summary }}</div>
                        </el-form-item>
                        <el-form-item label="关键帧目标检测：">
                            <div class="images-box">
                                <div class="vf-frame-box" v-for="img in props.row.markImages">
                                    <img v-if="img" :src="props.row.dir + 'imgMark/' + img" class="vf-frame-img">
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="更新时间：">
                            <span>{{ props.row.iUpdateAt | getLocalDateStr}}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <!--<el-table-column prop="_id" label="_id" width="100"></el-table-column> -->
            <el-table-column prop="videoName" label="文件名"></el-table-column>
            <el-table-column prop="date" label="时间"></el-table-column>
            <el-table-column prop="location" label="地点"></el-table-column>
            <el-table-column prop="summary" label="视频描述"></el-table-column>
            <!--<el-table-column prop="markImages" label="关键帧目标检测"></el-table-column>-->

            <el-table-column label="关键帧目标检测">
                <template scope="scope">
                    <qb-preview v-for="img in scope.row.markImages" v-if="img" :url="scope.row.dir + 'imgMark/' + img"></qb-preview>
                </template>
            </el-table-column>

            <el-table-column prop="iUpdateAt" label="更新时间" width="240"></el-table-column>
            <el-table-column prop="iStatus" label="状态" width="80"></el-table-column>
            <el-table-column label="操作" width="140">
                <template scope="scope">
                    <el-button size="small"
                               @click="onEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger"
                               @click="onDelete(scope.$index, scope.row)">删除</el-button><!--v-show="isAdmin"-->
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
                <el-form-item label="文档名">
                    <el-input v-model="form.videoName" placeholder="请输入编辑人姓名"></el-input>
                </el-form-item>

                <el-form-item label="时间">
                    <el-input v-model="form.date"></el-input>
                </el-form-item>

                <el-form-item label="地点">
                    <el-input v-model="form.location"></el-input>
                </el-form-item>

                <el-form-item label="视频描述">
                    <el-input v-model="form.summary"></el-input>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancleDialog">取 消</el-button>
                <el-button type="primary" @click="onSubmit">提 交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script scoped>
    import qbPreview from '../common/TableImagePreview.vue';

    export default {
        components:{
            qbPreview
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
                    fileId: '',
                    videoName: '',
                    date: '',
                    location: '',
                    summary: '',
                    dir: '',
                    markImages: [],},
                url: '/api/func/video_info',
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
            onUploadChange(event) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.form.doc = reader.result;
                };
                event.target.files[0] && reader.readAsDataURL(event.target.files[0]);
                this.form.docName = event.target.files[0].name;
            },
            initForm() {
                const fileInput = document.getElementById("fileInput"); //获取表单对象
                fileInput && fileInput.value && (fileInput.value = '');
                this.form = {
                    fileId: '',
                    videoName: '',
                    date: '',
                    location: '',
                    summary: '',
                    dir: '',
                    markImages: []
                };
            },
            /*onAdd() {
                this.initForm();
                this.isAdd = true;
                this.showDialog();
            },*/
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

                this.form.fileId = row.fileId  || '';
                this.form.videoName = row.videoName || '';
                this.form.date = row.date || '';
                this.form.location = row.location || '';
                this.form.summary = row.summary || '';
                this.form.dir = row.dir || '';
                this.form.markImages = row.markImages || [];
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
            onSubmit() {
                if (this.isAdd) {
                    //console.log(this.form);
                    if (!this.form.doc) {
                        return this.$message.error('请上传文档');
                    }

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
            delData(id) {
                let self = this;
                self.$axios.post(self.url + '/' + id + '?_op=del').then((res) => {
                    self.getData();
                });
            },
            onDelete(index, row) {
                this.$confirm('确认删除该条目吗？一旦删除不可恢复！！！')
                    .then(_ => {
                        this.delData(row._id);
                    })
                    .catch(_ => {});
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
    #field1-input {
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
    .da-rate {
        transform: translateY(8px);
    }
    #da-textarea {
        transform: translateY(10px);
    }
    .file-line {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .da-img-box {
        width: 203px;
        height: auto;
    }
    .vf-frame-box {
        position: relative;
        width: fit-content;
        display: inline-block;
    }
    .vf-frame-img{
        position: relative;
        display: inline-block;
        max-height: 300px;
        width: auto;
        margin: 10px 10px 0 0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.39);
    }
    .images-box {
        max-height: 350px;
        overflow: auto;
    }
</style>
