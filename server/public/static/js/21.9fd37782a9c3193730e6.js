webpackJsonp([21],{1015:function(t,a,e){t.exports={default:e(1016),__esModule:!0}},1016:function(t,a,e){var n=e(124),s=n.JSON||(n.JSON={stringify:JSON.stringify});t.exports=function(t){return s.stringify.apply(s,arguments)}},1099:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var n=e(1015),s=e.n(n),r=e(2);a.default={components:{},data:function(){return{url:"/api/func/qa",text:"暂无回答",question:"",graphJson:"",answerText:"",answerList:"",display:!1,tagDisplay:!1,nodes:[],links:[]}},created:function(){},computed:{},mounted:function(){},methods:{drawMap:function(){var t=this,a=r.init(document.getElementById("main"));a.setOption({tooltip:{formatter:"{b}"},animationDuration:1e3,animationEasingUpdate:"quinticInOut",hoverAnimation:!0,roam:!1,edgeSymbol:["circle","arrow"],edgeSymbolSize:10,series:[{name:"知识图谱",type:"graph",layout:"force",force:{repulsion:800,gravity:0,edgeLength:80,layoutAnimation:!0},data:this.nodes,links:this.links,categories:[{name:"0"},{name:"1"},{name:"2"},{name:"3"},{name:"4"},{name:"5"},{name:"6"},{name:"7"},{name:"8"},{name:"9"}],label:{normal:{show:!0,position:"outside",formatter:"{b}"}},lineStyle:{normal:{color:"source",curveness:0,type:"solid"}}}]}),window.onresize=a.resize,a.on("click",function(a){t.question=a.data.name,t.onQuery()})},getAnswer:function(t){var a=this;this.graphJson=s()(t.kgNodes+t.kgLinks),this.nodes=[],t.kgNodes.forEach(function(t){a.nodes.push({name:t.label,symbolSize:parseInt(100*t.weight),category:Math.floor(10*Math.random()).toString(),draggable:!0})}),this.links=[],t.kgLinks.forEach(function(t){a.links.push({source:t.source,target:t.target})}),this.drawMap()},doQuery:function(t){var a=this,e=new FormData;e.append("json",s()({question:this.question,op:"knowledgegraph"})),this.$axios.post(this.url,e).then(function(t){var e=t.data;if(e.errCode)return a.tagDisplay=!0,a.display=!1,a.text=e.errMsg||e.errCode;a.tagDisplay=!1,a.display=!0,a.getAnswer(e.data.jsonData)})},onQuery:function(){if(!this.question)return this.$message.error("未输入内容");this.doQuery(this.question)}}}},1131:function(t,a,e){a=t.exports=e(164)(!1),a.push([t.i,".query-btn[data-v-41c45fa0]{margin-left:-93px}.query-input[data-v-41c45fa0]{width:calc(100% - 83px)}.gr-label[data-v-41c45fa0]{display:inline;font-size:14px}.gr-graph-row[data-v-41c45fa0]{margin-top:25px}.gr-graph[data-v-41c45fa0]{display:block;width:fit-content;margin-left:47px;font-size:14px;line-height:20px;padding:5px 10px;border-radius:4px;background-color:#e4e8f1;transform:translateY(-23px)}.gr-tag[data-v-41c45fa0]{margin-top:10px;margin-left:0!important}.qa-answer-row[data-v-41c45fa0]{margin-top:25px}.qa-label[data-v-41c45fa0]{display:inline;font-size:14px}.qa-answer[data-v-41c45fa0]{display:block;width:fit-content;margin-left:47px;margin-bottom:8px;font-size:14px;line-height:20px;padding:5px 10px;border-radius:4px;background-color:#e4e8f1;transform:translateY(-23px)}.qa-answer-list[data-v-41c45fa0]{cursor:pointer}#main[data-v-41c45fa0]{margin-top:10px;width:100%;height:600px;overflow:auto}",""])},1184:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("el-row",{staticClass:"table"},[e("div",{staticClass:"crumbs"},[e("el-breadcrumb",{attrs:{separator:"/"}},[e("el-breadcrumb-item",[e("i",{staticClass:"el-icon-menu"}),t._v(" 功能")]),t._v(" "),e("el-breadcrumb-item",[t._v("知识图谱")])],1)],1),t._v(" "),e("el-row",{staticClass:"my-box"},[e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{span:16}},[e("el-input",{staticClass:"query-input",attrs:{size:"large",placeholder:"请输入内容"},nativeOn:{keyup:function(a){if(!("button"in a)&&t._k(a.keyCode,"enter",13,a.key))return null;t.onQuery(a)}},model:{value:t.question,callback:function(a){t.question=a},expression:"question"}})],1),t._v(" "),e("el-col",{attrs:{span:5}},[e("el-button",{staticClass:"query-btn",attrs:{type:"primary",size:"large"},on:{click:t.onQuery}},[t._v("生成")])],1)],1),t._v(" "),t.display?e("el-row",{attrs:{gutter:20}},[t.answerText?e("el-col",{staticClass:"qa-answer-row",attrs:{span:16}},[e("span",{staticClass:"qa-label"},[t._v("答案：")]),t._v(" "),e("span",{staticClass:"qa-answer",domProps:{innerHTML:t._s(t.answerText)}})]):t._e(),t._v(" "),t.answerList.length?e("el-col",{staticClass:"qa-answer-row",attrs:{span:16}},[e("span",{staticClass:"qa-label"},[t._v("答案：")]),t._v(" "),t._l(t.answerList,function(a,n){return e("span",{staticClass:"qa-answer-list",on:{click:function(e){t.onAnswerList(a,n)}}},[t._v(t._s(a))])})],2):t._e()],1):t._e(),t._v(" "),e("div",{attrs:{id:"main"}})],1)],1)},staticRenderFns:[]}},1212:function(t,a,e){var n=e(1131);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);e(378)("7b4b1b5e",n,!0)},994:function(t,a,e){e(1212);var n=e(377)(e(1099),e(1184),"data-v-41c45fa0",null);t.exports=n.exports}});