<template>
    <div>
        <el-form-item :label="myLabel" :label-width="myLabelWidth" :prop="prop">
            <el-row :gutter="0">
                <el-col :span="18">
                    <el-input
                        v-bind:value="value"
                        v-on:input="updateUrl($event)"
                        placeholder="请输入URL或上传"
                        label-width="180px">
                    </el-input>
                </el-col>
                <el-col :span="1">
                    <el-upload
                        class="upload-demo"
                        :on-success="onSuccess"
                        :show-file-list=false
                        :name="type"
                        :action="'/api/tools/' + type + '_upload'">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-col>
            </el-row>
        </el-form-item>
    </div>
</template>

<script>
    import mui from '../../../static/mui.min.js'
    export default {
        props: {
            'label' : {},
            'lableWidth' : {},
            'value' : {},
            'prop' : {},
            'type' : {
                default : 'image', // image, audio
            }
        },
        data: function(){
            return {
                myLabel: this.label || '',
                myLabelWidth: this.lableWidth || '120px',
                url: '',
                name: ''
            }
        },
        methods: {
            updateUrl(url) {
                console.log(url);
                this.$emit('input', url);
            },
            onSuccess(response, file, fileList) {
                console.log('1111', response, file, fileList);
                if (response.errCode || !response.url) {
                    return this.$message.error('上传失败 ' + response.errMsg);
                }
                this.value = response.url;
                this.updateUrl(response.url);
                return this.$message.success('上传成功');
            },
            onCopy(index, row) {
                console.log(row);
                this.$clipboard(row.url);
                this.$message.success(row.name  + ' 链接复制成功');
            },
        }
    }
</script>

<style>
.upload-demo {
    padding-left: 10px;
    line-height: normal;
    vertical-align: middle;
    display: inline-block;
}
.el-upload--text {
    border: none;
    width: auto;
    height: auto
}
</style>
