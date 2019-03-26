import _ from 'lodash';

export const videoRegex = /^video/;
export const imageRegex = /^image/;

function readBlobAsDataURL(obj) {
    return new Promise((resolve, reject) => {
        let fileRead = new FileReader();
        fileRead.readAsDataURL(obj.file);
        fileRead.onload = (e) => {
            obj.dataUri = e.target.result;
            resolve(obj);
        };
    });
}

function loadFile(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (theFile) => {
            let obj = {
                file,
                imageData: theFile.target.result
            };
            resolve(obj);
        };
        reader.onerror = (err) => {
            reject(err);
        };
    });
}

function loadImage(obj) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = obj.imageData;
        img.onload = function() {
            resolve({
                demension: {
                    width: img.width,
                    height: img.height
                },
                file: obj.file
            });
        };
        img.onerror = function (err) {
            reject(err);
        };
    });
}

function loadVideo(obj) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const url = URL.createObjectURL(obj.file);
        video.src = url;
        video.load();
        video.onloadedmetadata = function() {
            URL.revokeObjectURL(url);
            resolve({
                demension: {
                    width: video.videoWidth,
                    height: video.videoHeight,
                    duration: video.duration
                },
                file: obj.file
            });
        };
        video.onerror = function(err) {
            reject(err);
        };
    });
}

export function promiseImageSize(files) {
    return Promise.all(Array.from(files).map((file) => loadFile(file)))
                .then((list) => {
                    return Promise.all(list.map((obj) => loadImage(obj)));
                });
}

export function filterSizeMatchFiles(list, sizeList) {
    return list.filter((item) => {
        let {width, height} = item.demension;
        let index = sizeList.findIndex((size) => {
            return size.width === width && size.height === height;
        });
        if (index > -1) {
            return item;
        }
    });
}

export function filterFile(fileList, files) {
    let newFileList = [];
    Array.from(files).forEach((ele) => {
        let index = fileList.findIndex((item) => {
            return _.get(item, 'file.name') === _.get(ele, 'file.name');
        });
        if (index === -1) {
            let obj = _.cloneDeep(ele);
            obj.data = {
                progress: 0,
                status: 1 // 0 成功, 1 等待, 2 失败 3 正在上传
            };
            newFileList.push(obj);
        }
    });
    return fileList.concat(newFileList);
}

export function getImageDemensionByName(fileList, name) {
    let target = fileList.find((obj) => {
        return _.get(obj, 'file.name') === name;
    });
    return target ? target.demension : {width: 100, height: 100};
};

export function readBlobAsDataURLFromList(images) {
    return Promise.all(images.map((image) => {
        return readBlobAsDataURL(image);
    }));
}

export function promiseFileSize(files) {
    return Promise.all(Array.from(files).map((file) => loadFile(file)))
                .then((list) => {
                    return Promise.all(list.map((obj) => {
                        if (videoRegex.test(obj.file.type)) {
                            return loadVideo(obj);
                        } else {
                            return loadImage(obj);
                        }
                    }));
                });
}

/**
 * 上传广告资源时候的校验方法
 */
