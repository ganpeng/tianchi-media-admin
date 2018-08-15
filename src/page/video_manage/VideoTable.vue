<template>
    <div class="video-table-container">
       <el-table @selection-change="handleSelectionChange" class="my-table-style" :data="video.list" border>
            <el-table-column v-if="!hasRadio" type="selection" align="center" width="120px"></el-table-column>
            <el-table-column v-if="hasRadio" align="center" label="选择">
                <template slot-scope="scope">
                    <el-radio :value="video.selectedVideoId" :label="scope.row.id" @input="setSelectedVideoId({id: scope.row.id})">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="id" align="center" width="120px" label="编号"></el-table-column>
            <el-table-column prop="originName" align="center" width="200px" label="视频名称"></el-table-column>
            <el-table-column prop="link" align="center" width="300px" label="预览视频">
                <template slot-scope="scope">
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For4K"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For4K, scope.row.originName)"
                        >4K</el-button>
                        <icon color="#409EFF"
                            class="copy-btn pointer el-icon-printer"
                            v-if="scope.row.m3u8For4K"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For4K)"
                            name="copy">
                        </icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For1080P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For1080P, scope.row.originName)"
                        >1080</el-button>
                        <icon color="#409EFF" name="copy" class="copy-btn pointer el-icon-printer"
                            v-if="scope.row.m3u8For1080P"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For1080P)">
                        </icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For720P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For720P, scope.row.originName)"
                            >720</el-button>
                        <icon
                            v-if="scope.row.m3u8For720P"
                            color="#409EFF" class="copy-btn pointer el-icon-printer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For720P)"
                            name="copy">
                        </icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For480P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For480P, scope.row.originName)"
                        >480</el-button>
                        <icon
                            v-if="scope.row.m3u8For480P"
                            name="copy" color="#409EFF"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For720P)"
                            class="copy-btn pointer el-icon-printer"
                        ></icon>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="takeTimeInSec" align="center" label="视频时长">
                <template slot-scope="scope">
                    {{duration(scope.row.takeTimeInSec)}}
                </template>
            </el-table-column>
            <el-table-column width="150px" align="center" label="注入状态">
                <template slot-scope="scope">
                    <span v-html="getStatus(scope.row)"></span>
                </template>
            </el-table-column>
            <el-table-column align="center" width="220px" label="上传日期">
                <template slot-scope="scope">
                    {{timeStampFormat(scope.row.createdAt)}}
                </template>
            </el-table-column>
            <el-table-column v-if="!hasRadio" align="center" width="120px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button class="text-danger" type="text" @click="_deleteVideoById(scope.row.id)" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
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
            isFetching: true
        };
    },
    created() {
        let that = this;
        this.getVideoList()
            .finally(() => {
                this.isFetching = false;
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
            getStatus: 'video/getStatus'
        }),
        duration() {
            return (seconds) => {
                return this.$util.fromSecondsToTime(seconds);
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
            updatePagination: 'video/updatePagination',
            setSelectedVideoList: 'video/setSelectedVideoList'
        }),
        ...mapActions({
            getVideoList: 'video/getVideoList',
            deleteVideoById: 'video/deleteVideoById'
        }),
        handlePaginationChange(value, key) {
            this.updatePagination({value, key});
            if (key === 'pageSize') {
                window.localStorage.setItem('videoPageSize', value);
            }
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
                            this.getVideoList();
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
        handleSelectionChange(list) {
            this.setSelectedVideoList({list});
        }
    }
};
</script>
<style lang="less" scoped>
</style>
