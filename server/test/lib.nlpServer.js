/**
 * Created by pengfeixiang on 18/1/7.
 */

'use strict';

const fs = require('fs');
const lib = require('../lib/nlpServer');

const p = (err, data = {}) => {
    console.log(err, JSON.stringify(data));
};

const input = {
    question: '风从戈壁荒漠深处吹来，令人感到凉爽。路边林带里的白杨树轻轻晃了晃头发，窸窸窣窣。林带里，清凉的水已经完全渗入地下。风拂过，吹来丝丝水汽，清润无比。喝了一天水，白杨树的叶子油亮亮的，树干上的眼睛湿润润的，泛着柔柔的光。天空趁机展示它的颜料盒子。绯红、浅紫、靛青、深蓝，穹庐似的天空，成了色彩变化的环幕。白杨树的眼睛随着光线色彩变化着眼神，金色的眼眉惊喜，紫色的眼神妖媚，蓝色的眸子深邃。'
};

//lib.add(input, p);
//lib.inspect({}, p);
// lib.reload({}, p);
//lib.ping(p);

lib.segmentation(input, p);
