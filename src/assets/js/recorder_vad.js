
//兼容
window.URL = window.URL || window.webkitURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var Queue = function (length) {
    this.MAX_LEN = length;
    this.cache = new Array(length);
    this.index = 0;
    this.len = 0;
};

Queue.prototype.add = function (data) {
    this.cache[this.index] = new Float32Array(data);
    this.index = (this.index + 1) % this.MAX_LEN;
    this.len = (this.len + 1 > this.MAX_LEN) ? this.MAX_LEN : (this.len + 1);
};

Queue.prototype.clear = function (data) {
    this.cache = new Array(this.MAX_LEN);
    this.index = 0;
    this.len = 0;
};

Queue.prototype.get = function () {
    //console.log(this.len, this.cache);
    if (this.len < this.MAX_LEN) {
        return this.cache.slice(0, this.len);
    }

    var arr1 = this.cache.slice(this.index);
    var arr2 = this.cache.slice(0, this.index);
    var ret = [];
    arr1.forEach((data) => {
        ret.push(data);
    });

    arr2.forEach((data) => {
        ret.push(data);
    });

    this.clear(); //关键操作
    return ret;
};

function SoundMeter(context) {
    this.context = context;
    this.instant = 0.0;
    this.slow = 0.0;
    this.clip = 0.0;
    this.script = context.createScriptProcessor(2048, 1, 1);
    var that = this;
    this.script.onaudioprocess = function(event) {
        var input = event.inputBuffer.getChannelData(0);
        var i;
        var sum = 0.0;
        var clipcount = 0;
        for (i = 0; i < input.length; ++i) {
            sum += input[i] * input[i];
            if (Math.abs(input[i]) > 0.99) {
                clipcount += 1;
            }
        }
        that.instant = Math.sqrt(sum / input.length);
        that.slow = 0.90 * that.slow + 0.05 * that.instant;
        that.clip = clipcount / input.length;
    };
}

SoundMeter.prototype.connectToSource = function(stream, callback) {
    console.log('SoundMeter connecting');
    try {
        this.mic = this.context.createMediaStreamSource(stream);
        this.mic.connect(this.script);
        // necessary to make sample run, but should not be.
        this.script.connect(this.context.destination);
        if (typeof callback !== 'undefined') {
            callback(null);
        }
    } catch (e) {
        console.error(e);
        if (typeof callback !== 'undefined') {
            callback(e);
        }
    }
};
SoundMeter.prototype.stop = function() {
    this.mic.disconnect();
    this.script.disconnect();
};

