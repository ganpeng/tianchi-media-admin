<!-- 视频表格组件 -->
<template>
    <div class="video-table-container">
        <el-table
            ref="multipleTable"
            header-row-class-name="common-table-header"
            @selection-change="handleSelectionChange"
            class="my-table-style"
            :data="videoList"
            border>
            <el-table-column
                type="selection"
                align="center">
            </el-table-column>
            <el-table-column
                prop="id"
                align="center"
                width="120px"
                label="编号">
            </el-table-column>
            <el-table-column
                width="420px"
                prop="originName"
                align="center"
                label="视频名称">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" placement="top">
                        <div class="gan-tooltip" slot="content">{{scope.row.originName}}</div>
                        <span class="ellipsis-two">{{scope.row.originName}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                prop="link"
                align="center"
                label="预览视频">
                <template slot-scope="scope">
                    <div class="btn-icon-container preview-link">
                        <el-button
                            v-if="scope.row.m3u8For4K"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For4K, scope.row.originName)">
                            4K
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For4K"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For4K)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container preview-link">
                        <el-button
                            v-if="scope.row.m3u8For1080P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For1080P, scope.row.originName)">
                            1080
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For1080P"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For1080P)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container preview-link">
                        <el-button
                            v-if="scope.row.m3u8For720P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For720P, scope.row.originName)">
                            720
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For720P"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For720P)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container preview-link">
                        <el-button
                            v-if="scope.row.m3u8For480P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For480P, scope.row.originName)">
                            480
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For480P"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For480P)">
                        </svg-icon>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="takeTimeInSec"
                align="center"
                label="视频时长">
                <template slot-scope="scope">
                    {{scope.row.takeTimeInSec | fromSecondsToTime}}
                </template>
            </el-table-column>
            <!--注入状态-->
            <el-table-column
                align="center"
                label="注入状态">
                <template slot-scope="scope">
                    <template v-if="scope.row.status">
                        <span v-if="scope.row.status === 'SUCCESS'" class="status-normal">成功</span>
                        <span v-if="scope.row.status === 'FAILED'" class="status-abnormal">失败</span>
                        <span v-if="scope.row.status === 'DELETING'" class="status-deleting">正在删除</span>
                        <!--任务中包含：'切片正在入库'、'转码任务转码中'-->
                        <span
                            v-if="scope.row.status === 'SPLIT_TASK_SUCCESS' || scope.row.status === 'SPLIT_TASK_ON_PROCESS'"
                            class="status-on-going">
                            {{scope.row | parseStatus}}
                        </span>
                        <!--转码任务初始化中包含：'原文件上传成功'、'转码任务已提交'、'转码任务排队中'、'转码任务分配中'-->
                        <span
                            v-if="scope.row.status === 'UPLOAD_COMPLETED' || scope.row.status === 'SPLIT_TASK_SUBMITTED' || scope.row.status === 'SPLIT_TASK_ON_QUEUE' || scope.row.status === 'SPLIT_TASK_ON_PENDING'"
                            class="status-initiating">
                            {{scope.row | parseStatus}}
                        </span>
                        <span
                            v-if="scope.row.status === 'FAILED'"
                            class="retry-text-btn"
                            @click="retryInjectSingleVideo(scope.row)">
                            重试
                        </span>
                    </template>
                    <span v-else>---</span>
                </template>
            </el-table-column>
            <!--子站上传状态（子站）-->
            <el-table-column
                align="center"
                label="上传状态">
                <template slot-scope="scope">
                    <template v-if="scope.row.uploadStatus">
                        <span v-if="scope.row.uploadStatus === 'SUCCESS'" class="status-normal">成功</span>
                        <span v-if="scope.row.uploadStatus === 'FAILED'" class="status-abnormal">失败</span>
                        <span
                            v-if="scope.row.uploadStatus === 'ON_GOING'"
                            class="status-on-going">
                            上传中 {{scope.row | getPushPercent}}
                        </span>
                        <span
                            v-if="scope.row.uploadStatus === 'FAILED'"
                            class="retry-text-btn"
                            @click="pushVideoToMainSite(scope.row)">
                        重试
                    </span>
                    </template>
                    <span v-else>---</span>
                </template>
            </el-table-column>
            <!--子站拉取状态（子站）-->
            <el-table-column
                v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable"
                align="center"
                label="拉取状态">
                <template slot-scope="scope">
                    <template v-if="scope.row.downloadStatus">
                        <span v-if="scope.row.downloadStatus === 'SUCCESS'" class="status-normal">成功</span>
                        <span v-if="scope.row.downloadStatus === 'FAILED'" class="status-abnormal">失败</span>
                        <span
                            v-if="scope.row.downloadStatus === 'ON_GOING'"
                            class="status-on-going">
                            拉取中 {{scope.row | getDownloadPercent}}
                        </span>
                        <span
                            v-if="scope.row.downloadStatus === 'FAILED'"
                            class="retry-text-btn"
                            @click="pullVideoFromMainSite(scope.row)">
                            重试
                        </span>
                    </template>
                    <span v-else>---</span>
                </template>
            </el-table-column>
            <!--视频来源(主站、子站)-->
            <el-table-column align="center" label="视频来源">
                <template slot-scope="scope">
                    <span v-if="!scope.row.origin || scope.row.origin.length === 0">---</span>
                    <span v-else>{{scope.row.origin.name}}</span>
                </template>
            </el-table-column>
            <!--共享站点（主站）-->
            <el-table-column
                v-if="$wsCache.localStorage.get('siteInfo') && $wsCache.localStorage.get('siteInfo').siteMasterEnable"
                align="center"
                label="共享站点">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <!--注入中、注入失败、上传中、上传失败不可查看共享站点-->
                        <span
                            class="btn-text"
                            :class="{disabled:scope.row.uploadStatus === 'ON_GOING' || scope.row.uploadStatus === 'FAILED' || scope.row.status === 'INJECTING' || scope.row.status === 'FAILED'}"
                            @click="checkShareSiteList(scope.row)">
                            查看
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="160px"
                label="上传日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:mm:SS')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="160px"
                label="更新日期">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD HH:mm:SS')}}
                </template>
            </el-table-column>
            <el-table-column width="130px" align="center" label="操作">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <!--上传主站（子站）-->
                        <!--（注入成功或者拉取成功）而且（非上传中、非上传成功）的视频上传主站可点击-->
                        <span
                            v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable"
                            :class="{disabled :!((scope.row.status === 'SUCCESS' || scope.row.downloadStatus === 'SUCCESS') && !(scope.row.uploadStatus === 'ON_GOING' || scope.row.uploadStatus === 'SUCCESS'))}"
                            class="btn-text"
                            @click="pushVideoToMainSite(scope.row)">
                            上传主站
                        </span>
                        <!--共享设置（主站）-->
                        <!--注入中、注入失败、上传中、上传失败不可设置共享站点-->
                        <span
                            v-if="$wsCache.localStorage.get('siteInfo') && $wsCache.localStorage.get('siteInfo').siteMasterEnable"
                            :class="{disabled:!(scope.row.status === 'SUCCESS' || scope.row.uploadStatus === 'SUCCESS')}"
                            class="btn-text"
                            @click="setSingleVideoShareSite(scope.row)">
                            共享设置
                        </span>
                        <!--在拉取中和下载中状态的视频不能删除-->
                        <span
                            :class="{disabled:scope.row.uploadStatus === 'ON_GOING' || scope.row.downloadStatus === 'ON_GOING'}"
                            class="btn-text text-danger"
                            @click="deleteVideo(scope.row)">
                            删除
                        </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <display-video-dialog
            :url="url"
            :title="title"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <el-dialog
            title="共享站点"
            :visible.sync="shareSiteVisible"
            :close-on-click-modal="false"
            custom-class="normal-dialog share-site"
            width="40%">
            <div class="batch-share-body" v-if="shareSiteVisible">
                <ul>
                    <li v-for="(item, index) in currentVideo.shareSiteList" :key="index">
                        <el-tag type="info">{{item.name}}</el-tag>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shareSiteVisible = false">确定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="视频共享站点设置"
            :visible.sync="shareSiteSettingVisible"
            :close-on-click-modal="false"
            custom-class="normal-dialog share-site-setting"
            width="40%">
            <div class="share-body" v-if="shareSiteSettingVisible">
                <div>视频可以被以下站点共享:</div>
                <el-select v-model="videoShareSiteIdList" multiple placeholder="请选择共享站点">
                    <el-option
                        v-for="(item,index) in shareSiteOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shareSiteSettingVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmVideoShareSite">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>

    import DisplayVideoDialog from './DisplayVideoDialog';

    const ClipboardJS = require('clipboard');

    export default {
        components: {
            DisplayVideoDialog
        },
        props: {
            videoList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            shareSiteOptions: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                displayVideoDialogVisible: false,
                url: '',
                title: '',
                multipleSelection: [],
                // 展示共享站点
                shareSiteVisible: false,
                // 设置共享站点
                shareSiteSettingVisible: false,
                videoShareSiteIdList: [],
                currentVideo: {}
            };
        },
        filters: {
            parseStatus(video) {
                switch (video.status) {
                    case 'UPLOAD_COMPLETED':
                        return '原文件上传成功';
                    case 'SPLIT_TASK_SUBMITTED':
                        return '转码任务已提交';
                    case 'SPLIT_TASK_ON_QUEUE':
                        return '转码任务排队中';
                    case 'SPLIT_TASK_ON_PENDING':
                        return '转码任务分配中';
                    case 'SPLIT_TASK_ON_PROCESS':
                        return '转码任务转码中' + ' ' + video.transcodeProgress + '%';
                    case 'SPLIT_TASK_SUCCESS':
                        return '切片正在入库';
                    case 'SUCCESS':
                        return '注入成功';
                    case 'FAILED':
                        return '注入失败';
                    case 'DELETING':
                        return '删除中';
                    default:
                        return video.status;
                }
            },
            getUploadStatus(uploadStatus) {
                switch (uploadStatus) {
                    case 'ON_GOING':
                        return '上传中';
                    case 'SUCCESS':
                        return '上传成功';
                    case 'FAILED':
                        return '上传失败';
                    default:
                        return '---';
                }
            },
            getDownloadStatus(downloadStatus) {
                switch (downloadStatus) {
                    case 'ON_GOING':
                        return '拉取中';
                    case 'SUCCESS':
                        return '拉取成功';
                    case 'FAILED':
                        return '拉取失败';
                    default:
                        return '---';
                }
            },
            // 计算子站拉取主站视频的进度百分比
            getDownloadPercent(video) {
                if (!video.downloadedSplitCount || !video.totalSplitCount) {
                    return '0%';
                } else {
                    return (video.downloadedSplitCount * 100 / video.totalSplitCount).toFixed(0) + '%';
                }
            },
            // 计算子站上传主站视频的进度百分比
            getPushPercent(video) {
                if (!video.uploadedSplitCount || !video.totalSplitCount) {
                    return '0%';
                } else {
                    return (video.uploadedSplitCount * 100 / video.totalSplitCount).toFixed(0) + '%';
                }
            }
        },
        mounted() {
            this.initClipboard();
        },
        computed: {
            getVideoUrl() {
                return (uri) => {
                    let baseUri = window.localStorage.getItem('videoBaseUri');
                    return `${baseUri}${uri}`;
                };
            }
        },
        methods: {
            initClipboard() {
                let that = this;
                let clipboard = new ClipboardJS('.copy-btn');
                clipboard.on('success', function (e) {
                    that.$message.success('视频链接复制成功');
                    e.clearSelection();
                });
                clipboard.on('error', function (e) {
                    that.$message.error('视频链接复制失败');
                });
            },
            // 勾选视频
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length === 0) {
                    this.$emit('setBatchDisabledStatus', true);
                } else {
                    this.$emit('setBatchDisabledStatus', false);
                }
            },
            // 根据选中的视频项重新恢复勾选列表
            reCheckVideoList() {
                // 对于选择的多选项进行勾选
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    for (let k = 0; k < this.videoList.length; k++) {
                        if (this.multipleSelection[i].id === this.videoList[k].id) {
                            this.$nextTick(function () {
                                this.$refs.multipleTable.toggleRowSelection(this.videoList[k], true);
                            });
                        }
                    }
                }
            },
            // 展示共享站点（只存在于主站）
            checkShareSiteList(videoItem) {
                this.shareSiteVisible = true;
                this.currentVideo = videoItem;
            },
            // 设置单个视频分享站点（只存在于主站）
            setSingleVideoShareSite(videoItem) {
                this.shareSiteSettingVisible = true;
                this.currentVideo = videoItem;
                this.videoShareSiteIdList = [];
                if (this.currentVideo.shareSiteList) {
                    this.currentVideo.shareSiteList.map(site => {
                        this.videoShareSiteIdList.push(site.id);
                    });
                }
            },
            // 确定设置单个视频分享站点(只存在于主站)
            confirmVideoShareSite() {
                this.$service.setSingleVideoToBatchSite({
                    videoId: this.currentVideo.id,
                    siteIdList: this.videoShareSiteIdList
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('成功设置视频的共享站点');
                        this.videoShareSiteIdList = [];
                        this.shareSiteSettingVisible = false;
                    }
                });
            },
            // 拉取主站的视频到子站（只有在当前视频是以前拉取过的且失败的才能重新拉取）
            pullVideoFromMainSite(item) {
                if (item.downloadStatus === 'FAILED') {
                    let videoIdList = [item.id];
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
                } else {
                    this.$message.warning('当前视频的拉取状态不允许进行再次拉取');
                }
            },
            // 子站上传主站（只存在于子站）
            pushVideoToMainSite(item) {
                if (this.$wsCache.localStorage.get('siteInfo') && this.$wsCache.localStorage.get('siteInfo').siteName) {
                    if (!item.uploadStatus || item.uploadStatus === 'FAILED') {
                        this.$service.batchPushVideoToMaster({videoIdList: [item.id]}).then(response => {
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
                        });
                    } else {
                        this.$message.warning('当前视频上传状态不允许继续上传');
                    }
                } else {
                    this.$message.warning('请您先配置站点');
                }
            },
            closeDisplayVideoDialog(status) {
                this.displayVideoDialogVisible = status;
            },
            // 播放预览视频
            displayVideoPlayer(url, name) {
                this.displayVideoDialogVisible = true;
                this.url = `${url}`;
                this.title = name;
            },
            // 删除视频文件
            deleteVideo(video) {
                this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.$service.deleteVideo({
                        id: video.id,
                        host: video.host,
                        port: video.port
                    }).then((res) => {
                        if (res && res.code === 0) {
                            this.$message.success('视频删除成功');
                        } else if (res && res.code === 3306) {
                            this.$message({
                                type: 'error',
                                message: `该视频在如下节目 [${res.data.join(', ')}] 中有引用`,
                                duration: 5000
                            });
                        } else if (res && res.code === 3308) {
                            this.$message({
                                type: 'error',
                                message: `该视频在如下频道 [${res.data.join(', ')}] 中有引用`,
                                duration: 5000
                            });
                        }
                    });
                });
            },
            // 重试注入视频
            retryInjectSingleVideo(video) {
                this.$service.retryInjectVideo({
                    id: video.id,
                    host: video.host,
                    port: video.port
                }).then((res) => {
                    if (res && res.code === 0) {
                        this.$message.success('重试接口调用成功，请关注视频注入状态变化');
                    }
                });
            },
            // 获取已选的视频列表
            getSelectedVideoList() {
                return this.multipleSelection;
            }
        }
    };
</script>

<style lang="less" scoped>

    .gan-tooltip {
        width: 300px;
    }

    .preview-link {
        .el-button {
            font-size: 14px;
        }
    }

    /*展示分享站点*/
    .share-site {
        ul {
            text-align: left;
            li {
                display: inline-block;
                margin-bottom: 10px;
                .el-tag {
                    border: none;
                    margin-right: 10px;
                }
            }
        }
    }

    /*设置共享站点*/
    .share-site-setting {
        .share-body {
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
