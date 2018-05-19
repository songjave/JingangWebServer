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

            <el-button class="hidden" @click="successed">提交成功</el-button>
            <el-button class="hidden" @click="fail">提交失败</el-button>

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
                dataLocation: '',
                showLoader: false,
                dialog: false,
                taskId: '',
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
                getTaskListUr: '/api/tools/sts/task',
                wttUrl: '/api/tools/sts/wavStt'
            }
        },
        components:{
        },
        created(){
            this.isBroad = !!this.$route.query.is_broadcast;
            this.$route.query.aggressiveness && (this.aggressiveness = +(this.$route.query.aggressiveness) || 0);
        },
        computed: {
        },
        methods: {
            setClassName(row, index) {
                return row.isDeleted ? 'need-hide' : 'not-need-hide'
            },
            onLoadWav(index) {
                this.updateTableData(index);
            },
            // 参考文本发送请求
            wttReq(i) {
                if(!this.tableData[i]) {
                    return;
                }

                const id = this.tableData[i].id;
                this.$axios.get(this.wttUrl + '?path=' + this.dataLocation + '/' + id + '.wav')
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
            referenceList() {
                this.wttReq(0);
            },

            updateTableData(index = 0, max = 10) {
                console.log(index, max);
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
                const textLists = [];
                data.list.forEach((line) => {
                    const id = line.split('|||')[0];
                    const str = line.split('|||')[1];
                    str && textLists.push(str);
                    if (!id) {
                        return;
                    }


                    this.dataLocation = data.location;
                    this.tableData.push({
                        id: id,
                        link: data.location + '/' + id + '.wav',
                        name: id + '.wav',
                        audio: '',
                        text: '',
                        isDelete: false,
                        textDisplay: false
                    });
                });

                this.text = textLists.join('\r\n');

                this.updateTableData(0, 10);
                this.referenceList();
                this.show = true;
            },

            onWatchDataReady(taskId) {
                const handle = setInterval(() => {
                    this.getParsedData(taskId, (err, json) => {
                        if (err) {
                            return this.$message.error('数据拉取失败 ' + err);
                        }

                        if (json.inParse) {
                            return;
                        }

                        this.showLoader = false;
                        clearInterval(handle);
                        this.renderParsedData(json);
                    });
                }, 2000);
            },
            getParsedData(taskId, cb){
                this.$axios.get(this.getTaskDetailPrefix + taskId)
                    .then((res) => {
                        const json = res.data;
                        //console.log(json);
                        if (json.errCode) {
                            return cb(json.errCode);
                        }

                        return cb(0, json.data);
                    })
                    .catch(function (err) {
                        return cb(err);
                    });
            },
            onDelWav(index, row) {
                //console.log(index, row.audio);
                this.tableData[index].audio = '';
                this.tableData[index].isDeleted = true;
            },
            onWavSelect(event) {
                this.showText = false;
                this.showLoader = true;
                this.form.wavFile = event.target.files[0];
                const jsonData = JSON.stringify({
                    taskId: this.taskId,
                    textList: this.text.split('\n'),
                    aggressiveness: this.aggressiveness
                });
                const formData = new FormData();
                formData.append("jsonData", jsonData);
                formData.append("wav", this.form.wavFile);

                this.showWavUpload = false;
                this.$axios.post(this.wav_parseUrl, formData).then((res) => {
                    const json = res.data;
                    if (!json.errCode && json.data.taskId) {
                        this.taskId = json.data.taskId;
                        this.onWatchDataReady(this.taskId);
                    }
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
                    if (!json.errCode && json.data.taskId) {
                        this.taskId = json.data.taskId;
                        //this.onWatchDataReady(this.taskId);
                        this.showLoader = false;
                        this.showTextUpload = false;
                        this.showWavUpload = true;
                        this.showText = true;
                        this.text = json.data.textList.join('\r\n');
                    }
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
                    !this.tableData[i].isDeleted  && wavArr.push(this.tableData[i].id);
                }
                if (textArr.length !== wavArr.length) {
                    return this.$message.error('语音文件数量不等于文本行数');
                }
                let resultArr = [];
                for (let i in wavArr) {
                    resultArr.push(`${wavArr[i]}|||${textArr[i]}`);
                }
                //console.log('resultArr', resultArr);
                const jsonData = JSON.stringify({
                    taskId: this.taskId,
                    list: resultArr.join('\n')
                });
                const formData = new FormData();
                formData.append('jsonData', jsonData);
                this.$axios.post(this.submitUrl, formData).then((res) => {
                    //console.log(res);
                    res.data.errCode === 0 && this.successed();
                    res.data.errCode !== 0 && this.fail(res.data.errMsg || res.data.errCode);
                });

            },
            successed() {
                this.$message.success('提交成功');
                setTimeout(() => {
                    location.reload();
                }, 1000)
            },
            fail(err) {
                this.$message.error('提交失败\n' + err);
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
