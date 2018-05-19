<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 功能</el-breadcrumb-item>
                <el-breadcrumb-item>视频信息提取</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-form ref="form" :model="form" label-width="90px">
            <el-form-item label="时间：" class="vf-label">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="date1" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2" id="short-line">—</el-col>
                <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="form.date" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="地点：" class="vf-label">
                <el-input v-model="form.location"></el-input>
            </el-form-item>
            <el-form-item label="本地视频：" class="vf-label">
                <input type="file" accept="video/mp4" multiple="multiple" refs="onInputVideo" @change="onInputVideo" id="video-input" style="display: none">
                <el-button type="success" @click="clickVideoBtn">选择文件并提取</el-button>
            </el-form-item>
            <el-form-item label="网络视频：" class="vf-label">
                <el-input
                    placeholder="输入视频地址，仅支持mp4格式，如：http://www.ailongma.com/video/abc.mp4" icon="search" v-model="webUrl" id="vf-video-input">
                </el-input>
                <el-button type="success" @click="onWebSubmit">点击提取</el-button>
            </el-form-item>
        </el-form>

        <div v-if='loadDisplay' class="loader">{{ loadText }}</div>

        <el-tag type="gray" v-if="decsDisplay" class="vf-tag">{{ videoDesc }}</el-tag>
        <div class="vf-frame-box" v-for="(item, index) in imgArr">
            <img v-if="item.img" :src="item.img" class="vf-frame-img">
        </div>

    </div>
</template>

<script scoped>
    export default {
        components: {},
        data() {
            return {
                loadDisplay: false,
                imgArr: [],
                tarImg: '',
                loadText: '',
                webUrl: '',
                videoDesc: '',
                decsDisplay: false,
                date1: '',
                form: {
                    date: '',
                    location: '',
                    videoName: '',
                    fileId: ''
                },
                url: '/api/func/video_frame',
                resultUrl: '/api/func/video_frame',
                inputUrl: '/api/func/video_frame_webUrl',
                targetUrl: '/api/func/pic_target_webUrl',
                infoUrl: '/api/func/video_info'
            }
        },
        created() {},
        computed: {},
        methods: {
            initForm() {
                this.date1 = '';
                this.form = {
                    date: '',
                    location: '',
                    videoName: '',
                    fileId: ''
                }
            },
            onWatchFrameReady(id) {
                const handle = setInterval(() => {
                    this.$axios.get(`${this.resultUrl}/${id}`).then((res) => {
                        const json = res.data;
                        //console.log(json);
                        if (json.errCode) {
                            clearInterval(handle);
                            this.loadText = '';
                            this.loadDisplay = false;
                            return this.$message.err('数据处理失败');
                        }
                        if (json.data.summary) {
                            clearInterval(handle);

                            // videoInfo
                            this.postVideoInfo(id);
                            this.initForm();

                            this.loadText = '';
                            this.loadDisplay = false;
                            this.videoDesc = '视频中显示了' + json.data.summary;
                            //summaryArr.length && (this.videoDesc =summaryArr.join(';'));
                            this.decsDisplay = true;
                            json.data.images.forEach((img, index) => {
                                this.imgArr.push({
                                    img: json.data.dir + json.data.images[index],
                                });
                            });
                            console.log('请求成功时this.imgArr：', this.imgArr);
                        }
                    });
                }, 2000);
            },
            postVideoInfo(id) {
                this.form.fileId = id;
                this.$axios.post(this.infoUrl, this.form).then((res) => {
                    this.$message.success('信息存储成功');
                })
            },
            postVideo(url, formData) {
                this.$axios.post(url, formData).then((res) => {
                    const json = res.data;
                    if (!json.errCode) {
                        //this.$message.success('文件提交成功');
                        this.onWatchFrameReady(json.data.id);
                        return this.loadText = '信息提取中...';
                    }
                    this.loadDisplay = false;
                    this.loadText = '';
                    if (json.errCode === -4) {
                        return this.$message.error('输入地址中无可下载的视频');
                    }
                    return this.$message.error('处理异常: ' + (res.data.errMsg || res.data.errCode));
                });
            },
            onInputVideo(event) {
                if (!this.form.date || !this.form.location) {
                    return this.$message.error('请输入完整的视频信息');
                }
                if (event.target.files[0]) {
                    this.imgArr = [{
                        img: '',
                    }];
                    this.decsDisplay = false;
                    this.loadDisplay = true;
                    this.loadText = '文件提交中...';
                    this.form.videoName = event.target.files[0].name;
                    const formData = new FormData();
                    this.form.date = this.form.date.toLocaleString();
                    formData.append('file', event.target.files[0]);
                    this.postVideo(this.url, formData);
                }
            },
            clickVideoBtn() {
                const fileInput = document.getElementById("video-input");
                fileInput && fileInput.value && (fileInput.value = '');
                document.getElementById('video-input').click();
            },
            onWebSubmit() {
                if (!this.form.date || !this.form.location) {
                    return this.$message.error('请输入完整的视频信息');
                }
                const index= this.webUrl.lastIndexOf(".");
                const ext = this.webUrl.substr(index+1);
                if (!/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/.test(this.webUrl) || (!/mp4/g.test(ext))) {
                    return this.$message.error('视频地址格式错误');
                }
                this.imgArr = [{
                    img: '',
                }];
                this.decsDisplay = false;
                this.loadDisplay = true;
                this.loadText = '文件提交中...';
                console.log(this.webUrl);
                this.form.videoName = this.webUrl.replace(/(.*\/)*([^.]+)/ig,"$2");
                const formData = new FormData();
                this.form.date = this.form.date.toLocaleString();
                formData.append('videoInfo',JSON.stringify(this.form));
                formData.append('url',this.webUrl);
                this.postVideo(this.inputUrl, formData);
            },
        }
    }
</script>

<style scoped>
    ::-webkit-input-placeholder {
        color: #97a8be;
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
    #vf-video-input {
        width: calc(100% - 93px);
        margin-bottom: 10px;
        transform: translateY(2px);
    }
    .vf-tag {
        display: block;
        width: fit-content;
        margin-bottom: 10px;
        padding: 0 15px;
        color: #777474;
        font-size: 14px;
        font-weight: 600;
    }
    .vf-label {
        width: 50% !important;
        margin-bottom: 12px;
    }
    .vf-label .el-input {
        width: calc(100% - 2px);
    }
    .vf-label .el-col-11 {
        width: calc(50% - 8px);
    }
    #short-line {
        width: 14px;
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
