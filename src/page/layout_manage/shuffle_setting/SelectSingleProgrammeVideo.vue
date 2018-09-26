<!--选择单个节目中的视频组件-->
<template>
    <div>
        <el-table
            :data="programmeVideoList"
            border
            header-row-class-name="common-table-header"
            style="width: 100%"
            highlight-current-row
            :row-class-name="tableRowClassName">
            <el-table-column
                width="50px"
                align="center"
                label="选择">
                <template slot-scope="scope">
                    <el-radio
                        v-model="singleProgrammeVideo.id"
                        :label="scope.row.id"
                        @change="setProgrammeVideo(scope.row)">
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column
                prop="id"
                width="120px"
                align="center"
                label="编号">
                <template slot-scope="scope">
                    <label>{{scope.row.id}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                align="center"
                width="100px"
                label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                         :alt="scope.row.coverImage.name"
                         v-if="scope.row.coverImage">
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="type"
                align="center"
                label="时间">
                <template slot-scope="scope">
                    {{scope.row.takeTimeInSec | fromSecondsToTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="type"
                align="center"
                label="类别">
                <template slot-scope="scope">
                    {{scope.row.type | setVideoType}}
                </template>
            </el-table-column>
            <el-table-column
                prop="link"
                align="center"
                width="150px"
                label="预览视频">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.m3u8For4K"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For4K,scope.row.originName)"
                    >4K
                    </el-button>
                    <el-button
                        v-if="scope.row.m3u8For1080P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For1080P,scope.row.originName)"
                    >1080
                    </el-button>
                    <el-button
                        v-if="scope.row.m3u8For720P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For720P,scope.row.originName)"
                    >720
                    </el-button>
                    <el-button
                        v-if="scope.row.m3u8For480P"
                        type="text"
                        size="small"
                        @click="displayVideo(scope.row.m3u8For480P,scope.row.originName)"
                    >480
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="visible"
                align="center"
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.visible ? '已上架' :'已下架'}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalAmount">
        </el-pagination>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :title="previewVideoInfo.title"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';

    export default {
        name: 'SelectSingleProgrammeVideo',
        components: {
            DisplayVideoDialog
        },
        props: ['programme'],
        data() {
            return {
                listQueryParams: {
                    programmeId: '',
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                statusOptions: [{
                    value: '',
                    label: '全部'
                }, {
                    value: true,
                    label: '正常'
                }, {
                    value: false,
                    label: '已下架'
                }],
                totalAmount: 0,
                programmeVideoList: [],
                // 单选节目中的视频
                singleProgrammeVideo: {},
                previewVideoInfo: {
                    url: '',
                    visible: false
                }
            };
        },
        // 组件被keep-live设置为active状态时
        activated() {
            this.init();
        },
        methods: {
            init() {
                this.getProgrammeVideoList();
            },
            // 获取节目中的视频列表
            getProgrammeVideoList() {
                this.listQueryParams.programmeId = this.programme.id;
                this.$service.getProgrammeVideoListById(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.programmeVideoList = response.data.list;
                        this.totalAmount = response.data.total;
                    }
                });
            },
            tableRowClassName({row}) {
                if (!row.visible || !row.name) {
                    return 'warning-row video-row';
                }
                return 'video-row';
            },
            // 预览视频
            displayVideo(url, title) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.previewVideoInfo.url = `${baseUri}${url}`;
                this.previewVideoInfo.title = title;
                this.previewVideoInfo.visible = true;
            },
            // 关闭视频预览
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getProgrammeVideoList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum - 1;
                this.getProgrammeVideoList();
            },
            // 选中的节目中的视频更改时触发
            setProgrammeVideo(row) {
                if (!row) {
                    return;
                }
                if (row.visible && row.name) {
                    this.$emit('setProgrammeVideo', row);
                    // 节目中的视频下架或者没有展示名称时
                } else {
                    this.$message.warning(!row.visible ? '当前节目中的视频已经下架，不可选择' : '当前节目中的视频没有展示名称，不可选择，请添加相应的展示名称后再选择');
                    this.singleProgrammeVideo = {};
                    this.$emit('resetProgrammeVideo');
                }
            }
        }
    };
</script>

<style lang="less" scoped>

    .el-table {
        img {
            width: 70px;
        }
    }

</style>
