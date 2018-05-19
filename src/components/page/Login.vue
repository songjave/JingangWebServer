<!--<head>
    <title>智能咨询系统登录</title>
</head>-->
<template>
<body class="login-body">
<v-browser></v-browser>
<div id="container">
    <header class="login-header"></header>
    <section class="login-section">
        <nav class="login-nav">
            <button v-bind:class="navTextStatus" @click="textBtn" title="用户名登录"></button>
            <button v-if="!textVerified" class="nav-Voice-Inactive"></button>
            <button v-if="textVerified" v-bind:class="navVoiceStatus" @click="voiceBtn" title="声纹登录"></button>
            <!--<button v-bind:class="navVoiceStatus" @click="voiceBtn" title="声纹登录"></button>-->
            <button v-bind:class="navFaceStatus" @click="faceBtn" title="人脸登录"></button>
        </nav>
        <main class="login-main" v-if="textDisplay">
            <form class="login-form" @keydown.enter="submitTextVerify">
                <div>
                    <label class="login-label">用户名</label>
                    <input class="input-area" type="text" v-model="textVerify.uid" @click="uidFocus">
                </div>
                <div style="position: relative">
                    <label class="login-label" id="secret-label">密&ensp;&ensp;码</label>
                    <input type="text" v-bind:class="passwordClass" v-model="textVerify.password" @click="passwordFocus">
                    <div v-bind:class="eyesClass" @click="switchPassword" v-if="textVerify.password"></div>
                </div>
                <div class="text-warn">{{ textVerifyWarn }}</div>
                <div id="text-btn-group">
                    <button class="text-btn" type="button" @click="submitTextVerify">确 定</button>
                </div>
            </form>
        </main>
        <main class="login-main" v-if="voiceDisplay">
            <div class="wave-box">
                <div class="read" v-if="waveDisplay">请朗读以下文字：<br />宇宙只有一个地球，人类共有一个家园。地球是人类唯一赖以生存的家园，珍爱和呵护地球是人类的唯一选择。金山银山不如绿水青山。</div>
                <div class="voice-warn" v-if="!waveDisplay">{{ voiceVerifyWarn }}</div>
                <hr class="read-hr" v-if="waveDisplay"/>
                <svg class="wave-container" v-if="waveDisplay" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g class="wave">
                        <use xlink:href="#gentle-wave" x="50" y="0" fill="#229cf1"/>
                    </g>
                </svg>
            </div>
            <div v-bind:class="loginMicroClass" @click="onClickMicro" title="点击录音"></div>
            <audio id="audio" controls></audio>
        </main>
        <main class="login-main" v-if="faceDisplay">

            <video id="myVideo" width="440" :height="videoHeight" preload autoplay loop muted></video>

            <canvas id="myCanvas" width="440" height="330" style="display: none"></canvas>
            <div class="face-warn">{{ faceVerifyWarn }}</div>
            <div class="face-icon-box" v-if="isOnFaceCaptureEnd">
                <div class="face-icon" @click="onOpenFaceCapture" title="开启人脸识别" plain></div>
            </div>
            <div class="face-btn-group">
                <button class="face-btn left" v-if="isValidFace" @click="onTakeFaceCapture" title="点击拍照" round></button>
                <button class="face-btn right" v-if="isOnFaceCapture" @click="onCloseFaceCapture" title="取消" plain></button>
            </div>

        </main>
    </section>
</div>
</body>
</template>

