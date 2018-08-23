<!--节目表格组件-->
<template>
    <div class="tele-play-table-container">
        <el-row>
            <el-table
                :data="dataList"
                border
                header-row-class-name="common-table-header"
                style="width: 100%">
                <el-table-column
                    prop="storageVideoId"
                    label="视频ID"
                    align="center"
                    width="120px">
                        <template slot-scope="scope">
                            {{scope.row.storageVideoId | padEmpty}}
                        </template>
                </el-table-column>
                <el-table-column
                    prop="originName"
                    label="视频文件名"
                    align="center"
                    width="180">
                        <template slot-scope="scope">
                            {{scope.row.originName | padEmpty}}
                        </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    v-if="tableStatus === 1"
                    label="视频展示名"
                    align="center"
                    width="180">
                        <template slot-scope="scope">
                            {{scope.row.name | padEmpty}}
                        </template>
                </el-table-column>
                <el-table-column
                    prop="sort"
                    v-if="tableStatus === 1"
                    label="集数/期号"
                    align="center">
                        <template slot-scope="scope">
                            {{scope.row.sort | padEmpty}}
                        </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    label="相关人物">
                        <template slot-scope="scope">
                            {{videoPersonName(scope.row.figureList) | padEmpty}}
                        </template>
                </el-table-column>
                <el-table-column
                    v-if="tableStatus === 1"
                    align="center"
                    label="关联正片">
                        <template slot-scope="scope">
                            {{(scope.row.parentId ? featureVideoName(scope.row.parentId) : '') | padEmpty}}
                        </template>
                </el-table-column>
                <el-table-column
                    min-width="240px"
                    align="center"
                    label="视频地址">
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
                <el-table-column
                    prop="type"
                    v-if="tableStatus === 1"
                    align="center"
                    min-width="120px"
                    label="内容类型">
                        <template slot-scope="scope">
                            {{getVideoType(scope.row.type) | padEmpty}}
                        </template>
                </el-table-column>
                <el-table-column
                    prop="duration"
                    align="center"
                    min-width="120px"
                    label="时长">
                    <template slot-scope="scope">
                        {{duration(scope.row.takeTimeInSec) | padEmpty}}
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="tableStatus === 1"
                    prop="duration"
                    align="center"
                    min-width="120px"
                    label="上下架">
                    <template slot-scope="scope">
                        <i v-if="scope.row.visible" class="status-normal">已上架</i>
                        <i v-else class="status-abnormal">已下架</i>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="tableStatus === 1"
                    prop="createdAt"
                    align="center"
                    min-width="120px"
                    label="上传时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD') | padEmpty}}
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="tableStatus === 1"
                    fixed="right"
                    label="操作"
                    align="center"
                    width="160">
                    <template slot-scope="scope">
                        <el-button v-if="tableStatus !== 0" @click="displayVideo(scope.row.id)" type="text" class="text-success" size="small">查看</el-button>
                        <el-button v-if="status !== 1" @click="editVideo(scope.row.id)" type="text" size="small">编辑</el-button>
                        <el-button v-if="status !== 1 && isShow" @click="deleteVideo(scope.row.id, scope.row.visible)" type="text" size="small">
                            {{scope.row.visible ? '下架' : '上架'}}
                        </el-button>
                        <el-button v-if="status !== 1" @click="realDeleteVideo(scope.row.id)" type="text" class="text-danger" size="small">取消关联</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <upload-programme-video-dialog :videoStatus="videoStatus" :videoUploadDialogVisible="videoUploadDialogVisible" v-on:changeVideoDialogStatus="closeVideoDialog($event)"></upload-programme-video-dialog>
        <display-video-dialog
            :url="url"
            :title="videoTitle"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import UploadProgrammeVideoDialog from './UploadProgrammeVideoDialog';
