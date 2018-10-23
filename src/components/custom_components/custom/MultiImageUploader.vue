<template>
    <div class="multi-image-uploader-container">
        <div>
            <input type="file" id="multi-image-uploader" multiple accept="image/*"> 上传
        </div>
        <ul>
            <li class="image-item" v-for="(item, index) in showFileList" :key="index">
                <span>{{index}} : {{item.data.progress}}</span>
            </li>
        </ul>
    </div>
</template>
<script>
import {uploadRequest, promiseImageSize, filterFile, filterSizeMatchFiles} from '../../../util/upload';
export default {
    name: 'MultiImageUploader',
    data() {
        return {
            imageList: [],
            fileList: [],
            count: 0,
            isUploading: false
        };
    },
    created() {
        this.$nextTick(() => {
            let testUpload = document.querySelector('#multi-image-uploader');
            testUpload.addEventListener('change', this.uploadChangeHandler.bind(this));
        });
    },
    computed: {
        showFileList() {
            return this.fileList.filter((obj) => {
                return obj.data.status === 1 || obj.data.status === 3;
            });
        }
    },
    methods: {
        async uploadChangeHandler(e) {
            let images = await promiseImageSize(e.target.files);
            let fileList = filterSizeMatchFiles(images, [{width: 807, height: 455}, {width: 200, height: 200}]);
            if (fileList.length === 0) {
                this.$message.error('本次选择图片不符合尺寸要求');
                return false;
            }
            let newFileList = filterFile(this.fileList, fileList);
            this.fileList = Array.from(newFileList);

            if (!this.isUploading) {
                this.uploadHandler();
            }
        },
        async uploadHandler() {
            if (this.fileList[this.count] === undefined) {
                this.isUploading = false;
                return false;
            }

            //  获取上传文件的服务器地址
            let baseUri = await this.$util.getUploadServer();
            // 构造上传的数据和配置项
            let formData = new FormData();
            let {file} = this.fileList[this.count];
            formData.append('file', file);
            let headers = this.$util.getUploadHeaders(this.$store.state.user.token);
            let options = {
                formData,
                headers,
                uri: `${baseUri}/v1/storage/image`,
                progressHandler: (event) => {
                    let percent = event.loaded / event.total * 100;
                    this.updateProgress(Math.round(percent));
                }
            };

            //  准备开始上传了
            this.updateStatus(3);
            this.isUploading = true;
            try {
                let resStr = await uploadRequest(options);
                let res = JSON.parse(resStr);
                //  上传成功 0 成功, 1 等待, 2 失败 3 正在上传
                if (res && (res.code === 0)) {
                    if (res.data[0] && (res.data[0].failCode === 0 || res.data[0].failCode === 3300)) {
                        let data = res.data[0].image;
                        let obj = {};
                        obj.id = data.id;
                        obj.uri = data.uri;
                        obj.name = data.fileName;
                        this.imageList.push(obj);
                        console.log(this.imageList);
                    } else {
                        this.$message.error(res.data[0].failReason);
                    }
                } else {
                    this.$message.error('图片保存失败');
                }
                this.updateStatus(0);
                this.count++;
                this.uploadHandler();
            } catch (err) {
                //  上传失败
                console.log(err);
                this.updateStatus(2);
                console.log('error');
                this.count++;
                this.uploadHandler();
            }
        },
        updateProgress(progress) {
            this.fileList = this.fileList.map((item, index) => {
                if (index === this.count) {
                    item.data.progress = progress;
                }
                return item;
            });
        },
        updateStatus(status) {
            this.fileList = this.fileList.map((item, index) => {
                if (index === this.count) {
                    item.data.status = status;
                }
                return item;
            });
        }
    }
};
</script>
<style scoped>
.image-item {
    display: inline-block;
    width: 60px;
    height: 60px;
    background: red;
}
</style>
