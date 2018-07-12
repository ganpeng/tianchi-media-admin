<!--选择单个节目中的视频组件-->
<template>
    <div>
        <el-table
            :data="programmeVideoList"
            border
            ref="selectSingleProgrammeVideo"
            style="width: 100%"
            highlight-current-row
            :row-class-name="tableRowClassName"
            @current-change="setProgrammeVideo">
            <el-table-column
                width="50px"
                label="选择">
                <template slot-scope="scope">
                    <i class="el-icon-success"></i>
                </template>
            </el-table-column>
            <el-table-column
                prop="id"
                label="编号">
                <template slot-scope="scope">
                    <label>{{scope.row.id}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="名称">
            </el-table-column>
            <el-table-column
                label="图片">
                <template slot-scope="scope">
                    <img :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl"
                         :alt="scope.row.coverImage.name"
                         v-if="scope.row.coverImage">
                    <label v-else>------</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="description"
                label="简介">
                <template slot-scope="scope">
                    <label>{{scope.row.description}}</label>
                    <el-popover
                        placement="right"
                        :title="scope.row.name + '简介'"
                        width="250"
                        trigger="hover"
                        :content="scope.row.description">
                        <el-button slot="reference" type="text" class="more">更多</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                prop="type"
                label="时间">
                <template slot-scope="scope">
                    {{scope.row.takeTimeInSec | fromSecondsToTime}}
                </template>
            </el-table-column>
            <el-table-column
                prop="type"
                label="类别">
                <template slot-scope="scope">
                    {{scope.row.type | setVideoType}}
                </template>
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
                prop="visible"
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
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../../video_manage/DisplayVideoDialog';

    export default {
        name: 'SelectSingleProgrammeVideo',
        components: {
            DisplayVideoDialog
        },
        props: ['programme'],
        data() {
            return {
                listQueryParams: {
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
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getProgrammeVideoList();
            },
            // 获取节目中的视频列表
            getProgrammeVideoList() {
                this.$service.getProgrammeVideoListById(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.programmeVideoList = response.data.list;
                        this.totalAmount = response.data.total;
                        // 对于选择的单选项进行勾选
                        for (let k = 0; k < this.programmeVideoList.length; k++) {
                            if (this.singleProgrammeVideo.id === this.programmeVideoList[k].id) {
                                this.$nextTick(function () {
                                    this.$refs.selectSingleProgrammeVideo.setCurrentRow(this.programmeVideoList[k]);
                                    this.$emit('setProgrammeVideo', this.programmeVideoList[k]);
                                });
                            }
                        }
                    }
                });
            },
            tableRowClassName({row}) {
                if (!row.visible) {
                    return 'warning-row';
                }
                return '';
            },
            // 预览视频
            displayVideo(url) {
                this.previewVideoInfo.url = `http://dev-video.tianchiapi.com${url}`;
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
                if (row.visible) {
                    this.singleProgrammeVideo = row;
                    this.$emit('setProgrammeVideo', row);
                } else {
                    this.$message('当前节目中的视频已经下架，不可选择');
                    this.$refs.selectSingleProgrammeVideo.setCurrentRow();
                    this.$emit('resetProgrammeVideo');
                }
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .el-table {
        img {
            width: 120px;
        }
        label {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            -ms-text-overflow: ellipsis;
            text-overflow: ellipsis;
        }
        .more {
            float: right;
        }

        .el-icon-success {
            margin-right: 5px;
            color: #409EFF;
            visibility: hidden;
        }
        .current-row {
            .el-icon-success {
                visibility: visible;
            }
        }
    }

</style>
