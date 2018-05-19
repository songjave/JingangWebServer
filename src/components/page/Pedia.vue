<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 服务管理</el-breadcrumb-item>
                <el-breadcrumb-item>百科全书录入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="my-box pedia">
            <el-form label-width="80px">
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
                        <el-input class="text-input" placeholder="请输入子条目名称" v-model="subentry.name"></el-input>
                        <el-button class="del-button" icon="circle-close" @click="delSubentry(index)"></el-button>
                        <el-input class="line-input" type="textarea" :rows="5" placeholder="请输入子条目内容" v-model="subentry.content"></el-input>
                    </template>
                    <el-button class="block" type="primary" size="small" @click="addSubentry"><i class="el-icon-plus"></i>添加</el-button>
                </el-form-item>

                <el-form-item label="图片">
                    <template v-for="(img, index) in form.images">
                        <el-input class="text-input" placeholder="请输入图片描述" v-model="img.describe"></el-input>
                        <el-button class="del-button" icon="circle-close" @click="delImg(index)"></el-button>
                        <input class="block" type="file" @change="inputImg(index)">
                    </template>
                    <el-button class="block" type="primary" size="small" @click="addImg"><i class="el-icon-plus"></i>添加</el-button>
                </el-form-item>

                <el-form-item>
                    <el-button size="small" type="success" @click="onSubmit">立即创建</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script scoped>
    export default {
        components:{
        },
        data() {
            return {
                url: '/api/tools/baike',
                form: {
                    bookName: '',
                    entryName: '',
                    entryEnglish: '',
                    entrySpell: '',
                    entryContent: '',
                    subentrys: [],
                    images: []
                },
                bookList: [{
                    value: '国防建设',
                    label: '国防建设'
                },{
                    value: '国际军事',
                    label: '国际军事'
                },{
                    value: '军事法',
                    label: '军事法'
                },{
                    value: '军事工作',
                    label: '军事工作'
                },{
                    value: '军事后勤',
                    label: '军事后勤'
                },{
                    value: '军事环境',
                    label: '军事环境'
                },{
                    value: '军事技术',
                    label: '军事技术'
                },{
                    value: '军事历史',
                    label: '军事历史'
                },{
                    value: '军事思想',
                    label: '军事思想'
                },{
                    value: '军事著作',
                    label: '军事著作'
                },{
                    value: '军事装备',
                    label: '军事装备'
                },{
                    value: '战略',
                    label: '战略'
                },{
                    value: '中国人民解放军政治工作',
                    label: '中国人民解放军政治工作'
                },{
                    value: '作战',
                    label: '作战'
                }]
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
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
                    data: '',
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
                if (!this.form.bookName) {
                    return this.$message.error('请选择书名');
                }
                else if (!this.form.entryName) {
                    return this.$message.error('请输入词条名称');
                }
                else if (!this.form.entryEnglish) {
                    return this.$message.error('请输入词条英文');
                }
                else if (!this.form.entrySpell) {
                    return this.$message.error('请输入词条拼音');
                }
                else if (!this.form.entryContent) {
                    return this.$message.error('请输入词条内容');
                }
                else if (!this.form.entryEnglish.match(/^[《》<>\-’'"”（）()~\s\dA-Za-z]+$/g)) {
                    return this.$message.error('请输入正确格式的词条英文');
                }
                else if (!this.form.entrySpell.match(/^[《》<>\-’'"”（）()~\s\dA-Za-z]+$/g)) {
                    return this.$message.error('请输入正确格式的词条拼音');
                }

                this.form.entryName = this.form.entryName.trim();
                this.form.entryEnglish = this.form.entryEnglish.trim();
                this.form.entrySpell = this.form.entrySpell.trim();
                this.form.entryContent = this.form.entryContent.trim();

                let list = '';
                //console.log(this.form.entryContent);
                //list = this.form.entryName.split(/\s+/);this.form.entryName = list.join(' ');
                //list = this.form.entryEnglish.split(/\s+/);this.form.entryEnglish = list.join(' ');
                //list = this.form.entrySpell.split(/\s+/);this.form.entrySpell = list.join(' ');
                //list = this.form.entryContent.split(/\s+/);this.form.entryContent = list.join(' ').replace(/\n/g, '\r\n');


                /*this.form.subentrys.forEach((sub, index) => {
                    console.log('sub.name', sub.name);
                    if (sub.name && !sub.content) {
                        return this.$message.error('请输入子条目内容'); // 只能跳出循环，不能跳出所在函数
                    }
                    else if (!sub.name && sub.content) {
                        return this.$message.error('请输入子条目名称');
                    }
                    if (!sub.name && !sub.content) {
                        this.form.subentrys.splice(index, 1);
                    }
                });*/

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
                    //list = this.form.subentrys[i].name.split(/\s+/);this.form.subentrys[i].name = list.join(' ');
                    //list = this.form.subentrys[i].content.split(/\s+/);this.form.subentrys[i].content = list.join(' ');
                }

                const formData = new FormData();
                let imgFile = {};
                if (this.form.images.length) {
                    for (let i in this.form.images) {
                        const image = this.form.images[i];
                        if (!image.data) {
                            //this.form.images.splice(index, 1);
                            return this.$message.error('请删除未上传图片的图片输入框');
                        }
                        this.form.images[i].describe = image.describe.trim();
                        list = this.form.images[i].describe.split(/\s+/);this.form.images[i].describe = list.join(' ');

                        formData.append('imgs[]', image.data);

                        //去掉form中的images[i].data
                        delete image.data;
                    }
                    /*this.form.images.forEach((image, index) => {
                        if (!image.id && !image.data) {
                            //this.form.images.splice(index, 1);
                            return this.$message.error('请删除未输入任何信息的图片输入框');
                        }
                        imgFile['id'] = image.id;
                        imgFile['data'] = image.data;
                        //去掉form中的images[i].data
                        delete image.data;
                    });*/
                }
                //console.log(JSON.stringify(this.form));

                formData.append('jsonData', JSON.stringify(this.form));
                this.$axios.post(this.url, formData).then((res) => {
                    const json = res.data;
                    if (json.err) {
                        return this.$message.error('提交失败\n' + json.err);
                    }
                    this.$message.success('提交成功');
                    /*this.form = {
                        bookName: '',
                        entryName: '',
                        entryEnglish: '',
                        entrySpell: '',
                        entryContent: '',
                        subentrys: [],
                        images: []
                    };*/

                    this.form.entryName = '';
                    this.form.entryEnglish = '';
                    this.form.entrySpell = '';
                    this.form.entryContent = '';
                    this.form.subentrys = [];
                    this.form.images = []
                });
            }
        }
    }

</script>

<style>
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
