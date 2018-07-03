<template>
    <div class="video-table-container">
       <el-table :data="video.list" border style="width:100%;margin:20px 0;">
            <el-table-column v-if="hasRadio" align="center" label="选择">
                <template slot-scope="scope">
                    <el-radio :value="video.selectedVideoId" :label="scope.row.id" @input="setSelectedVideoId({id: scope.row.id})">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="id" align="center" width="240px" label="编号"></el-table-column>
            <el-table-column prop="originName" align="center" width="200px" label="视频名称"></el-table-column>
            <el-table-column prop="link" align="center" width="300px" label="预览视频">
                <template slot-scope="scope">
                    <!-- <el-button
                        v-if="scope.row.m3u8For1080P"
                        type="text" @click="displayVideo(scope.row.playUrl)" size="small">4K</el-button> -->
                    <el-button
                        v-if="scope.row.m3u8For1080P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For1080P)"
                        >1080</el-button>
                    <el-button
                        v-if="scope.row.m3u8For720P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For720P)"
                        >720</el-button>
                    <el-button
                        v-if="scope.row.m3u8For480P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For480P)"
                        >480</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="takeTimeInSec" align="center" label="视频时长">
                <template slot-scope="scope">
                    {{duration(scope.row.takeTimeInSec)}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="视频类型">
                <template slot-scope="scope">
                    {{scope.row.videoType === 'VOD' ? '点播视频' : '轮播视频'}}
                </template>
            </el-table-column>
            <el-table-column prop="takeTimeInSec" align="center" label="注入状态">
                <template slot-scope="scope">
                    {{getStatus(scope.row.status)}}
                </template>
            </el-table-column>
            <el-table-column align="center" width="220px" label="上传日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:MM:SS')}}
                </template>
            </el-table-column>
            <el-table-column v-if="!hasRadio" align="center" width="120px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="_deleteVideoById(scope.row.id)" size="small">删除</el-button>
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
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex';
import DisplayVideoDialog from './DisplayVideoDialog';
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
            url: ''
        };
    },
    created() {
        this.getVideoList();
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
            deleteVideoById: 'video/deleteVideoById'
        }),
        handlePaginationChange(value, key) {
            this.updatePagination({value, key});
            this.getVideoList();
        },
        closeDisplayVideoDialog(status) {
            this.displayVideoDialogVisible = status;
        },
        displayVideo(url) {
            this.displayVideoDialogVisible = true;
            this.url = `http://dev-video.tianchiapi.com${url}`;
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
                            this.getVideoList();
                        }
                    });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        }
    }
};
</script>
<style lang="less" scoped>
</style>
