<template>
    <div class="video-table-container text-center">
        <el-form :inline="true">
            <el-form-item class="search">
                <el-input
                    v-model="queryParams.key"
                    placeholder="搜索你想要的信息"
                    clearable>
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getVideoList">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-table
            ref="selectMultipleVideoTable"
            :data="videoList"
            border
            @select="selectVideo"
            :row-class-name="tableRowClassName"
            style="width:100%;margin:20px 0;">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="id"
                align="center"
                width="240px"
                label="编号">
            </el-table-column>
            <el-table-column
                prop="originName"
                align="center"
                width="200px"
                label="视频名称">
            </el-table-column>
            <el-table-column
                prop="link"
                align="center"
                width="300px"
                label="预览视频">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.m3u8For1080P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For1080P)"
                    >1080
                    </el-button>
                    <el-button
                        v-if="scope.row.m3u8For720P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For720P)"
                    >720
                    </el-button>
                    <el-button
                        v-if="scope.row.m3u8For480P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For480P)"
                    >480
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="takeTimeInSec"
                align="center"
                label="视频时长">
                <template slot-scope="scope">
                    {{scope.row.takeTimeInSec | fromSecondsToTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="status"
                align="center"
                label="注入状态">
                <template slot-scope="scope">
                    {{scope.row.status | switchStatus}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="220px"
                label="上传日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD HH:MM:SS')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="220px"
                label="视频用途">
                <template slot-scope="scope">
                    {{scope.row.videoType | switchVideoType}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <span slot="footer" class="dialog-footer">
              <el-button @click="closeSelectVideoDialog">取 消</el-button>
              <el-button type="primary" @click="appendVideo">确 定</el-button>
            </span>
        <display-video-dialog
            :url="url"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>
<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';

    export default {
        components: {
            DisplayVideoDialog
        },
        props: ['currentSelectedVideoList'],
        data() {
            return {
                queryParams: {
                    status: 'SUCCESS',
                    videoType: 'CAROUSEL',
                    key: '',
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                total: 0,
                displayVideoDialogVisible: false,
                url: '',
                hasRadio: true,
                videoList: [],
                selectedMultipleVideo: []
            };
        },
        filters: {
            switchStatus(status) {
                switch (status) {
                    case 'SUCCESS':
                        return '注入成功';
                    case 'FAILED':
                        return '注入失败';
                    case 'INJECTING':
                        return '注入中';
                    default:
                        return '------';
                }
            },
            switchVideoType(videoType) {
                switch (videoType) {
                    case 'VOD':
                        return '点播';
                    case 'CAROUSEL':
                        return '轮播';
                    default:
                        return '------';
                }
            }
        },
        created() {
            this.getVideoList();
        },
        methods: {
            // 获取视频的列表
            getVideoList() {
                this.$service.getVideoList(this.queryParams).then(response => {
                    if (response && response.code === 0) {
                        this.videoList = response.data.list;
                        this.total = response.data.total;
                        // 选中已选中的视频
                        this.selectedMultipleVideo.map(currentVideo => {
                            this.videoList.map(video => {
                                if (currentVideo.code === video.code) {
                                    this.$nextTick(function () {
                                        this.$refs.selectMultipleVideoTable.toggleRowSelection(video);
                                    });
                                }
                            });
                        });
                        // 对原先已选则的视频做标记
                        this.currentSelectedVideoList.map(currentVideo => {
                            this.videoList.map(video => {
                                if (currentVideo.code === video.code) {
                                    video.hadSelected = true;
                                }
                            });
                        });
                    }
                });
            },
            tableRowClassName({row}) {
                if (row.hadSelected) {
                    return 'unselectable-row';
                }
                return '';
            },
            // 选择或者取消选择视频
            selectVideo(selection, video) {
                if (video.hadSelected) {
                    this.$message('该视频已经存在于轮播频道列表中，不可选择');
                    return;
                }
                if (this.getOperate(selection, video) === 'APPEND') {
                    this.selectedMultipleVideo.push(video);
                } else {
                    for (let i = 0; i < this.selectedMultipleVideo.length; i++) {
                        if (this.selectedMultipleVideo[i].code === video.code) {
                            this.selectedMultipleVideo.splice(i, 1);
                        }
                    }
                }
            },
            // 判定当前操作情况
            getOperate(selection, row) {
                for (let i = 0; i < selection.length; i++) {
                    if (selection[i].code === row.code) {
                        return 'APPEND';
                    }
                }
                return 'CANCEL';
            },
            // 添加视频
            appendVideo() {
                this.$emit('appendVideo', this.selectedMultipleVideo);
                this.$emit('closeSelectVideoDialog');
            },
            handleSizeChange() {
                this.getVideoList();
            },
            handleCurrentChange(pageNum) {
                this.queryParams.pageNum = pageNum - 1;
                this.getVideoList();
            },
            closeDisplayVideoDialog(status) {
                this.displayVideoDialogVisible = status;
            },
            displayVideo(url) {
                this.displayVideoDialogVisible = true;
                this.url = `http://dev-video.tianchiapi.com${url}`;
            },
            closeSelectVideoDialog() {
                this.$emit('closeSelectVideoDialog');
            }
        }
    };
</script>
<style lang="less" scoped>

</style>
