"use strict";

const fs = require('fs');
const path = require('path');
const config = require('../../config/config');
const ERROR = require('../../config/error');
const funCommon = require('./funCommon');

const exitResult = (dirs, cb) => {
    for (let dir of dirs) {
        if (!fs.existsSync(dir + 'result.json')) {
            return cb(false);
        }
    }
    return cb(true);
};

const readImages = (dir, cb) => {
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(err);
            return cb(err);
        }
        let images = [];
        files.forEach((file, i) => {
            const ext = funCommon.getExt(file);
            if (ext === '.jpg') {
                //console.log('push file----', file);
                images.push(file);
            }
            if (i === files.length - 1) {
                return cb(0, {
                    images: images
                });
            }
        });
    });
};

const formatSummary = ((summaryArray) => {
    //console.log('summaryArray:', summaryArray);
    let sentenceArr = [];
    if (summaryArray.length) {
        summaryArray.sort(function(a, b){
            let keyA = a[1];
            let keyB = b[1];
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
        summaryArray.forEach((item) => {
            let phrase = `${item[1]}个${item[0]}`;
            sentenceArr.push(phrase);
        })
    }
    return sentenceArr.join('，');
});

const getImages = (type, id, cb) => {
    const keyframeDir = path.join(config.webStoragePath, `./${type}/result/${id}/keyframe/`);
    const imgMarkDir = path.join(config.webStoragePath, `./${type}/result/${id}/imgMark/`);
    let imgDescDir = path.join(config.webStoragePath, `./${type}/result/${id}/imgDesc/`);

    if (type === 'video_info_extract') {
        return exitResult([keyframeDir, imgMarkDir, imgDescDir], (isExit) => {
            if (!isExit) {
                return cb(0);
            }
            let result = {};
            const resultJson = JSON.parse(fs.readFileSync(imgMarkDir + 'result.json'));
            result.summary = formatSummary(resultJson.summary);
            readImages(imgMarkDir, (err, markData) => {
                if (err) {
                    console.error(err);
                    return cb(err);
                }
                if (markData === {}) {
                    readImages(keyframeDir, (err, frameData) => {
                        if (err) {
                            console.error(err);
                            return cb(err);
                        }
                        if (frameData === {}) {
                            result.dir = funCommon.delStorage(keyframeDir);
                            return cb(0, result);
                        }
                        result.dir = funCommon.delStorage(keyframeDir);
                        result.images = frameData.images;
                        return cb(0, result);
                    })
                }
                result.dir = funCommon.delStorage(imgMarkDir);
                result.images = markData.images;
                return cb(0, result);
            })
        });
    }
    if (type === 'img_info_extract') {
        return exitResult([imgMarkDir], (isExit) => {
            if (!isExit) {
                return cb(0);
            }
            let result = {};
            const resultJson = JSON.parse(fs.readFileSync(imgMarkDir + 'result.json'));
            result.summary = formatSummary(resultJson.summary);

            return readImages(imgMarkDir, (err, markData) => {
                if (err) {
                    console.error(err);
                    return cb(err);
                }
                if (markData === {}) {
                    result.dir = funCommon.delStorage(imgMarkDir);
                    return cb(0, result);
                }
                result.dir = funCommon.delStorage(imgMarkDir);
                result.images = markData.images;
                return cb(0, result);
            })
        });
    }
    /*console.log('imgDescDir:', imgDescDir);
    fs.readFile(imgDescDir + 'result.json', 'utf8', (err, data) => {
        if (err) {
            return cb(0);
        }
        const result = {};
        result.resultJson = JSON.parse(data);
        fs.readdir(imgMarkDir, (err, files) => {
            result.dir = imgMarkDir.replace(config.webStoragePath, '');
            console.log('files----', files);
            if (err) {
                console.error(err);
                return cb(err);
            }
            if (!files.length) {
                return cb(ERROR.UNKNOWN);
            }
            readImgs(files, (images) => {
                if (images.length) {
                    result.images = images;
                    return cb(0, result);
                }
                fs.readdir(keyframeDir, (err, nextfiles) => {
                    result.dir = keyframeDir.replace(config.webStoragePath, '');
                    if (err) {
                        console.error(err);
                        return cb(err);
                    }
                    if (!nextfiles.length) {
                        return cb(ERROR.UNKNOWN);
                    }
                    readImgs(nextfiles, (images) => {
                        result.images = images;
                        return cb(0, result);
                    });
                });
            });
        });
    });*/
};

const videoInfo = (result, cb) => {
    result.docs.forEach((doc, index) => {
        console.log('doc:', doc);
        //console.log('id:', doc.id);
        const dir = path.join(config.webStoragePath, `./video_info_extract/result/${doc.fileId}/`);
        // 读imgMarkDir的result.json
        const resultJson = JSON.parse(fs.readFileSync(path.join(dir, './imgMark/result.json')));
        doc.summary = formatSummary(resultJson.summary);
        doc.dir = funCommon.delStorage(dir); //到id
        // 读imgMarkDir的图片
        readImages(path.join(dir, `imgMark/`), (err, data) => {
            doc.markImages = data.images;
            if (index === result.docs.length - 1) {
                return cb(0, result);
            }
        });
    });
};

module.exports = {
    getImages,
    videoInfo
};