<script>
    import '../../assets/js/recoder';
    import '../../assets/js/build/tracking';
    import '../../assets/js/build/data/face-min';
    import vBrowser from '../common/BrowserFit.vue';
    //import 'tracking/build/tracking';
    //import 'tracking/build/data/face-min';

    export default {
        components:{
            vBrowser
        },
        data() {
            return {
                textDisplay: true,
                textVerify: {
                    uid: '',
                    password: ''
                },
                textVerifyWarn: '',
                textVerified: false,
                textVerifiedUid: '',


                voiceDisplay: false,
                microBtnClick: false,
                voiceVerifyWarn: '',
                isRecording: false,
                recorder: null,
                voiceBlob: null,
                waveDisplay: false,
                loginMicroClass: {
                    loginMicroActive: false,
                    loginMicroInactive: true
                },
                recordTime: 0,
                recordStart: 0,

                faceDisplay: false,
                faceVerifyWarn: '',
                captrueFace: '',
                form: {},
                flag: false,
                isOnFaceCaptureEnd: true,
                isOnFaceCapture: false,
                isValidFace: false,
                isValidFaceHandle: null,
                videoHeight: 330,
                trackingTask: null,
                detectFaceCallback: null,
                passwordClass: {
                    passwordVisible: false,
                    passwordHidden: true
                },
                eyesClass: {
                    openEyes: false,
                    closeEyes: true
                },

                navTextStatus: {
                    navBtnActive: true,
                    navBtnInactive: false
                },
                navVoiceStatus: {
                    navBtnActive: false,
                    navBtnInactive: true
                },
                navFaceStatus: {
                    navBtnActive: false,
                    navBtnInactive: true
                },
                jumpUrl: '/',
                url: '/api/user/login',
            }
        },
        created(){
        },
        computed: {
        },
        methods: {
            switchPassword() {
                this.passwordClass.passwordVisible = !this.passwordClass.passwordVisible;
                this.passwordClass.passwordHidden = !this.passwordClass.passwordHidden;
                this.eyesClass.openEyes = !this.eyesClass.openEyes;
                this.eyesClass.closeEyes = !this.eyesClass.closeEyes;
            },
            initText() {
                this.textVerify = {
                    uid: '',
                        password: ''
                };
                this.textVerifyWarn = '';
            },
            initVoice() {
                this.microBtnClick = false;
                this.voiceVerifyWarn = '';
                this.isRecording = false;
                //this.recorder = null;
                this.voiceBlob = null;
                this.waveDisplay = false;
                this.loginMicroClass = {
                    loginMicroActive: false,
                    loginMicroInactive: true
                };
                this.recordTime = 0;
                this.recordStart = 0;
            },
            initFace() {
                this.faceVerifyWarn = '';
                this.captrueFace = '';
                this.form = {};
                this.flag = false;
                this.isOnFaceCaptureEnd = true;
                this.isOnFaceCapture = false;
                this.isValidFace = false;
                this.isValidFaceHandle = null;
                this.videoHeight = 330;
                this.trackingTask = null;
                this.detectFaceCallback = null;
                this.passwordClass = {
                    passwordVisible: false,
                    passwordHidden: true
                };
                this.eyesClass = {
                    openEyes: false,
                    closeEyes: true
                };
            },
            navBtnClick(current, other1, other2) {
                if (!current.navBtnActive) {
                    current.navBtnActive = true;
                    current.navBtnInactive = false;
                }
                if (other1.navBtnActive) {
                    other1.navBtnActive = false;
                    other1.navBtnInactive = true;
                }
                if (other2.navBtnActive) {
                    other2.navBtnActive = false;
                    other2.navBtnInactive = true;
                }
            },
            textBtn() {
                this.textDisplay = true;
                this.voiceDisplay = false;
                this.faceDisplay = false;
                this.navBtnClick(this.navTextStatus, this.navVoiceStatus, this.navFaceStatus);
                this.onCloseFaceCapture();
                this.initVoice();
                this.initFace();
            },
            voiceBtn() {
                this.textDisplay = false;
                this.voiceDisplay = true;
                this.faceDisplay = false;
                this.navBtnClick(this.navVoiceStatus, this.navTextStatus, this.navFaceStatus);
                this.onCloseFaceCapture();
                this.initText();
                this.initFace();
            },
            faceBtn() {
                this.textDisplay = false;
                this.voiceDisplay = false;
                this.faceDisplay = true;
                this.navBtnClick(this.navFaceStatus, this.navVoiceStatus, this.navTextStatus);
                this.initText();
                this.initVoice();
            },

            postReq(formdata, cb) {
                this.$axios.post(this.url, formdata).then((res) => {
                    const json = res.data;
                    //console.log(json);
                    return cb(json);
                });
            },

            //-------text verify---------
            uidFocus() {
                this.textVerifyWarn = '';
            },
            passwordFocus() {
                this.textVerifyWarn = '';
            },
            submitTextVerify() {
                if (!this.textVerify.uid) {
                    return this.textVerifyWarn = '请输入用户名';
                }
                if (!this.textVerify.password) {
                    return this.textVerifyWarn = '请输入密码';
                }

                const formData = new FormData();
                formData.append('uid', this.textVerify.uid);
                formData.append('password', this.textVerify.password);

                this.postReq(formData, (json) => {
                    if (!json.errCode) {
                        //this.$router.push(this.jumpUrl); // 注释掉
                        this.textVerified = true;
                        this.textVerifiedUid = json.data.uid;
                        this.voiceBtn();
                        this.voiceVerifyWarn = '请点击按钮进行声纹识别';
                    }
                    else if (json.errCode === -5) {
                        return this.textVerifyWarn = '用户ID或密码输入错误，请重新输入';
                    }
                    else{
                        return this.textVerifyWarn = '服务器错误';
                    }
                });
            },

            //-------voice verify---------
            afterClickMicro() {
                this.waveDisplay = !this.waveDisplay;
                this.loginMicroClass.loginMicroInactive = !this.loginMicroClass.loginMicroInactive;
                this.loginMicroClass.loginMicroActive = !this.loginMicroClass.loginMicroActive;
            },
            onClickMicro() {
                this.microBtnClick = !this.microBtnClick;
                this.recordTime = 0;
                if (this.microBtnClick) {
                    this.onStartRecord((err) => {
                        this.voiceVerifyWarn = '';
                        if (err.msg) {
                            //console.log('err.msg', err.msg); //err.name & err.message
                            this.voiceVerifyWarn = err.msg;
                            this.microBtnClick = !this.microBtnClick;
                            return;
                        }
                        this.recordStart = Date.parse(new Date());
                        this.afterClickMicro();
                    });
                }
                else {
                    this.recordTime = Math.abs(Date.parse(new Date()) - this.recordStart);
                    this.recordTime > 4000 && this.onStopRecord();
                    this.recordTime <= 4000 && (this.voiceVerifyWarn = '说话时长小于5秒，请重新开始');
                    this.afterClickMicro();
                }
            },
            doRecognize() {
                const formData = new FormData();
                formData.append('voice', this.voiceBlob);

                this.postReq(formData, (json) => {
                    if (!json.errCode) {
                        console.log(json.data.uid, this.textVerifiedUid);
                        if (json.data.uid !== this.textVerifiedUid) {
                            this.voiceVerifyWarn = '语音登录失败，请重试';
                            setTimeout(() => {
                                return this.voiceVerifyWarn = '';
                            }, 1800);
                        }
                        else this.$router.push(this.jumpUrl);
                    }
                    else if (json.errCode === -5) {
                        this.voiceVerifyWarn = '语音登录失败，请重试';
                        setTimeout(() => {
                            return this.voiceVerifyWarn = '';
                        }, 1800);
                    }
                    else {
                        this.voiceVerifyWarn = '服务器错误';
                        setTimeout(() => {
                            return this.voiceVerifyWarn = '';
                        }, 3000);
                    }
                });
            },
            onStartRecord(cb) {
                if (this.isRecording) {
                    this.recorder.stop();
                }

                if (this.recorder) {
                    //this.recorder.clear();
                    this.isRecording = true;
                    this.recorder.start();
                    return cb({});
                }
                else if (!this.recorder || !window.AudioContext) {
                    HZRecorder.get((rec) => {
                        if (rec.code || rec.name) {
                            return cb(rec);
                        }
                        this.recorder = rec;
                        this.isRecording = true;
                        this.recorder.start();
                        return cb({});
                    });
                }

            },
            onStopRecord() {
                this.recorder.stop();
                const audio = document.getElementById('audio');
                this.recorder.play(audio);
                this.voiceBlob = this.recorder.getData();
                this.isRecording = false;
                this.onRecognize();
            },
            onRecognize() {
                if (!this.voiceBlob) {
                    return this.voiceVerifyWarn = '无效数据';
                }
                //this.doRecognize();
                this.$router.push(this.jumpUrl);
            },

            //-------face verify---------
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
            doFaceRecognize() {
                const formData = new FormData();
                formData.append('face', this.dataURLtoBlob(this.form.face));

                this.postReq(formData, (json) => {
                    if (!json.errCode) {
                        this.$router.push(this.jumpUrl);
                    }
                    else if (json.errCode === -5) {
                        this.faceVerifyWarn = '面部登录失败，请重试';
                    }
                    else {
                        this.faceVerifyWarn = '服务器错误';
                    }
                });
            },
            onTakeFaceCapture() {
                this.detectFaceCallback = (base64Data) => {
                    //console.log(base64Data.length);
                    this.detectFaceCallback = null;
                    this.onCloseFaceCapture();
                    this.form.face = base64Data;
                    this.isValidFace = false;
                    this.doFaceRecognize();
                }
            },
            onCloseFaceCapture() {
                this.trackingTask && this.trackingTask.stop();
                const video = document.getElementById("myVideo");
                video && video.pause();
                video && (video.src = "");
                video && video.srcObject && video.srcObject.getVideoTracks() && video.srcObject.getVideoTracks()[0].stop();
                //this.videoHeight = 0;
                this.isOnFaceCapture = false;
                this.isValidFace = false;
                this.isOnFaceCaptureEnd = true;
            },
            onOpenFaceCapture() {
                this.faceVerifyWarn = '';
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
                        this.faceVerifyWarn = '无法正常打开摄像头';
                        return;
                    }
                    this.trackingTask = result;
                    //console.log('this.trackingTask:', this.trackingTask);

                    tracker.on('track', (event) => {
                        this.isOnFaceCapture = true;
                        this.isOnFaceCaptureEnd = false;
                        this.videoHeight = 330;
                        if (event.data.length === 0) {
                            if (this.isValidFaceHandle){
                                // return;
                            }

                            this.isValidFaceHandle = setTimeout(() => {
                                this.isValidFace = false;
                            }, 300);

                            return;
                        }

                        this.isValidFaceHandle && clearTimeout(this.isValidFaceHandle);
                        this.isValidFace = true;

                        if (!this.detectFaceCallback) { //未触发拍照
                            return;
                        }

                        const canvas = document.getElementById('myCanvas');
                        const context = canvas.getContext('2d');
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.drawImage(myVideo, 0, 0, 440, 330);
                        const imgData = canvas.toDataURL();
                        this.detectFaceCallback(imgData);
                    });
                });
            },
        }
    }

</script>

<style scoped>
    @import '../../assets/css/login2.css';
</style>
