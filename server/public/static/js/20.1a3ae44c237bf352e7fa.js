webpackJsonp([20],{1015:function(t,a,e){t.exports={default:e(1016),__esModule:!0}},1016:function(t,a,e){var s=e(124),r=s.JSON||(s.JSON={stringify:JSON.stringify});t.exports=function(t){return r.stringify.apply(r,arguments)}},1104:function(t,a,e){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=e(1015),r=e.n(s);a.default={components:{},data:function(){return{url:"/api/func/qa",submitUrl:"/api/tools/qa_test",text:"暂无回答",tagDisplay:!1,answerText:"",answerList:[],problemOption:[{value:"答案准确"},{value:"答案错误（答非所问）"},{value:"答案不恰当（有待提高）"},{value:"无答案返回"},{value:"其它"}],form:{iEditor:"",question:"",answer:"",version:"",rate:0,problem:"",remarks:"",id:""},display:!1}},created:function(){},computed:{},methods:{checkInput:function(){if(this.answerText="",this.answerList="",!this.form.question)return this.$message.error("未输入内容")},onAnswerList:function(t,a){var e=(a+1).toString();this.form.question=t,this.checkInput(),this.doQuery(e)},initForm:function(){this.form={iEditor:"",question:"",answer:"",version:"",rate:0,problem:"",remarks:"",id:""}},doQuery:function(t){var a=this,e=new FormData;e.append("question",t),this.$axios.post(this.url,e).then(function(t){var e=t.data;if(e.errCode)return a.tagDisplay=!0,a.display=!1,a.text=e.errMsg||e.errCode;a.tagDisplay=!1,a.display=!0,a.text=r()(e);var s=e.data.jsonData;1===s.answer.length&&(a.answerText=s.answer[0].replace(/\n/g,"<br />")),s.answer.length>1&&(a.answerList=s.answer),a.form.answer=e.data.jsonData.answer.join(",").replace(/\n/g,"<br />"),a.form.version=e.data.jsonData.version})},onQuery:function(){if(!this.form.question)return this.$message.error("未输入内容");this.doQuery(this.form.question)},onSubmit:function(){var t=this;this.form.answer=this.form.answer.replace(/<br \/>/g,"\n"),this.$axios.post(this.submitUrl,this.form).then(function(a){var e=a.data;if(e.errCode)return t.$message.error("提交失败: error "+e.errCode);t.display=!1,t.initForm(),t.$message.success("提交成功")})}}}},1146:function(t,a,e){a=t.exports=e(164)(!1),a.push([t.i,".handle-box[data-v-bdcd4cc4]{margin-bottom:20px}.handle-select[data-v-bdcd4cc4]{width:120px}.handle-input[data-v-bdcd4cc4]{width:300px;display:inline-block}.el-col[data-v-bdcd4cc4]{margin-bottom:20px}.query-btn[data-v-bdcd4cc4]{margin-left:-93px}.query-input[data-v-bdcd4cc4]{width:calc(100% - 83px)}.qa-label[data-v-bdcd4cc4],.qa-rate[data-v-bdcd4cc4]{display:inline;font-size:14px}.qa-answer-row[data-v-bdcd4cc4]{margin-bottom:10px}.qa-answer-list[data-v-bdcd4cc4],.qa-answer[data-v-bdcd4cc4]{display:block;width:calc(100% - 68px);margin-left:47px;font-size:14px;line-height:20px;padding:5px 10px;border-radius:4px;background-color:#e4e8f1;transform:translateY(-16px)}.qa-answer-list[data-v-bdcd4cc4]{cursor:pointer}#qa-textarea .el-textarea .el-textarea__inner[data-v-bdcd4cc4]{display:inline;margin-left:40px;transform:translateY(-14px)}#qa-textarea[data-v-bdcd4cc4]{width:calc(100% - 48px);vertical-align:top}.qa-submit button[data-v-bdcd4cc4]{margin-left:45px}.editor-input[data-v-bdcd4cc4]{width:178px}",""])},1198:function(t,a){t.exports={render:function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("el-row",{staticClass:"table"},[e("div",{staticClass:"crumbs"},[e("el-breadcrumb",{attrs:{separator:"/"}},[e("el-breadcrumb-item",[e("i",{staticClass:"el-icon-menu"}),t._v(" 服务管理")]),t._v(" "),e("el-breadcrumb-item",[t._v("问答测试")])],1)],1),t._v(" "),e("el-row",{staticClass:"my-box"},[e("el-row",{attrs:{gutter:20}},[e("el-col",{attrs:{span:16}},[e("el-input",{staticClass:"query-input",attrs:{size:"large",placeholder:"请输入内容"},nativeOn:{keyup:function(a){if(!("button"in a)&&t._k(a.keyCode,"enter",13,a.key))return null;t.onQuery(a)}},model:{value:t.form.question,callback:function(a){t.$set(t.form,"question",a)},expression:"form.question"}})],1),t._v(" "),e("el-col",{attrs:{span:5}},[e("el-button",{staticClass:"query-btn",attrs:{type:"primary",size:"large"},on:{click:t.onQuery}},[t._v("咨询")])],1)],1),t._v(" "),e("el-row",{attrs:{gutter:20}},[t.tagDisplay?e("el-tag",{attrs:{type:"gray"}},[t._v(t._s(t.text))]):t._e()],1),t._v(" "),t.display?e("el-row",{attrs:{gutter:20}},[t.answerText?e("el-col",{staticClass:"qa-answer-row",attrs:{span:16}},[e("span",{staticClass:"qa-label"},[t._v("答案：")]),t._v(" "),e("span",{staticClass:"qa-answer",domProps:{innerHTML:t._s(t.answerText)}})]):t._e(),t._v(" "),t.answerList.length?e("el-col",{staticClass:"qa-answer-row",attrs:{span:16}},[e("span",{staticClass:"qa-label"},[t._v("答案：")]),t._v(" "),t._l(t.answerList,function(a,s){return e("span",{staticClass:"qa-answer-list",on:{click:function(e){t.onAnswerList(a,s)}}},[t._v(t._s(a))])})],2):t._e(),t._v(" "),e("el-col",{attrs:{span:16}},[e("span",{staticClass:"qa-label"},[t._v("版本：")]),t._v(" "),e("el-tag",[t._v(t._s(t.form.version))])],1),t._v(" "),e("el-col",{attrs:{span:16}},[e("span",{staticClass:"qa-label"},[t._v("评级：")]),t._v(" "),e("el-rate",{staticClass:"qa-rate",model:{value:t.form.rate,callback:function(a){t.$set(t.form,"rate",a)},expression:"form.rate"}})],1),t._v(" "),e("el-col",{attrs:{span:16}},[e("span",{staticClass:"qa-label"},[t._v("问题：")]),t._v(" "),e("el-select",{attrs:{placeholder:"选填"},model:{value:t.form.problem,callback:function(a){t.$set(t.form,"problem",a)},expression:"form.problem"}},t._l(t.problemOption,function(t){return e("el-option",{key:t.value,attrs:{value:t.value}})}))],1),t._v(" "),e("el-col",{attrs:{span:16}},[e("span",{staticClass:"qa-label"},[t._v("备注：")]),t._v(" "),e("el-input",{attrs:{id:"qa-textarea",type:"textarea",rows:3,placeholder:"选填"},model:{value:t.form.remarks,callback:function(a){t.$set(t.form,"remarks",a)},expression:"form.remarks"}})],1),t._v(" "),e("el-col",{attrs:{span:16}},[e("span",{staticClass:"qa-label"},[t._v("姓名：")]),t._v(" "),e("el-input",{staticClass:"editor-input",attrs:{placeholder:"测试人员姓名"},model:{value:t.form.iEditor,callback:function(a){t.$set(t.form,"iEditor",a)},expression:"form.iEditor"}})],1),t._v(" "),e("el-col",{staticClass:"qa-submit",attrs:{span:16}},[e("el-button",{attrs:{type:"success",size:"large"},on:{click:t.onSubmit}},[t._v("提交反馈")])],1)],1):t._e()],1)],1)},staticRenderFns:[]}},1227:function(t,a,e){var s=e(1146);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);e(378)("ec131260",s,!0)},999:function(t,a,e){e(1227);var s=e(377)(e(1104),e(1198),"data-v-bdcd4cc4",null);t.exports=s.exports}});