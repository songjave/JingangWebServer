webpackJsonp([14],{1014:function(t,e,r){r(1207);var i=r(377)(r(1119),r(1180),"data-v-2f5543d8",null);t.exports=i.exports},1015:function(t,e,r){t.exports={default:r(1016),__esModule:!0}},1016:function(t,e,r){var i=r(124),n=i.JSON||(i.JSON={stringify:JSON.stringify});t.exports=function(t){return n.stringify.apply(n,arguments)}},1033:function(t,e){!function(t){t.URL=t.URL||t.webkitURL,navigator.getUserMedia=navigator.getUserMedia||navigator.webkitGetUserMedia||navigator.mozGetUserMedia||navigator.msGetUserMedia;var e=function(e,r){r=r||{},r.sampleBits=r.sampleBits||16,r.sampleRate=r.sampleRate||14700;var i=new(t.webkitAudioContext||t.AudioContext),n=i.createMediaStreamSource(e),a=i.createScriptProcessor||i.createJavaScriptNode,o=a.apply(i,[4096,1,1]),s={size:0,buffer:[],inputSampleRate:i.sampleRate,inputSampleBits:16,outputSampleRate:r.sampleRate,oututSampleBits:r.sampleBits,clear:function(){this.buffer=[],this.size=0},input:function(t){this.buffer.push(new Float32Array(t)),this.size+=t.length},compress:function(){for(var t=new Float32Array(this.size),e=0,r=0;r<this.buffer.length;r++)t.set(this.buffer[r],e),e+=this.buffer[r].length;for(var i=parseInt(this.inputSampleRate/this.outputSampleRate),n=t.length/i,a=new Float32Array(n),o=0,s=0;o<n;)a[o]=t[s],s+=i,o++;return a},encodeWAV:function(){var t=Math.min(this.inputSampleRate,this.outputSampleRate),e=Math.min(this.inputSampleBits,this.oututSampleBits),r=this.compress(),i=r.length*(e/8),n=new ArrayBuffer(44+i),a=new DataView(n),o=0,s=function(t){for(var e=0;e<t.length;e++)a.setUint8(o+e,t.charCodeAt(e))};if(s("RIFF"),o+=4,a.setUint32(o,36+i,!0),o+=4,s("WAVE"),o+=4,s("fmt "),o+=4,a.setUint32(o,16,!0),o+=4,a.setUint16(o,1,!0),o+=2,a.setUint16(o,1,!0),o+=2,a.setUint32(o,t,!0),o+=4,a.setUint32(o,1*t*(e/8),!0),o+=4,a.setUint16(o,e/8*1,!0),o+=2,a.setUint16(o,e,!0),o+=2,s("data"),o+=4,a.setUint32(o,i,!0),o+=4,8===e)for(var c=0;c<r.length;c++,o++){var u=Math.max(-1,Math.min(1,r[c])),l=u<0?32768*u:32767*u;l=parseInt(255/(65535/(l+32768))),a.setInt8(o,l,!0)}else for(var c=0;c<r.length;c++,o+=2){var u=Math.max(-1,Math.min(1,r[c]));a.setInt16(o,u<0?32768*u:32767*u,!0)}return new Blob([a],{type:"audio/wav"})}};this.start=function(){n.connect(o),o.connect(i.destination)},this.stop=function(){o.disconnect()},this.clear=function(){s.clear()},this.getBlob=function(){return this.stop(),s.encodeWAV()},this.play=function(e){e.src=t.URL.createObjectURL(this.getBlob())},this.getData=function(){return this.getBlob()},o.onaudioprocess=function(t){s.input(t.inputBuffer.getChannelData(0))}};e.throwError=function(t){},e.canRecording=null!=navigator.getUserMedia,e.get=function(t,r){if(t){if(!navigator.getUserMedia)return t({name:"UNSUPPORTED_Error",msg:"当前浏览器不支持录音功能"});navigator.getUserMedia({audio:!0},function(i){var n=new e(i,r);t(n)},function(e){switch(e.code||e.name){case"PERMISSION_DENIED":case"PermissionDeniedError":e.msg="浏览器拒绝开启录音功能",t(e);break;case"NOT_SUPPORTED_ERROR":case"NotSupportedError":e.msg="浏览器不支持硬件设备",t(e);break;case"MANDATORY_UNSATISFIED_ERROR":case"MandatoryUnsatisfiedError":e.msg="无法发现指定的硬件设备",t(e);break;default:e.msg="无法打开麦克风",t(e)}})}},t.HZRecorder=e}(window)},1119:function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=r(1015),n=r.n(i),a=r(1033);r.n(a);e.default={components:{},data:function(){return{url:"/api/user/login",isRecording:!1,recorder:null,voiceBlob:null,text:"暂无识别结果",form:{}}},created:function(){},computed:{},methods:{doRecoginze:function(){var t=this,e=new FormData;e.append("voice",this.voiceBlob),this.$axios.post(this.url,e).then(function(e){var r=e.data;if(r.errCode)return t.text=r.errMsg||r.errCode;t.text=n()(r)})},onStartRecord:function(){var t=this;this.isRecording&&this.recorder.stop(),this.recorder?(this.recorder.clear(),this.isRecording=!0,this.recorder.start()):this.recorder&&window.AudioContext||HZRecorder.get(function(e){if(console.log(e),e.code||e.name)return t.$message.error(e.msg);t.recorder=e,t.isRecording=!0,t.recorder.start()})},onStopRecord:function(){this.recorder.stop();var t=document.getElementById("audio");this.recorder.play(t),this.voiceBlob=this.recorder.getData(),this.isRecording=!1},onRecoginze:function(){if(!this.voiceBlob)return alert("无效数据");this.doRecoginze()}}}},1126:function(t,e,r){e=t.exports=r(164)(!1),e.push([t.i,".handle-box[data-v-2f5543d8]{margin-bottom:20px}.handle-select[data-v-2f5543d8]{width:120px}.handle-input[data-v-2f5543d8]{width:300px;display:inline-block}.el-row[data-v-2f5543d8]{margin-bottom:20px}",""])},1180:function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"table"},[r("div",{staticClass:"crumbs"},[r("el-breadcrumb",{attrs:{separator:"/"}},[r("el-breadcrumb-item",[r("i",{staticClass:"el-icon-menu"}),t._v(" 服务管理")]),t._v(" "),r("el-breadcrumb-item",[t._v("声纹识别测试")])],1)],1),t._v(" "),r("div",{staticClass:"my-box"},[r("el-row",[r("audio",{attrs:{id:"audio",controls:""}})]),t._v(" "),r("el-row",[r("el-button",{attrs:{type:"primary",plain:""},on:{click:function(e){t.onStartRecord()}}},[t._v("开始录音")]),t._v(" "),r("el-button",{attrs:{type:"primary",plain:""},on:{click:function(e){t.onStopRecord()}}},[t._v("停止录音")])],1),t._v(" "),r("el-row",[r("el-button",{attrs:{type:"success"},on:{click:function(e){t.onRecoginze()}}},[t._v("进行声纹识别")])],1),t._v(" "),r("el-tag",{attrs:{type:"gray"}},[t._v(t._s(t.text))])],1)])},staticRenderFns:[]}},1207:function(t,e,r){var i=r(1126);"string"==typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);r(378)("64ed36e6",i,!0)}});