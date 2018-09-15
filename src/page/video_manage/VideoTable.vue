<!-- 视频表格组件 -->
<template>
    <div class="video-table-container">
        <el-table
            ref="multipleTable"
            header-row-class-name="common-table-header"
            @select="selectHandler"
            @select-all="selectAllHandler"
            class="my-table-style" :data="video.list" border>
            <el-table-column v-if="!hasRadio" type="selection" align="center"></el-table-column>
            <el-table-column v-if="hasRadio" width="60px" align="center" label="选择">
                <template slot-scope="scope">
                    <el-radio :disabled="isDisabled(scope.row.id)" :value="video.selectedVideoId" :label="scope.row.id" @input="setSelectedVideoId({id: scope.row.id})">&nbsp;</el-radio>
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
                        >4K</el-button>
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
                        >1080</el-button>
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
                            >720</el-button>
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
                            >480</el-button>
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
            <el-table-column align="center" label="注入状态">
                <template slot-scope="scope">
                    <span v-html="getStatus(scope.row)"></span>
                    <el-button v-if="needRetry(scope.row)" class="text-primary" type="text" @click="retrySingleVideo(scope.row.id)" size="small">重试</el-button>
                </template>
            </el-table-column>
            <el-table-column align="center" label="上传日期">
                <template slot-scope="scope">
                    {{timeStampFormat(scope.row.createdAt)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="更新日期">
                <template slot-scope="scope">
                    {{timeStampFormat(scope.row.updatedAt)}}
                </template>
            </el-table-column>
            <el-table-column v-if="!hasRadio" width="80px" align="center" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button class="text-danger" type="text" @click="_deleteVideoById(scope.row.id)" size="small">删除</el-button>
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
        }
    },
    data() {
        return {
            displayVideoDialogVisible: false,
            url: '',
            title: '',
            selectedVideoList: []
        };
    },
    created() {
        let that = this;
        this.getVideoList()
            .then(() => {
                !this.hasRadio && this.checkedVideoList();
            });
        let clipboard = new ClipboardJS('.copy-btn');
        clipboard.on('success', function(e) {
            that.$message.success('视频链接复制成功');
            e.clearSelection();
        });
        clipboard.on('error', function(e) {
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
        cutStr(str) {
            return str.length > 40 ? str.substring(0, 40) + '...' : str;
        },
        needRetry(video) {
            let {status, transcodeStatus} = video;
            return (status === 'INJECTING' && transcodeStatus === 'FAILED') || status === 'FAILED';
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
</style>
