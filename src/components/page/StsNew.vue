<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 服务管理</el-breadcrumb-item>
                <el-breadcrumb-item v-if="!isBroad">语音分片标注</el-breadcrumb-item>
                <el-breadcrumb-item v-if="isBroad"><span style="color: #fd6853">广播语音标注专用（自动分句对间隔更敏感, 大于15秒的音频直接删掉）</span></el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="my-box">

            <el-button type="primary" @click="dialog = true" id="click-upload-btn" v-if="showTextUpload">点击上传文本</el-button>
            <el-button type="warning" @click="clickWavBtn" v-if="showWavUpload">上传音频</el-button>

            <el-row>
                <input type="file" accept="audio/wav" @change="onWavSelect" id="uploadWavBtn">
            </el-row>

            <el-dialog :visible.sync="dialog" class="sts-dialog">
                <el-form ref="form" :model="form"  class="demo-form-inline">

                    <el-form-item label="姓名ID:">
                        <el-input v-model="form.userId" placeholder="请输入姓名ID"></el-input>
                    </el-form-item>

                    <el-form-item label="文档ID:">
                        <el-input v-model="form.docId" placeholder="请输入文档ID"></el-input>
                    </el-form-item>

                    <el-form-item label="文档:">
                        <input type="file" accept=".txt" @change="onTxtSelect">
                    </el-form-item>

                    <el-form-item class="block-dom">
                        <el-button @click="onCancelUpload">取消</el-button>
                        <el-button type="primary" @click="onPreParse">提交</el-button>
                    </el-form-item>

                </el-form>
            </el-dialog>

            <el-row>
                <el-input type="textarea" autosize placeholder="请输入内容" class="text-area" v-model='text' v-if="showText" />
            </el-row>

            <el-row v-if='showLoader' class="loader">处理中...</el-row>

            <div v-if='show'>
                <el-table :data="tableData" class="sts-table" :row-class-name="setClassName">
                    <el-table-column type="index" width="50" class="line-number"></el-table-column>
                    <el-table-column label="文件名" width="100">
                        <template slot-scope="scope">
                            <span>{{ scope.row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="参考文本" width="150">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="top" v-if="scope.row.textDisplay">
                                <p>{{ scope.row.text }}</p>
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium">{{ scope.row.text }}</el-tag>
                                </div>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="删除" width="65">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" width="80"
                                       @click="onDelWav(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="音频" width="190">
                        <template slot-scope="scope">
                            <el-button v-if="!scope.row.audio"size="mini" type="success" @click="onLoadWav(scope.$index)">点击载入音频</el-button>
                            <audio v-if="scope.row.audio" controls v-bind:src="scope.row.audio"></audio>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row id="right-area">
                    <div  id="headBlock"></div>
                    <el-input type="textarea" autosize placeholder="请输入内容" class="text-area" v-model='text'>
                    </el-input>
                </el-row>

                <el-row class="submit">
                    <el-button type="success" @click="submit">提交</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                form: {
                    userId: '',
                    docId: '',
                    wavFile: '',
                    txtFile: '',
                },
                aggressiveness: 1,
                isBroad: false,
                isEdit: false,
                fromVersion: -1,
                dataLocation: '',
                showLoader: false,
                dialog: false,
                taskId: '',
                id: '',
                show: false,
                showWavUpload: false,
                showTextUpload: true,
                showText: false,
                text: '',
                tableData: [],
                wavLocation: '',
                text_parseUrl: '/api/tools/sts/text_parse',
                wav_parseUrl: '/api/tools/sts/wav_parse',
                submitUrl:'/api/tools/sts/submit',
                getTaskDetailPrefix: '/api/tools/sts/task/',
                getTaskVersionDetailPrefix: '/api/tools/sts/task/',
                getTaskListUr: '/api/tools/sts/task',
                wttUrl: '/api/tools/sts/wavStt',

                search_field: '',
                search_key: '',
                isMarkNew: false
            }
        },
        components:{
        },
        created(){
            const query  =this.$route.query || {};
            if (query.id) {
                this.id = query.id;
                this.taskId = query.taskId;

                if (query.isMarkNew) {
                    this.isMarkNew = true;
                    this.fromVersion = -1;
                    this.doNewMarkViewChange();
                }
                else {
                    this.isEdit = true;
                    this.fromVersion = +(query.version) || 0;
                    this.doEditorViewChange();
                }
            }

            query.search_field && (this.search_field = query.search_field);
            query.search_key && (this.search_key = query.search_key);

            this.isBroad = !!query.is_broadcast;
            query.aggressiveness && (this.aggressiveness = +(query.aggressiveness) || 0);
        },
        computed: {
        },
        methods: {
            doNewMarkViewChange() {
                this.showTextUpload = false;
                this.$axios.get(this.getTaskDetailPrefix + this.id).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        return this.$message.error(json.errMsg || '响应异常');
                    }

                    this.renderParsedData(json.data);
                });
            },
            doEditorViewChange() {
                this.showTextUpload = false;
                this.$axios.get(this.getTaskVersionDetailPrefix + this.id + '/' + this.fromVersion).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        return this.$message.error(json.errMsg || '响应异常');
                    }

                    this.renderParsedData(json.data);
                });
            },
            setClassName(row, index) {
                return row.isDeleted ? 'need-hide' : 'not-need-hide'
            },
            onLoadWav(index) {
                this.updateTableData(index);
            },
            // 参考文本发送请求
            wttReq(i = 0) {
                if(!this.tableData[i]) {
                    return;
                }

                const name = this.tableData[i].name;
                this.$axios.get(this.wttUrl + '?path=' + this.dataLocation + '/' + name)
                    .then((res) => {
                        //console.log(res.data.data.text);
                        this.tableData[i].textDisplay = true;
                        this.tableData[i].text = res.data.data.text;
                        this.wttReq(++i); // 循环异步 递归
                    })
                    .catch((err) => {
                        //console.log(err);
                        this.tableData[i].textDisplay = true;
                        this.tableData[i].text = '请求异常';
                        return this.wttReq(++i);
                    });
            },
            updateTableData(index = 0, max = 10) {
                const len = this.tableData.length;
                let count = 0;
                for (let i = 0; i < len; i++) {
                    this.tableData[i].audio = '';
                }

                for (let i = index; i < len && count <= max; i++) {
                    if (!this.tableData[i].isDeleted) {
                        this.tableData[i].audio = this.tableData[i].link;
                        count++;
                    }
                }
            },
            renderParsedData(data) {
                this.showLoader = false;
                data.wavList.forEach((name) => {
                    this.dataLocation = data.location;
                    this.tableData.push({
                        link: data.location + '/' + name,
                        name: name,
                        audio: '',
                        text: '',
                        isDelete: false,
                        textDisplay: false
                    });
                });

                this.text = this.isMarkNew ? data.splitedReviewedTextList.join('\r\n') : data.textList.join('\r\n');
                this.updateTableData(0, 10);
                this.wttReq();
                this.show = true;
            },
            onDelWav(index, row) {
                //console.log(index, row.audio);
                this.tableData[index].audio = '';
                this.tableData[index].isDeleted = true;
            },
            onWavSelect(event) {
                this.showText = false;
                this.showLoader = true;
                //this.form.wavFile = event.target.files[0];
                const textList = this.text.split('\n');
                textList.map((item) => {
                    return item.trim();
                });

                const jsonData = JSON.stringify({
                    id: this.id,
                    taskId: this.taskId,
                    textList: textList,
                    aggressiveness: this.aggressiveness
                });
                const formData = new FormData();
                formData.append("jsonData", jsonData);
                formData.append("wav", event.target.files[0]);

                this.showWavUpload = false;
                this.$axios.post(this.wav_parseUrl, formData).then((res) => {
                    this.showLoader = false;
                    const json = res.data;
                    if (json.errCode) {
                        return this.$message.error(json.errMsg || '响应异常');
                    }
                    // this.renderParsedData(json.data);
                    this.$message.success('提交成功, 请继续录音或者去标注');
                    setTimeout(() => {
                        this.$router.push({ path: `/sts_list?search_field=${encodeURIComponent(this.search_field)}&search_key=${encodeURIComponent(this.search_key)}`});
                    }, 1500);
                });
            },
            clickWavBtn() {
                document.getElementById('uploadWavBtn').click();
            },
            onTxtSelect(event) {
                return this.form.txtFile = event.target.files[0];
            },
            onCancelUpload() {
                this.dialog = false;
            },
            onPreParse() {
                this.dialog = false;
                if (!this.form.userId || !this.form.docId || !this.form.txtFile) {
                    return this.$message.error('请输入姓名ID、文档ID，并上传.txt文件');
                }

                if (!(+this.form.userId)) {
                    return this.$message.error('无效姓名ID，姓名ID必须是数字');
                }

                if (!(/^\d+[-_\d]*$/.test(this.form.docId))) {
                    return this.$message.error('无效文档ID，文档ID最多只能包含数字_(下划线)-(横杠)');
                }

                this.show = false;
                this.showLoader = true;
                this.tableData = [];
                this.doPreParse();
            },
            doPreParse() {
                const formData = new FormData();
                formData.append("userId", this.form.userId);
                formData.append("docId", this.form.docId);
                formData.append("txt", this.form.txtFile);

                this.$axios.post(this.text_parseUrl, formData).then((res) => {
                    const json = res.data;

                    if (json.errCode) {
                        return this.$message.error(json.errMsg || '文本解析失败');
                    }

                    if (!json.data || !json.data._id) {
                        return this.$message.error('返回数据异常，获取不到ID， 请联系管理员');
                    }

                    this.taskId = json.data.taskId;
                    this.showLoader = false;
                    this.showTextUpload = false;
                    this.showWavUpload = true;
                    this.showText = true;
                    this.text = json.data.originTextList.join('\r\n');
                    this.id = json.data._id;
                });
            },
            submit() {
                //停止wttReq请求
                let textArr = this.text.split('\n');
                for (let i in textArr) {
                    textArr[i] = textArr[i].trim();
                    if (!textArr[i]) {
                        return this.$message.error(`第${(parseInt(i)+1)}行没有文字`);
                    }
                    const reg = /[\/①②③④⑤⑥⑦⑧⑨⑩IⅡⅢVⅤⅥⅦⅧⅨⅩ、＇：∶‘’“”〝〞ˆˇ﹕︰﹑·¨….´～—ˉ\\｜‖＂〃｀@﹫¡¿﹟#﹩$﹠﹪%*﹡﹢﹦﹤‐￣¯―﹨˜+=­＿_\-~（）〈〉《》‹›﹛﹜]/g;
                    if (reg.test(textArr[i])) {
                        return this.$message.error(`第${(parseInt(i)+1)}行存在特殊标点`);
                    }
                    let list = textArr[i].split(/\s+/);
                    textArr[i] = list.join(' ');
                }

                let wavArr = [];
                for (let i in this.tableData) {
                    !this.tableData[i].isDeleted  && wavArr.push(this.tableData[i].name);
                }
                if (textArr.length !== wavArr.length) {
                    return this.$message.error('语音文件数量不等于文本行数');
                }

                //console.log('resultArr', resultArr);
                const jsonData = JSON.stringify({
                    taskId: this.taskId,
                    textList: textArr,
                    wavList: wavArr,
                    id: this.id,
                    fromVersion: this.fromVersion
                });
                const formData = new FormData();
                formData.append('jsonData', jsonData);
                this.$axios.post(this.submitUrl, formData).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        return this.$message.error(json.errMsg || '提交异常，请联系管理员, 或尝试等待几秒后重新提交');
                    }
                    this.$message.success('提交成功');
                    this.tableData = [];
                    setTimeout(() => {
                        this.$router.push({ path: `/sts_list?search_field=${encodeURIComponent(this.search_field)}&search_key=${encodeURIComponent(this.search_key)}`});
                    }, 1500);
                });
            }
        }
    }

