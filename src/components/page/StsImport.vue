<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 工具</el-breadcrumb-item>
                <el-breadcrumb-item>语音标注导入管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-table :data="docs" border style="width: 100%" ref="singleTable" @current-change="">
            <!--<el-table-column prop="_id" label="_id" width="50"></el-table-column> -->
            <el-table-column prop="createAt" label="任务创建时间"></el-table-column>
            <el-table-column prop="creator" label="创建人"></el-table-column>
            <el-table-column prop="status" label="导入状态"></el-table-column>
            <el-table-column prop="date" label="包导出日期"></el-table-column>
            <el-table-column prop="importDate" label="导入日期"></el-table-column>
            <el-table-column prop="total" label="目录数" width="100"></el-table-column>
            <el-table-column prop="dir" label="来源路径" width="150"></el-table-column>
            <el-table-column prop="targetDir" label="目标路径" width="150"></el-table-column>
            <el-table-column label="操作" width="140">
                <template scope="scope">
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

        <el-table :data="files" border style="width: 100%" ref="singleTable">
            <el-table-column prop="path" label="路径"></el-table-column>
            <el-table-column label="操作" width="140">
                <template scope="scope">
                    <el-button size="small" type="danger" v-show="isAdmin"
                               @click="onImport(scope.$index, scope.row)">导入</el-button>
                </template>
            </el-table-column>
        </el-table>
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
                url: '/admin/api/sts_import',
                docs: [],
                files: [],
                page: 1,
                limit: 10,
                total: 0,
                date: '',
                isAdmin: true,
                dialogFormLabelWidth: '120px',
                currentRow: null,
                form: {
                },
                dialogVisible: false,
                checkVisible: false
            }
        },
        created(){
            this.getData();
            // this.isAdmin = this.$route.query.isAdmin || false;
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
                    self.docs = docs;
                    self.files = res.data.data.files || [];
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
            onImport(index, row) {
                //console.log(row);
                this.$axios.post(this.url, {dir: row.path}).then((res) => {
                    setTimeout(() => {
                        this.getData();
                    }, 500);
                });
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
