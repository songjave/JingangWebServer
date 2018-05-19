'use strict';



const lib = require('../lib/jieba');

const input = {
	text: '自《“健康中国2030”规划纲要》发布以来，健康素养水平上升为健康中国建设的战略目标之一。2016年我国国民健康素养水平为11.58%，距离2030年达到30%的目标仍有较大距离。如民间信谣传谣、急救技能匮乏、医患沟通不顺畅等情况长期存在，造成诸多社会问题。'
}

lib.segment(input, (err, data) => {
	console.log(err, data);
})