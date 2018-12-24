<!--视频列表组件-->
<template>
    <div class="video-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="video-search-container">
                <div @keyup.enter="getSubjectList" class="text-left filters-container">
                    <el-form :inline="true" class="filter-form">
                        <el-form-item>
                            <el-input
                                :value="searchFields.name"
                                clearable
                                class="border-input"
                                @input="inputHandler($event, 'name')"
                                placeholder="搜索你想要的信息">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                class="btn-style-one"
                                @click="searchHandler"
                                type="primary">
                                <svg-icon icon-class="search"></svg-icon>
                                搜索
                            </el-button>
                        </el-form-item>
                        <el-form-item label="后缀">
                            <el-select
                                :value="searchFields.suffix"
                                clearable
                                placeholder="请选择视频后缀"
                                @input="inputHandler($event, 'suffix')">
                                <el-option
                                    v-for="(item, index) in suffixOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="注入状态">
                            <el-select
                                :value="searchFields.status"
                                @change="inputHandler($event, 'status')"
                                clearable
                                placeholder="请选择注入状态">
                                <el-option
                                    v-for="item in statusOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--上传状态-->
                        <el-form-item label="上传状态">
                            <el-select
                                :value="searchFields.uploadStatus"
                                clearable
                                placeholder="请选择视频上传状态"
                                @input="inputHandler($event, 'uploadStatus')">
                                <el-option
                                    v-for="(item, index) in uploadStatusOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                class="btn-style-one"
                                @click="clearSearchFields"
                                type="primary">
                                <svg-icon icon-class="reset"></svg-icon>
                                重置
                            </el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button
                                type="text"
                                @click="moreFilters = !moreFilters"
                                class="more-filters"
                                :class="{active:moreFilters}">
                                更多筛选
                                <i class="el-icon-arrow-up" v-if="moreFilters"></i>
                                <i class="el-icon-arrow-down" v-else></i>
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-form :inline="true" class="more-filter-box filter-form" v-if="moreFilters">
                        <!--拉取状态（子站）-->
                        <el-form-item
                            v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable"
                            label="拉取状态">
                            <el-select
                                :value="searchFields.downloadStatus"
                                clearable
                                placeholder="请选择视频拉取状态"
                                @input="inputHandler($event, 'downloadStatus')">
                                <el-option
                                    v-for="(item, index) in downloadStatusOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="来源">
                            <el-select
                                :value="searchFields.originSiteId"
                                clearable
                                placeholder="请选择视频来源"
                                @input="inputHandler($event, 'originSiteId')">
                                <el-option
                                    v-for="(item, index) in sourceOptions"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--共享站点搜索（主站）-->
                        <el-form-item
                            v-if="$wsCache.localStorage.get('siteInfo') && $wsCache.localStorage.get('siteInfo').siteMasterEnable"
                            label="共享站点">
                            <el-select
                                :value="searchFields.shareSiteId"
                                clearable
                                placeholder="请选择共享站点"
                                @input="inputHandler($event, 'shareSiteId')">
                                <el-option
                                    v-for="(item, index) in shareSiteOptions"
                                    :key="index"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="时间">
                            <el-date-picker
                                prefix-icon="0"
                                :value="searchFields.dateRange"
                                type="daterange"
                                @input="inputHandler($event, 'dateRange')"
                                value-format="timestamp"
                                :unlink-panels="true"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">视频列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                        <el-dropdown
                            trigger="click"
                            class="my-dropdown" :class="{'is-disabled':isDisabled}">
                            <span class="el-dropdown-link">
                                批量操作
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu
                                slot="dropdown">
                                <el-dropdown-item>
                                    <span @click="retrySelectedVideoHandler">批量重试</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <span @click="exportSelectedVideoHandler">批量导出</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <span @click="deleteVideoList">批量删除</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <span @click="downloadSelectedTsVideo">批量下载</span>
                                </el-dropdown-item>
                                <!--共享设置（主站）-->
                                <el-dropdown-item
                                    v-if="$wsCache.localStorage.get('siteInfo') && $wsCache.localStorage.get('siteInfo').siteMasterEnable">
                                    <span @click="setShareSite">共享设置</span>
                                </el-dropdown-item>
                                <!--上传主站（子站）-->
                                <el-dropdown-item
                                    v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable">
                                    <span @click="batchPushToMaster">上传主站</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="goToVideoUploadPage">
                            <svg-icon icon-class="import_pp"></svg-icon>
                            上传
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="toDiffTime">
                            <svg-icon icon-class="add"></svg-icon>
                            检查时长
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="toDownloadVideoList">
                            <svg-icon icon-class="add"></svg-icon>
                            下载列表
                        </el-button>
                        <!--拉取视频（配置完成的子站）-->
                        <el-button
                            v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable"
                            class="btn-style-two contain-svg-icon"
                            @click="openPullVideoDialog">
                            <svg-icon icon-class="add"></svg-icon>
                            拉取视频
                        </el-button>
                    </div>
                </div>
                <video-table ref="videoTable" :shareSiteOptions="shareSiteOptions"></video-table>
                <div class="text-left table-dropdow-box">
                    <el-dropdown
                        class="my-dropdown" :class="{'is-disabled':isDisabled}"
                        trigger="click">
                            <span class="el-dropdown-link">
                                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <span @click="retrySelectedVideoHandler">批量重试</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span @click="exportSelectedVideoHandler">批量导出</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span @click="deleteVideoList">批量删除</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span @click="downloadSelectedTsVideo">批量下载</span>
                            </el-dropdown-item>
                            <!--共享设置（主站）-->
                            <el-dropdown-item
                                v-if="$wsCache.localStorage.get('siteInfo') && $wsCache.localStorage.get('siteInfo').siteMasterEnable">
                                <span @click="setShareSite">共享设置</span>
                            </el-dropdown-item>
                            <!--上传主站（子站）-->
                            <el-dropdown-item
                                v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable">
                                <span @click="batchPushToMaster">上传主站</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <el-dialog
            title="站点共享设置"
            :visible.sync="batchShareDialogVisible"
            :close-on-click-modal="false"
            custom-class="batch-share-site"
            width="40%">
            <div class="batch-share-body" v-if="batchShareDialogVisible">
                <div>{{$refs.videoTable.selectedVideoList.length}}个视频可以被以下站点共享:</div>
                <el-select v-model="siteIdList" multiple clearable placeholder="请选择共享站点">
                    <el-option
                        v-for="(item, index) in shareSiteOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="batchShareDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="batchShareVideo">确 定</el-button>
            </span>
        </el-dialog>
        <!--拉取选择的主站视频列表-->
        <el-dialog
            title="选择主站的视频"
            :close-on-click-modal=false
            :visible.sync="selectMasterVideoDialogVisible"
            center
            width="80%">
            <select-multiple-master-video
                v-if="selectMasterVideoDialogVisible"
                v-on:pullVideoFromMaster="pullVideoFromMaster"
                v-on:closeSelectVideoDialog="selectMasterVideoDialogVisible = false">
            </select-multiple-master-video>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import XLSX from 'xlsx';
    import SelectMultipleMasterVideo from './SelectMultipleMasterVideo';
    import VideoTable from './VideoTable';
    import role from '@/util/config/role';

    const FileSaver = require('file-saver');
    export default {
        name: 'VideoList',
        components: {
            VideoTable,
            SelectMultipleMasterVideo
        },
        data() {
            return {
                suffixOptions: role.VIDEO_SUFFIX_OPTIONS,
                selectMasterVideoDialogVisible: false,
                statusOptions: role.VIDEO_INJECTING_STATUS_OPTIONS,
                downloadStatusOptions: role.VIDEO_DOWNLOAD_STATUS_OPTIONS,
                uploadStatusOptions: role.VIDEO_UPLOAD_STATUS_OPTIONS,
                sourceOptions: [],
                shareSiteOptions: [],
                timer: null,
                isDisabled: true,
                batchShareDialogVisible: false,
                // 多个视频进行多个站点共享设置的共享站点Id列表
                siteIdList: [],
                moreFilters: false
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
            window.eventBus.$on('setDisabled', this.setDisabled.bind(this));
            window.addEventListener('keyup', this.keyupHandler);
            this.resetProgramme();
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
                updateUploadState: 'uploadVideo/updateUploadState',
                resetProgramme: 'programme/resetProgramme'
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
                this.searchHandler();
            },
            openPullVideoDialog() {
                if (this.$wsCache.localStorage.get('siteInfo') && this.$wsCache.localStorage.get('siteInfo').siteName) {
                    this.selectMasterVideoDialogVisible = true;
                } else {
                    this.$message.warning('请您先配置站点');
                }
            },
            // 批量设置视频共享站点
            setShareSite() {
                // 对选择的视频列表进行检测，注入成功、上传成功的视频可以设置共享
                let videoList = this.$refs.videoTable.selectedVideoList;
                for (let i = 0; i < videoList.length; i++) {
                    if (!(videoList[i].status === 'SUCCESS' || videoList[i].uploadStatus === 'SUCCESS')) {
                        this.$message.warning('共享站点设置操作只有注入成功、上传成功的视频才可进行共享设置');
                        return;
                    }
                }
                this.batchShareDialogVisible = true;
            },
            // 设置多个视频进行多个站点的共享
            batchShareVideo() {
                let videoIdList = [];
                this.$refs.videoTable.selectedVideoList.map(video => {
                    videoIdList.push(video.id);
                });
                this.$service.setBatchVideoToBatchSite({
                    siteIdList: this.siteIdList,
                    videoIdList: videoIdList
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('成功设置视频共享站点');
                        this.siteIdList = [];
                        this.batchShareDialogVisible = false;
                    }
                });
            },
            // 批量上传主站——将本地视频上传至主站(只存在于子站)
            batchPushToMaster() {
                // 对选择的视频列表进行检测，（注入成功或拉取成功）且（非上传中、非上传成功）的视频可以上传主站
                let videoList = this.$refs.videoTable.selectedVideoList;
                for (let i = 0; i < videoList.length; i++) {
                    if (!((videoList[i].status === 'SUCCESS' || videoList[i].downloadStatus === 'SUCCESS') && !(videoList[i].uploadStatus === 'ON_GOING' || videoList[i].uploadStatus === 'SUCCESS'))) {
                        this.$message.warning('批量上传主站仅支持注入/拉取成功且未上传成功的视频');
                        return;
                    }
                }
                if (this.$wsCache.localStorage.get('siteInfo') && this.$wsCache.localStorage.get('siteInfo').siteName) {
                    let videoIdList = [];
                    this.$refs.videoTable.selectedVideoList.map(video => {
                        videoIdList.push(video.id);
                    });
                    this.$service.batchPushVideoToMaster({videoIdList}).then(response => {
                        if (response && response.code === 0) {
                            if (response && response.code === 0 && response.data.length === 0) {
                                this.$message.success('正在上传视频到主站，请关注其状态更改');
                            } else if (response && response.code === 0 && response.data.length !== 0) {
                                // 批量上传存在有特殊情况说明
                                let message = '当前上传视频含有如下问题：';
                                response.data.map(video => {
                                    message = message + '[' + video.originName + ']视频问题：' + video.failReason + ';';
                                });
                                this.$message({
                                    type: 'error',
                                    message: message,
                                    duration: 5000
                                });
                            }
                        }
                    });
                } else {
                    this.$message.warning('请您先配置站点');
                }
            },
            // 拉取主站的视频到子站(只存在于子站)
            pullVideoFromMaster(videoList) {
                let videoIdList = [];
                videoList.map(video => {
                    videoIdList.push(video.id);
                });
                this.$service.batchPullVideoFromMaster({videoIdList}).then(response => {
                    if (response && response.code === 0 && response.data.length === 0) {
                        this.$message.success('正在拉取视频到本站，请关注其状态更改');
                    } else if (response && response.code === 0 && response.data.length !== 0) {
                        // 批量上传存在有特殊情况说明
                        let message = '当前上传视频含有如下问题：';
                        response.data.map(video => {
                            message = message + '[' + video.originName + ']视频问题：' + video.failReason + ';';
                        });
                        this.$message({
                            type: 'error',
                            message: message,
                            duration: 5000
                        });
                    }
                });
            },
            clearInputValue() {
                if (this.$refs.uploadInputFile && this.$refs.uploadInputFile.value) {
                    this.$refs.uploadInputFile.value = null;
                }
                if (this.$refs.uploadInputDir && this.$refs.uploadInputDir.value) {
                    this.$refs.uploadInputDir.value = null;
                }
            },
            // 批量重试
            retrySelectedVideoHandler() {
                // 对选择的视频列表进行检测，注入失败的视频才能进行批量重试
                let videoList = this.$refs.videoTable.selectedVideoList;
                for (let i = 0; i < videoList.length; i++) {
                    if (videoList[i].status !== 'FAILED') {
                        this.$message.warning('批量删除操作仅支持注入失败的视频');
                        return;
                    }
                }
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
            // 批量下载视频文件
            downloadSelectedTsVideo() {
                // 对选择的视频列表进行检测，注入成功或拉取成功或上传成功的视频文件才能批量下载
                let videoList = this.$refs.videoTable.selectedVideoList;
                for (let i = 0; i < videoList.length; i++) {
                    if (!(videoList[i].status === 'SUCCESS' || videoList[i].downloadStatus === 'SUCCESS' || videoList[i].uploadStatus === 'SUCCESS')) {
                        // 主站
                        if (this.$wsCache.localStorage.get('siteInfo').siteMasterEnable) {
                            this.$message.warning('批量下载操作仅支持注入成功、上传成功的视频');
                        } else {
                            this.$message.warning('批量下载操作仅支持注入成功、拉取成功的视频');
                        }
                        return;
                    }
                }
                this.$message.success('正在请求下载视频文件，请稍等');
                let videoIdList = [];
                this.$refs.videoTable.selectedVideoList.map(video => {
                    videoIdList.push(video.id);
                });
                this.$service.exportTsVideos({videoIdList: videoIdList, isRetry: false}).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('成功下载视频文件，稍后可到下载列表页面查看');
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
            // 批量删除视频
            deleteVideoList() {
                // 对选择的视频列表进行检测，在拉取中和下载中状态的视频不能删除
                let videoList = this.$refs.videoTable.selectedVideoList;
                for (let i = 0; i < videoList.length; i++) {
                    if (videoList[i].uploadStatus === 'ON_GOING' || videoList[i].downloadStatus === 'ON_GOING') {
                        // 主站
                        if (this.$wsCache.localStorage.get('siteInfo').siteMasterEnable) {
                            this.$message.warning('上传中的视频不能被删除');
                        } else {
                            this.$message.warning('上传中和拉取中的视频不能被删除');
                        }
                        return;
                    }
                }
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
            goToVideoUploadPage() {
                let routeData = this.$router.resolve({
                    name: 'VideoImport'
                });
                window.open(routeData.href, '_blank');
            },
            toDownloadVideoList() {
                this.$router.push({name: 'DownloadVideoList'});
            },
            toDiffTime() {
                this.$router.push({name: 'DiffTimeVideoList'});
            }
        }
    };
</script>

<style scoped lang="less">

    .video-search-container {
        padding-bottom: 20px;
        border-bottom: 1px solid #252D3F;
        .filters-container {
            background: #2A3040;
            border-radius: 8px;
        }
        .svg-icon {
            margin-right: 10px;
        }

        // 按钮
        .more-filters {
            font-size: 12px;
            color: #6F7480;
            &.active {
                color: #1989FA;
                i {
                    color: #6F7480;
                }
            }
            i {
                margin-left: 8px;
            }
        }

        .more-filter-box {
            background: #252C3D;
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }
    }

    /*批量共享视频*/
    .batch-share-site {
        .batch-share-body {
            text-align: left;
            margin-bottom: 40px;
            div {
                text-align: left;
                font-size: 18px;
            }
            .el-select {
                margin-top: 20px;
                width: 80%;
            }
        }
    }

    .el-dropdown {
        &.is-disabled {
            opacity: 0.3;
            pointer-events: none;
        }
    }

</style>
