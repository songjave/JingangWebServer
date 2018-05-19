'use strict';


let str = `自《“健康中国2030”规划纲要》发布以来，健康素养水平上升为健康中国建设的战略目标之一。2016年我国国民健康素养水平为11.58%，距离2030年达到30%的目标仍有较大距离。如民间信谣传谣、急救技能匮乏、医患沟通不顺畅等情况长期存在，造成诸多社会问题。

医学健康知识的科普成为解决这些问题的关键手段，互联网成为越来越多公众获取相关医学健康知识的重要渠道，据企鹅智酷调查报告显示，39%的用户在患病时会先自行网上搜索。然而信息繁杂找不到、专业知识看不懂、医疗广告分不清的三大问题成为公众面对互联网医学科普的最大困扰。`


//str = '企鹅医典主要1514.37通过——文字、图片、影音、互动等形式，'

//str = ['9, 10, 15,16,17,18, 19, 20, 21, 211, 2511, ,20100, 345611, 3800000, 38989810'] //sublimeText. vscode, Webstrom(IDE) nodejs vue

const nodejieba = require("nodejieba");




const chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
const chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
const chnUnitChar = ["", "十", "百", "千"];


function SectionToChinese(section){
  var strIns = '', chnStr = '';
  var unitPos = 0;
  var zero = true;
  while(section > 0){
    var v = section % 10;
    if(v === 0){
      if(!zero){
        zero = true;
        chnStr = chnNumChar[v] + chnStr;
      }
    }else{
      zero = false;
      strIns = chnNumChar[v];
      strIns += chnUnitChar[unitPos];
      chnStr = strIns + chnStr;
    }
    unitPos++;
    section = Math.floor(section / 10);
  }
  return chnStr;
}


function NumberToChinese(num){
  var _num = num;
  var unitPos = 0;
  var strIns = '', chnStr = '';
  var needZero = false;

  if(num === 0){
    return chnNumChar[0];
  }

  while(num > 0){
    var section = num % 10000;
    if(needZero){
      chnStr = chnNumChar[0] + chnStr;
    }
    strIns = SectionToChinese(section);
    strIns += (section !== 0) ? chnUnitSection[unitPos] : chnUnitSection[0];
    chnStr = strIns + chnStr;
    needZero = (section < 1000) && (section > 0);
    num = Math.floor(num / 10000);
    unitPos++;
  }

  if (_num >= 10 & _num < 20) {
  	chnStr = chnStr.replace(/^一/, '');
  }

  return chnStr;
}


const isSeperator = (str) => {
	return str.length === 1 && /[，。？！；“”,?!;\n,'"]/.test(str);
};

const isInvalidChar = (str) => {
	return /[：—、:《》{}<>@#$%^&*~（ ）()]/.test(str);
};

const isDigit = (str) => {
	return str.length === 1 && /[0-9]/.test(str);
};

const DIGIT_MAP = {
    '０': 0,
    '１'	: 1,
    '２'	: 2,
    '３'	: 3,
    '４': 4,
    '５'	: 5,
    '６'	: 6,
    '７'	: 7,
    '８'	: 8,
    '９'	: 9
};

const cut = (text) => {
    text = text.replace(/[０１２３４５６７８９]/g, function (m) {
        return (DIGIT_MAP[m] || 0).toString();
    });

	const arr = nodejieba.cut(text);
	const ret = [[]];
	let index = 0;
	let dList = [];

	arr.forEach((word)=> {
		word = word.trim();
		if (!word) {
            if (dList.length > 0) {
                const num = +(dList.join(''));
                ret[index].push(NumberToChinese(num));
                dList = []
            }
			return;
		}

		if (isDigit(word)) {
			return dList.push(word);
		}

		if (dList.length > 0) {
			const num = +(dList.join(''));
			ret[index].push(NumberToChinese(num));
			dList = []
		}

		if (isSeperator(word)) {
			if (ret[index].length !== 0) {
				index++;
				ret[index] = [];
			}
		}
		else if (isInvalidChar(word)) {
			return;
		}
		else {
			ret[index].push(word);
		}
	});


	if (dList.length > 0) {
		const num = +(dList.join(''));
		ret[index].push(NumberToChinese(num));
		dList = [];
	}

	for (let i = 0; i < ret.length; i++) {
		ret[i] = ret[i].join(' ');
	}

	if (ret[ret.length - 1] === '') {
		ret.length = ret.length - 1;
	}

	//console.log(ret);
	return ret.join(' ');
};


const segment = (input, cb) => {
    const list = [];
    input.textList.forEach((text) => {
        list.push(cut(text));
    });

	return cb(0, {list});
};

const segmentSync = (input) => {
    const list = [];
    input.textList.forEach((text) => {
        list.push(cut(text));
    });

    return list;
};


/*segment({textList: ['经过近十年不懈的努力终于在６７年研制出了自己的第代通用机枪', '哈哈哈']}, (err, data) => {
    console.log(err, data);
});*/


module.exports = {
	segment,
    segmentSync
};
