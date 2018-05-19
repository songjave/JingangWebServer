<template>
    <el-row class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 功能</el-breadcrumb-item>
                <el-breadcrumb-item>知识图谱</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row class="my-box">
            <el-row :gutter="20">
                <el-col :span="16"><el-input size="large" placeholder="请输入内容" v-model="question" @keyup.enter.native="onQuery" class="query-input"> </el-input></el-col>
                <el-col :span="5"><el-button type="primary" size="large" @click="onQuery" class="query-btn">生成</el-button></el-col>
            </el-row>

            <el-row :gutter="20" v-if="display">
                <el-col :span="16" class="qa-answer-row" v-if="answerText">
                    <span class="qa-label">答案：</span>
                    <span class="qa-answer" v-html="answerText"></span>
                </el-col>
                <el-col :span="16" class="qa-answer-row" v-if="answerList.length">
                    <span class="qa-label">答案：</span>
                    <span class="qa-answer-list" v-for="(item, index) in answerList" @click="onAnswerList(item, index)">{{ item }}</span>
                </el-col>
            </el-row>

            <div id="main"></div>
        </el-row>
    </el-row>
</template>

<script>
    //import '../../assets/js/echarts.min';
    let echarts = require('echarts/lib/echarts');
    //let echarts = require('../../assets/js/echarts.min');
    export default {
        components:{
        },
        data() {
            return {
                url: '/api/func/qa',
                text: '暂无回答',
                question: '',
                graphJson: '',
                answerText: '',
                answerList: '',
                display: false,
                tagDisplay: false,
                nodes: [],
                links: [],
            }
        },
        created(){
        },
        computed: {
        },
        mounted() {
            //this.drawMap();
        },
        methods: {
            drawMap() {
                const size = 80;
                const size1 = 50;
                const yy = 200;
                const yy1 = 250;
                const myChart = echarts.init(document.getElementById('main'));
                // 绘制图表
                myChart.setOption({
                    tooltip: {
                        formatter: '{b}'
                    },
                    animationDuration: 1000,
                    animationEasingUpdate: 'quinticInOut',
                    hoverAnimation : true,
                    //focusNodeAdjacency: true,
                    roam: false,
                    edgeSymbol: ['circle', 'arrow'],
                    edgeSymbolSize : 10,
                    series: [{
                        name: '知识图谱',
                        type: 'graph',
                        layout: 'force',
                        force: {
                            repulsion: 800, // 斥力因子，值越大斥力越大
                            gravity : 0, // 引力因子，值越大节点越往中心点靠拢
                            edgeLength :80, // 边的两个节点之间的距离，值越小则长度越长
                            layoutAnimation : true
                        },
                        data: this.nodes,
                        links: this.links,
                        categories: [{
                            'name': '0'
                        }, {
                            'name': '1'
                        }, {
                            'name': '2'
                        }, {
                            'name': '3'
                        }, {
                            'name': '4'
                        }, {
                            'name': '5'
                        }, {
                            'name': '6'
                        }, {
                            'name': '7'
                        }, {
                            'name': '8'
                        }, {
                            'name': '9'
                        }],
                        label: {
                            normal: {
                                show: true,
                                position: 'outside',
                                formatter: '{b}',
                            }
                        },
                        lineStyle: {
                            normal: {
                                color: 'source',
                                curveness: 0,
                                type: "solid"
                            }
                        }
                    }]
                });
                window.onresize = myChart.resize;
                myChart.on('click', (data) => {
                    //console.log(data.data.name);
                    this.question = data.data.name;
                    this.onQuery();
                });
            },
            getAnswer(jsonData) {
                /*const jsonAnswer = jsonData.answer;
                jsonAnswer && jsonAnswer.answer.length === 1 && (this.answerText = jsonAnswer.answer[0].replace(/\n/g, '<br />'));
                if (jsonAnswer && jsonAnswer.answer.length > 1) {
                    this.answerList = jsonAnswer.answer;
                }*/
                this.graphJson = JSON.stringify(jsonData.kgNodes + jsonData.kgLinks);
                this.nodes = [];
                jsonData.kgNodes.forEach((node) => {
                    this.nodes.push({
                        name: node.label,
                        symbolSize: parseInt(node.weight * 100),
                        category: Math.floor(Math.random() * 10).toString(),
                        draggable: true
                    });
                });

                //console.log(JSON.stringify(this.nodes));
                this.links = [];
                jsonData.kgLinks.forEach((link) => {
                    this.links.push({
                        source: link.source,
                        target: link.target
                    })
                });
                this.drawMap();
            },
            doQuery(question) {
                const formData = new FormData();
                formData.append('json', JSON.stringify({question: this.question, op: 'knowledgegraph'}));

                this.$axios.post(this.url, formData).then((res) => {
                    const json = res.data;
                    if (json.errCode) {
                        this.tagDisplay = true;
                        this.display = false;
                        return this.text = json.errMsg || json.errCode;
                    }
                    this.tagDisplay = false;
                    this.display = true;
                    this.getAnswer(json.data.jsonData);
                });
            },
            onQuery() {
                if (!this.question) {
                    return this.$message.error('未输入内容');
                }
                this.doQuery(this.question);
            },
        }
    }

</script>

<style scoped>
    .query-btn {
        margin-left: -93px;
    }
    .query-input {
        width: calc(100% - 83px);
    }
    .gr-label {
        display: inline;
        font-size: 14px;
    }
    .gr-graph-row {
        margin-top: 25px;
    }
    .gr-graph {
        display: block;
        width: fit-content;
        margin-left: 47px;
        font-size: 14px;
        line-height: 20px;
        padding: 5px 10px;
        border-radius: 4px;
        background-color: #e4e8f1;
        transform: translateY(-23px);
    }
    .gr-tag {
        margin-top: 10px;
        margin-left: 0 !important;
    }
    .qa-answer-row {
        margin-top: 25px;
    }
    .qa-label {
        display: inline;
        font-size: 14px;
    }
    .qa-answer {
        display: block;
        width: fit-content;
        margin-left: 47px;
        margin-bottom: 8px;
        font-size: 14px;
        line-height: 20px;
        padding: 5px 10px;
        border-radius: 4px;
        background-color: #e4e8f1;
        transform: translateY(-23px);
    }
    .qa-answer-list {
        cursor: pointer;
    }
    #main {
        margin-top: 10px;
        width: 100%;
        height: 600px;
        overflow: auto;
    }
</style>
