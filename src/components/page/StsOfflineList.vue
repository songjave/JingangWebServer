<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i>语音标注</el-breadcrumb-item>
                <el-breadcrumb-item>离线语音标注</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-table :data="docs" border style="width: 100%" ref="singleTable" @current-change="">
            <el-table-column type="expand">
                <template scope="props">
                    <el-form label-position="left" class="entry-detail">
                        <el-form-item label="更新时间">
                            <span>{{ props.row.updateAt | getLocalDateStr}}</span>
                        </el-form-item>

                        <el-form-item label="taskId">
                            <span>{{ props.row.taskId }}</span>
                        </el-form-item>
                        <el-form-item label="原始文本">
                            <span>{{ props.row.originText }}</span>
                        </el-form-item>
                        <el-form-item label="原始存放路径">
                            <span>{{ props.row.uploadDir }}</span>
                        </el-form-item>
                        <el-form-item label="备注">
                            <span>{{ props.row.remark}}</span>
                        </el-form-item>

                        <el-form-item label="版本信息">
                            <div v-html="formatResultList(props.row.result)"></div>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <!--<el-table-column prop="_id" label="_id" width="100"></el-table-column> -->
            <el-table-column prop="userId" label="用户ID" width="150"></el-table-column>
            <el-table-column prop="docId" label="文档ID" width="150"></el-table-column>
            <el-table-column prop="status" label="状态" width="50"></el-table-column>
            <el-table-column prop="remark" label="备注" width="100"></el-table-column>
            <el-table-column prop="duration" label="原始时长(毫秒)"></el-table-column>
            <el-table-column prop="wavCount" label="总音频数"></el-table-column>
            <el-table-column prop="versionCount" label="版本数"></el-table-column>
            <el-table-column label="操作" width="140">
                <template scope="scope">
                    <el-button size="small" v-if="scope.row.isWavMarked"
                               @click="onEdit(scope.$index, scope.row)">去审查</el-button>
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
                url: '/api/tools/sts/task',
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
                },
                isAdd: true,
                isAdmin: false,
                dialogVisible: false,
                checkVisible: false
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
            formatResultList(list) {
                const arr = [];
                list.forEach((obj) => {
                    const str = `<p>版本:${obj.version}|来源版本:${obj.fromVersion}|文件数目:${obj.wavList.length}|时长:${obj.duration}|编辑人:${obj.editor || '<空>'}</p>`
                    arr.push(str);
                });
                return arr.join('');
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
                    sort_field: 'updateAt'
                };
                self.search_field && (params.search_field = self.search_field);
                self.search_key && (params.search_key = self.search_key);

                self.$axios.get(self.url, { params }).then((res) => {
                    const docs = res.data.data.docs || [];
                    //console.log('gridDatas', gridDatas);
                    for (let i = 0; i< docs.length; i++) {
                        docs[i].wavList = docs[i].wavList || [];
                        docs[i].result = docs[i].result || [];

                        docs[i].wavCount = docs[i].wavList.length;
                        docs[i].versionCount = docs[i].result.length;
                        docs[i].isWavMarked = docs[i].versionCount > 0;
                    }
                    self.docs = docs;
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
                this.$confirm('确认删除文档 ['+ row.docId +'] 吗？一旦删除不可恢复！！！')
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
                this.$router.push({ path: '/sts_new' });
            },
            onEdit(index, row) {
                const version = row.result[row.result.length-1].version;
                //console.log(this.$router.path);
                this.$router.push({ path: `/sts_new?id=${row._id}&version=${version}&taskId=${encodeURIComponent(row.taskId)}`});
            },
            showComfirm() {
                this.comfirmVisible = true;
            },
            cancleDialog(){
                this.dialogVisible = false;
                this.$refs['form'].resetFields();
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
