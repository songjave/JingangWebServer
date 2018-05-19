<template>
<div class="table">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-menu"></i> 功能</el-breadcrumb-item>
            <el-breadcrumb-item>动态数据采集</el-breadcrumb-item>
        </el-breadcrumb>
    </div>

    <div class="handle-box">
        <el-button type="success" icon="plus" class="handle-add mr10" @click="onAdd">添加</el-button>
        <el-select v-model="search_field" placeholder="搜索字段" class="handle-select mr10">
            <el-option key="1" label="字段2" value="field2"></el-option>
            <el-option key="2" label="字段3" value="field3"></el-option>
        </el-select>
        <el-input v-model="search_key" placeholder="搜索关键词" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="onSearch">搜索</el-button>
        <el-button type="primary" icon="circle-close" @click="onClear">重置</el-button>
    </div>
    <el-table :data="docs" border style="width: 100%" ref="singleTable" @current-change="">
        <el-table-column type="expand">
            <template scope="props">
                    <el-form label-position="left" class="entry-detail">
                        <el-form-item label="字段1">
                            <span>{{ props.row.field1 }}</span>
                        </el-form-item>
                        <el-form-item label="字段2">
                            <span>{{ props.row.field2 }}</span>
                        </el-form-item>
                        <el-form-item label="字段3">
                            <div v-html="props.row.field3"></div>
                        </el-form-item>
                        <el-form-item label="字段4">
                            <span>{{ props.row.field4 }}</span>
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
        <el-table-column prop="field1" label="字段1"></el-table-column>
        <el-table-column prop="field2" label="字段2"></el-table-column>
        <el-table-column prop="field3" label="字段3"></el-table-column>
        <el-table-column prop="field4" label="字段4"></el-table-column>
        <el-table-column prop="iEditor" label="编辑人"></el-table-column>
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
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 30, 50, 100, 1000]" :page-size="limit" :total="total">
        </el-pagination>
    </div>
    <el-dialog :title="isAdd ? '添加' : '编辑'" :visible.sync="dialogVisible" close="cancleDialog">
        <el-form label-width="80px">
            <el-form-item label="编辑人">
                <el-input v-model="form.iEditor" placeholder="请输入编辑人姓名"></el-input>
            </el-form-item>

            <el-form-item label="字段1">
                <el-rate class="da-rate" v-model="form.field1"></el-rate>
            </el-form-item>

            <el-form-item label="字段2">
                <el-select v-model="form.field2" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="字段3">
                <el-input id="da-textarea" type="textarea" :rows="3" placeholder="请输入内容" v-model="form.field3"></el-input>
            </el-form-item>

            <el-form-item label="字段4">
                <input type="file" @change="onUploadChange">
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
import qbUpload from '../common/Upload.vue';
import ElTag from "../../../node_modules/element-ui/packages/tag/src/tag";

export default {
    components: {
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
                field1: 0,
                field2: '',
                field3: '',
                field4: '',
                id: ''
            },
            options: [{
                value: '选项一'
            }, {
                value: '选项二'
            }, {
                value: '选项三'
            }, {
                value: '选项四'
            }],
            url: '/api/func/da',
        }
    },
    created() {
        this.getData();
        this.isAdmin = this.$route.query.isAdmin || false;
    },
    computed: {},
    filters: {
        getLocalDateStr(str) {
            const getRelugarNumber = (d) => {
                let dstr = '' + d;
                while (dstr.length < 2) {
                    dstr = '0' + dstr;
                }
                return dstr;
            };

            let d1 = new Date(str);
            let year = d1.getFullYear();
            let month = d1.getMonth() + 1;
            let day = d1.getDate();
            let hour = d1.getHours();
            let min = d1.getMinutes();
            return '' + year + '-' + getRelugarNumber(month) + '-' + getRelugarNumber(day) + ' ' + getRelugarNumber(hour) + ':' + getRelugarNumber(min);
        }
    },
    methods: {
        readFile(cb) {
            const reader = new FileReader();
            reader.onload = (e) => {
                return cb(reader.result);
            };
            event.target.files[0] && reader.readAsDataURL(event.target.files[0]);
        },
        onUploadChange(event) {
            this.readFile((data) => {
                //console.log(data.slice(0, 30));
                this.form.field4 = data;
            });
        },
        initForm() {
            this.form = {
                iEditor: '',
                field1: 0,
                field2: '',
                field3: '',
                field4: '',
                id: ''
            };
            if (this.isAdd) {
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

            this.form.id = row._id || '';
            this.form.iEditor = row.iEditor || '';
            this.form.field1 = row.field1 || 0;
            this.form.field2 = row.field2 || '';
            this.form.field3 = row.field3 || '';
            this.form.field4 = row.field4 || '';
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
        cancleDialog() {
            this.dialogVisible = false;
            //this.$refs['form'].resetFields();
            this.answerVisible = false;
        },
        formatFile(fileData) {
            fileData.forEach((item) => {
                item.field4 && (item.field4 = item.field4.slice(0, 10) + '...'); // 只显示一部分
            });
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

            self.$axios.get(self.url, {
                params
            }).then((res) => {
                const gridDatas = res.data.data.docs || [];
                self.docs = gridDatas;
                this.formatFile(self.docs);
                self.total = res.data.data.total || 0;
            });
        },
        onSubmit() {
            this.iEditor = this.form.iEditor;

            if (this.isAdd) {
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

.entry-detail .el-form-item {
    margin-bottom: 0;
}

.entry-detail .el-form-item .el-form-item__label {
    font-weight: bold;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
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
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
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
    text-overflow: ellipsis;
    white-space: nowrap;
}

.da-img-box {
    width: 203px;
    height: auto;
}
</style>
