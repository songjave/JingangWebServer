webpackJsonp([4],{1e3:function(e,t,a){a(1214);var r=a(377)(a(1105),a(1186),"data-v-54ac0748",null);e.exports=r.exports},1015:function(e,t,a){e.exports={default:a(1016),__esModule:!0}},1016:function(e,t,a){var r=a(124),i=r.JSON||(r.JSON={stringify:JSON.stringify});e.exports=function(e){return i.stringify.apply(i,arguments)}},1017:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"ElTag",props:{text:String,closable:Boolean,type:String,hit:Boolean,closeTransition:Boolean,color:String},methods:{handleClose:function(e){this.$emit("close",e)}}}},1018:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{label:{},lableWidth:{},value:{},prop:{},type:{default:"image"}},data:function(){return{myLabel:this.label||"",myLabelWidth:this.lableWidth||"120px",url:"",name:""}},methods:{updateUrl:function(e){console.log(e),this.$emit("input",e)},onSuccess:function(e,t,a){return console.log("1111",e,t,a),e.errCode||!e.url?this.$message.error("上传失败 "+e.errMsg):(this.value=e.url,this.updateUrl(e.url),this.$message.success("上传成功"))},onCopy:function(e,t){console.log(t),this.$clipboard(t.url),this.$message.success(t.name+" 链接复制成功")}}}},1019:function(e,t,a){e.exports={default:a(1020),__esModule:!0}},1020:function(e,t,a){a(1023);var r=a(124).Object;e.exports=function(e,t,a){return r.defineProperty(e,t,a)}},1023:function(e,t,a){var r=a(165);r(r.S+r.F*!a(88),"Object",{defineProperty:a(89).f})},1024:function(e,t,a){t=e.exports=a(164)(!1),t.push([e.i,".upload-demo{padding-left:10px;line-height:normal;vertical-align:middle;display:inline-block}.el-upload--text{border:none;width:auto;height:auto}",""])},1025:function(e,t,a){var r=a(377)(a(1017),a(1028),null,null);e.exports=r.exports},1026:function(e,t,a){a(1029);var r=a(377)(a(1018),a(1027),null,null);e.exports=r.exports},1027:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-form-item",{attrs:{label:e.myLabel,"label-width":e.myLabelWidth,prop:e.prop}},[a("el-row",{attrs:{gutter:0}},[a("el-col",{attrs:{span:18}},[a("el-input",{attrs:{value:e.value,placeholder:"请输入URL或上传","label-width":"180px"},on:{input:function(t){e.updateUrl(t)}}})],1),e._v(" "),a("el-col",{attrs:{span:1}},[a("el-upload",{staticClass:"upload-demo",attrs:{"on-success":e.onSuccess,"show-file-list":!1,name:e.type,action:"/admin/api/tools/"+e.type+"_upload"}},[a("el-button",{attrs:{size:"small",type:"primary"}},[e._v("点击上传")])],1)],1)],1)],1)],1)},staticRenderFns:[]}},1028:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("transition",{attrs:{name:e.closeTransition?"":"el-zoom-in-center"}},[a("span",{staticClass:"el-tag",class:[e.type?"el-tag--"+e.type:"",{"is-hit":e.hit}],style:{backgroundColor:e.color}},[e._t("default"),e._v(" "),e.closable?a("i",{staticClass:"el-tag__close el-icon-close",on:{click:e.handleClose}}):e._e()],2)])},staticRenderFns:[]}},1029:function(e,t,a){var r=a(1024);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a(378)("35bd6048",r,!0)},1034:function(e,t,a){"use strict";t.__esModule=!0;var r=a(1019),i=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(e,t,a){return t in e?(0,i.default)(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}},1105:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r,i=a(1034),o=a.n(i),s=a(1015),l=a.n(s),n=a(1026),c=(a.n(n),a(1025)),u=a.n(c);t.default={components:{ElTag:u.a},data:function(){return{search_field:"",search_key:"",docs:[],page:1,limit:10,total:0,isAdd:!0,isAdmin:!1,dialogVisible:!1,answerVisible:!1,form:{iEditor:"",question:"",answer:"",version:"",rate:0,problem:"",remarks:"",id:""},problemOption:[{value:"无答案返回"},{value:"答案错误（答非所问）"},{value:"答案不恰当（有待提高）"},{value:"其它"}],queryUrl:"/api/func/qa",url:"/api/tools/qa_test"}},created:function(){this.getData(),this.isAdmin=this.$route.query.isAdmin||!1},computed:{},filters:{getLocalDateStr:function(e){var t=function(e){for(var t=""+e;t.length<2;)t="0"+t;return t},a=new Date(e),r=a.getFullYear(),i=a.getMonth()+1,o=a.getDate(),s=a.getHours(),l=a.getMinutes();return r+"-"+t(i)+"-"+t(o)+" "+t(s)+":"+t(l)}},methods:(r={initForm:function(){this.form={iEditor:"",question:"",answer:"",version:"",rate:0,problem:"",remarks:"",id:""},this.isAdd&&(this.form.question=this.question||"",this.form.iEditor=this.iEditor||"")},onAdd:function(){this.initForm(),this.isAdd=!0,this.showDialog()},onSearch:function(){},onClear:function(){},handleSizeChange:function(e){this.limit=e,this.getData()},handleCurrentChange:function(e){this.page=e,this.getData()}},o()(r,"onSearch",function(){return this.search_field?this.search_key?void this.getData():this.$message.error("未填写搜索词"):this.$message.error("未指定搜索字段")}),o()(r,"onClear",function(){this.search_field="",this.search_key="",this.page=1,this.getData()}),o()(r,"format",function(e){var t=e.split("\n"),a=[];return t.forEach(function(e){a.push("<p>"+e+"</p>")}),a.join("<br>")}),o()(r,"onEdit",function(e,t){this.isAdd=!1,this.form.id=t._id||"",this.form.iEditor=t.iEditor||"",this.form.question=t.question||"",this.form.answer=t.answer||"",this.form.version=t.version||"",this.form.rate=t.rate||0,this.form.problem=t.problem||"",this.form.remarks=t.remarks||[],this.form.iStatus=t.iStatus||0,this.form.iRemark=t.iRemark||[],this.showDialog()}),o()(r,"showDialog",function(){this.dialogVisible=!0}),o()(r,"showComfirm",function(){this.comfirmVisible=!0}),o()(r,"cancleDialog",function(){this.dialogVisible=!1,this.answerVisible=!1}),o()(r,"getData",function(){var e=this,t={offset:(e.page-1)*e.limit,limit:e.limit,sort_field:"iUpdateAt"};e.search_field&&(t.search_field=e.search_field),e.search_key&&(t.search_key=e.search_key),e.$axios.get(e.url,{params:t}).then(function(t){var a=t.data.data.docs||[];e.docs=a,e.total=t.data.data.total||0})}),o()(r,"doQuery",function(e){var t=this,a=new FormData;a.append("question",e),this.$axios.post(this.queryUrl,a).then(function(e){var a=e.data;if(a.errCode)return t.tagDisplay=!0,t.display=!1,t.text=a.errMsg||a.errCode;t.answerVisible=!0,t.tagDisplay=!1,t.display=!0,t.text=l()(a),t.form.answer=a.data.jsonData.answer.replace(/\n/g,"<br />"),t.form.version=a.data.jsonData.version})}),o()(r,"onQuery",function(){if(!this.form.question)return this.$message.error("未输入内容");this.doQuery(this.form.question)}),o()(r,"onSubmit",function(){var e=this;return this.iEditor=this.form.iEditor,this.isAdd?(this.question=this.form.question,this.form.answer=this.form.answer.replace(/<br \/>/g,"\n"),this.$axios.post(this.url,this.form).then(function(t){var a=t.data;if(a.errCode)return e.$message.error("提交失败: error "+a.errCode);e.dialogVisible=!1,e.$message.success("提交成功"),e.getData()})):this.$axios.post(this.url+"/"+this.form.id,this.form).then(function(t){var a=t.data;if(a.errCode)return e.$message.error("更新失败: error "+a.errCode);e.dialogVisible=!1,e.$message.success("更新成功"),e.getData()})}),r)}},1133:function(e,t,a){t=e.exports=a(164)(!1),t.push([e.i,".el-alert[data-v-54ac0748]{padding-top:0;padding-bottom:0}.entry-detail .el-form-item[data-v-54ac0748]{margin-bottom:0}.entry-detail .el-form-item .el-form-item__label[data-v-54ac0748]{font-weight:700}.handle-box[data-v-54ac0748]{margin-bottom:20px}.handle-select[data-v-54ac0748]{width:120px}.handle-input[data-v-54ac0748]{width:300px;display:inline-block}#question-input[data-v-54ac0748]{display:inline;-webkit-appearance:none;-moz-appearance:none;appearance:none;background-color:#fff;background-image:none;border-radius:4px;border:1px solid #bfcbd9;box-sizing:border-box;color:#1f2d3d;font-size:inherit;height:36px;line-height:1;outline:0;padding:3px 10px;transition:border-color .2s cubic-bezier(.645,.045,.355,1);width:calc(100% - 65px)}[data-v-54ac0748]::-webkit-input-placeholder{color:#97a8be}.qa-answer[data-v-54ac0748]{display:block;font-size:14px;line-height:20px;padding:5px 10px;border-radius:4px;background-color:#e4e8f1}.qa-rate[data-v-54ac0748]{transform:translateY(8px)}#qa-textarea[data-v-54ac0748]{transform:translateY(10px)}",""])},1186:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"table"},[a("div",{staticClass:"crumbs"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",[a("i",{staticClass:"el-icon-menu"}),e._v(" 服务管理")]),e._v(" "),a("el-breadcrumb-item",[e._v("问答测试列表")])],1)],1),e._v(" "),a("div",{staticClass:"handle-box"},[a("el-select",{staticClass:"handle-select mr10",attrs:{placeholder:"搜索字段"},model:{value:e.search_field,callback:function(t){e.search_field=t},expression:"search_field"}},[a("el-option",{key:"1",attrs:{label:"咨询问题",value:"question"}}),e._v(" "),a("el-option",{key:"2",attrs:{label:"版本",value:"version"}}),e._v(" "),a("el-option",{key:"3",attrs:{label:"反馈问题",value:"problem"}}),e._v(" "),a("el-option",{key:"4",attrs:{label:"编辑人",value:"iEditor"}})],1),e._v(" "),a("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"搜索关键词"},model:{value:e.search_key,callback:function(t){e.search_key=t},expression:"search_key"}}),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"search"},on:{click:e.onSearch}},[e._v("搜索")]),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"circle-close"},on:{click:e.onClear}},[e._v("重置")])],1),e._v(" "),a("el-table",{ref:"singleTable",staticStyle:{width:"100%"},attrs:{data:e.docs,border:""},on:{"current-change":function(e){}}},[a("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-form",{staticClass:"entry-detail",attrs:{"label-position":"left"}},[a("el-form-item",{attrs:{label:"咨询问题"}},[a("span",[e._v(e._s(t.row.question))])]),e._v(" "),a("el-form-item",{attrs:{label:"答案"}},[a("span",[e._v(e._s(t.row.answer))])]),e._v(" "),a("el-form-item",{attrs:{label:"版本"}},[a("span",[e._v(e._s(t.row.version))])]),e._v(" "),a("el-form-item",{attrs:{label:"评级"}},[a("span",[e._v(e._s(t.row.rate))])]),e._v(" "),a("el-form-item",{attrs:{label:"反馈问题"}},[a("span",[e._v(e._s(t.row.problem))])]),e._v(" "),a("el-form-item",{attrs:{label:"备注"}},[a("div",{domProps:{innerHTML:e._s(t.row.remarks)}})]),e._v(" "),a("el-form-item",{attrs:{label:"编辑人"}},[a("div",{domProps:{innerHTML:e._s(t.row.iEditor)}})]),e._v(" "),a("el-form-item",{attrs:{label:"更新时间"}},[a("span",[e._v(e._s(e._f("getLocalDateStr")(t.row.iUpdateAt)))])])],1)]}}])}),e._v(" "),a("el-table-column",{attrs:{type:"index",width:"60"}}),e._v(" "),a("el-table-column",{attrs:{prop:"question",label:"咨询问题"}}),e._v(" "),a("el-table-column",{attrs:{prop:"answer",label:"答案",width:"400"}}),e._v(" "),a("el-table-column",{attrs:{prop:"version",label:"版本"}}),e._v(" "),a("el-table-column",{attrs:{prop:"rate",label:"评级",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{prop:"problem",label:"反馈问题"}}),e._v(" "),a("el-table-column",{attrs:{prop:"remarks",label:"备注"}}),e._v(" "),a("el-table-column",{attrs:{prop:"iEditor",label:"编辑人"}}),e._v(" "),a("el-table-column",{attrs:{prop:"iUpdateAt",label:"更新时间"}}),e._v(" "),a("el-table-column",{attrs:{prop:"iStatus",label:"状态",width:"80"}}),e._v(" "),a("el-table-column",{attrs:{label:"操作"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"small"},on:{click:function(a){e.onEdit(t.$index,t.row)}}},[e._v("编辑")]),e._v(" "),a("el-button",{directives:[{name:"show",rawName:"v-show",value:e.isAdmin,expression:"isAdmin"}],attrs:{size:"small",type:"danger"},on:{click:function(a){e.onDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{layout:"total, sizes, prev, pager, next, jumper","page-sizes":[10,20,30,50,100,1e3],"page-size":e.limit,total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),e._v(" "),a("el-dialog",{attrs:{title:e.isAdd?"添加":"编辑",visible:e.dialogVisible,close:"cancleDialog"},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("el-form",{attrs:{"label-width":"80px"}},[a("el-form-item",{attrs:{label:"编辑人"}},[a("el-input",{attrs:{placeholder:"请输入编辑人姓名"},model:{value:e.form.iEditor,callback:function(t){e.$set(e.form,"iEditor",t)},expression:"form.iEditor"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"咨询问题"}},[a("input",{directives:[{name:"model",rawName:"v-model",value:e.form.question,expression:"form.question"}],attrs:{id:"question-input",placeholder:"请输入内容"},domProps:{value:e.form.question},on:{input:function(t){t.target.composing||e.$set(e.form,"question",t.target.value)}},nativeOn:{keyup:function(t){if(!("button"in t)&&e._k(t.keyCode,"enter",13,t.key))return null;e.onQuery(t)}}}),e._v(" "),a("el-button",{staticClass:"query-btn",attrs:{type:"primary"},on:{click:e.onQuery}},[e._v("咨询")])],1),e._v(" "),e.form.answer?a("div",[a("el-form-item",{attrs:{label:"答案"}},[a("span",{staticClass:"qa-answer",domProps:{innerHTML:e._s(e.form.answer)}})]),e._v(" "),a("el-form-item",{attrs:{label:"版本"}},[a("el-tag",[e._v(e._s(e.form.version))])],1),e._v(" "),a("el-form-item",{attrs:{label:"评级"}},[a("el-rate",{staticClass:"qa-rate",model:{value:e.form.rate,callback:function(t){e.$set(e.form,"rate",t)},expression:"form.rate"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"反馈问题"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.form.problem,callback:function(t){e.$set(e.form,"problem",t)},expression:"form.problem"}},e._l(e.problemOption,function(e){return a("el-option",{key:e.value,attrs:{value:e.value}})}))],1),e._v(" "),a("el-form-item",{attrs:{label:"备注"}},[a("el-input",{attrs:{id:"qa-textarea",type:"textarea",rows:3,placeholder:"请输入内容"},model:{value:e.form.remarks,callback:function(t){e.$set(e.form,"remarks",t)},expression:"form.remarks"}})],1)],1):e._e()],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.cancleDialog}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},[e._v("提交反馈")])],1)],1)],1)},staticRenderFns:[]}},1214:function(e,t,a){var r=a(1133);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);a(378)("df4a98ae",r,!0)}});