</script>

<style>
    .need-hide {
        display: none;
    }

    #click-upload-btn {
        margin-bottom: 10px;
    }
    .sts-dialog .el-dialog--small {
        position: absolute;
        width: 300px;
        border-radius: 5px;
        padding-left: 30px;
    }
    .block-dom {
        position: relative;
        width: 195px;
        margin-left: 28px;
    }
    .block-dom button {
        width: 65px;
    }
    #uploadWavBtn {
        display: none;
    }
    #headBlock {
        position: relative;
        width: calc(100% - 2px);
        height: 39px;
        background-color: #eef1f6;
        clear: both;
        float: left;
        margin-left: 10px;
        border: 1px solid #dfe6ec;
        border-bottom: none;
    }
    #right-area {
        float: left;
        width: calc(100% - 560px);
    }
    .text-area {
        width: 100%;
        clear: both;
        float: left;
        margin-left: 10px;
    }
    .sts-table {
        width: 556px;
        float: left;
    }
    .text-area .el-textarea__inner {
        line-height: 40px;
        font-size: 18px;
        padding: 0 7px;
        border-radius: 2px;
        border: 1px solid #dfe6ec;
        background-image: url(../../assets/line.jpg);
        white-space: nowrap;
    }
    .submit {
        padding-top: 10px;
        clear: both;
    }
    .hidden {
        display: none;
    }
    input {
        margin-bottom: 20px;
        width: calc(100% - 59px);
    }
    .sts-dialog .el-input {
        width: calc(100% - 59px);
        float: left;
    }
    .sts-dialog .el-input__inner {
        height: auto;
        width: 76%;
    }
    .block-dom {
        display: block !important;
    }
    .sts-dialog .el-form-item {
        margin-bottom: 10px;
    }
    .el-table .cell{
        white-space: nowrap;
    }
    .loader {
        width: 250px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: helvetica, arial, sans-serif;
        text-transform: uppercase;
        font-weight: 900;
        color: #20a0ff;
        letter-spacing: 0.2em;
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
