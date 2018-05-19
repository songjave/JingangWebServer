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
                <el-button type="success" @click="onRecoginze()">进行语音识别</el-button>
            </el-row>

            <el-tag class="stt_tag">{{text}}</el-tag>
            <el-tag class="stt_tag" type="primary">{{textBeta}}</el-tag>
            <el-tag class="stt_tag" type="success">{{textAlpha}}</el-tag>
            <el-tag class="stt_tag" type="warning">{{textBaidu}}</el-tag>

        </div>
    </div>
</template>

<script>
    import '../../assets/js/recoder';
    export default {
        components:{
        },
        data() {
            return {
                url: '/api/func/stt',
                urlBeta: '/api/func/stt/stt_beta',
                urlAlpha: '/api/func/stt/stt_alpha',
                urlBaidu: '/api/func/stt/stt_baidu_online',
                isRecording: false,
                recorder: null,
                voiceBlob: null,
                text: '暂无识别结果',
                textBeta: '暂无识别结果',
                textAlpha: '暂无识别结果',
                textBaidu: '暂无识别结果',
                form: {}
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            doRecoginze() {
                const formData = new FormData();
                formData.append('file', this.voiceBlob);

                this.$axios.post(this.url, formData).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                      return this.text = json.errMsg || json.errCode;
                    }
                    this.text = json.data.text || '未识别到文本';
                });

                this.$axios.post(this.urlBeta, formData).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        return this.textBeta = json.errMsg || json.errCode;
                    }
                    this.textBeta = json.data.text || '未识别到文本';
                });

                this.$axios.post(this.urlAlpha, formData).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        return this.textAlpha = json.errMsg || json.errCode;
                    }
                    this.textAlpha = json.data.text || '未识别到文本';
                });

                this.$axios.post(this.urlBaidu, formData).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        return this.textBaidu = json.errMsg || json.errCode;
                    }
                    this.textBaidu = json.data.text || '未识别到文本';
                });
            },
            onStartRecord() {
                if (this.isRecording) {
                    this.recorder.stop();
                }
                if (this.recorder) {
                    this.recorder.clear();
                    this.isRecording = true;
                    this.recorder.start();
                }
                else if (!this.recorder || !window.AudioContext) {
                    HZRecorder.get((rec) => {
                        console.log(rec);
                        if (rec.code || rec.name) {
                            return this.$message.error(rec.msg);
                        }
                        this.recorder = rec;
                        this.isRecording = true;
                        this.recorder.start();
                    });
                }
            },
            onStopRecord() {
                this.recorder.stop();
                const audio = document.getElementById('audio');
                this.recorder.play(audio);
                this.voiceBlob = this.recorder.getData();
                this.isRecording = false;
            },
            onRecoginze() {
                if (!this.voiceBlob) {
                    return alert('无效数据');
                }
                this.doRecoginze();
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
    .stt_tag {
        display: block;
        margin-bottom: 10px;
        width: fit-content;
    }
</style>
