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
        img.onload = function () {
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
    }).map((item) => item.file);
}

export function filterFile(fileList, files) {
    let newFileList = [];
    Array.from(files).forEach((file) => {
        let index = fileList.findIndex((item) => {
            return item.file.name === file.name;
        });
        if (index === -1) {
            let obj = {
                file,
                data: {
                    progress: 0,
                    status: 1 // 0 成功, 1 等待, 2 失败 3 正在上传
                }
            };
            newFileList.push(obj);
        }
    });
    return fileList.concat(newFileList);
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
