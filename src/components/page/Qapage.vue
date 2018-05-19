<!--<head>
    <title>智能咨询系统</title>
</head>-->
<template>
<div class="main-body">
    <v-browser></v-browser>
    <header class="index-header">
        <img src="../../assets/imgs/logo2.png">

        <div class="inline">
            <input type="text" class="quest-input" v-model="question" @keyup.enter="query">

            <div class="micro-wave-box">
                <svg class="micro-wave-container" v-if="microWaveDisplay" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none">
                    <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                    </defs>
                    <g class="wave">
                        <use xlink:href="#gentle-wave" x="50" y="0" fill="#229cf1"/>
                    </g>
                </svg>
            </div>

            <div class="fork-icon" @click="clearInput" v-if="question"></div>
            <div v-bind:class="queryIconClass" @click="query()" title="咨询"></div>
        </div>
        <div class="logout" @click="onLogout" title="退出登录"></div>
        <div v-bind:class="userNameClass">{{ userName }}</div>
    </header>
    <div class="contanier">
        <audio id="audio" controls></audio>
        <div class="main-micro-box" v-if="notQueryCss">
            <hr class="micro-hr" />
            <div v-bind:class="microClass" @click="onMicroClick" v-bind:title="microBtnTitle"></div>
            <div class="load" v-show="loaderDisplay"></div>
        </div>
        <div class="recommend" v-if="notQueryCss">
            <div class="title">推荐问题</div>
            <!--TODO 添加过滤器-->
            <div class="recommend-content">
                <div class="list">
                    <li @click="onClickItem(recList[0])">{{ recList[0] }}</li>
                    <li @click="onClickItem(recList[1])">{{ recList[1] }}</li>
                    <li @click="onClickItem(recList[2])">{{ recList[2] }}</li>
                </div>
                <div class="list">
                    <li @click="onClickItem(recList[3])">{{ recList[3] }}</li>
                    <li @click="onClickItem(recList[4])">{{ recList[4] }}</li>
                    <li @click="onClickItem(recList[5])">{{ recList[5] }}</li>
                </div>
                <div class="list">
                    <li @click="onClickItem(recList[6])">{{ recList[6] }}</li>
                    <li @click="onClickItem(recList[7])">{{ recList[7] }}</li>
                    <li @click="onClickItem(recList[8])">{{ recList[8] }}</li>
                </div>
                <div class="list">
                    <li @click="onClickItem(recList[9])">{{ recList[9] }}</li>
                    <li @click="onClickItem(recList[10])">{{ recList[10] }}</li>
                    <li @click="onClickItem(recList[11])">{{ recList[11] }}</li>
                </div>
            </div>
        </div>
        <div class="answer-contanier" v-if="isQueryCss">
            <div v-if="waitAnswer" class="loading-icon"><i class="el-icon-loading"></i></div>
            <div class="answer-block">
                <div v-show="getAnswer">
                    <div @click="pauseSpeak" v-bind:class="muteClass" v-bind:title="muteTitle"></div>
                    <div class="answer-text" v-html="answerText" v-if="answerText"></div>

                    <div class="answer-list">
                        <div v-for="(item, index) in answerList" @click="onAnswerList(item, index)" v-if="answerList.length">{{ item }}</div>
                    </div>

                    <hr class="answer-hr" v-if="imgsListDisplay"/>
                    <div class="imgs-box" v-if="imgsListDisplay">
                        <img class="answer-img" v-bind:src="imgsList"/>
                        <!--<img class="answer-img" src="../../assets/imgs/logo1.png"/>-->
                    </div>
                </div>
            </div>
            <hr class="img-hr"/>
            <div class="simial-recommend-micro">
                <div class="simial-recommend">
                    <div class="similar" v-if="simListDisplay">
                        <div class="title">相似问题</div>
                        <div class="similar-content">
                            <div class="list">
                                <li @click="onClickItem(simList[0])">{{ simList[0] }}</li>
                                <li @click="onClickItem(simList[1])">{{ simList[1] }}</li>
                                <li @click="onClickItem(simList[2])">{{ simList[2] }}</li>
                            </div>
                            <div class="list">
                                <li @click="onClickItem(simList[3])">{{ simList[3] }}</li>
                                <li @click="onClickItem(simList[4])">{{ simList[4] }}</li>
                                <li @click="onClickItem(simList[5])">{{ simList[5] }}</li>
                            </div>
                        </div>
                    </div>
                    <div class="recommend-query" v-bind:class="recommendClass">
                        <div class="title">推荐问题</div>
                        <div class="recommend-content-query">
                            <div class="list">
                                <li @click="onClickItem(recList[0])">{{ recList[0] }}</li>
                                <li @click="onClickItem(recList[1])">{{ recList[1] }}</li>
                                <li @click="onClickItem(recList[2])">{{ recList[2] }}</li>
                            </div>
                            <div class="list">
                                <li @click="onClickItem(recList[3])">{{ recList[3] }}</li>
                                <li @click="onClickItem(recList[4])">{{ recList[4] }}</li>
                                <li @click="onClickItem(recList[5])">{{ recList[5] }}</li>
                            </div>
                            <div class="list">
                                <li @click="onClickItem(recList[6])">{{ recList[6] }}</li>
                                <li @click="onClickItem(recList[7])">{{ recList[7] }}</li>
                                <li @click="onClickItem(recList[8])">{{ recList[8] }}</li>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom-micro-box">
                    <div v-bind:class="microClass" @click="onMicroClick" v-bind:title="microBtnTitle"></div>
                    <div class="load" v-show="loaderDisplay"></div>
                </div>
            </div>
        </div>
    </div>
    <div id="alertshow" v-if="alertDisplay">
        <div id="text-area">
            <h4>{{ alertText }}</h4>
        </div>
        <div id="buttonOk" @click="onClickAlert">
        <h4 id="button-text">确定</h4>
        </div>
    </div>