import DisplayVideoDialog from '../video_manage/DisplayVideoDialog';
import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
import role from '@/util/config/role';
const ClipboardJS = require('clipboard');
export default {
    name: 'ProgrammeTable',
    components: {
        UploadProgrammeVideoDialog,
        DisplayVideoDialog,
        PreviewSingleImage
    },
    props: {
        dataList: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: ''
        },
        status: {
            type: Number, // 1表示“电视剧”， 2表示“电影”， 3表示“综艺”
            default: 1
        },
        tableStatus: {
            type: Number // 0表示“待添加视频列表“ 1表示”已添加视频列表“
        }
    },
    data() {
        return {
            videoUploadDialogVisible: false,
            displayVideoDialogVisible: false,
            url: '',
            videoTitle: '',
            isEdit: true,
            //  videoStatus 有三中状态，0：表示创建， 1: 表示编辑， 2： 表示查看
            videoStatus: 1,
            previewImage: {
                title: '',
                display: false,
                uri: ''
            }
        };
    },
    created() {
        let that = this;
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
            featureVideoName: 'programme/featureVideoName',
            video: 'programme/video',
            isShow: 'programme/isShow',
            isUnsavedVideo: 'programme/isUnsavedVideo',
            videoPersonName: 'programme/videoPersonName'
        }),
        duration() {
            return (seconds) => {
                return this.$util.fromSecondsToTime(seconds);
            };
        },
        getVideoType() {
            return (key) => {
                return role.VIDEO_TYPE_OBJ[key];
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
            deleteVideoFromTempList: 'programme/deleteVideoFromTempList',
            deleteVideoFromList: 'programme/deleteVideoFromList',
            setCurrentVideo: 'programme/setCurrentVideo',
            setCacheSort: 'programme/setCacheSort'
        }),
        ...mapActions({
            getProgrammeVideoById: 'programme/getProgrammeVideoById',
            deleteProgrammeVideoById: 'programme/deleteProgrammeVideoById',
            realDeleteProgrammeVideoById: 'programme/realDeleteProgrammeVideoById',
            getProgrammeVideoListById: 'programme/getProgrammeVideoListById',
            getFeatureVideoList: 'programme/getFeatureVideoList'
        }),
        editVideo(id) {
            if (this.isUnsavedVideo(id)) {
                let video = this.video.list.find((video) => video.id === id);
                this.setCurrentVideo({currentVideo: video});
                this.setCacheSort({sort: video.sort});
                this.videoUploadDialogVisible = true;
                this.videoStatus = 1;
            } else {
                this.getProgrammeVideoById(id)
                    .then((res) => {
                        this.videoUploadDialogVisible = true;
                        this.videoStatus = 1;
                    });
            }
        },
        displayVideo(id) {
            if (this.isUnsavedVideo(id)) {
                let video = this.video.list.find((video) => video.id === id);
                this.setCurrentVideo({currentVideo: video});
                this.setCacheSort({sort: video.sort});
                this.videoUploadDialogVisible = true;
                this.videoStatus = 2;
            } else {
                this.getProgrammeVideoById(id)
                    .then((res) => {
                        this.videoUploadDialogVisible = true;
                        this.videoStatus = 2;
                    });
            }
        },
        deleteVideo(id, visible) {
            this.$confirm(`您确定要${visible ? '下架视频' : '上架视频'}吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.deleteProgrammeVideoById(id);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
        },
        closeVideoDialog(status) {
            this.videoUploadDialogVisible = status;
        },
        deleteUnsavedVideo(uid) {
            this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                this.deleteVideoFromTempList({uid});
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        realDeleteVideo(id) {
            this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'error'
            }).then(() => {
                if (this.isUnsavedVideo(id)) {
                    this.deleteVideoFromList({id});
                } else {
                    this.realDeleteProgrammeVideoById(id)
                        .then((res) => {
                            this.deleteVideoFromList({id});
                            this.getFeatureVideoList({id: this.$route.params.id, pageSize: 99999});
                        });
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        closeDisplayVideoDialog(status) {
            this.displayVideoDialogVisible = status;
        },
        displayVideoPlayer(url, name) {
            this.displayVideoDialogVisible = true;
            let baseUri = window.localStorage.getItem('videoBaseUri');
            this.url = `${baseUri}${url}`;
            this.videoTitle = name;
        },
        // 放大预览图片
        displayImage(image) {
            this.previewImage.title = image.name;
            this.previewImage.display = true;
            this.previewImage.uri = image.uri;
        }
    }
};
</script>
<style lang="less" scoped>
</style>