var HZRecorder = function (stream, config) {
    config = config || {};
    config.sampleBits = config.sampleBits || 16;      //采样数位 8, 16
    config.sampleRate = config.sampleRate || (44100 / 3);   //采样率(1/3 44100)

    var currStatus = 'INIT';

    var context = new (window.webkitAudioContext || window.AudioContext)();
    var audioInput = context.createMediaStreamSource(stream);
    var createScript = context.createScriptProcessor || context.createJavaScriptNode;
    var recorder = createScript.apply(context, [4096, 1, 1]);
    var queue = new Queue(6);

    var audioData = {
        size: 0          //录音文件长度
        , buffer: []     //录音缓存file
        , cache: []
        , inputSampleRate: context.sampleRate    //输入采样率
        , inputSampleBits: 16       //输入采样数位 8, 16
        , outputSampleRate: config.sampleRate    //输出采样率
        , oututSampleBits: config.sampleBits       //输出采样数位 8, 16
        , clear: function () {
            this.buffer = [];
            this.size = 0;
            this.cache = [];
        }
        , input: function (data) {
            if (currStatus === 'INACTIVE') {
                return queue.add(data);
            }

            this.buffer.push(new Float32Array(data));
            //console.log(Date.now(), data.length);
            this.size += data.length;
        }, end: function () {
            this.cache = queue.get();
            if (this.cache.length === 0) {
                return;
            }

            var _size = 0;
            for(var i = 0; i < this.cache.length; i++) {
                _size += this.cache[i].length;
            }

            this.buffer = [].concat(this.cache, this.buffer);
            this.size = _size + this.size;
        }
        , compress: function () { //合并压缩
            //合并
            var data = new Float32Array(this.size);
            var offset = 0;
            for (var i = 0; i < this.buffer.length; i++) {
                data.set(this.buffer[i], offset);
                offset += this.buffer[i].length;
            }
            //压缩
            var compression = parseInt(this.inputSampleRate / this.outputSampleRate);
            var length = data.length / compression;
            var result = new Float32Array(length);
            var index = 0, j = 0;
            while (index < length) {
                result[index] = data[j];
                j += compression;
                index++;
            }
            return result;
        }
        , encodeWAV: function () {
            this.end();
            var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
            var sampleBits = Math.min(this.inputSampleBits, this.oututSampleBits);
            var bytes = this.compress();
            var dataLength = bytes.length * (sampleBits / 8);
            var buffer = new ArrayBuffer(44 + dataLength);
            var data = new DataView(buffer);

            var channelCount = 1;//单声道
            var offset = 0;

            var writeString = function (str) {
                for (var i = 0; i < str.length; i++) {
                    data.setUint8(offset + i, str.charCodeAt(i));
                }
            };

            // 资源交换文件标识符
            writeString('RIFF'); offset += 4;
            // 下个地址开始到文件尾总字节数,即文件大小-8
            data.setUint32(offset, 36 + dataLength, true); offset += 4;
            // WAV文件标志
            writeString('WAVE'); offset += 4;
            // 波形格式标志
            writeString('fmt '); offset += 4;
            // 过滤字节,一般为 0x10 = 16
            data.setUint32(offset, 16, true); offset += 4;
            // 格式类别 (PCM形式采样数据)
            data.setUint16(offset, 1, true); offset += 2;
            // 通道数
            data.setUint16(offset, channelCount, true); offset += 2;
            // 采样率,每秒样本数,表示每个通道的播放速度
            data.setUint32(offset, sampleRate, true); offset += 4;
            // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
            data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;
            // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
            data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;
            // 每样本数据位数
            data.setUint16(offset, sampleBits, true); offset += 2;
            // 数据标识符
            writeString('data'); offset += 4;
            // 采样数据总数,即数据总大小-44
            data.setUint32(offset, dataLength, true); offset += 4;
            // 写入采样数据
            if (sampleBits === 8) {
                for (var i = 0; i < bytes.length; i++, offset++) {
                    var s = Math.max(-1, Math.min(1, bytes[i]));
                    var val = s < 0 ? s * 0x8000 : s * 0x7FFF;
                    val = parseInt(255 / (65535 / (val + 32768)));
                    data.setInt8(offset, val, true);
                }
            } else {
                for (var i = 0; i < bytes.length; i++, offset += 2) {
                    var s = Math.max(-1, Math.min(1, bytes[i]));
                    data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
                }
            }

            return new Blob([data], { type: 'audio/wav' });
        }
    };


    var soundMeter = new SoundMeter(context);
    soundMeter.connectToSource(stream, (e) => {
        if (e) {
            return alert(e);
        }

        soundMeterHandle = setInterval(() => {
            if (currStatus !== 'ACTIVE' && currStatus !== 'INACTIVE') {
                return;
            }

            if(currStatus === 'ACTIVE' && soundMeter.slow < 0.02) {
                //console.log('----------stop it --------');
                this.vadFinish();
            }

            if (currStatus === 'INACTIVE' && soundMeter.slow > 0.022) {
                //console.log('---------active it !!!!!--------');
                this.vadActive();
            }

            //console.log(soundMeter.instant.toFixed(2), soundMeter.slow.toFixed(2), soundMeter.clip)
        }, 100);
    });

    this.sentenceCb = [];
    this.statusCb = [];

    this.onSentenceReady = function (cb) {
        this.sentenceCb.push(cb);
    };

    this.onStatusChange = function (cb) {
        this.statusCb.push(cb);
    };

    this.triggerStatusChange = function (status) {
        if (status === currStatus) {
            return;
        }

        currStatus = status;
        this.statusCb.forEach((cb) => {
            cb(status);
        });
    };

    this.triggerSentenceReady = function () {
        const data = this.getBlob();
        this.sentenceCb.forEach((cb) => {
            cb(data);
        });
    };

    this.vadFinish = function () {
        this.triggerStatusChange('INACTIVE');
        this.stop();
        this.triggerSentenceReady();
        //var audio = document.getElementById('audio');
        //this.play(audio);

        this.clear();
        this.start();
    };

    this.vadActive = function () {
        this.triggerStatusChange('ACTIVE');
    };

    //开始录音
    this.start = function () {
        this.clear();
        this.triggerStatusChange('INACTIVE');
        audioInput.connect(recorder);
        recorder.connect(context.destination);
    };

    //内部停止func
    this.stop = function () {
        recorder.disconnect();
    };

    this.end = function () {
        this.triggerStatusChange('STOP');
        recorder.disconnect();
    };


    this.clear = function () {
        audioData.clear();
    };

    //获取音频文件
    this.getBlob = function () {
        this.stop();
        return audioData.encodeWAV();
    };

    //回放
    this.play = function (audio) {
        audio.src = window.URL.createObjectURL(this.getBlob());
    };

    this.getData = function () {
        return this.getBlob();
    };

    //音频采集
    recorder.onaudioprocess = function (e) {
        audioData.input(e.inputBuffer.getChannelData(0));
        //record(e.inputBuffer.getChannelData(0));
    }
};


const MyRecorder = function (config) {
    this.recorder = null;
    this.isDeviceValid = !!navigator.getUserMedia;
    this.config = config;

};

MyRecorder.prototype.init = function(cb) {
    if (!this.isDeviceValid) {
        throw new Error('当前浏览器不支持录音功能。');
    }

    function dealError(error) {
        switch (error.code || error.name) {
            case 'PERMISSION_DENIED':
            case 'PermissionDeniedError':
                //HZRecorder.throwError('浏览器拒绝开启录音功能。');
                error.msg = '浏览器拒绝开启录音功能'; // 原错误提示：用户拒绝提供信息
                cb(error);
                break;
            case 'NOT_SUPPORTED_ERROR':
            case 'NotSupportedError':
                //HZRecorder.throwError('浏览器不支持硬件设备。');
                error.msg = '浏览器不支持硬件设备';
                cb(error);
                break;
            case 'MANDATORY_UNSATISFIED_ERROR':
            case 'MandatoryUnsatisfiedError':
                //HZRecorder.throwError('无法发现指定的硬件设备。');
                error.msg = '无法发现指定的硬件设备';
                cb(error);
                break;
            default:
                //HZRecorder.throwError('无法打开麦克风。异常信息:' + (error.code || error.name));
                error.msg = '无法打开麦克风';
                cb(error);
                break;
        }
    }

    navigator.getUserMedia({ audio: true }, function (stream){
        const recorder = new HZRecorder(stream, this.config);
        return cb(recorder);
    }, dealError);
};


MyRecorder.prototype.get = function (cb) {
    if (this.recorder) {
        return cb(this.recorder);
    }

    this.init((recorder) => {
        this.recorder = recorder;
        return cb(this.recorder);
    });
};


window.MyRecorder = MyRecorder;
