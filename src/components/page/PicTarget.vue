<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 功能</el-breadcrumb-item>
                <el-breadcrumb-item>图像信息提取</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form>
            <el-form-item label="本地图像：">
                <input type="file" accept="image/jpg" @change="onInputImg" id="img-input" style="display: none">
                <el-button type="success" @click="clickImgBtn">选择文件并提取</el-button>
            </el-form-item>

            <el-form-item label="网络图像：">
                <!--<el-input
                    placeholder="输入网络图片地址，仅支持jpg格式图像" icon="search" v-model="webUrl" :on-icon-click="handleIconClick" id="pt-img-input" @keyup.enter.native="handleIconClick">
                </el-input>-->
                <el-input
                    placeholder="输入网络图片地址，仅支持jpg格式图像" v-model="webUrl" id="pt-img-input">
                </el-input>
                <el-button type="success" @click="onWebSubmit">点击提取</el-button>
            </el-form-item>
        </el-form>

        <div v-if='loadDisplay' class="loader">处理中...</div>

        <div v-for="(item, index) in imgArr" v-if="item" class="pt-img-container">
            <i class="el-icon-circle-close pt-img-fork" @click="onCloseImg(index)"></i>
            <!--<img :src="item.img" class="pt-img-box">-->
            <img :src="item.imgTag" class="pt-img-box">
            <div class="pt-tag"><span>{{ item.des }}</span></div>
        </div>

    </div>
</template>

<script scoped>
    export default {
        components:{
        },
        data() {
            return {
                webUrl: '',
                loadDisplay: false,
                webTaging: false,
                imgArr: [],
                addImgArr: [],
                url: '/api/func/pic_target',
                resultUrl: '/api/func/pic_target',
                inputUrl: '/api/func/pic_target_webUrl'
            }
        },
        created(){},
        computed: {},
        methods: {
            uuid() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    let r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
                    return v.toString(16);
                });
            },
            onCloseImg(index) {
                this.imgArr[index].img = '';
                this.imgArr[index].imgTag = '';
                this.imgArr.splice(index,1);
            },
            onWebSubmit() {
                const index= this.webUrl.lastIndexOf(".");
                const ext = this.webUrl.substr(index+1);
                if (!/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/.test(this.webUrl) || !/jpg/g.test(ext)) {
                    return this.$message.error('图片地址格式错误');
                }
                this.webTaging = true;
                this.loadDisplay = true;
                this.loadText = '文件提交中...';
                this.addImgArr = [{
                    img: '',
                    imgTag: '',
                    des: ''
                }];
                console.log(this.webUrl);
                const formData = new FormData();
                formData.append('id', this.uuid());
                formData.append('url',this.webUrl);
                this.postImg(this.inputUrl, formData);
            },
            onWatchDataReady(id) {
                const handle = setInterval(() => {
                    this.$axios.get(`${this.resultUrl}/${id}`).then((res) => {
                        const json = res.data;
                        //console.log(json);
                        if (json.errCode) {
                            clearInterval(handle);
                            this.loadText = '';
                            this.loadDisplay = false;
                            return this.$message.error('数据处理失败');
                        }
                        if (json.data.summary) {
                            clearInterval(handle);
                            this.loadText = '';
                            this.loadDisplay = false;
                            this.webUrl = '';
                            //const descArr = json.data.summary;
                            // imgMark中的result.json的summary不支持多张图片分别描述 !important
                            this.addImgArr.forEach((item, index) => {
                                //this.webTaging && (item.img = this.webUrl);
                                json.data.images[index] && (item.imgTag = json.data.dir + json.data.images[index]); //后端返回图片路径
                                !json.data.images[index] && (item.imgTag = item.img);
                                //console.log(item.des);
                                //console.log('descArr', descArr[index]);
                                json.data.summary && (item.des = '图像显示了' + json.data.summary);
                                !json.data.summary && (item.des = '图像所含元素类别未知');
                            });
                            this.imgArr = this.addImgArr.concat(this.imgArr);
                            return this.$message.success('处理成功');
                        }
                    });
                }, 2000);
            },
            readPhoto(index) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addImgArr[index].img = reader.result;
                };
                event.target.files[index] && reader.readAsDataURL(event.target.files[index]);
            },
            postImg(url, formData) {
                this.$axios.post(url, formData).then((res) => {
                    const json = res.data;
                    if (!json.errCode) {
                        //this.$message.success('文件提交成功');
                        this.onWatchDataReady(json.data.id);
                        return this.loadText = '信息提取中...';
                    }
                    this.loadDisplay = false;
                    this.loadText = '';
                    if (json.errCode === -4) {
                        return this.$message.error('输入地址中无可下载的图片');
                    }
                    return this.$message.error('处理异常: ' + (res.data.errMsg || res.data.errCode));
                });
            },
            uploadImg(fileArr) {
                this.loadDisplay = true;
                this.loadText = '文件提交中...';
                const formData = new FormData();
                formData.append('id', this.uuid());
                for (let index in event.target.files) {
                    if (index === 'length') {
                        break;
                    }
                    this.addImgArr.push({
                        img: '',
                        imgTag: '',
                        des: ''
                    });
                    this.readPhoto(index);
                    formData.append("file", event.target.files[index]);
                }
                this.postImg(this.url, formData);
            },
            onInputImg(event) {
                this.webTaging = false;
                this.addImgArr = [];
                //this.readPhoto();
                this.uploadImg(event.target.files);
            },
            clickImgBtn() {
                const fileInput = document.getElementById("img-input");
                fileInput && fileInput.value && (fileInput.value = '');
                document.getElementById('img-input').click();
            }
        }
    }
</script>

<style scoped>
    ::-webkit-input-placeholder {
        color: #97a8be;
    }
    .pt-img-box{
        position: relative;
        max-height: 300px;
        width: auto;
        margin: 0 5px 10px 0;
        left: 50%;
        transform: translate(-50%);
    }
    .pt-img-container {
        position: relative;
        width: fit-content;
        display: inline-block;
        margin: 10px 10px 0 0;
        padding: 10px 5px 5px 10px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.39);
    }
    .pt-img-fork {
        position: absolute;
        z-index: 1;
        color: #b0aeae;
        right: 14px;
        top: 14px;
        display: none;
        cursor: pointer;
    }
    .pt-img-container:hover .pt-img-fork {
        display: block;
    }
    #pt-img-input {
        width: 45%;
        margin-bottom: 10px;
        margin-right: 10px;
        transform: translateY(2px);
    }
    .pt-tag {
        display: block;
        width: fit-content;
        margin-bottom: 10px;
        padding: 0 15px;
        color: #777474;
        font-size: 14px;
        font-weight: 600;
    }
    .loader {
        position: absolute;
        width: 250px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: helvetica, arial, sans-serif;
        text-transform: uppercase;
        font-weight: 900;
        color: #20a0ff;
        letter-spacing: 0.2em;
        z-index: 10;
    }
    .loader::before, .loader::after {
        content: "";
        display: block;
        width: 15px;
        height: 15px;
        background: #20a0ff;
        position: absolute;
        animation: load .7s infinite alternate ease-in-out;
    }
    .loader::before {
        top: 0;
    }
    .loader::after {
        bottom: 0;
    }
    @keyframes load {
        0% { left: 0; height: 30px; width: 15px }
        50% { height: 8px; width: 40px }
        100% { left: 235px; height: 30px; width: 15px}
    }
</style>
