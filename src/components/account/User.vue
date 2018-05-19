<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="success" icon="plus" class="handle-add mr10" @click="onAdd">添加</el-button>
            <el-select v-model="search_field" placeholder="搜索字段" class="handle-select mr10">
                <el-option key="1" label="id" value="uid"></el-option>
                <el-option key="2" label="姓名" value="name"></el-option>
                <el-option key="3" label="角色" value="role"></el-option>
            </el-select>
            <el-input v-model="search_key" placeholder="搜索关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="onSearch">搜索</el-button>
            <el-button type="primary" icon="circle-close" @click="onClear">重置</el-button>

            <!--<el-button type="primary" icon="search" @click="onSyncFace">同步到人脸识别</el-button>
            <el-button type="primary" icon="circle-close" @click="onReloadFace">重载人脸识别</el-button>
            <el-button type="info" icon="search" @click="onSyncVoice">同步到声纹识别</el-button>
            <el-button type="info" icon="circle-close" @click="onReloadVoice">重载声纹识别</el-button>-->
        </div>
        <el-table :data="docs" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="uid" label="id"> </el-table-column>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <!--<el-table-column prop="password" label="密码"></el-table-column> -->
            <el-table-column prop="role" label="角色"></el-table-column>
            <el-table-column label="人脸">
                <template scope="scope">
                    <qb-preview v-if="scope.row.face" :url="scope.row.face"></qb-preview>
                </template>
            </el-table-column>
            <el-table-column label="声纹" width="330">
                <template scope="scope">
                    <audio controls v-if="scope.row.voice" :src="scope.row.voice"></audio>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small"
                               @click="onEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger"
                               @click="onDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change ="handleCurrentChange"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[50, 100, 1000]"
                    :page-size="limit"
                    :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="isAdd ? '添加' : '编辑'" :visible.sync="dialogVisible" class="user-dialog">
            <el-form :model="form">
                <el-form-item label="用户id" :label-width="dialogFormLabelWidth">
                    <el-input placeholder="必填项" v-model="form.uid" auto-complete="off" :readonly="!isAdd" @blur="onUidBlur" @focus="onUidFocus" @change="onUidChange" :class="uidInputClass"></el-input>
                    <i class="el-icon-information" id="user-id-warn" v-if="userIdWarn">{{ userIdWarnText }}</i>
                    <div v-if="userIdNotes">
                        <div>
                            <i class="el-icon-information user-notes" v-if="userIdLen"></i>
                            <i class="el-icon-circle-check user-notes-check" v-if="!userIdLen"></i>
                            <span>长度为8-16个字符</span>
                        </div>
                        <div>
                            <i class="el-icon-information user-notes" v-if="userIdChar"></i>
                            <i class="el-icon-circle-check user-notes-check" v-if="!userIdChar"></i>
                            <span>只能包含字母或数字</span>
                        </div>
                    </div>
                    <i class="el-icon-check" id="user-id-check" v-if="userIdCheck"></i>

                </el-form-item>
                <el-form-item label="用户姓名" :label-width="dialogFormLabelWidth">
                    <el-input placeholder="必填项" v-model="form.name" auto-complete="off" @blur="onNameBlur" @focus="onNameFocus" @change="onNameChange" :class="nameInputClass"></el-input>
                    <div v-if="nameNotes">
                        <i class="el-icon-information user-notes" v-if="userNameChar"></i>
                        <i class="el-icon-circle-check user-notes-check" v-if="!userNameChar"></i>
                        <span>只能输入汉字</span>
                    </div>
                    <i class="el-icon-check" id="name-check" v-if="nameCheck"></i>
                </el-form-item>
                <el-form-item label="输入密码" :label-width="dialogFormLabelWidth">
                    <el-input placeholder="必填项" v-model="form.password" type="password" auto-complete="off" @blur="onPwdBlur" :class="pwdInputClass"></el-input>
                    <i class="el-icon-check" id="pwd-check" v-if="pwdCheck"></i>
                </el-form-item>
                <el-form-item label="确认密码" :label-width="dialogFormLabelWidth">
                    <el-input placeholder="必填项" v-model="confirmPwd" type="password" auto-complete="off" @blur="onPassBlur" @focus="onPassFocus" :class="passInputClass"></el-input>
                    <i class="el-icon-information" id="pass-warn" v-if="passWarn">{{ passWarnText }}</i>
                    <i class="el-icon-check" id="pass-check" v-if="passCheck"></i>
                </el-form-item>
                <el-form-item label="用户角色" :label-width="dialogFormLabelWidth">
                    <el-select v-model="form.role" placeholder="必填项">
                        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="人脸" :label-width="dialogFormLabelWidth">
                    <el-row v-if="faceRender">
                        <img :src="form.face" class="user-img-box">
                    </el-row>
                    <el-row>
                        <input type="file" @change="inputPhoto" accept="image/png, image/jpeg" id="user-image-input"/>
                        <el-button type="primary" @click="onOpenFaceCapture" plain>开启摄像头</el-button>
                        <el-button type="success" v-show="isValidFace" @click="onTakeFaceCapture" round>拍照</el-button>
                        <el-button v-show="isOnFaceCapture" @click="onCloseFaceCapture" plain>取消</el-button>
                        <el-button type="primary" @click="onUploadPhoto" plain>上传图片</el-button>
                    </el-row>
                    <el-row>
                        <video id="myVideo" width="320" :height="240" preload autoplay loop muted v-show="videoDisplay"></video>
                        <canvas id="canvas" width="320" height="240" style="display: none"></canvas>
                    </el-row>
                </el-form-item>
                <el-form-item label="声纹" :label-width="dialogFormLabelWidth">
                    <el-row>
                        <audio id="audio" controls :src="form.voice"></audio>
                        <i class="el-icon-loading" id="recordering-icon" v-if="recorderingIcon"></i>
                        <i class="el-icon-upload" id="uploading-icon" v-if="uploadingIcon"><span style="font-size: 9px">上传中，请等待...</span></i><br />
                        <input type="file" ref="inputVoice" @change="inputVoice" accept=".wav" id="user-voice-input"/>
                        <el-button type="primary" @click="onStartRecord()" plain>开始录音</el-button>
                        <el-button type="primary" @click="onStopRecord()" plain>停止录音</el-button>
                        <el-button type="primary" @click="onUploadVoice" plain>上传音频</el-button>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDialog">取 消</el-button>
                <el-button type="primary" @click="submitDialog">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import qbPreview from '../common/TableImagePreview.vue';
    import '../../assets/js/build/tracking';
    import '../../assets/js/build/data/face-min';
    import '../../assets/js/recoder'

    export default {
        components:{
            qbPreview
        },
        data() {
            return {
                url: '/admin/api/user',
                syncFaceUrl: '/admin/api/sync/face',
                syncVoiceUrl: '/admin/api/sync/voice',
                reloadFaceUrl: '/admin/api/reload/face',
                reloadVoiceUrl: '/admin/api/reload/voice',
                docs: [],
                page: 1,
                limit: 500,
                total: 0,

                userPhoto: '',
                audioSrc: '',
                faceRender: false,
                userIdWarn: false,
                userIdWarnText: '',
                uidInputClass: {
                    uidInputNormal: true,
                    uidInputWarn: false
                },
                userIdNotes: false,
                userIdCheck: false,
                userIdLen: true,
                userIdChar: true,
                nameNotes: false,
                userNameChar: true,
                nameInputClass: {
                    nameInputNormal: true,
                    nameInputWarn: false
                },
                nameCheck: false,
                pwdCheck: false,
                pwdInputClass: {
                    pwdInputNormal: true,
                    pwdInputWarn: false
                },
                confirmPwd: '',
                passInputClass: {
                    passInputNormal: true,
                    passInputWarn: false
                },
                passWarn: true,
                passWarnText: '',
                passCheck: false,
                recorderingIcon: false,
                uploadingIcon: false,
                videoDisplay: false,

                roleOptions: [{
                    label: '普通用户',
                    value: 'public'
                }, {
                    label: '高级用户',
                    value: 'inner'
                }, {
                    label: '超级用户',
                    value: 'secret'
                }],

                multipleSelection: [],
                select_cate: '',
                select_word: '',

                is_search: false,
                search_field: '',
                search_key: '',

                isAdd: true,
                dialogVisible: false,
                form: {},
                dialogFormLabelWidth: '120px',

                flag: false,
                isOnFaceCaptureEnd: true,
                isOnFaceCapture: false,
                isValidFace: false,
                isValidFaceHandle: null,
                trackingTask: null,
                detectFaceCallback: null,
                isRecording: false,
                recorder: null,

                isOnSyncFace: false,
                isOnSyncVoice: false
            }
        },
        created(){
            this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.docs;
            }
        },
        watch: {
            audioSrc: () => { // 音频时长
                let time = document.getElementById('audio').duration; // 返回NaN
                //console.log(time);
            }
        },
        methods: {
            clearNotes() {
                this.userIdWarn = false;
                this.userIdNormalStyle();
                this.userIdNotes = false;
                this.userIdCheck = false;
                this.userIdLen = true;
                this.userIdChar = true;
                this.nameNotes = false;
                this.nameCheck = false;
                this.userNameChar = true;
                this.nameNormalStyle();
                this.pwdCheck = false;
                this.pwdNormalStyle();
                this.passWarn = false;
                this.passCheck = false;
                this.passNormalStyle();
                this.confirmPwd = '';

                this.recorderingIcon = false;
                this.uploadingIcon = false;
            },
            userIdWarnDisplay(text) {
                this.userIdWarn = true;
                this.userIdWarnText = text;
            },
            userIdWarnStyle() {
                this.uidInputClass.uidInputWarn = true;
                this.uidInputClass.uidInputNormal = false;
            },
            userIdNormalStyle() {
                this.uidInputClass.uidInputWarn = false;
                this.uidInputClass.uidInputNormal = true;
            },
            onUidFocus() {
                this.userIdWarn = false;
                this.userIdNotes = true;
                this.userIdCheck = false;
                this.form.uid && this.onUidChange();
            },
            onUidChange() {
                this.userIdNormalStyle();
                const str = this.form.uid;
                //console.log(str);
                // 长度8-16
                const len = str.length;
                (len > 7 && len < 17) && (this.userIdLen = false);
                (len < 7 || len > 17) && (this.userIdLen = true);
                // 字母或数字
                const reg = /^[A-Za-z0-9]+$/.test(str);
                reg && (this.userIdChar = false);
                !reg && (this.userIdChar = true);
                (!this.userIdLen && !this.userIdChar) && (this.userIdCheck = true);
            },
            onUidBlur() {
                this.userIdCheck = false;
                this.userIdNotes = false;
                if (this.isAdd) {
                    const uid = this.form.uid;
                    let self = this;
                    self.$axios.get(self.url + '/' + uid).then((res) => {
                        const json = res.data;
                        if (json.errCode === -14) {
                            this.userIdWarnStyle();
                            return this.userIdWarnDisplay('该用户id已存在');
                        }
                        else if (json.errCode) {
                            this.userIdWarnStyle();
                            return this.userIdWarnDisplay('您不能使用该id注册');
                        }
                        this.userIdWarn = false;

                        if (!this.userIdLen && !this.userIdChar) {
                            this.userIdNormalStyle();
                            return this.userIdCheck = true;
                        }
                        this.userIdCheck = false;
                        return this.userIdWarnStyle();
                    });
                }
            },
            nameNormalStyle() {
                this.nameInputClass.nameInputWarn = false;
                this.nameInputClass.nameInputNormal = true;
            },
            nameWarnStyle() {
                this.nameInputClass.nameInputWarn = true;
                this.nameInputClass.nameInputNormal = false;
            },
            onNameFocus() {
                //this.userIdWarn = false;
                this.nameNotes = true;
                this.nameCheck = false;
                this.onNameChange(); // 否则edit时，点击后直接进入onNameBlur()会有红框
            },
            onNameChange() {
                this.nameNormalStyle();
                const str = this.form.name;
                const reg = /^([\u4e00-\u9fa5·])+$/g.test(str);
                reg && (this.userNameChar = false);
                !reg && (this.userNameChar = true);
                !this.userNameChar && (this.nameCheck = true);
            },
            onNameBlur() {
                this.nameNotes = false;

                if (!this.userNameChar) {
                    this.nameNormalStyle();
                    return this.nameCheck = true;
                }
                this.nameCheck = false;
                return this.nameWarnStyle();
            },
            pwdNormalStyle() {
                this.pwdInputClass.pwdInputNormal = true;
                this.pwdInputClass.pwdInputWarn = false;
            },
            pwdWarnStyle() {
                this.pwdInputClass.pwdInputNormal = false;
                this.pwdInputClass.pwdInputWarn = true;
            },
            onPwdBlur() {
                if (this.form.password) {
                    this.pwdCheck = true;
                    this.pwdNormalStyle();
                    return this.onPassBlur();
                }
                this.pwdCheck = false;
                return this.pwdWarnStyle();
            },
            passNormalStyle() {
                this.passInputClass.passInputNormal = true;
                this.passInputClass.passInputWarn = false;
            },
            passWarnStyle() {
                this.passInputClass.passInputNormal = false;
                this.passInputClass.passInputWarn = true;
            },
            onPassFocus() {
                this.passWarn = false;
            },
            onPassBlur() {
                if (!this.form.password) {
                    this.passWarn = true;
                    return this.passWarnText = '请先输入密码，再确认密码';
                }
                if (this.confirmPwd === this.form.password) {
                    this.passWarn = false;
                    this.passCheck = true;
                    return this.passNormalStyle();
                }
                this.passWarn = true;
                this.passWarnText = '两次输入的密码不一样';
                this.passCheck = false;
                return this.passWarnStyle();
            },
            inputVoice(event) {
                this.uploadingIcon = true;
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = e.target.result;
                    this.form.voiceBlob = new Blob([data], { type: 'audio/wav' });
                    this.blobtoDataURL(this.form.voiceBlob, (dataURL) => {
                        const audio = document.getElementById('audio');
                        audio.src = dataURL;
                    });
                    this.uploadingIcon = false;
                };
                event.target.files[0] && reader.readAsArrayBuffer(event.target.files[0]);
            },
            onUploadVoice() {
                document.getElementById('user-voice-input').click();
            },
            onUploadPhoto() {
                document.getElementById('user-image-input').click();
            },
            readPhoto(cb) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    return cb(reader.result);
                };
                event.target.files[0] && reader.readAsDataURL(event.target.files[0]);
            },
            inputPhoto(event) {
                this.readPhoto((data) => {
                    this.form.face = data;
                    this.faceRender = this.form.face;
                });
            },
            onStartRecord() {
                this.recorderingIcon = true;
                if (this.isRecording) {
                    this.recorder.stop();
                }
                if (this.recorder) {
                    this.recorder.clear();
                    this.isRecording = true;
                    this.recorder.start();
                    return;
                }
                HZRecorder.get((rec) => {
                    if (rec.code || rec.name) {
                        return this.$message.error(rec.msg);
                    }
                    this.recorder = rec;
                    this.isRecording = true;
                    this.recorder.start();
                });
            },
            onStopRecord() {
                this.recorderingIcon = false;
                this.recorder.stop();
                const audio = document.getElementById('audio');
                this.recorder.play(audio);
                this.form.voiceBlob = this.recorder.getData();
                this.blobtoDataURL(this.form.voiceBlob, (dataURL) => {
                    const audio = document.getElementById('audio');
                    audio.src = dataURL;
                    this.isRecording = false;
                });
            },
            handleSizeChange(val) {
                this.limit = val;
                this.getData();
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getData();
            },
            formatFile(fileData) {
                fileData.forEach((user) => {
                    user.face && (user.face = 'data:image/jpeg;base64,' + user.face);
                    user.voice && (user.voice = 'data:audio/wav;base64,' + user.voice);
                });

            },
            getData() {
                let self = this;
                let params = {
                    offset: (self.page - 1) * self.limit,
                    limit: self.limit,
                    sort_field: 'iUpdateAt'
                };
                self.search_field && (params.search_field = self.search_field);
                self.search_key && (params.search_key = self.search_key);

                self.$axios.get(self.url, { params }).then((res) => {
                    const gridDatas = res.data.data.docs || [];
                    self.docs = gridDatas;
                    this.formatFile(self.docs);
                    self.total = res.data.data.total || 0;
                });
            },
            onSearch() {
                if (!this.search_field) {
                    return this.$message.error('未指定搜索字段');
                }

                if (!this.search_key) {
                    return this.$message.error('未填写搜索词');
                }

                this.getData();
            },
            onClear() {
                this.search_field = '';
                this.search_key = '';
                this.page = 1;
                this.getData();
            },
            blobtoDataURL(blob, cb) {
                const read = new FileReader();
                read.onload = (e) => {
                    cb(e.target.result);
                };
                read.readAsDataURL(blob);
            },
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
            addData() {
                let self = this;
                const formData = new FormData();
                formData.append('uid', this.form.uid);
                formData.append('name', this.form.name);
                formData.append('role', this.form.role);
                formData.append('password', this.form.password);
                this.form.voiceBlob && formData.append('voice', this.form.voiceBlob);
                this.form.face && formData.append('face', this.dataURLtoBlob(this.form.face));
                self.$axios.post(self.url, formData).then((res) => {
                    if (res.errCode) {
                        return this.$message.error('操作异常: ' + (res.data.errMsg || res.data.errCode));
                    }
                    self.getData();
                });
            },
            delData(id) {
                let self = this;
                self.$axios.delete(self.url + '/' + id).then((res) => {
                    self.getData();
                });
            },
            putData() {
                let self = this;
                let id = this.form._id;

                const formData = new FormData();

                formData.append('uid', this.form.uid);
                formData.append('name', this.form.name);
                formData.append('role', this.form.role);
                formData.append('password', this.form.password);
                this.form.voiceBlob && formData.append('voice', this.form.voiceBlob ? this.form.voiceBlob : this.form.voice);

                this.form.face && formData.append('face', /^data:image/.test(this.form.face) ? this.dataURLtoBlob(this.form.face) : this.form.face);

                self.$axios.put(self.url + '/' + id, formData).then((res) => {
                    if (res.errCode) {
                        return this.$message.error('操作异常: ' + (res.data.errMsg || res.data.errCode));
                    }
                    self.getData();
                });
            },
            onTakeFaceCapture() {
                this.faceRender = true;
                this.detectFaceCallback = (base64Data) => {
                    //console.log(base64Data.length);
                    this.detectFaceCallback = null;
                    this.onCloseFaceCapture();
                    this.form.face = base64Data;
                    this.isValidFace = false;
                }
            },
            onCloseFaceCapture() {
                this.videoDisplay = false;
                this.isValidFace = false;
                this.trackingTask.stop();
                const video = document.getElementById("myVideo");
                video.pause();
                video.src="";
                video.srcObject && video.srcObject.getVideoTracks() && video.srcObject.getVideoTracks()[0].stop();
                this.isOnFaceCapture = false;
                this.isOnFaceCaptureEnd = true;
            },
            onOpenFaceCapture() {
                this.videoDisplay = true;
                if (this.trackingTask) {
                    // return this.trackingTask.run();
                }

                const tracker = new tracking.ObjectTracker('face');
                tracker.setInitialScale(4);
                tracker.setStepSize(2);
                tracker.setEdgesDensity(0.1);
                tracking.track('#myVideo', tracker, { camera: true }, (result) => {
                    if (result.errCode) {
                        this.videoDisplay = false;
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
            onReloadFace() {
                if (this.isOnReloadFace) {
                    return;
                }
                this.isOnReloadFace = true;
                this.$axios.post(this.reloadFaceUrl, {}).then((res) => {
                    this.isOnReloadFace = false;
                    const json = res.data;
                    if (json.errCode) {
                        return this.$message.error('操作异常: ' + (res.data.errMsg || res.data.errCode));
                    }
                    return this.$message.success('操作成功');
                }).catch((err) => {
                    this.isOnReloadFace = false;
                    return this.$message.error('操作异常: ' + err);
                });
            },
            onReloadVoice() {
                if (this.isOnReloadVoice) {
                    return;
                }
                this.isOnReloadVoice = true;
                this.$axios.post(this.reloadVoiceUrl, {}).then((res) => {
                    this.isOnReloadVoice = false;
                    const json = res.data;
                    if (json.errCode) {
                        return this.$message.error('操作异常: ' + (res.data.errMsg || res.data.errCode));
                    }
                    return this.$message.success('操作成功');
                }).catch((err) => {
                    this.isOnReloadVoice = false;
                    return this.$message.error('操作异常: ' + err);
                });
            },
            onSyncFace() {
                if (this.isOnSyncFace) {
                  return;
                }
                this.isOnSyncFace = true;
                this.$axios.post(this.syncFaceUrl, {}).then((res) => {
                    this.isOnSyncFace = false;
                    const json = res.data;
                    if (json.errCode) {
                        return this.$message.error('操作异常: ' + (res.data.errMsg || res.data.errCode));
                    }
                    return this.$message.success('操作成功');
                }).catch((err) => {
                    this.isOnSyncFace = false;
                    return this.$message.error('操作异常: ' + err);
                });
            },
            onSyncVoice() {
                if (this.isOnSyncVoice) {
                    return;
                }
                this.isOnSyncVoice = true;
                this.$axios.post(this.syncVoiceUrl, {}).then((res) => {
                    this.isOnSyncVoice = false;
                    const json = res.data;
                    if (json.errCode) {
                        return this.$message.error('操作异常: ' + (res.data.errMsg || res.data.errCode));
                    }
                    return this.$message.success('操作成功');
                }).catch((err) => {
                    this.isOnSyncVoice = false;
                    return this.$message.error('操作异常: ' + err);
                });
            },
            onAdd() {
                this.form = {};
                /*const audio = document.getElementById('audio');
                audio && (audio.src = '');*/
                this.form.voice = '';
                this.isAdd = true;
                this.showDialog();
            },
            onEdit(index, row) {
                this.form = {
                    name: row.name,
                    uid: row.uid,
                    _id: row._id,
                    role: row.role,
                    password: row.password,
                    face: row.face || '',
                    voice: row.voice || '',
                };
                this.form.face && (this.faceRender = true);
                this.isAdd = false;
                this.showDialog();
            },
            onDelete(index, row) {
                this.$confirm('确认删除用户 ['+ row.uid +'] 吗？')
                    .then(_ => {
                        this.delData(row._id);
                    })
                    .catch(_ => {});
            },
            showDialog() {
                this.clearNotes();
                this.confirmPwd = this.form.password;
                this.dialogVisible = true;
            },
            cancelDialog() {
                this.dialogVisible = false;
                this.faceRender = false;
                this.videoDisplay = false;
            },
            submitDialog(){
                if (this.isAdd && (!this.userIdCheck || !this.nameCheck || !this.pwdCheck || !this.passCheck || !this.form.role)) {
                    return this.$message.error('请以正确格式完整输入用户信息');
                }
                else if (!this.form.uid || !this.form.name || !this.form.role || !this.form.password || !this.confirmPwd) {
                    return this.$message.error('请确保用户信息格式正确且完整');
                }

                if (this.isAdd) {
                    this.addData();
                }
                else {
                    this.putData();
                }

                this.dialogVisible = false;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            formatter(row, column) {
                return row.face;
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
</style>

<style>
    pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
    pre span.string { color: green; }
    pre span.number { color: darkorange; }
    pre span.boolean { color: blue; }
    pre span.null { color: magenta; }
    pre span.key { color: red; }
    #user-voice-input, #user-image-input {
        display: none;
    }
    .user-img-box {
        width: 203px;
        height: auto;
    }
    #audio {
        margin-bottom: 10px;
    }
    #myVideo {
        margin-top: 10px;
        -moz-transform:scaleX(-1);
        -webkit-transform:scaleX(-1);
        -o-transform:scaleX(-1);
        transform:scaleX(-1);
    }
    .user-dialog .el-dialog__body {
        padding: 30px 60px 30px 0;
    }
    .user-dialog .dialog-footer {
        padding: 0 40px 20px 0;
    }
    #user-id-warn {
        color: #ff4949;
        font-weight: bold;
    }
    #user-id-warn:before, .user-notes:before, #pass-warn:before {
        margin-right: 5px;
    }
    .uidInputWarn .el-input__inner {
        border: 1px solid #ff4949;
    }
    .user-notes {
        color: #1576d8;
        display: inline;
    }
    .user-notes-check {
        color: #13ce66;
        display: inline;
    }
    #user-id-check {
        color: #13ce66;
        position: absolute;
        left: calc(100% - 30px);
        top: 11px;
    }
    .nameInputWarn .el-input__inner {
        border: 1px solid #ff4949;
    }
    #name-check {
        color: #13ce66;
        position: absolute;
        left: calc(100% - 30px);
        top: 11px;
    }
    #pwd-check {
        color: #13ce66;
        position: absolute;
        left: calc(100% - 30px);
        top: 11px;
    }
    .pwdInputWarn  .el-input__inner {
        border: 1px solid #ff4949;
    }
    #pass-warn {
        color: #ff4949;
        font-weight: bold;
    }
    #pass-check {
        color: #13ce66;
        position: absolute;
        left: calc(100% - 30px);
        top: 11px;
    }
    #recordering-icon, #uploading-icon {
        position: relative;
        color: #4285f4;
        width: fit-content;
        top: -20px;
        left: 5px;
    }
    .el-button+.el-button {
        margin-top: 5px;
    }
</style>
