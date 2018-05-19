<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 功能</el-breadcrumb-item>
                <el-breadcrumb-item>图像自动描述</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <input type="file" accept="image/*" multiple="multiple" @change="onInputImg" id="img-input" style="display: none">
        <el-button type="primary" @click="clickImgBtn">上传图片</el-button><br />
        <div v-if='loadDisplay' class="loader">处理中...</div>
        <div v-for="(item, index) in imgArr" v-if="item.des" class="pd-img-container">
            <i class="el-icon-circle-close dp-img-fork" @click="onCloseImg(index)"></i>
            <img :src="item.img" class="pd-img-box">
            <div class="pd-tag"><span>{{ item.des }}</span></div>
        </div>

    </div>
</template>

<script scoped>
    export default {
        components:{
        },
        data() {
            return {
                loadDisplay: false,
                imgArr: [],
                addImgArr: [],
                url: '/api/func/pic_describe',
            }
        },
        created(){
        },
        computed: {},
        methods: {
            onCloseImg(index) {
                this.imgArr[index].img = '';
                this.imgArr[index].des = '';
            },
            readPhoto(index) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addImgArr[index].img = reader.result;
                };
                event.target.files[index] && reader.readAsDataURL(event.target.files[index]);
            },
            postImg(formData) {
                this.$axios.post(this.url, formData).then((res) => {
                    this.loadDisplay = false;
                    const json = res.data;
                    if (!json.errCode) {
                        this.addImgArr.forEach((item, index) => {
                            item.des = json.data.list[index].des;
                        });
                        this.imgArr = this.addImgArr.concat(this.imgArr);
                        return this.$message.success('处理成功');
                    }
                    return this.$message.error('处理异常: ' + (res.data.errMsg || res.data.errCode));
                });
            },
            uploadImg(fileArr) {
                this.loadDisplay = true;
                const formData = new FormData();
                for (let index in event.target.files) {
                    if (index === 'length') {
                        break;
                    }
                    this.addImgArr.push({
                        img: '',
                        des: ''
                    });
                    this.readPhoto(index);
                    formData.append("file", event.target.files[index]);
                }
                this.postImg(formData);
            },
            onInputImg(event) {
                this.addImgArr = [];
                //this.readPhoto();
                this.uploadImg(event.target.files);
            },
            clickImgBtn() {
                document.getElementById('img-input').click();
            },
        }
    }
</script>

<style scoped>
    ::-webkit-input-placeholder {
        color: #97a8be;
    }
    .pd-img-box{
        position: relative;
        height: 300px;
        width: auto;
        margin-bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
    }
    .pd-tag {
        display: block;
        width: fit-content;
        margin-bottom: 10px;
        padding: 0 15px;
        color: #777474;
        font-size: 14px;
        font-weight: 600;
    }
    .pd-img-container {
        position: relative;
        display: inline-block;
        margin: 10px 10px 0 0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.39);
    }
    .dp-img-fork {
        position: absolute;
        z-index: 1;
        color: #b0aeae;
        right: 5px;
        top: 5px;
        display: none;
        cursor: pointer;
    }
    .pd-img-container:hover .dp-img-fork {
        display: block;
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
