webpackJsonp([12],{1017:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"ElTag",props:{text:String,closable:Boolean,type:String,hit:Boolean,closeTransition:Boolean,color:String},methods:{handleClose:function(e){this.$emit("close",e)}}}},1018:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={props:{label:{},lableWidth:{},value:{},prop:{},type:{default:"image"}},data:function(){return{myLabel:this.label||"",myLabelWidth:this.lableWidth||"120px",url:"",name:""}},methods:{updateUrl:function(e){console.log(e),this.$emit("input",e)},onSuccess:function(e,t,a){return console.log("1111",e,t,a),e.errCode||!e.url?this.$message.error("上传失败 "+e.errMsg):(this.value=e.url,this.updateUrl(e.url),this.$message.success("上传成功"))},onCopy:function(e,t){console.log(t),this.$clipboard(t.url),this.$message.success(t.name+" 链接复制成功")}}}},1024:function(e,t,a){t=e.exports=a(164)(!1),t.push([e.i,".upload-demo{padding-left:10px;line-height:normal;vertical-align:middle;display:inline-block}.el-upload--text{border:none;width:auto;height:auto}",""])},1025:function(e,t,a){var i=a(377)(a(1017),a(1028),null,null);e.exports=i.exports},1026:function(e,t,a){a(1029);var i=a(377)(a(1018),a(1027),null,null);e.exports=i.exports},1027:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("el-form-item",{attrs:{label:e.myLabel,"label-width":e.myLabelWidth,prop:e.prop}},[a("el-row",{attrs:{gutter:0}},[a("el-col",{attrs:{span:18}},[a("el-input",{attrs:{value:e.value,placeholder:"请输入URL或上传","label-width":"180px"},on:{input:function(t){e.updateUrl(t)}}})],1),e._v(" "),a("el-col",{attrs:{span:1}},[a("el-upload",{staticClass:"upload-demo",attrs:{"on-success":e.onSuccess,"show-file-list":!1,name:e.type,action:"/admin/api/tools/"+e.type+"_upload"}},[a("el-button",{attrs:{size:"small",type:"primary"}},[e._v("点击上传")])],1)],1)],1)],1)],1)},staticRenderFns:[]}},1028:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("transition",{attrs:{name:e.closeTransition?"":"el-zoom-in-center"}},[a("span",{staticClass:"el-tag",class:[e.type?"el-tag--"+e.type:"",{"is-hit":e.hit}],style:{backgroundColor:e.color}},[e._t("default"),e._v(" "),e.closable?a("i",{staticClass:"el-tag__close el-icon-close",on:{click:e.handleClose}}):e._e()],2)])},staticRenderFns:[]}},1029:function(e,t,a){var i=a(1024);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);a(378)("35bd6048",i,!0)},1101:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a(1026),r=(a.n(i),a(1025)),s=a.n(r);t.default={components:{ElTag:s.a},data:function(){return{url:"/api/tools/baike",docs:[],page:1,limit:10,total:0,dialogFormLabelWidth:"120px",currentRow:null,select_cate:"",select_word:"",del_list:[],is_search:!1,search_field:"",search_key:"",iEditor:"",bookName:"",form:{bookName:"",entryName:"",entryEnglish:"",entrySpell:"",entryContent:"",subentrys:[],images:[],iEditor:"",iRemark:""},isAdd:!0,isAdmin:!1,dialogVisible:!1,checkVisible:!1,bookList:[{value:"国防建设",label:"国防建设(1)"},{value:"国际军事",label:"国际军事(2)"},{value:"军事法",label:"军事法(3)"},{value:"军事工作",label:"军事工作(4)"},{value:"军事后勤",label:"军事后勤(5)"},{value:"军事环境",label:"军事环境(6)"},{value:"军事技术",label:"军事技术(7)"},{value:"军事历史",label:"军事历史(8)"},{value:"军事思想",label:"军事思想(9)"},{value:"军事著作",label:"军事著作(10)"},{value:"军事装备",label:"军事装备(11)"},{value:"战略",label:"战略(12)"},{value:"中国人民解放军政治工作",label:"中国人民解放军政治工作(13)"},{value:"作战",label:"作战(14)"}]}},created:function(){this.getData(),this.isAdmin=this.$route.query.isAdmin||!1},computed:{},filters:{getLocalDateStr:function(e){var t=function(e){for(var t=""+e;t.length<2;)t="0"+t;return t},a=new Date(e),i=a.getFullYear(),r=a.getMonth()+1,s=a.getDate(),l=a.getHours(),o=a.getMinutes();return i+"-"+t(r)+"-"+t(s)+" "+t(l)+":"+t(o)}},methods:{format:function(e){var t=e.split("\n"),a=[];return t.forEach(function(e){a.push("<p>"+e+"</p>")}),a.join("<br>")},formatSubEntrys:function(e){var t=[];return e.forEach(function(e){t.push("<p><h4>"+e.name+"</h4></p>"),t.push("<p>"+e.content+"</p>")}),t.join("")||"<空>"},formatImages:function(e){var t=[];return e.forEach(function(e){t.push("<p><h4>"+e.describe+"</h4></p>"),t.push('<p><img style="width: 80px" src="/baike/'+e.id+'"</p>')}),t.join("")||"<空>"},onImageUploadSuccess:function(e,t,a){if(e.errCode||!e.data.id)return this.$message.error("上传失败 "+(e.errMsg||""));var i=e.data.index;return this.form.images[i].id=e.data.id,this.$message.success("图片上传成功")},initForm:function(){this.form={bookName:"",entryName:"",entryEnglish:"",entrySpell:"",entryContent:"",subentrys:[],images:[],iEditor:"",iRemark:""},this.isAdd&&(this.form.bookName=this.bookName||"",this.form.iEditor=this.iEditor||"")},handleSizeChange:function(e){this.limit=e,this.getData()},handleCurrentChange:function(e){this.page=e,this.getData()},getData:function(){var e=this,t={offset:(e.page-1)*e.limit,limit:e.limit,sort_field:"iUpdateAt"};e.search_field&&(t.search_field=e.search_field),e.search_key&&(t.search_key=e.search_key),e.$axios.get(e.url,{params:t}).then(function(t){var a=t.data.data.docs||[];e.docs=a,e.total=t.data.data.total||0})},delData:function(e){var t=this;t.$axios.post(t.url+"/"+e+"?_op=del").then(function(e){t.getData()})},onDelete:function(e,t){var a=this;this.$confirm("确认删除条目 ["+t.entryName+"] 吗？一旦删除不可恢复！！！").then(function(e){a.delData(t._id)}).catch(function(e){})},onSearch:function(){return this.search_field?this.search_key?void this.getData():this.$message.error("未填写搜索词"):this.$message.error("未指定搜索字段")},onClear:function(){this.search_field="",this.search_key="",this.page=1,this.getData()},onAdd:function(){this.initForm(),this.isAdd=!0,this.showDialog()},onEdit:function(e,t){this.isAdd=!1,this.form.id=t._id||"",this.form.iEditor=this.iEditor||"",this.form.bookName=t.bookName||"",this.form.entryName=t.entryName||"",this.form.entryEnglish=t.entryEnglish||"",this.form.entrySpell=t.entrySpell||"",this.form.entryContent=t.entryContent||"",this.form.subentrys=t.subentrys||[],this.form.images=t.images||[],this.form.iRemark=t.iRemark||[],this.form.iStatus=t.iStatus||0,this.showDialog()},showDialog:function(){this.dialogVisible=!0},showComfirm:function(){this.comfirmVisible=!0},cancleDialog:function(){this.dialogVisible=!1,this.$refs.form.resetFields()},addSubentry:function(){this.form.subentrys.push({name:"",content:""})},delSubentry:function(e){this.form.subentrys.splice(e,1)},addImg:function(){this.form.images.push({describe:"",id:""})},delImg:function(e){this.form.images.splice(e,1)},inputImg:function(e){this.form.images[e].data=event.target.files[0]},onSubmit:function(){var e=this;if(this.form.entryName=this.form.entryName.trim(),this.form.entryEnglish=this.form.entryEnglish.trim(),this.form.entrySpell=this.form.entrySpell.trim(),this.form.entryContent=this.form.entryContent.trim(),this.form.iEditor=this.form.iEditor.trim(),!this.form.iEditor)return this.$message.error("编辑人必填！！");if(!this.form.bookName)return this.$message.error("请选择书名");if(!this.form.entryName)return this.$message.error("请输入词条名称");if(!this.form.entryEnglish)return this.$message.error("请输入词条英文");if(!this.form.entrySpell)return this.$message.error("请输入词条拼音");if(!this.form.entryContent)return this.$message.error("请输入词条内容");if(!this.form.entryEnglish.match(/^[《》<>\-’'"”（）()~\s\dA-Za-z]+$/g))return this.$message.error("请输入正确格式的词条英文");if(!this.form.entrySpell.match(/^[《》<>\-’'"”（）()~\s\dA-Za-z]+$/g))return this.$message.error("请输入正确格式的词条拼音");for(var t in this.form.subentrys){var a=this.form.subentrys[t];if(!a.name&&!a.content)return this.$message.error("请删除空的子条目输入框");if(a.name&&!a.content)return this.$message.error("请输入子条目内容");if(!a.name&&a.content)return this.$message.error("请输入子条目名称");this.form.subentrys[t].name=a.name.trim(),this.form.subentrys[t].content=a.content.trim()}if(this.form.images.length)for(var i in this.form.images){var r=this.form.images[i];if(!r.id)return this.$message.error("请删除未上传图片的图片输入框");this.form.images[i].describe=r.describe.trim()||""}return this.iEditor=this.form.iEditor,this.isAdd?(this.bookName=this.form.bookName,this.$axios.post(this.url,this.form).then(function(t){var a=t.data;if(a.errCode)return e.$message.error("提交失败: error "+a.errCode);e.dialogVisible=!1,e.$message.success("提交成功"),e.getData()})):this.$axios.post(this.url+"/"+this.form.id,this.form).then(function(t){var a=t.data;if(a.errCode)return e.$message.error("更新失败: error "+a.errCode);e.dialogVisible=!1,e.$message.success("更新成功"),e.getData()})}}}},1120:function(e,t,a){t=e.exports=a(164)(!1),t.push([e.i,".el-alert{padding-top:0;padding-bottom:0}.entry-detail .el-form-item{margin-bottom:0}.entry-detail .el-form-item .el-form-item__label{font-weight:700}.handle-box{margin-bottom:20px}.handle-select{width:120px}.handle-input{width:300px;display:inline-block}.pedia .text-input{width:33%;margin-bottom:10px}.pedia .line-input{width:99.8%;margin-bottom:10px}.pedia .block{display:block;margin-bottom:10px}.pedia .block i{margin-right:8px}.pedia .del-button{border:none;color:#97a8be;padding:5px}.pedia .del-button:hover{color:#20a0ff}",""])},1173:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"table"},[a("div",{staticClass:"crumbs"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",[a("i",{staticClass:"el-icon-menu"}),e._v(" 服务管理")]),e._v(" "),a("el-breadcrumb-item",[e._v("百科全书词条列表")])],1)],1),e._v(" "),a("div",{staticClass:"handle-box"},[a("el-button",{staticClass:"handle-add mr10",attrs:{type:"success",icon:"plus"},on:{click:e.onAdd}},[e._v("添加")]),e._v(" "),a("el-select",{staticClass:"handle-select mr10",attrs:{placeholder:"搜索字段"},model:{value:e.search_field,callback:function(t){e.search_field=t},expression:"search_field"}},[a("el-option",{key:"1",attrs:{label:"条目名称",value:"entryName"}}),e._v(" "),a("el-option",{key:"2",attrs:{label:"编辑人",value:"iEditor"}}),e._v(" "),a("el-option",{key:"3",attrs:{label:"书名",value:"bookName"}})],1),e._v(" "),a("el-input",{staticClass:"handle-input mr10",attrs:{placeholder:"搜索关键词"},model:{value:e.search_key,callback:function(t){e.search_key=t},expression:"search_key"}}),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"search"},on:{click:e.onSearch}},[e._v("搜索")]),e._v(" "),a("el-button",{attrs:{type:"primary",icon:"circle-close"},on:{click:e.onClear}},[e._v("重置")])],1),e._v(" "),a("el-table",{ref:"singleTable",staticStyle:{width:"100%"},attrs:{data:e.docs,border:""},on:{"current-change":function(e){}}},[a("el-table-column",{attrs:{type:"expand"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-form",{staticClass:"entry-detail",attrs:{"label-position":"left"}},[a("el-form-item",{attrs:{label:"名称"}},[a("span",[e._v(e._s(t.row.entryName))])]),e._v(" "),a("el-form-item",{attrs:{label:"英文"}},[a("span",[e._v(e._s(t.row.entryEnglish))])]),e._v(" "),a("el-form-item",{attrs:{label:"拼音"}},[a("span",[e._v(e._s(t.row.entrySpell))])]),e._v(" "),a("el-form-item",{attrs:{label:"所属书目"}},[a("span",[e._v(e._s(t.row.bookName))])]),e._v(" "),a("el-form-item",{attrs:{label:"层级"}},[a("span",[e._v(e._s(t.row.wid))])]),e._v(" "),a("el-form-item",{attrs:{label:"描述"}},[a("div",{domProps:{innerHTML:e._s(e.format(t.row.entryContent))}})]),e._v(" "),a("el-form-item",{attrs:{label:"子条目"}},[a("div",{domProps:{innerHTML:e._s(e.formatSubEntrys(t.row.subentrys))}})]),e._v(" "),a("el-form-item",{attrs:{label:"图片"}},[a("div",{domProps:{innerHTML:e._s(e.formatImages(t.row.images))}})]),e._v(" "),a("el-form-item",{attrs:{label:"备注"}},[a("span",[e._v(e._s(t.row.iRemark))])]),e._v(" "),a("el-form-item",{attrs:{label:"更新时间"}},[a("span",[e._v(e._s(e._f("getLocalDateStr")(t.row.iUpdateAt)))])])],1)]}}])}),e._v(" "),a("el-table-column",{attrs:{type:"index",width:"60"}}),e._v(" "),a("el-table-column",{attrs:{prop:"entryName",label:"名称",width:"150"}}),e._v(" "),a("el-table-column",{attrs:{prop:"bookName",label:"书名",width:"150"}}),e._v(" "),a("el-table-column",{attrs:{prop:"iStatus",label:"状态",width:"50"}}),e._v(" "),a("el-table-column",{attrs:{prop:"iEditor",label:"编辑人",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"iRemark",label:"备注",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"wid",label:"层级"}}),e._v(" "),a("el-table-column",{attrs:{label:"操作",width:"140"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"small"},on:{click:function(a){e.onEdit(t.$index,t.row)}}},[e._v("编辑")]),e._v(" "),a("el-button",{directives:[{name:"show",rawName:"v-show",value:e.isAdmin,expression:"isAdmin"}],attrs:{size:"small",type:"danger"},on:{click:function(a){e.onDelete(t.$index,t.row)}}},[e._v("删除")])]}}])})],1),e._v(" "),a("div",{staticClass:"pagination"},[a("el-pagination",{attrs:{layout:"total, sizes, prev, pager, next, jumper","page-sizes":[10,20,30,50,100,1e3],"page-size":e.limit,total:e.total},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1),e._v(" "),a("el-dialog",{attrs:{title:e.isAdd?"添加":"编辑",visible:e.dialogVisible},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("el-form",{attrs:{"label-width":"80px"}},[a("el-form-item",{attrs:{label:"编辑人"}},[a("el-input",{staticClass:"text-input",attrs:{placeholder:"请输入编辑人姓名"},model:{value:e.form.iEditor,callback:function(t){e.$set(e.form,"iEditor",t)},expression:"form.iEditor"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"书名"}},[a("el-select",{attrs:{filterable:"",placeholder:"请选择"},model:{value:e.form.bookName,callback:function(t){e.$set(e.form,"bookName",t)},expression:"form.bookName"}},e._l(e.bookList,function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})}))],1),e._v(" "),a("el-form-item",{attrs:{label:"词条名称"}},[a("el-input",{staticClass:"text-input",attrs:{placeholder:"请输入词条名称"},model:{value:e.form.entryName,callback:function(t){e.$set(e.form,"entryName",t)},expression:"form.entryName"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"词条英文"}},[a("el-input",{staticClass:"text-input",attrs:{placeholder:"请输入词条英文"},model:{value:e.form.entryEnglish,callback:function(t){e.$set(e.form,"entryEnglish",t)},expression:"form.entryEnglish"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"词条拼音"}},[a("el-input",{staticClass:"text-input",attrs:{placeholder:"请输入词条拼音"},model:{value:e.form.entrySpell,callback:function(t){e.$set(e.form,"entrySpell",t)},expression:"form.entrySpell"}}),e._v(" "),a("el-tag",{attrs:{type:"gray"}},[e._v("保留原有格式，如：“军事环境研究”对应的拼音是 junshi huanjing yanjiu")])],1),e._v(" "),a("el-form-item",{attrs:{label:"词条内容"}},[a("el-input",{staticClass:"line-input",attrs:{type:"textarea",rows:10,placeholder:"请输入词条内容"},model:{value:e.form.entryContent,callback:function(t){e.$set(e.form,"entryContent",t)},expression:"form.entryContent"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"子条目"}},[e._l(e.form.subentrys,function(t,i){return[a("el-button",{staticClass:"del-button",attrs:{icon:"circle-close"},on:{click:function(t){e.delSubentry(i)}}},[e._v("删除此条")]),e._v(" "),a("el-input",{staticClass:"text-input",attrs:{placeholder:"请输入子条目名称"},model:{value:t.name,callback:function(a){e.$set(t,"name",a)},expression:"subentry.name"}}),e._v(" "),a("el-input",{staticClass:"line-input",attrs:{type:"textarea",rows:5,placeholder:"请输入子条目内容"},model:{value:t.content,callback:function(a){e.$set(t,"content",a)},expression:"subentry.content"}}),e._v(" "),a("br"),a("br")]}),e._v(" "),a("el-button",{staticClass:"block",attrs:{type:"primary",size:"small"},on:{click:e.addSubentry}},[a("i",{staticClass:"el-icon-plus"}),e._v("添加")])],2),e._v(" "),a("el-form-item",{attrs:{label:"图片"}},[e._l(e.form.images,function(t,i){return[a("el-row",{attrs:{gutter:0}},[a("el-col",{attrs:{span:3}},[a("el-button",{staticClass:"del-button",attrs:{icon:"circle-close"},on:{click:function(t){e.delImg(i)}}},[e._v("删除")])],1),e._v(" "),a("el-col",{attrs:{span:8}},[a("el-input",{staticClass:"text-input",attrs:{placeholder:"请输入图片描述"},model:{value:t.describe,callback:function(a){e.$set(t,"describe",a)},expression:"img.describe"}})],1),e._v(" "),a("el-col",{attrs:{span:8}},[a("el-input",{attrs:{placeholder:"请点击右侧按钮上传图片","label-width":"100px",readonly:!0},model:{value:t.id,callback:function(a){e.$set(t,"id",a)},expression:"img.id"}})],1),e._v(" "),a("el-col",{attrs:{span:2}},[a("el-upload",{staticClass:"upload-demo",attrs:{"on-success":e.onImageUploadSuccess,"show-file-list":!1,name:"image",data:{index:i},action:"/api/tools/baike_image_upload"}},[a("el-button",{attrs:{size:"small",type:"primary"}},[e._v("点击上传图片")])],1)],1)],1)]}),e._v(" "),a("el-button",{staticClass:"block",attrs:{type:"primary",size:"small"},on:{click:e.addImg}},[a("i",{staticClass:"el-icon-plus"}),e._v("添加")])],2),e._v(" "),a("el-form-item",{attrs:{label:"备注"}},[a("el-input",{staticClass:"text-input",attrs:{placeholder:"备注信息（选填）"},model:{value:e.form.iRemark,callback:function(t){e.$set(e.form,"iRemark",t)},expression:"form.iRemark"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:e.cancleDialog}},[e._v("取 消")]),e._v(" "),a("el-button",{attrs:{type:"primary"},on:{click:e.onSubmit}},[e._v("确 定")])],1)],1)],1)},staticRenderFns:[]}},1201:function(e,t,a){var i=a(1120);"string"==typeof i&&(i=[[e.i,i,""]]),i.locals&&(e.exports=i.locals);a(378)("26328136",i,!0)},996:function(e,t,a){a(1201);var i=a(377)(a(1101),a(1173),null,null);e.exports=i.exports}});