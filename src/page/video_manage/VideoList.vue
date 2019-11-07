<!--视频列表组件-->
<template>
    <div class="video-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <video-filter-params
                ref="videoFilterParams"
                v-on:getVideoList="getVideoList">
            </video-filter-params>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">视频列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                        <el-dropdown
                            trigger="click"
                            class="my-dropdown"
                            :class="{'is-disabled':isBatchDisabled}">
                            <span class="el-dropdown-link">
                                批量操作
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu
                                slot="dropdown">
                                <el-dropdown-item>
                                    <span @click="retryInjectSelectedVideoHandler">批量重试</span>
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
                                <!--重试拉取（子站）-->
                                <el-dropdown-item
                                    v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable">
                                    <span @click="batchPullVideoFromMainSite">重试拉取</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="goToVideoUploadPage">
                            <svg-icon icon-class="inject_video"></svg-icon>
                            注入视频
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="toDiffTime">
                            <svg-icon icon-class="check_length"></svg-icon>
                            检查时长
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="toDownloadVideoList">
                            <svg-icon icon-class="download_video"></svg-icon>
                            下载列表
                        </el-button>
                        <!--拉取视频（配置完成的子站）-->
                        <el-button
                            v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable"
                            class="btn-style-two contain-svg-icon"
                            @click="openPullVideoDialog">
                            <svg-icon icon-class="pull_video"></svg-icon>
                            拉取视频
                        </el-button>
                    </div>
                </div>
                <video-table
                    ref="videoTable"
                    :shareSiteOptions="shareSiteOptions"
                    :videoList="videoList"
                    v-on:setBatchDisabledStatus="setBatchDisabledStatus">
                </video-table>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
                    :page-size="listQueryParams.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
                <div class="text-left table-dropdow-box">
                    <el-dropdown
                        class="my-dropdown" :class="{'is-disabled':isBatchDisabled}"
                        trigger="click">
                            <span class="el-dropdown-link">
                                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <span @click="retryInjectSelectedVideoHandler">批量重试</span>
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
                            <!--重试拉取（子站）-->
                            <el-dropdown-item
                                v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable">
                                <span @click="batchPullVideoFromMainSite">重试拉取</span>
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
            custom-class="normal-dialog batch-share-site"
            width="40%">
            <div class="batch-share-body" v-if="batchShareDialogVisible">
                <div>{{$refs.videoTable.getSelectedVideoList().length}}个视频可以被以下站点共享:</div>
                <el-select
                    v-model="batchShareSiteIdList"
                    multiple
                    clearable
                    @change="setShareSites"
                    placeholder="请选择共享站点">
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
            custom-class="normal-dialog"
            center
            width="80%">
            <select-multiple-master-video
                v-if="selectMasterVideoDialogVisible"
                v-on:pullVideoFromMaster="pullVideoFromMaster"
                v-on:closeSelectVideoDialog="selectMasterVideoDialogVisible = false">
            </select-multiple-master-video>
        </el-dialog>
        <batch-message-list-dialog
            ref="batchMessageListDialog"
            :batchMessageList="batchMessageList"
            v-on:setBatchDisabledStatus="setBatchDisabledStatus">
        </batch-message-list-dialog>
    </div>
</template>

