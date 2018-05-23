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
                    label="视频ID"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="视频名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    v-if="status !== 2"
                    prop="sortNumber"
                    label="视频排序">
                </el-table-column>
                <el-table-column
                    prop="description"
                    width="200px"
                    label="视频简介">
                </el-table-column>
                <el-table-column
                    v-if="status !== 2"
                    prop="positive"
                    label="关联正片">
                </el-table-column>
                <el-table-column
                    prop="url"
                    width="200px"
                    label="视频地址">
                </el-table-column>
                <el-table-column
                    prop="contentType"
                    label="内容类型">
                </el-table-column>
                <el-table-column
                    prop="typeId"
                    label="视频类型">
                </el-table-column>
                <el-table-column
                    v-if="status === 1"
                    prop="needPay"
                    label="是否付费">
                </el-table-column>
                <el-table-column
                    prop="duration"
                    label="时长">
                </el-table-column>
                <el-table-column
                    prop="createdAt"
                    label="上传时间">
                </el-table-column>
                <el-table-column
                    label="操作"
                    width="160">
                    <template slot-scope="scope">
                        <el-button @click="displayVideo(scope.row)" type="primary" size="small">查看</el-button>
                        <el-button v-if="status === 3" @click="editVideo(scope.row)" type="warning" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <upload-programme-video-dialog :videoStatus="videoStatus" :videoUploadDialogVisible="videoUploadDialogVisible" v-on:changeVideoDialogStatus="closeVideoDialog($event)"></upload-programme-video-dialog>
    </div>
</template>
<script>
import UploadProgrammeVideoDialog from './UploadProgrammeVideoDialog';
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
            default: '电视剧'
        },
        status: {
            type: Number, // 1表示“电视剧”， 2表示“电影”， 3表示“综艺”
            default: 1
        }
    },
    data() {
        return {
            videoUploadDialogVisible: false,
            isEdit: true,
            //  videoStatus 有三中状态，0：表示创建， 1: 表示编辑， 2： 表示查看
            videoStatus: 1,
            currentVideo: {}
        };
    },
    methods: {
        editVideo(id) {
            this.videoUploadDialogVisible = true;
            this.videoStatus = 1;
            this.setVideo(id);
        },
        displayVideo(id) {
            this.videoUploadDialogVisible = true;
            this.videoStatus = 2;
            this.setVideo(id);
        },
        closeVideoDialog(status) {
            this.videoUploadDialogVisible = status;
        },
        setVideo(id) {
            let video = this.dataList.find((video) => video.id === id);
            this.currentVideo = video;
        }
    }
};
</script>
<style lang="less" scoped>
</style>