export function filterNotMatchFiles(files) {
    let allowImageDimensions = [{width: 432, height: 198}, {width: 320, height: 140}, {width: 1200, height: 600}, {width: 1920, height: 1080}];
    let allowVideoDimensions = [{width: 1280, height: 720}];
    let allowGifDimensions = [{width: 432, height: 198}];
    let videoList = files.filter((obj) => {
        return /^video/.test(obj.file.type);
    });
    let imageList = files.filter((obj) => {
        return /(png|jpe?g|webp)$/.test(obj.file.type);
    });
    let gifImageList = files.filter((obj) => {
        return /(gif)$/.test(obj.file.type);
    });

    function imageFilter(imageFiles) {
        let imageMatchedFiles = [];
        let imageNotMatchedFiles = [];

        for (let i = 0; i < imageFiles.length; i++) {
            let item = imageFiles[i];
            let demensionMatchedIndex = allowImageDimensions.findIndex((_item) => {
                return _item.width === item.demension.width && _item.height === item.demension.height;
            });

            if (demensionMatchedIndex < 0) {
                 imageNotMatchedFiles.push({
                     name: item.file.name,
                     message: '图片尺寸不符合要求'
                 });
                 continue;
            }

            if (item.demension.width === 432 && item.demension.height === 198) {
                check432_198(item);
            } else if (item.demension.width === 320 && item.demension.height === 140) {
                check320_140(item);
            } else if (item.demension.width === 1920 && item.demension.height === 1080) {
                check1920_1080(item);
            } else if (item.demension.width === 1200 && item.demension.height === 600) {
                check1200_600(item);
            } else {
                 imageNotMatchedFiles.push({
                     name: item.file.name,
                     message: '图片尺寸不符合要求'
                 });
                 continue;
            }
        }

        function check432_198(obj) { // eslint-disable-line
            if (obj.file.size <= 200 * 1024) {
                imageMatchedFiles.push(obj);
            } else {
                imageNotMatchedFiles.push({
                    name: obj.file.name,
                    message: '432*198尺寸的图片必须小于200K'
                });
            }
        }

        function check320_140(obj) { // eslint-disable-line
            if (!(/png$/.test(obj.file.type))) {
                imageNotMatchedFiles.push({
                    name: obj.file.name,
                    message: '320*140尺寸的图片格式必须为PNG'
                });
            }

            if ((/png$/.test(obj.file.type)) && obj.file.size > 100 * 1024) {
                imageNotMatchedFiles.push({
                    name: obj.file.name,
                    message: '320*140尺寸的图片大小必须小于100K'
                });
            } else {
                imageMatchedFiles.push(obj);
            }
        }

        function check1920_1080(obj) { // eslint-disable-line
            if (obj.file.size <= 1024 * 1024) {
                imageMatchedFiles.push(obj);
            } else {
                imageNotMatchedFiles.push({
                    name: obj.file.name,
                    message: '1920*1080尺寸的图片必须小于1M'
                });
            }
        }

        function check1200_600(obj) { // eslint-disable-line
            if (obj.file.size <= 1024 * 1024) {
                imageMatchedFiles.push(obj);
            } else {
                imageNotMatchedFiles.push({
                    name: obj.file.name,
                    message: '1920*1080尺寸的图片必须小于1M'
                });
            }
        }

        return { imageMatchedFiles, imageNotMatchedFiles };
    }

    function gifFilter(gifFiles) {
        let gifMatchedFiles = [];
        let gifNotMatchedFiles = [];
        gifFiles.forEach((item) => {
            let demensionMatchedIndex = allowGifDimensions.findIndex((_item) => {
                return _item.width === item.demension.width && _item.height === item.demension.height;
            });

            let sizeMatched = item.file.size <= 1024 * 1024;
            if (demensionMatchedIndex < 0) {
                gifNotMatchedFiles.push({
                    name: item.file.name,
                    message: 'gif图尺寸不符合要求'
                });
            }

            if (demensionMatchedIndex >= 0 && !sizeMatched) {
                gifNotMatchedFiles.push({
                    name: item.file.name,
                    message: 'gif图必须小于或等于1M'
                });
            }

            if (demensionMatchedIndex >= 0 && sizeMatched) {
                gifMatchedFiles.push(item);
            }
        });
        return { gifMatchedFiles, gifNotMatchedFiles };
    }

    function videoFilter(videoFiles) {
        let videoMatchedFiles = [];
        let videoNotMatchedFiles = [];
        videoFiles.forEach((item) => {
            let demensionMatchedIndex = allowVideoDimensions.findIndex((_item) => {
                return _item.width <= item.demension.width && _item.height <= item.demension.height;
            });

            let sizeMatched = item.file.size <= (60 * 1024 * 1024);
            let durationMatched = item.demension.duration <= 60;

            if (demensionMatchedIndex < 0) {
                videoNotMatchedFiles.push({
                    name: item.file.name,
                    message: '视频分辨率不符合要求'
                });
            }

            if (demensionMatchedIndex >= 0 && !sizeMatched) {
                videoNotMatchedFiles.push({
                    name: item.file.name,
                    message: '视频必须小于或等于60M'
                });
            }

            if (demensionMatchedIndex >= 0 && sizeMatched && !durationMatched) {
                videoNotMatchedFiles.push({
                    name: item.file.name,
                    message: '视频时长必须小于或等于60S'
                });
            }

            if (demensionMatchedIndex >= 0 && sizeMatched && durationMatched) {
                videoMatchedFiles.push(item);
            }
        });
        return { videoMatchedFiles, videoNotMatchedFiles };
    }
    let { gifMatchedFiles, gifNotMatchedFiles } = gifFilter(gifImageList);
    let { videoMatchedFiles, videoNotMatchedFiles } = videoFilter(videoList);
    let { imageMatchedFiles, imageNotMatchedFiles } = imageFilter(imageList);

    return {
        matchedFiles: [...gifMatchedFiles, ...videoMatchedFiles, ...imageMatchedFiles],
        notMatchedFiles: [...gifNotMatchedFiles, ...videoNotMatchedFiles, ...imageNotMatchedFiles]
    };
}

export function uploadRequest(options) {
    return new Promise((resolve, reject) => {
        let {uri, formData, headers, progressHandler} = options;
        if (!uri || !formData) {
            throw new Error('上传地址或者文件不能为空');
        }
        let xhr = new XMLHttpRequest();
        xhr.open('post', uri);
        for (let key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }

        xhr.onload = (evt) => {
            resolve(evt.target.responseText);
        };

        xhr.onerror = (err) => {
            reject(err);
        };

        xhr.onabort = () => {
            reject(new Error('cancel_flag'));
        };

        xhr.upload.onprogress = progressHandler && typeof progressHandler === 'function' ? progressHandler : () => {};

        xhr.send(formData);
    });
}