<script>
    import VideoFilterParams from '../search_filter_params/VideoFilterParams';
    import XLSX from 'xlsx';
    import SelectMultipleMasterVideo from './SelectMultipleMasterVideo';
    import VideoTable from './VideoTable';
    import BatchMessageListDialog from './BatchMessageListDialog';

    export default {
        name: 'VideoList',
        components: {
            VideoFilterParams,
            VideoTable,
            SelectMultipleMasterVideo,
            BatchMessageListDialog
        },
        data() {
            return {
                batchMessageList: [],
                listQueryParams: {
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: this.$wsCache.localStorage.get('videoFilter') ? this.$wsCache.localStorage.get('videoFilter').pageNum + 1 : 1,
                total: 0,
                videoList: [],
                shareSiteOptions: [],
                selectMasterVideoDialogVisible: false,
                isBatchDisabled: true,
                batchShareDialogVisible: false,
                // 多个视频进行多个站点共享设置的共享站点Id列表
                batchShareSiteIdList: [],
                batchRequestTimer: ''
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('videoFilter')) {
                    this.listQueryParams.pageNum = this.$wsCache.localStorage.get('videoFilter').pageNum;
                    this.listQueryParams.pageSize = this.$wsCache.localStorage.get('videoFilter').pageSize;
                    this.$refs.videoFilterParams.initFilterParams(this.$wsCache.localStorage.get('videoFilter'));
                    for (let key in this.$wsCache.localStorage.get('videoFilter')) {
                        this.listQueryParams[key] = this.$wsCache.localStorage.get('videoFilter')[key];
                    }
                }
                this.getVideoList();
                // 初始化共享站点的列表
                this.$service.getAllSiteList().then(response => {
                    if (response && response.code === 0) {
                        this.shareSiteOptions = response.data;
                        this.shareSiteOptions.unshift({id: '0', name: '全选'});
                    }
                });
            },
            getVideoList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.pageNum = 1;
                }
                this.listQueryParams.pageNum = this.pageNum - 1;
                this.$wsCache.localStorage.set('videoFilter', this.listQueryParams);
                this.$service.getVideoList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.videoList = response.data.list;
                        this.total = response.data.total;
                        this.$refs.videoTable.reCheckVideoList();
                    }
                });
            },
            // 设置共享站点，对全选进行处理
            setShareSites() {
                this.batchShareSiteIdList.map(siteId => {
                    if (siteId === '0') {
                        this.batchShareSiteIdList = [];
                        this.shareSiteOptions.map(siteOption => {
                            if (siteOption.name !== '全选') {
                                this.batchShareSiteIdList.push(siteOption.id);
                            }
                        });
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getVideoList();
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.getVideoList();
            },
            // 设置批量操作状态
            setBatchDisabledStatus(isBatchDisabled) {
                this.isBatchDisabled = isBatchDisabled;
            },
            // 打开拉取视频弹窗
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
                let videoList = this.$refs.videoTable.getSelectedVideoList();
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
                this.$refs.videoTable.getSelectedVideoList().map(video => {
                    videoIdList.push(video.id);
                });
                this.$service.setBatchVideoToBatchSite({
                    siteIdList: this.batchShareSiteIdList,
                    videoIdList: videoIdList
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('成功设置视频共享站点');
                        this.batchShareSiteIdList = [];
                        this.batchShareDialogVisible = false;
                    }
                });
            },
            // 批量上传主站——将本地视频上传至主站(只存在于子站)
            batchPushToMaster() {
                // 对选择的视频列表进行检测，（注入成功或拉取成功）且（非上传中、非上传成功）的视频可以上传主站
                let videoList = this.$refs.videoTable.getSelectedVideoList();
                for (let i = 0; i < videoList.length; i++) {
                    if (!((videoList[i].status === 'SUCCESS' || videoList[i].downloadStatus === 'SUCCESS') && !(videoList[i].uploadStatus === 'ON_GOING' || videoList[i].uploadStatus === 'SUCCESS'))) {
                        this.$message.warning('批量上传主站仅支持注入/拉取成功且未上传成功的视频');
                        return;
                    }
                }
                if (this.$wsCache.localStorage.get('siteInfo') && this.$wsCache.localStorage.get('siteInfo').siteName) {
                    let videoIdList = [];
                    this.$refs.videoTable.getSelectedVideoList().map(video => {
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
            // 批量拉取主站的视频到子站（只有在当前视频是以前拉取过的且失败的才能重新拉取）
            batchPullVideoFromMainSite() {
                // 对选择的视频列表进行检测，拉取失败的视频可以重新拉取
                let videoList = this.$refs.videoTable.getSelectedVideoList();
                for (let i = 0; i < videoList.length; i++) {
                    if (videoList[i].downloadStatus !== 'FAILED') {
                        this.$message.warning('重试拉取仅支持拉取失败的视频');
                        return;
                    }
                }
                let videoIdList = [];
                videoList.forEach(function (item) {
                    videoIdList.push(item.id);
                });
                if (videoIdList.length > 0) {
                    this.$service.batchPullVideoFromMaster({videoIdList}).then(response => {
                        if (response && response.code === 0 && response.data.length === 0) {
                            this.$message.success('正在拉取视频到本站，请关注其状态更改');
                        } else if (response && response.code === 0 && response.data.length !== 0) {
                            // 批量上传存在有特殊情况说明
                            let message = '当前视频含有如下问题：';
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
                } else {
                    this.$message.warning('不存在可以重新拉取的视频');
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
            // 注入失败视频----批量重试
            retryInjectSelectedVideoHandler() {
                // 对选择的视频列表进行检测，注入失败的视频才能进行批量重试
                let videoList = this.$refs.videoTable.getSelectedVideoList();
                for (let i = 0; i < videoList.length; i++) {
                    if (videoList[i].status !== 'FAILED') {
                        this.$message.warning('批量删除操作仅支持注入失败的视频');
                        return;
                    }
                }
                let idList = this.$refs.videoTable.getSelectedVideoList().filter((video) => {
                    return this.needRetryInject(video);
                }).map((item) => item.id);
                if (idList.length > 0) {
                    // 开始批量操作，期间禁用其它批量操作
                    this.setBatchDisabledStatus(true);
                    this.$refs.batchMessageListDialog.setBatchMessageStatus(true);
                    // 开始重新注入视频
                    // 初始化最初批量请求信息
                    this.batchMessageList = [];
                    for (let i = 0; i < videoList.length; i++) {
                        let message = {};
                        message.id = videoList[i].id;
                        message.name = videoList[i].name;
                        message.message = {};
                        message.message.relateList = [];
                        this.batchMessageList.push(message);
                    }
                    let that = this;
                    for (let i = 0; i < videoList.length; i++) {
                        let newFunction = function () {
                            return (function (i) {
                                that.retryInjectSingleVideo(videoList, i);
                            })(i);
                        };
                        setTimeout(newFunction, i * 1000);
                    }
                } else {
                    this.$message.warning('不存在可以重新注入的视频');
                }
            },
            // 重新注入视频
            retryInjectSingleVideo(videoList, index) {
                this.$service.retryInjectVideo({
                    id: videoList[index].id,
                    host: videoList[index].host,
                    port: videoList[index].port
                }).then((res) => {
                    this.batchMessageList[index].isFinished = true;
                    this.batchMessageList.splice(index, 1, this.batchMessageList[index]);
                    if (res && res.code === 0) {
                        this.batchMessageList[index].isSuccess = true;
                    } else {
                        this.batchMessageList[index].isSuccess = false;
                        this.batchMessageList[index].message.otherReason = '请求出现错误';
                    }
                });
            },
            // 是否可以重新注入
            needRetryInject(video) {
                let {status, transcodeStatus} = video;
                return (status === 'INJECTING' && transcodeStatus === 'FAILED') || status === 'FAILED';
            },
            // 批量下载视频文件
            downloadSelectedTsVideo() {
                // 对选择的视频列表进行检测，注入成功或拉取成功或上传成功的视频文件才能批量下载
                let videoList = this.$refs.videoTable.getSelectedVideoList();
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
                videoList.map(video => {
                    videoIdList.push(video.id);
                });
                this.$service.exportTsVideos({videoIdList: videoIdList, isRetry: false}).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('成功下载视频文件，稍后可到下载列表页面查看');
                    }
                });
            },
            // 批量导出选择的视频文件列表的EXCEL文件
            exportSelectedVideoHandler() {
                let videoList = this.$refs.videoTable.getSelectedVideoList().map((video) => {
                    let obj = {};
                    obj['编号'] = video.id;
                    obj['视频名称'] = video.originName;
                    obj['视频地址'] = this.joinVideoUrl(video);
                    obj['视频时长'] = this.$util.fromSecondsToTime(video.takeTimeInSec);
                    obj['上传日期'] = this.$util.formatDate(new Date(video.createdAt), 'yyyy-MM-DD HH:mm:SS');
                    return obj;
                });
                let exportChannelData = videoList;
                let wb = XLSX.utils.book_new();
                let newWsName = '表1';
                let ws = XLSX.utils.json_to_sheet(exportChannelData);
                XLSX.utils.book_append_sheet(wb, ws, newWsName);
                XLSX.writeFile(wb, '导出视频列表_' + new Date() + '.xlsx');
            },
            // 批量删除视频
            deleteVideoList() {
                // 对选择的视频列表进行检测，在拉取中和下载中状态的视频不能删除
                let videoList = this.$refs.videoTable.getSelectedVideoList();
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
                let idList = this.$refs.videoTable.getSelectedVideoList().map((item) => {
                    return item.id;
                });
                if (idList.length > 0) {
                    this.$confirm(`您确定要删除吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        if (idList.length > 0) {
                            // 开始批量操作，期间禁用其它批量操作
                            this.setBatchDisabledStatus(true);
                            this.$refs.batchMessageListDialog.setBatchMessageStatus(true);
                            // 开始删除视频
                            // 初始化最初批量请求信息
                            this.batchMessageList = [];
                            for (let i = 0; i < videoList.length; i++) {
                                let message = {};
                                message.id = videoList[i].id;
                                message.name = videoList[i].name;
                                message.message = {};
                                message.message.relateList = [];
                                this.batchMessageList.push(message);
                            }
                            let that = this;
                            for (let i = 0; i < videoList.length; i++) {
                                let newFunction = function () {
                                    return (function (i) {
                                        that.deleteSingleVideo(videoList, i);
                                    })(i);
                                };
                                setTimeout(newFunction, i * 1000);
                            }
                        }
                    });
                }
            },
            deleteSingleVideo(videoList, index) {
                this.$service.deleteVideo({
                    id: videoList[index].id,
                    host: videoList[index].host,
                    port: videoList[index].port
                }).then((res) => {
                    this.batchMessageList[index].isFinished = true;
                    this.batchMessageList.splice(index, 1, this.batchMessageList[index]);
                    if (res && res.code === 0) {
                        this.batchMessageList[index].isSuccess = true;
                    } else if (res && res.code === 3306) {
                        this.batchMessageList[index].isSuccess = false;
                        this.batchMessageList[index].message.relateReason = '节目内已关联';
                        this.batchMessageList[index].message.relateList = res.data;
                    } else if (res && res.code === 3308) {
                        this.batchMessageList[index].isSuccess = false;
                        this.batchMessageList[index].message.relateReason = '频道内已关联';
                        this.batchMessageList[index].message.relateList = res.data;
                    } else {
                        this.batchMessageList[index].isSuccess = false;
                        this.batchMessageList[index].message.otherReason = '请求出现错误';
                    }
                });
            },
            joinVideoUrl(video) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                let urlList = [video.m3u8For4K, video.m3u8For1080P, video.m3u8For720P, video.m3u8For480P];
                let urlStr = urlList.filter((item) => item).map((item) => {
                    return `${baseUri}${item}`;
                }).join(', ');
                return urlStr;
            },
            // 跳转到上传视频页面
            goToVideoUploadPage() {
                let routeData = this.$router.resolve({
                    name: 'VideoImport'
                });
                window.open(routeData.href, '_blank');
            },
            // 跳转到下载视频列表页面
            toDownloadVideoList() {
                this.$router.push({name: 'DownloadVideoList'});
            },
            // 跳转到检查时长列表页面
            toDiffTime() {
                this.$router.push({name: 'DiffTimeVideoList'});
            }
        }
    };
</script>

<style scoped lang="less">

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

</style>
