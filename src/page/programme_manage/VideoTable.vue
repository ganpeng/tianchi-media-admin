<!-- 视频表格组件 -->
<template>
    <div class="video-table-container">
        <el-table
            ref="multipleTable"
            header-row-class-name="common-table-header"
            :row-class-name="tableRowClassName"
            class="my-table-style" :data="video.list" border>
            <el-table-column width="60px" align="center" label="选择">
                <template slot-scope="scope">
                    <el-radio :disabled="isDisabled(scope.row.id)" :value="video.selectedVideoId" :label="scope.row.id"
                              @input="setSelectedVideoId({id: scope.row.id})">&nbsp;
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="id" align="center" width="118" label="编号">
            </el-table-column>
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
                    </template>
                    <span v-else>---</span>
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
    import DisplayVideoDialog from '../video_manage/DisplayVideoDialog';

    const ClipboardJS = require('clipboard');
    export default {
        components: {
            DisplayVideoDialog
        },
        props: {
            status: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                displayVideoDialogVisible: false,
                url: '',
                title: ''
            };
        },
        created() {
            let that = this;
            this.getVideoList();
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
                getVideoList: 'video/getVideoList'
            }),
            //  动态的为符合条件的行添加class
            tableRowClassName({row, rowIndex}) {
                if (this.isDisabled(row.id) || row.id === this.video.selectedVideoId) {
                    return 'checked';
                }
                return '';
            },
            handlePaginationChange(value, key) {
                this.updatePagination({value, key});
                this.getVideoList();
            },
            closeDisplayVideoDialog(status) {
                this.displayVideoDialogVisible = status;
            },
            displayVideoPlayer(url, name) {
                this.displayVideoDialogVisible = true;
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.url = `${baseUri}${url}`;
                this.title = name;
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
