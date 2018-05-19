<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 服务管理</el-breadcrumb-item>
                <el-breadcrumb-item>人脸识别测试</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="my-box">
            <el-row  class="face-button">
                <el-button v-show="isOnFaceCaptureEnd" type="primary" @click="onOpenFaceCapture" plain>开启摄像头拍照</el-button>
                <el-button type="success" v-show="isValidFace" @click="onTakeFaceCapture" round>拍照并识别</el-button>
                <el-button v-show="isOnFaceCapture" @click="onCloseFaceCapture" plain>取消</el-button>
            </el-row>
            <el-row v-if="form.face">
                <img :src="form.face">
            </el-row>
            <el-row>
                <video id="myVideo" width="320" height="240" v-show="videoHeight" preload autoplay loop muted></video>
                <canvas id="canvas" width="320" height="240" style="display: none"></canvas>
            </el-row>

            <el-tag type="gray">{{text}}</el-tag>

        </div>
    </div>
</template>

<script>
    import '../../assets/js/build/tracking';
    import '../../assets/js/build/data/face-min';

    export default {
        components:{
        },
        data() {
            return {
                url: '/api/user/login',
                text: '暂无识别结果',
                form: {},

                flag: false,
                isOnFaceCaptureEnd: true,
                isOnFaceCapture: false,
                isValidFace: false,
                isValidFaceHandle: null,
                videoHeight: false,
                trackingTask: null,
                detectFaceCallback: null,
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            dataURLtoBlob (dataurl) {
                const arr = dataurl.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            },
            doRecognize() {
                const formData = new FormData();
                formData.append('face', this.dataURLtoBlob(this.form.face));

                this.$axios.post(this.url, formData).then((res) => {
                    const json = res.data;
                    //console.log(json);
                    if (json.errCode) {
                      return this.text = json.errMsg || json.errCode;
                    }
                    this.text = JSON.stringify(json);
                });
            },
            onTakeFaceCapture() {
                this.detectFaceCallback = (base64Data) => {
                    //console.log(base64Data.length);
                    this.detectFaceCallback = null;
                    this.onCloseFaceCapture();
                    this.form.face = base64Data;
                    this.isValidFace = false;
                    this.doRecognize();
                }
            },
            onCloseFaceCapture() {
                this.trackingTask.stop();
                const video = document.getElementById("myVideo");
                video.pause();
                video.src="";
                video.srcObject && video.srcObject.getVideoTracks() && video.srcObject.getVideoTracks()[0].stop();
                this.videoHeight = false;
                this.isOnFaceCapture = false;
                this.isOnFaceCaptureEnd = true;
                this.isValidFace = false;
            },
            onOpenFaceCapture() {
                this.text = '暂无识别结果';
                this.videoHeight = true;
                this.form = {};
                if (this.trackingTask) {
                    // return this.trackingTask.run();
                }

                const tracker = new tracking.ObjectTracker('face');
                tracker.setInitialScale(4);
                tracker.setStepSize(2);
                tracker.setEdgesDensity(0.1);

                tracking.track('#myVideo', tracker, { camera: true }, (result) => {
                    if (result.errCode) {
                        this.isOnFaceCapture = false;
                        this.isOnFaceCaptureEnd = true;
                        this.videoHeight = false;
                        return this.$message.error('无法正常打开摄像头');
                    }
                    this.trackingTask = result;

                    tracker.on('track', (event) => {
                        this.isOnFaceCapture = true;
                        this.isOnFaceCaptureEnd = false;
                        if (event.data.length === 0) {
                            if(this.isValidFaceHandle){
                                return;
                            }

                            this.isValidFaceHandle = setTimeout(() => {
                                this.isValidFace = false;
                            }, 200);

                            return;
                        }

                        this.isValidFaceHandle && clearTimeout(this.isValidFaceHandle);
                        this.isValidFace = true;

                        if (!this.detectFaceCallback) { //未触发拍照
                            return;
                        }

                        const canvas = document.getElementById('canvas');
                        const context = canvas.getContext('2d');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.translate(canvas.width, 0);
                        context.scale(-1, 1);
                        context.drawImage(myVideo, 0, 0, 320, 240);
                        context.translate(canvas.width, 0);
                        context.scale(-1, 1);
                        const imgData = canvas.toDataURL();
                        this.detectFaceCallback(imgData);
                    });
                });
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
    .el-row {
        margin-bottom: 20px;
    }
    #myVideo {
        -moz-transform:scaleX(-1);
        -webkit-transform:scaleX(-1);
        -o-transform:scaleX(-1);
        transform:scaleX(-1);
    }
    .face-button .el-button+.el-button{
        margin-left: 0;
    }
</style>
