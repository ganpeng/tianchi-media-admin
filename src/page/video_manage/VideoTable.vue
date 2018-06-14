<template>
    <div class="video-table-container">
       <el-table :data="video.list" border style="width:100%;margin:20px 0;">
            <el-table-column v-if="hasRadio" align="center" label="选择">
                <template slot-scope="scope">
                    <el-radio :value="video.selectedVideoId" :label="scope.row.id" @input="setSelectedVideoId({id: scope.row.id})">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="id" align="center" width="240px" label="编号"></el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="视频名称"></el-table-column>
            <el-table-column prop="link" align="center" width="300px" label="预览视频">
                <template slot-scope="scope">
                    <el-button type="text" @click="displayVideo(scope.row.playUrl)" size="small">4K</el-button>
                    <el-button type="text" size="small">1080</el-button>
                    <el-button type="text" size="small">720</el-button>
                    <el-button type="text" size="small">480</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="duration" align="center" label="视频时长"></el-table-column>
            <el-table-column align="center" width="120px" label="上传日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center" width="120px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="video.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="video.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="video.total">
        </el-pagination>
        <display-video-dialog
            :url="url"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import DisplayVideoDialog from './DisplayVideoDialog';
export default {
    components: {
        DisplayVideoDialog
    },
    props: {
        hasRadio: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            displayVideoDialogVisible: false,
            url: ''
        };
    },
    computed: {
        ...mapGetters({
            video: 'video/videoObj'
        })
    },
    methods: {
        ...mapMutations({
            setSelectedVideoId: 'video/setSelectedVideoId'
        }),
        handleSizeChange(pageSize) {
        },
        handleCurrentChange(pageNum) {
        },
        closeDisplayVideoDialog(status) {
            this.displayVideoDialogVisible = status;
        },
        displayVideo(url) {
            this.displayVideoDialogVisible = true;
            this.url = url;
        }
    }
};
</script>
<style lang="less" scoped>
</style>
