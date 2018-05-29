<!--节目表格组件-->
<template>
    <div class="tele-play-table-container">
        <el-row class="block-title">
            <h2 class="table-title">{{title}}</h2>
            <el-table
                :data="dataList"
                border
                style="width: 100%">
                <el-table-column
                    prop="id"
                    v-if="tableStatus === 1"
                    label="视频ID"
                    align="center"
                    width="240px">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="视频名称"
                    align="center"
                    width="180">
                </el-table-column>
                <el-table-column
                    v-if="status !== 2"
                    prop="sort"
                    align="center"
                    label="视频排序">
                </el-table-column>
                <el-table-column
                    prop="description"
                    width="200px"
                    align="center"
                    label="视频简介">
                </el-table-column>
                <el-table-column
                    v-if="status !== 2"
                    prop="positive"
                    align="center"
                    label="关联正片">
                </el-table-column>
                <el-table-column
                    prop="playUrl"
                    min-width="240px"
                    align="center"
                    label="视频地址">
                </el-table-column>
                <el-table-column
                    prop="type"
                    align="center"
                    min-width="120px"
                    label="内容类型">
                        <template slot-scope="scope">
                            {{getVideoType(scope.row.type)}}
                        </template>
                </el-table-column>
                <el-table-column
                    prop="quality"
                    align="center"
                    min-width="120px"
                    label="视频类型">
                </el-table-column>
                <el-table-column
                    v-if="status === 1"
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
                        <el-button v-if="status !== 1" @click="deleteVideo(scope.row.id)" type="text" size="small">
                            {{scope.row.visible ? '下架' : '上架'}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="tableStatus === 0"
                    fixed="right"
                    label="操作"
                    align="center"
                    width="160">
                    <template slot-scope="scope">
                        <el-button v-if="tableStatus === 0" @click="deleteUnsavedVideo(scope.row.uid)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <upload-programme-video-dialog :videoStatus="videoStatus" :videoUploadDialogVisible="videoUploadDialogVisible" v-on:changeVideoDialogStatus="closeVideoDialog($event)"></upload-programme-video-dialog>
    </div>
</template>
<script>
import {mapActions, mapMutations} from 'vuex';
import UploadProgrammeVideoDialog from './UploadProgrammeVideoDialog';
import role from '@/util/config/role';
export default {
    name: 'ProgrammeTable',
    components: {
        UploadProgrammeVideoDialog
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
            isEdit: true,
            //  videoStatus 有三中状态，0：表示创建， 1: 表示编辑， 2： 表示查看
            videoStatus: 1
        };
    },
    computed: {
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
            deleteVideoFromList: 'programmeVideo/deleteVideoFromList'
        }),
        ...mapActions({
            getProgrammeVideo: 'programmeVideo/getProgrammeVideo',
            deleteProgrammeVideo: 'programme/deleteProgrammeVideo'
        }),
        editVideo(id) {
            this.getProgrammeVideo(id)
                .then((res) => {
                    this.videoUploadDialogVisible = true;
                    this.videoStatus = 1;
                });
        },
        displayVideo(id) {
            this.getProgrammeVideo(id)
                .then((res) => {
                    this.videoUploadDialogVisible = true;
                    this.videoStatus = 2;
                });
        },
        deleteVideo(id) {
            this.deleteProgrammeVideo(id);
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
                this.deleteVideoFromList({uid});
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
