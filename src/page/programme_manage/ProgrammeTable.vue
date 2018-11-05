<!--节目表格组件-->
<template>
    <div class="tele-play-table-container">
        <el-row>
            <el-table
                class="my-table-style"
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
                    label="文件名"
                    align="center"
                    width="180">
                        <template slot-scope="scope">
                            <span class="ellipsis two">
                                {{scope.row.originName | padEmpty}}
                            </span>
                        </template>
                </el-table-column>
                <!--
                <el-table-column
                    label="是否有封面图"
                    align="center"
                    width="120">
                        <template slot-scope="scope">
                            {{scope.row.coverImage ? '是' : '否'}}
                        </template>
                </el-table-column>
                -->
                <!--
                <el-table-column
                    prop="name"
                    label="展示名"
                    align="center"
                    width="160">
                        <template slot-scope="scope">
                            <span class="ellipsis two">
                                {{scope.row.name | padEmpty}}
                            </span>
                        </template>
                </el-table-column>
                -->
                <el-table-column
                    prop="sort"
                    width="100"
                    label="集数/期号"
                    align="center">
                        <template slot-scope="scope">
                            {{scope.row.sort | padEmpty}}
                        </template>
                </el-table-column>
                <!--
                <el-table-column
                    align="center"
                    label="相关人物">
                        <template slot-scope="scope">
                            <span class="ellipsis two">
                                {{videoPersonName(scope.row.figureList) | padEmpty}}
                            </span>
                        </template>
                </el-table-column>
                -->
                <el-table-column
                    align="center"
                    label="关联正片">
                        <template slot-scope="scope">
                            <span class="ellipsis two">
                                {{(scope.row.parentId ? featureVideoName(scope.row.parentId) : '') | padEmpty}}
                            </span>
                        </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="180"
                    label="预览">
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
                <el-table-column
                    prop="type"
                    align="center"
                    min-width="80px"
                    label="内容类型">
                        <template slot-scope="scope">
                            {{getVideoType(scope.row.type) | padEmpty}}
                        </template>
                </el-table-column>
                <el-table-column
                    prop="duration"
                    align="center"
                    width="100"
                    label="时长">
                    <template slot-scope="scope">
                        {{duration(scope.row.takeTimeInSec) | padEmpty}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="duration"
                    align="center"
                    min-width="80px"
                    label="上下架">
                    <template slot-scope="scope">
                        <input
                            v-if="status !== 1 && isShow"
                            class="my-switch switch-anim"
                            type="checkbox"
                            :checked="scope.row.visible"
                            @click.prevent="_lowerFramePerson(scope.row)"/>
                        <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                        <i v-else class="off-the-shelf">已下架</i>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    align="center"
                    min-width="100px"
                    label="上传时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD') | padEmpty}}
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作"
                    align="center"
                    width="160">
                    <template slot-scope="scope">
                        <div class="operator-btn-wrapper">
                            <span class="btn-text" @click="displayVideo(scope.row.id)">查看</span>
                            <span class="btn-text" v-if="status !== 1" @click="editVideo(scope.row.id)">编辑</span>
                            <span class="btn-text text-danger" v-if="status !== 1" @click="realDeleteVideo(scope.row.id)">取消关联</span>
                        </div>
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
            type: Number,
            default: 1
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
        cutStr(str) {
            return str.length > 30 ? str.substring(0, 30) + '...' : str;
        },
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
.gan-tooltip {
    width: 300px;
}
</style>
