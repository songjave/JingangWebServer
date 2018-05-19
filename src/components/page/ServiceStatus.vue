<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 服务管理</el-breadcrumb-item>
                <el-breadcrumb-item>人脸识别服务</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="success" icon="plus" class="handle-add mr10" @click="onAdd">添加</el-button>
            <el-button type="primary" icon="setting" class="handle-add mr10" @click="onRefresh">刷新</el-button>
        </div>
        <el-table :data="docs" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column prop="sid" label="id"> </el-table-column>
            <el-table-column prop="name" label="服务名"></el-table-column>
            <el-table-column prop="ip" label="ip"></el-table-column>
            <el-table-column prop="port" label="port"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>

            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small"
                               @click="onEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger"
                               @click="onDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="isAdd ? '添加' : '编辑'" :visible.sync="dialogVisible">
            <el-form :model="form">
                <el-form-item label="sid" :label-width="dialogFormLabelWidth">
                    <el-input v-model="form.sid" auto-complete="off" :readonly="!isAdd"></el-input>
                </el-form-item>
                <el-form-item label="名称" :label-width="dialogFormLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="ip" :label-width="dialogFormLabelWidth">
                    <el-input v-model="form.ip" auto-complete="on"></el-input>
                </el-form-item>
                <el-form-item label="port" :label-width="dialogFormLabelWidth">
                    <el-input v-model="form.port" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog">取 消</el-button>
                <el-button type="primary" @click="submitDialog">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        components:{
        },
        data() {
            return {
                url: '/admin/api/service',
                docs: [],
                page: 1,
                limit: 500,
                total: 0,

                is_search: false,
                search_field: '',
                search_key: '',

                isAdd: true,
                dialogVisible: false,
                form: {},
                dialogFormLabelWidth: '120px',
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.docs;
            }
        },
        methods: {
            getData() {
                let self = this;
                let params = {
                    offset: (self.page - 1) * self.limit,
                    limit: self.limit
                };
                self.search_field && (params.search_field = self.search_field);
                self.search_key && (params.search_key = self.search_key);

                self.$axios.get(self.url, { params }).then((res) => {
                    self.docs = res.data.data.docs || [];
                    self.total = res.data.data.total || 0;
                });
            },
            onRefresh() {
                this.getData();
            },
            addData() {
                let self = this;
                const formData = new FormData();
                formData.append('sid', this.form.sid);
                formData.append('name', this.form.name);
                formData.append('ip', this.form.ip);
                formData.append('port', this.form.port);

                self.$axios.post(self.url, formData).then((res) => {
                    self.getData();
                });
            },
            delData(sid) {
                let self = this;
                self.$axios.delete(self.url + '/' + sid).then((res) => {
                    self.getData();
                });
            },
            putData() {
                let self = this;
                let sid = this.form.sid;

                const formData = new FormData();

                formData.append('sid', this.form.sid);
                formData.append('name', this.form.name);
                formData.append('ip', this.form.ip);
                formData.append('port', this.form.port);

                self.$axios.put(self.url + '/' + sid, formData).then((res) => {
                    self.getData();
                });
            },
            onAdd() {
                this.form = {};
                this.isAdd = true;
                this.showDialog();
            },
            onEdit(index, row) {
                this.form = {
                    name: row.name,
                    sid: row.sid,
                    ip: row.ip,
                    port: row.port,
                };
                this.isAdd = false;
                this.showDialog();
            },
            onDelete(index, row) {
                this.$confirm('确认删除 ['+ row.sid +'] 吗？')
                    .then(_ => {
                        this.delData(row.sid);
                    })
                    .catch(_ => {});
            },
            showDialog() {
                this.dialogVisible = true;
            },
            cancelDialog() {
                this.dialogVisible = false;
            },
            submitDialog(){
                if (this.isAdd) {
                    this.addData();
                }
                else {
                    this.putData();
                }

                this.dialogVisible = false;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
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
</style>

<style>
    pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
    pre span.string { color: green; }
    pre span.number { color: darkorange; }
    pre span.boolean { color: blue; }
    pre span.null { color: magenta; }
    pre span.key { color: red; }
</style>
