<!--节目表格组件-->
<template>
    <div class="tele-play-table-container">
        <el-row>
            <!-- <h2 class="table-title">{{title}}</h2> -->
            <el-table
                :data="dataList"
                border
                style="width: 100%">
                <!--
                <el-table-column
                    prop="order"
                    label="视频排序"
                    align="center"
                    width="240px">
                </el-table-column>
                -->
                <el-table-column
                    prop="storageVideoId"
                    label="视频ID"
                    align="center"
                    width="240px">
                </el-table-column>
                <el-table-column
                    prop="originName"
                    label="视频文件名"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    v-if="tableStatus === 1"
                    label="视频展示名"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="sort"
                    v-if="tableStatus === 1"
                    label="集数/期号"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="description"
                    v-if="tableStatus === 1"
                    width="200px"
                    align="center"
                    label="视频简介">
                </el-table-column>
                <el-table-column
                    align="center"
                    label="相关人物">
                        <template slot-scope="scope">
                            {{videoPersonName(scope.row.figureList)}}
                        </template>
                </el-table-column>
                <el-table-column
                    v-if="tableStatus === 1"
                    align="center"
                    label="视频封面">
                        <template slot-scope="scope">
                            <img @click="displayImage(scope.row.coverImage ? scope.row.coverImage : {})" class="person-image pointer" :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
                        </template>
                </el-table-column>
                <el-table-column
                    v-if="tableStatus === 1"
                    align="center"
                    label="关联正片">
                        <template slot-scope="scope">
                            {{(scope.row.parentId ? featureVideoName(scope.row.parentId) : '/')}}
                        </template>
                </el-table-column>
                <el-table-column
                    min-width="240px"
                    align="center"
                    label="视频地址">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.m3u8For4K"
                            type="text"
                            @click="displayVideoPlayer(scope.row.m3u8For4K)"
                            size="small"
                            >4K</el-button>
                        <el-button
                            v-if="scope.row.m3u8For1080P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For1080P)"
                            >1080</el-button>
                        <el-button
                            v-if="scope.row.m3u8For720P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For720P)"
                            >720</el-button>
                        <el-button
                            v-if="scope.row.m3u8For480P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For480P)"
                            >480</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="type"
                    v-if="tableStatus === 1"
                    align="center"
                    min-width="120px"
                    label="内容类型">
                        <template slot-scope="scope">
                            {{getVideoType(scope.row.type)}}
                        </template>
                </el-table-column>
                <el-table-column
                    v-if="status === 1 && tableStatus === 1"
                    prop="free"
                    align="center"
                    label="是否付费">
                        <template slot-scope="scope">
                            {{scope.row.free ? '是' : '否'}}
                        </template>
                </el-table-column>
                <el-table-column
                    prop="duration"
                    align="center"
                    min-width="120px"
                    label="时长">
                    <template slot-scope="scope">
                        {{duration(scope.row.takeTimeInSec)}}
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="tableStatus === 1"
                    prop="duration"
                    align="center"
                    min-width="120px"
                    label="上下架">
                    <template slot-scope="scope">
                        {{scope.row.visible ? '已上架' : '已下架'}}
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="tableStatus === 1"
                    prop="createdAt"
                    align="center"
                    min-width="120px"
                    label="上传时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="tableStatus === 1"
                    fixed="right"
                    label="操作"
                    align="center"
                    width="160">
                    <template slot-scope="scope">
                        <el-button v-if="tableStatus !== 0" @click="displayVideo(scope.row.id)" type="text" size="small">查看</el-button>
                        <el-button v-if="status !== 1" @click="editVideo(scope.row.id)" type="text" size="small">编辑</el-button>
                        <el-button v-if="status !== 1 && isShow" @click="deleteVideo(scope.row.id, scope.row.visible)" type="text" size="small">
                            {{scope.row.visible ? '下架' : '上架'}}
                        </el-button>
                        <el-button @click="realDeleteVideo(scope.row.id)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <upload-programme-video-dialog :videoStatus="videoStatus" :videoUploadDialogVisible="videoUploadDialogVisible" v-on:changeVideoDialogStatus="closeVideoDialog($event)"></upload-programme-video-dialog>
        <display-video-dialog
            :url="url"
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
import PreviewSingleImage from 'sysComponents/custom_components/global/PreviewSingleImage';
import role from '@/util/config/role';
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
        displayVideoPlayer(url) {
            this.displayVideoDialogVisible = true;
            let baseUri = window.localStorage.getItem('videoBaseUri');
            this.url = `${baseUri}${url}`;
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
