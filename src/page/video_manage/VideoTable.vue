<!-- 视频表格组件 -->
<template>
    <div class="video-table-container">
        <el-table
            ref="multipleTable"
            header-row-class-name="common-table-header"
            :row-class-name="tableRowClassName"
            @select="selectHandler"
            @select-all="selectAllHandler"
            class="my-table-style" :data="video.list" border>
            <el-table-column v-if="!hasRadio" type="selection" align="center"></el-table-column>
            <el-table-column v-if="hasRadio" width="60px" align="center" label="选择">
                <template slot-scope="scope">
                    <el-radio :disabled="isDisabled(scope.row.id)" :value="video.selectedVideoId" :label="scope.row.id"
                              @input="setSelectedVideoId({id: scope.row.id})">&nbsp;
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="id" align="center" width="118" label="编号"></el-table-column>
            <el-table-column width="420px" prop="originName" align="center" label="视频名称">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" placement="top">
                        <div class="gan-tooltip" slot="content">{{scope.row.originName}}</div>
                        <span class="ellipsis-two">{{scope.row.originName}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="link" align="center" label="预览视频">
                <template slot-scope="scope">
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For4K"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For4K, scope.row.originName)"
                        >4K
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For4K"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For4K)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For1080P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For1080P, scope.row.originName)"
                        >1080
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For1080P"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For1080P)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For720P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For720P, scope.row.originName)"
                        >720
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For720P"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For720P)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For480P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For480P, scope.row.originName)"
                        >480
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
            <el-table-column prop="takeTimeInSec" align="center" label="视频时长">
                <template slot-scope="scope">
                    {{duration(scope.row.takeTimeInSec)}}
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
                        <span class="status-mid"
                              v-if="scope.row.status && scope.row.status !== 'FAILED' && scope.row.status !== 'SUCCESS'">
                            {{scope.row | parseStatus}}
                        </span>
                        <span v-if="needRetry(scope.row)"
                              class="btn-text text-primary"
                              @click="retrySingleVideo(scope.row.id)">
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
                    <span>{{scope.row.uploadStatus | getUploadStatus}}</span>
                    <label v-if="scope.row.uploadStatus === 'ON_GOING'">{{scope.row | getPushPercent}}</label>
                    <el-button
                        v-if="scope.row.uploadStatus === 'FAILED'"
                        type="text"
                        @click="pushVideoToMainSite(scope.row)">
                        重试
                    </el-button>
                </template>
            </el-table-column>
            <!--子站拉取状态（子站）-->
            <el-table-column
                v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable"
                align="center"
                label="拉取状态">
                <template slot-scope="scope">
                    <span>{{scope.row.downloadStatus | getDownloadStatus}}</span>
                    <label v-if="scope.row.downloadStatus === 'ON_GOING'">{{scope.row | getDownloadPercent}}</label>
                    <el-button
                        v-if="scope.row.downloadStatus === 'FAILED'"
                        type="text"
                        @click="pullVideoFromMainSite(scope.row)">
                        重试
                    </el-button>
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
                    <!--注入中、注入失败、上传中、上传失败不可查看共享站点-->
                    <el-button
                        type="text"
                        :disabled="scope.row.uploadStatus === 'ON_GOING' || scope.row.uploadStatus === 'FAILED' || scope.row.status === 'INJECTING' || scope.row.status === 'FAILED'"
                        @click="checkShareSiteList(scope.row)">
                        查看
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="160px"
                label="上传日期">
                <template slot-scope="scope">
                    {{timeStampFormat(scope.row.createdAt)}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="160px"
                label="更新日期">
                <template slot-scope="scope">
                    {{timeStampFormat(scope.row.updatedAt)}}
                </template>
            </el-table-column>
            <el-table-column v-if="!hasRadio" width="130px" align="center" label="操作">
                <template slot-scope="scope">
                    <!--上传主站（子站）-->
                    <!--（注入成功或者拉取成功）而且（非上传中、非上传成功）的视频上传主站可点击-->
                    <el-button
                        v-if="$wsCache.localStorage.get('siteInfo') && !$wsCache.localStorage.get('siteInfo').siteMasterEnable"
                        :disabled="!((scope.row.status === 'SUCCESS' || scope.row.downloadStatus === 'SUCCESS') && !(scope.row.uploadStatus === 'ON_GOING' || scope.row.uploadStatus === 'SUCCESS'))"
                        class="text-primary upload-btn"
                        type="text"
                        @click="pushVideoToMainSite(scope.row)"
                        size="small">
                        上传主站
                    </el-button>
                    <!--共享设置（主站）-->
                    <!--注入中、注入失败、上传中、上传失败不可设置共享站点-->
                    <el-button
                        v-if="$wsCache.localStorage.get('siteInfo') && $wsCache.localStorage.get('siteInfo').siteMasterEnable"
                        :disabled="!(scope.row.status === 'SUCCESS' || scope.row.uploadStatus === 'SUCCESS')"
                        type="text"
                        @click="setSingleVideoShareSite(scope.row)"
                        size="small">
                        共享设置
                    </el-button>
                    <!--在拉取中和下载中状态的视频不能删除-->
                    <el-button
                        :disabled="scope.row.uploadStatus === 'ON_GOING' || scope.row.downloadStatus === 'ON_GOING'"
                        class="text-danger"
                        type="text"
                        @click="_deleteVideoById(scope.row.id)" size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50, 100, 200, 500]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
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
            custom-class="share-site"
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
            custom-class="share-site-setting"
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
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import DisplayVideoDialog from './DisplayVideoDialog';
    import _ from 'lodash';

    const ClipboardJS = require('clipboard');
    export default {
        components: {
            DisplayVideoDialog
        },
        props: {
            hasRadio: {
                type: Boolean,
                default: false
            },
            status: {
                type: String,
                default: ''
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
                selectedVideoList: [],
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
                        return '转码任务转码中' + video.transcodeProgress + '%';
                    case 'SPLIT_TASK_SUCCESS':
                        return '转码任务成功';
                    case 'SUCCESS':
                        return '注入成功';
                    case 'FAILED':
                        return '注入失败';
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
        created() {
            let that = this;
            this.getVideoList()
                .then(() => {
                    !this.hasRadio && this.checkedVideoList();
                });
            let clipboard = new ClipboardJS('.copy-btn');
            clipboard.on('success', function (e) {
                that.$message.success('视频链接复制成功');
                e.clearSelection();
            });
            clipboard.on('error', function (e) {
                that.$message.error('视频链接复制失败');
            });
        },
        computed: {
            ...mapGetters({
                video: 'video/video',
                pagination: 'video/pagination',
                getStatus: 'video/getStatus',
                programmeVideo: 'programme/video'
            }),
            duration() {
                return (seconds) => {
                    return this.$util.fromSecondsToTime(seconds);
                };
            },
            isDisabled() {
                return (id) => {
                    let list = this.programmeVideo.list;
                    let index = list.findIndex((video) => video.storageVideoId === id);
                    return index >= 0;
                };
            },
            timeStampFormat() {
                return (seconds) => {
                    let date = new Date(seconds);
                    let year = date.getFullYear();
                    let month = date.getMonth() + 1;
                    let day = date.getDate();
                    let hour = date.getHours();
                    let minute = date.getMinutes();
                    let second = date.getSeconds();
                    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
                };
            },
            getVideoUrl() {
                return (uri) => {
                    let baseUri = window.localStorage.getItem('videoBaseUri');
                    return `${baseUri}${uri}`;
                };
            }
        },
        methods: {
            ...mapMutations({
                setSelectedVideoId: 'video/setSelectedVideoId',
                setPagination: 'video/setPagination',
                updatePagination: 'video/updatePagination'
            }),
            ...mapActions({
                getVideoList: 'video/getVideoList',
                deleteVideoById: 'video/deleteVideoById',
                retryVideoByIdList: 'video/retryVideoByIdList'
            }),
            //  动态的为符合条件的行添加class
            tableRowClassName({row, rowIndex}) {
                if (this.isDisabled(row.id) || row.id === this.video.selectedVideoId) {
                    return 'checked';
                }
                return '';
            },
            // 展示共享站点（只存在于主站）
            checkShareSiteList(item) {
                this.shareSiteVisible = true;
                this.currentVideo = item;
            },
            // 设置单个视频分享站点（只存在于主站）
            setSingleVideoShareSite(item) {
                this.shareSiteSettingVisible = true;
                this.currentVideo = item;
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
                            this.$refs.videoTable.checkedVideoList();
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
            cutStr(str) {
                return str.length > 40 ? str.substring(0, 40) + '...' : str;
            },
            needRetry(video) {
                return video.status === 'FAILED';
            },
            handlePaginationChange(value, key) {
                this.updatePagination({value, key});
                if (key === 'pageSize') {
                    window.localStorage.setItem('videoPageSize', value);
                } else {
                    this.selectedVideoList = [];
                }
                this.getVideoList()
                    .then(() => {
                        !this.hasRadio && this.checkedVideoList();
                    });
            },
            closeDisplayVideoDialog(status) {
                this.displayVideoDialogVisible = status;
            },
            displayVideoPlayer(url, name) {
                this.displayVideoDialogVisible = true;
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.url = `${baseUri}${url}`;
                this.title = name;
            },
            _deleteVideoById(id) {
                this.$confirm('此操作将删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.deleteVideoById(id)
                        .then((res) => {
                            if (res && res.code === 0) {
                                this.$message.success('视频删除成功');
                                this.getVideoList()
                                    .then(() => {
                                        !this.hasRadio && this.checkedVideoList();
                                    });
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
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            selectHandler(list, row) {
                let isSelected = list.findIndex((item) => item.id === row.id) >= 0;
                if (isSelected) {
                    this.selectedVideoList.push(row);
                } else {
                    this.selectedVideoList = this.selectedVideoList.filter((item) => item.id !== row.id);
                }
                if (this.selectedVideoList.length > 0) {
                    window.eventBus.$emit('setDisabled', false);
                } else {
                    window.eventBus.$emit('setDisabled', true);
                }
            },
            selectAllHandler(list) {
                if (list.length > 0) {
                    this.selectedVideoList = _.uniqBy(this.selectedVideoList.concat(list), 'id');
                } else {
                    this.selectedVideoList = this.selectedVideoList.filter((item) => {
                        let index = this.video.list.findIndex((video) => {
                            return video.id === item.id;
                        });
                        return index < 0;
                    });
                }
                if (this.selectedVideoList.length > 0) {
                    window.eventBus.$emit('setDisabled', false);
                } else {
                    window.eventBus.$emit('setDisabled', true);
                }
            },
            retrySingleVideo(id) {
                this.retryVideoByIdList([id])
                    .then((res) => {
                        if (res && res.code === 0) {
                            this.$message.success('该视频重新注入成功');
                        } else {
                            this.$message.error('该视频重新注入失败');
                        }
                        this.getvideolist()
                            .then(() => {
                                !this.hasradio && this.checkedvideolist();
                            });
                    });
            },
            checkedVideoList() {
                this.selectedVideoList.forEach((item) => {
                    let video = this.video.list.find((video) => {
                        return item.code === video.code;
                    });
                    if (video) {
                        this.$nextTick(() => {
                            this.$refs.multipleTable.toggleRowSelection(video, true);
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="less" scoped>

    .gan-tooltip {
        width: 300px;
    }

    .el-radio__label {
        padding-left: 0;
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

<style lang="scss">

    .upload-btn {
        &.is-disabled {
            span {
                color: #c0c4cc !important;
            }
        }
    }

</style>