</div>
</template>

<script>
    import '../../assets/js/adapter-latest'
    import '../../assets/js/recorder_vad'
    import vBrowser from '../common/BrowserFit.vue';

    export default {
        components:{
            vBrowser
        },
        data() {
            return {
                userName: '',
                question: '',
                answerText: '',
                answerList: [],
                alertText: '',
                muteTitle: '停止播放',
                microBtnTitle: '开始录音',
                waitAnswer: true,
                getAnswer: false,
                microStart: false,
                isQueryCss: false,
                notQueryCss: true,
                microWaveDisplay: false,
                simListDisplay: false,
                imgsListDisplay: false,
                loaderDisplay: false,
                isOn: false,
                ttsPause: false,
                alertDisplay: false,
                recorder: null,
                voiceBlob: null,
                recList: [],
                simList: [],
                imgsList: [],
                form: {},
                microClass: {
                    active: true,
                    inactive: false
                },
                muteClass: {
                    mute: true,
                    muted: false
                },
                recommendClass: {
                    onlyRecommend: true,
                    existRecommend: false
                },
                queryIconClass: {
                    queryIcon: true,
                    queryIconIE: false
                },
                userNameClass: {
                    publicUser: false,
                    innerUser: false,
                    secretUser: false,
                },
                supportSTT: true,
                STT_URL: '/api/home/stt',
                IS_LOGIN_API: '/api/user/is_login',
                LOGOUT_API: '/api/user/logout',
                LOGIN_REDIRECT_URL: '/login',
                RECOMMEND_LIST_API: '/api/home/recommend',
                QA_API: '/api/home/qa',
                NOT_LOGIN_ERR: -12
            }
        },
        created() {
            const ua = navigator.userAgent.toLowerCase();
            //console.log(ua);
            (/ie/g.test(ua) || /opera/g.test(ua)) && (this.supportSTT = false);
            //console.log('supportSTT:', this.supportSTT);
            if (/ie/g.test(ua)) {
                this.queryIconClass.queryIcon = false;
                this.queryIconClass.queryIconIE = true;
            }

            this.$axios.get(this.IS_LOGIN_API).then((res) => {
                const json = res.data;
                if (!json || !json.data.uid) {
                    return this.$router.push(this.LOGIN_REDIRECT_URL);
                }
                this.role = json.data.role;

                if (json.data.role === 'public') {
                    this.userName = json.data.name + '(公开)';
                    this.userNameClass.publicUser = true;
                    this.userNameClass.innerUser = false;
                    this.userNameClass.secretUser = false;
                }
                if (json.data.role === 'inner') {
                    this.userName = json.data.name + '(内部)';
                    this.userNameClass.publicUser = false;
                    this.userNameClass.innerUser = true;
                    this.userNameClass.secretUser = false;
                }
                if (json.data.role === 'secret') {
                    this.userName = json.data.name + '(涉密)';
                    this.userNameClass.publicUser = false;
                    this.userNameClass.innerUser = false;
                    this.userNameClass.secretUser = true;
                }
                const text = '欢迎，' + json.data.name;
                this.supportSTT && this.speak(text);
            });
            this.$axios.get(this.RECOMMEND_LIST_API).then((res) => {
                const json = res.data;
                if (json.data) {
                    json.data.docs.forEach((item) => {
                        const rec = item.title;
                        this.recList.push(rec);
                    });
                }
            });
        },
        computed: {
        },
        methods: {
            checkInput() {
                this.answerText = '';
                this.answerList = '';
                if (!this.question) {
                    return this.$message.error('未输入内容');
                }
            },
            onAnswerList(item, index) {
                //const question = (index + 1).toString();
                this.question = item;
                this.checkInput();
                this.query();
            },
            speak(text) {
                const words = new SpeechSynthesisUtterance(text);
                window.speechSynthesis.speak(words);
            },
            onMute() {
                this.muteClass.mute = true;
                this.muteClass.muted = false;
                this.muteTitle = '停止播放';
            },
            onMuted() {
                this.muteClass.mute = false;
                this.muteClass.muted = true;
                this.muteTitle = '开始播放';
            },
            cancelSpeak() {
                this.muteClass.mute = true;
                this.muteClass.muted = false;
                window.speechSynthesis.cancel() && window.speechSynthesis.cancel();
            },
            pauseSpeak() {
                this.ttsPause = !this.ttsPause;
                if (this.ttsPause) {
                    this.onMute();
                    return window.speechSynthesis.resume();
                }
                this.onMuted();
                return window.speechSynthesis.pause();
            },
            onLogout() {
                this.supportSTT && this.cancelSpeak();
                this.$axios.post(this.LOGOUT_API).then(() => {
                    return location.href = `/?f=${Date.now()}#/login`;
                });
            },
            clearInput() {
              this.question = '';
            },
            onClickItem(item) {
                this.question = item;
                this.query();
            },
            doRecognize() {
                const formData = new FormData();
                formData.append('file', this.voiceBlob);
                //console.log(this.voiceBlob);

                this.$axios.post(this.STT_URL, formData).then((res) => {
                    // 开录音
                    this.onStartRecord(() => {});
                    const json = res.data;
                    //console.log(json);
                    if (json.errCode) {
                        return this.question = json.errMsg || json.errCode;
                    }
                    this.question = json.data.text || '未识别到文本';
                });
            },
            dealStatusChange(status) {
                console.log('status change-----', status);
                status === 'ACTIVE' && (this.microWaveDisplay = true);
                status === 'INACTIVE' && (this.microWaveDisplay = false);
                status === 'STOP' && (this.microWaveDisplay = false);
            },

            dealSentenceReady(data) {
                const audio = document.getElementById('audio');
                this.voiceBlob = data;
                audio.src = window.URL.createObjectURL(data);
                // 关录音
                this.onStopRecord();
                this.doRecognize()
            },
            onStartRecord(cb) {
                if (this.recorder) {
                    if (this.isOn) {
                        this.recorder.end();
                    }
                    this.recorder.start();
                    return cb({});
                }

                const myRecorder = new MyRecorder();
                myRecorder.get((rec) => {
                    //console.log('rec:', rec);
                    if (rec.code || rec.name) {
                        return cb(rec);
                    }

                    this.recorder = rec;
                    this.isOn = true;

                    this.recorder.start();
                    this.recorder.onStatusChange(this.dealStatusChange);
                    this.recorder.onSentenceReady(this.dealSentenceReady);
                    return cb({});
                });
            },
            onStopRecord() {
                this.recorder.end();
                this.isOn = false;
            },
            changeMicroClass() {
                this.microClass.active = !this.microClass.active;
                this.microClass.inactive = !this.microClass.inactive;
            },
            onClickAlert() {
                this.alertDisplay = false;
                this.alertText = '';
            },
            myAlert(str) {
                this.alertDisplay = true;
                this.alertText = str;
            },
            onMicroClick() {
                //console.log('supportSTT:', this.supportSTT);
                this.supportSTT && this.cancelSpeak();
                this.microStart = !this.microStart; //true
                //console.log('this.microStart', this.microStart);

                if (this.microStart) {
                    this.onStartRecord((err) => {
                        //console.log(err);
                        if (err.msg) {
                            this.myAlert('无法打开麦克风');
                            this.microStart = false;
                            //console.log('err.msg', err.msg); //err.name & err.message
                            return;
                        }
                        this.loaderDisplay = true;
                        this.microBtnTitle = '结束录音';
                        this.changeMicroClass();
                    });
                }
                else if (!this.microStart) {
                    this.loaderDisplay = false;
                    this.microBtnTitle = '开始录音';
                    this.changeMicroClass();
                    return this.onStopRecord();
                }
            },
            jump() {
                this.supportSTT && this.cancelSpeak();
                this.$router.push(this.LOGIN_REDIRECT_URL);
            },
            getQaAnswer(formData, cb) {
                this.$axios.post(this.QA_API, formData).then((res) => {
                    const json = res.data;
                    //console.log(json.errCode);
                    if (json.errCode === this.NOT_LOGIN_ERR) {
                        return this.jump();
                    }
                    //console.log(res);
                    cb(json);
                });
            },
            getAnswerText(data) {
                if (data && data.jsonData && data.jsonData.answer) {
                    const originAnswer = data.jsonData.answer;
                    //console.log(originAnswer);
                    let text = '';
                    if (originAnswer.length === 1) {
                        this.answerList = '';
                        this.answerText = `<p>${originAnswer[0].replace(/\n/g, '<br />')}<p>`;
                        text = originAnswer[0].replace(/\n/g, '。');
                    }
                    if (originAnswer.length > 1) {
                        this.answerText = '';
                        this.answerList = originAnswer;
                        text = '请问您想要查询的是以下列表中的哪一项，请点击继续查询';
                    }

                    text = text.replace(/小T/g, '小踢');
                    this.supportSTT && this.speak(text);
                }
            },
            getAnswerLinks(data) {
                if (data && data.jsonData.links && data.jsonData.links.length) {
                    //console.log(data.links);
                    this.simListDisplay = true;
                    data.links.forEach((item) => {
                        this.simList.push(item);
                    })
                }
            },
            getAnswerImgs(data) {
                if(data && data.jsonData.imgs && data.jsonData.imgs.length) {
                    this.imgsListDisplay = true;
                    data.imgs.forEach((item) => {
                        this.imgsList.push(item);
                    })
                }
                /*//test
                this.imgsListDisplay = true;
                this.imgsList = ['../../static/img/img.jpg'];*/
            },
            query() {
                this.supportSTT && this.cancelSpeak();
                if (!this.question) {
                    return this.myAlert('请输入您的问题');
                }

                this.isQueryCss = true;
                this.notQueryCss = false;
                this.waitAnswer = false;
                this.getAnswer = false;

                let time = setInterval(() => {
                    this.waitAnswer = true;
                }, 1000);

                const formData = new FormData();
                //console.log(this.question);
                formData.append('json', JSON.stringify({question: this.question, context: '',role: this.role}));

                this.getQaAnswer(formData, (json) => {
                    const data = json.data;
                    //console.log(data);
                    this.muteClass.mute = true;
                    this.muteClass.muted = false;
                    this.ttsPause = true;
                    this.onMute();
                    clearInterval(time);
                    this.waitAnswer = false;
                    this.getAnswer = true;
                    if (json.errCode) {
                        this.answerText = `服务器错误`;
                        return this.supportSTT && this.speak(this.answerText);
                    }
                    this.getAnswerText(data);
                    this.getAnswerLinks(data);
                    this.getAnswerImgs(data);
                });
            },
        },
        mounted(){
            this.supportSTT && this.cancelSpeak();
        },
        deactivated() {
            this.supportSTT && this.cancelSpeak();
        }
    }
</script>

<style scoped>
    @import '../../assets/css/index2.css';
</style>
