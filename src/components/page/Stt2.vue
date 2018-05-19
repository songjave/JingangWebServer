<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 服务管理</el-breadcrumb-item>
                <el-breadcrumb-item>语音识别测试</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="my-box">
            <el-row>
                <audio id="audio" controls></audio>
            </el-row>
            <el-row>
                <el-button type="primary" @click="onStartRecord()" plain>开始录音</el-button>
                <el-button type="primary" @click="onStopRecord()" plain>停止录音</el-button>
            </el-row>
            <el-row>
                <el-tag type="gray">{{text}}</el-tag>
            </el-row>
            <el-row>
            <el-tag type="">{{status}}</el-tag>
            </el-row>
        </div>
    </div>
</template>

<script>
    import '../../assets/js/adapter-latest'
    import '../../assets/js/recorder_vad'
    export default {
        components:{
        },
        data() {
            return {
                url: '/api/func/stt',
                isOn: false,
                recorder: null,
                voiceBlob: null,
                text: '暂无识别结果',
                status: '状态停止',
                form: {}
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            doRecognize() {
                const formData = new FormData();
                formData.append('file', this.voiceBlob);

                this.$axios.post(this.url, formData).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                      return this.text = json.errMsg || json.errCode;
                    }
                    this.text = json.data.text || '未识别到文本';
                });
            },
            dealStatusChange(status) {
                //console.log('status change-----', status);
                this.status = status;
            },

            dealSentenceReady(data) {
                const audio = document.getElementById('audio');
                this.voiceBlob = data;
                audio.src = window.URL.createObjectURL(data);
                this.doRecognize()
            },
            onStartRecord() {
                if (this.recorder) {
                    if (this.isOn) {
                        this.recorder.end();
                    }
                    return this.recorder.start();
                }

                const myRecorder = new MyRecorder();
                myRecorder.get((rec) => {
                    this.recorder = rec;
                    this.isOn = true;

                    this.recorder.start();
                    this.recorder.onStatusChange(this.dealStatusChange);
                    this.recorder.onSentenceReady(this.dealSentenceReady);
                });
            },
            onStopRecord() {
                this.recorder.end();
                this.isOn = false;
            }
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
</style>
