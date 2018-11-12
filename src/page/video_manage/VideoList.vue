<!--视频列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'视频资源管理'},
            {name:'视频列表'}]">
        </custom-breadcrumb>
        <el-col :span="24">
            <div style="margin-bottom:20px;" class="float-right">
                <el-dropdown>
                    <el-button
                        class="page-main-btn create-blue-btn contain-svg-icon"
                    >
                        <svg-icon icon-class="upload"></svg-icon>
                        上传视频<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <div class="wrapper">
                                <label for="upload-input-file">选择文件</label>
                                <input id="upload-input-file" class="upload-input" type="file"
                                       accept="video/*,application/zip"
                                       ref="uploadInputFile" multiple>
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <div class="wrapper">
                                <label for="upload-input-dir">选择文件夹</label>
                                <input id="upload-input-dir" class="upload-input" type="file"
                                       accept="video/*,application/zip"
                                       ref="uploadInputDir" multiple directory webkitdirectory allowdirs>
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-col>
        <el-form id="label-font" :inline="true" class="demo-form-inline search-form text-left"
                 @keyup.enter.native="searchHandler" @submit.native.prevent>
            <el-col :span="24">
                <el-form-item class="search">
                    <el-input
                        :value="searchFields.name"
                        placeholder="搜索你想要的信息"
                        clearable
                        @input="inputHandler($event, 'name')"
                    >
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item class="search">
                    <el-select
                        :value="searchFields.status"
                        clearable
                        placeholder="请选择视频注入状态"
                        @input="inputHandler($event, 'status')"
                    >
                        <el-option
                            v-for="(item, index) in statusOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search">
                    <el-select
                        :value="searchFields.suffix"
                        clearable
                        placeholder="请选择视频后缀"
                        @input="inputHandler($event, 'suffix')"
                    >
                        <el-option
                            v-for="(item, index) in suffixOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-date-picker
                        :value="searchFields.dateRange"
                        type="daterange"
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        @input="inputHandler($event, 'dateRange')"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button class="page-main-btn" type="primary" icon="el-icon-search" @click="searchHandler" plain>
                        搜索
                    </el-button>
                    <el-button class="clear-filter page-main-btn clear-btn" type="primary" @click="clearSearchFields"
                               plain>
                        <svg-icon
                            icon-class="clear_filter"
                            class-name="svg-box">
                        </svg-icon>
                        清空筛选条件
                    </el-button>
                </el-form-item>
                <el-form-item class="float-right">
                    <el-button class="delete-btn create-blue-btn" :disabled="isDisabled" size="small"
                               @click="retrySelectedVideoHandler">批量重试
                    </el-button>
                    <el-button class="delete-btn create-blue-btn" :disabled="isDisabled" size="small"
                               @click="exportSelectedVideoHandler">批量导出
                    </el-button>
                    <el-button class="delete-btn create-blue-btn" :disabled="isDisabled" size="small"
                               @click="exportSelectedTsVideo">批量下载
                    </el-button>
                    <el-button class="delete-btn disabled-red-btn" size="small" :disabled="isDisabled"
                               @click="deleteVideoList">批量删除
                    </el-button>
                    <el-button class="delete-btn create-blue-btn" size="small" @click="toDiffTime">
                        检查时长
                    </el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <video-table ref="videoTable"></video-table>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import XLSX from 'xlsx';
    import VideoTable from './VideoTable';
    import role from '@/util/config/role';

    const FileSaver = require('file-saver');
    const Uppie = require('../../assets/js/uppie');
    const uppie = new Uppie();
    export default {
        name: 'VideoList',
        components: {
            VideoTable
        },
        data() {
            return {
                statusOptions: role.VIDEO_UPLOAD_STATUS_OPTIONS,
                suffixOptions: role.VIDEO_SUFFIX_OPTIONS,
                timer: null,
                isDisabled: true
            };
        },
        computed: {
            ...mapGetters({
                video: 'video/video',
                searchFields: 'video/searchFields',
                uploadState: 'uploadVideo/uploadState',
                selectedVideoIdList: 'video/selectedVideoIdList'
            })
        },
        created() {
            window.eventBus.$on('clearInputValue', this.clearInputValue.bind(this));
            window.eventBus.$on('setDisabled', this.setDisabled.bind(this));
            this.$nextTick(() => {
                uppie(document.querySelector('#upload-input-file'), this.uploadChangeHandler.bind(this));
                uppie(document.querySelector('#upload-input-dir'), this.uploadChangeHandler.bind(this));
            });
            window.addEventListener('keyup', this.keyupHandler);
            this.timer = setInterval(() => {
                this.getVideoList()
                    .then(() => {
                        this.$refs.videoTable.checkedVideoList();
                    });
            }, 1000 * 10);
        },
        beforeRouteLeave(to, from, next) {
            clearInterval(this.timer);
            this.timer = null;
            next();
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        methods: {
            ...mapMutations({
                updateSearchFields: 'video/updateSearchFields',
                resetSearchFields: 'video/resetSearchFields',
                updateUploadState: 'uploadVideo/updateUploadState'
            }),
            ...mapActions({
                getVideoList: 'video/getVideoList',
                retryVideoByIdList: 'video/retryVideoByIdList'
            }),
            setDisabled(value) {
                this.isDisabled = value;
            },
            clearSearchFields() {
                this.resetSearchFields();
            },
            clearInputValue() {
                if (this.$refs.uploadInputFile && this.$refs.uploadInputFile.value) {
                    this.$refs.uploadInputFile.value = null;
                }
                if (this.$refs.uploadInputDir && this.$refs.uploadInputDir.value) {
                    this.$refs.uploadInputDir.value = null;
                }
            },
            retrySelectedVideoHandler() {
                let idList = this.$refs.videoTable.selectedVideoList.filter((video) => {
                    return this.needRetry(video);
                }).map((item) => item.id);
                if (idList.length > 0) {
                    this.retryVideoByIdList(idList)
                        .then((res) => {
                            if (res && res.code === 0) {
                                this.$message.success('批量重新注入成功');
                            } else {
                                this.$message.error('批量重新注入失败');
                            }
                            this.getVideoList()
                                .then(() => {
                                    this.$refs.videoTable.checkedVideoList();
                                });
                        });
                } else {
                    this.$message.warning('没有可以重新注入的视频存在');
                }
            },
            needRetry(video) {
                let {status, transcodeStatus} = video;
                return (status === 'INJECTING' && transcodeStatus === 'FAILED') || status === 'FAILED';
            },
            // 导出ts视频文件
            exportSelectedTsVideo() {
                this.$message.success('正在请求下载视频文件，请稍等');
                let videoIdList = [];
                this.$refs.videoTable.selectedVideoList.map(video => {
                    videoIdList.push(video.id);
                });
                this.$service.exportTsVideos({videoIdList: videoIdList}).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('成功下载视频文件，请查看');
                    }
                });
            },
            exportSelectedVideoHandler() {
                let videoList = this.$refs.videoTable.selectedVideoList.map((video) => {
                    let obj = {};
                    obj['编号'] = video.id;
                    obj['视频名称'] = video.originName;
                    obj['视频地址'] = this.joinVideoUrl(video);
                    obj['视频时长'] = this.$util.fromSecondsToTime(video.takeTimeInSec);
                    obj['上传日期'] = this.timeStampFormat(video.createdAt);
                    return obj;
                });
                this.downloadExl(videoList);
            },
            deleteVideoList() {
                let idList = this.$refs.videoTable.selectedVideoList.map((item) => {
                    return item.id;
                });
                if (idList.length > 0) {
                    this.$confirm(`您确定要删除吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        if (idList.length > 0) {
                            this.$service.deleteVideoByIdList(idList)
                                .then((res) => {
                                    if (res && res.code === 0) {
                                        this.getVideoList()
                                            .then(() => {
                                                this.$refs.videoTable.checkedVideoList();
                                            });
                                        this.$message.success('删除成功');
                                    } else {
                                        this.$message.error('删除失败');
                                    }
                                });
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            keyupHandler(e) {
                if (e.keyCode === 13) {
                    this.searchHandler();
                }
            },
            inputHandler(value, key) {
                this.updateSearchFields({key, value});
            },
            searchHandler() {
                this.getVideoList()
                    .then(() => {
                        this.$refs.videoTable.checkedVideoList();
                    });
            },
            uploadChangeHandler(e) {
                let files = Array.from(e.target.files).filter((file) => {
                    return /(.mpg|.ts|.zip)$/.test(file.name);
                });
                if (files.length === 0) {
                    this.$message.warning('本次选择没有符合要求的文件');
                }
                let newFileList = [];
                files.forEach((file) => {
                    let index = this.uploadState.files.findIndex((item) => {
                        return item.file.name === file.name;
                    });
                    if (index === -1) {
                        let obj = {
                            file,
                            progress: {
                                percent: 0,
                                status: 'waiting',
                                message: ''
                            }
                        };
                        newFileList.push(obj);
                    }
                });
                let newFiles = this.uploadState.files.concat(newFileList);
                this.updateUploadState({key: 'files', value: newFiles});
                window.eventBus.$emit('startUpload');
                this.clearInputValue();
            },
            //  导出部分代码
            getCharCol(n) {
                let s = '';
                let m = 0;
                while (n > 0) {
                    m = n % 26 + 1;
                    s = String.fromCharCode(m + 64) + s;
                    n = (n - m) / 26;
                }
                return s;
            },
            string2ArrayBuffer(s) {
                let buf = new ArrayBuffer(s.length);
                let view = new Uint8Array(buf);
                for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            },
            downloadExl(data, type) {
                let keys = Object.keys(data[0]);
                let firstRow = {};
                keys.forEach(function (item) {
                    firstRow[item] = item;
                });
                data.unshift(firstRow);

                let content = {};

                // 把json格式的数据转为excel的行列形式
                let sheetsData = data.map(function (item, rowIndex) {
                    return keys.map(function (key, columnIndex) {
                        return Object.assign({}, {
                            value: item[key],
                            position: (columnIndex > 25 ? this.getCharCol(columnIndex) : String.fromCharCode(65 + columnIndex)) + (rowIndex + 1)
                        });
                    });
                }).reduce(function (prev, next) {
                    return prev.concat(next);
                });

                sheetsData.forEach(function (item, index) {
                    content[item.position] = {v: item.value};
                });
                // 设置区域,比如表格从A1到D10,SheetNames:标题
                let coordinate = Object.keys(content);
                let workBook = {
                    SheetNames: ['视频列表'],
                    Sheets: {
                        '视频列表': Object.assign({}, content, {'!ref': coordinate[0] + ':' + coordinate[coordinate.length - 1]})
                    }
                };
                // 这里的数据是用来定义导出的格式类型
                let excelData = XLSX.write(workBook, {bookType: 'xlsx', bookSST: false, type: 'binary'});
                let blob = new Blob([this.string2ArrayBuffer(excelData)], {type: ''});
                FileSaver.saveAs(blob, '导出视频列表.xlsx');
            },
            timeStampFormat(seconds) {
                let date = new Date(seconds);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            },
            joinVideoUrl(video) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                let urlList = [video.m3u8For4K, video.m3u8For1080P, video.m3u8For720P, video.m3u8For480P];
                let urlStr = urlList.filter((item) => item).map((item) => {
                    return `${baseUri}${item}`;
                }).join(', ');
                return urlStr;
            },
            toDiffTime() {
                this.$router.push({name: 'DiffTimeVideoList'});
            }
        }
    };
</script>
<style scoped lang="less">
    .wrapper {
        position: relative;
        width: 80px;
        height: 32px;
        margin-right: 10px;
        label, .upload-input {
            position: absolute;
            top: 0;
            left: 0;
            width: 80px;
            height: 32px;
        }
        .upload-input {
            opacity: 0;
            cursor: pointer;
        }
    }
</style>
