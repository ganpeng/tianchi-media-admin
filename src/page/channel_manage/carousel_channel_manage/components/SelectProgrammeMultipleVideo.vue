<template>
    <div id="select-multiple-video" class="video-table-container text-center">
        <div id="select-steps">
            <div>
                <label>1</label>
                <span>选择节目</span>
            </div>
            <i></i>
            <div>
                <label>2</label>
                <span>选择节目内视频</span>
            </div>
        </div>
        <div id="select-all">
            <el-checkbox v-model="checkedAll">选择该节目内的所有视频</el-checkbox>
        </div>
        <el-table
            ref="selectMultipleVideoTable"
            :data="videoList"
            header-row-class-name="common-table-header"
            border
            @select="selectVideo"
            @select-all="selectAll"
            :row-class-name="tableRowClassName"
            style="width:100%;margin:20px 0;">
            <el-table-column
                align="center"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="id"
                align="center"
                width="120px"
                label="视频编号">
            </el-table-column>
            <el-table-column
                prop="originName"
                align="center"
                label="视频名称">
            </el-table-column>
            <el-table-column
                prop="link"
                align="center"
                label="视频">
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
                prop="takeTimeInSec"
                align="center"
                label="视频时长">
                <template slot-scope="scope">
                    {{scope.row.takeTimeInSec | fromSecondsToTime}}
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
            :page-size="queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :title="previewVideoInfo.title"
            ref="displayVideoPlayer"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from 'sysComponents/custom_components/custom/DisplayVideoDialog';

    export default {
        name: 'SelectMultipleVideo',
        components: {
            DisplayVideoDialog
        },
        props: {
            currentSelectedVideoList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            currentSelectedProgrammeId: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                checkedAll: false,
                queryParams: {
                    programmeId: this.currentSelectedProgrammeId,
                    typeList: 'FEATURE',
                    pageNum: 0,
                    pageSize: 5
                },
                pageNum: 1,
                total: 0,
                previewVideoInfo: {
                    url: '',
                    title: '',
                    visible: false
                },
                videoList: [],
                selectedMultipleVideo: this.currentSelectedVideoList.slice(0)
            };
        },
        created() {
            this.getVideoList();
        },
        methods: {
            // 获取视频的列表
            getVideoList() {
                this.$service.getProgrammeVideoListById(this.queryParams).then(response => {
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
                    return 'unselectable-row video-row';
                }
                return 'video-row';
            },
            selectAll(selections) {
                // 判断是添加还是删除所有当前videoList
                // 取消全选
                if (selections.length === 0) {
                    for (let i = 0; i < this.videoList.length; i++) {
                        for (let k = 0; k < this.selectedMultipleVideo.length; k++) {
                            if (this.videoList[i].code === this.selectedMultipleVideo[k].code) {
                                this.selectedMultipleVideo.splice(k, 1);
                            }
                        }
                    }
                    // 全选添加
                } else {
                    for (let i = 0; i < this.videoList.length; i++) {
                        let tag = false;
                        // 去掉当前已选择的
                        for (let k = 0; k < this.selectedMultipleVideo.length; k++) {
                            if (this.videoList[i].code === this.selectedMultipleVideo[k].code) {
                                tag = true;
                            }
                        }
                        // 去掉原先已选择的
                        for (let m = 0; m < this.currentSelectedVideoList.length; m++) {
                            if (this.videoList[i].code === this.currentSelectedVideoList[m].code) {
                                tag = true;
                            }
                        }
                        if (tag === false) {
                            this.selectedMultipleVideo.push(this.videoList[i]);
                        }
                    }
                }
            },
            // 选择或者取消选择视频
            selectVideo(selection, video) {
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
            getSelectedMultipleVideo() {
                return this.selectedMultipleVideo;
            },
            handleSizeChange(pageSize) {
                this.queryParams.pageSize = pageSize;
                this.getVideoList();
            },
            handleCurrentChange(pageNum) {
                this.queryParams.pageNum = pageNum - 1;
                this.getVideoList();
            },
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            },
            displayVideo(url, title) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.previewVideoInfo.url = `${baseUri}${url}`;
                this.previewVideoInfo.title = title;
                this.previewVideoInfo.visible = true;
                this.$refs.displayVideoPlayer.showDialog();
            },
            closeSelectVideoDialog() {
                this.$emit('closeSelectVideoDialog');
            }
        }
    };
</script>

<style lang="scss" scoped>

    .selected-count {
        margin-top: -30px;
        height: 45px;
        border-bottom: 1px solid #3E495E;
        text-align: left;
        span {
            padding-left: 5px;
            height: 45px;
            line-height: 55px;
            font-size: 14px;
            color: #FFFFFF;
        }
    }

    .search-field-item {
        text-align: left;
        margin-top: 24px;
        margin-left: 40px;
        margin-bottom: 20px;
        .el-input {
            margin-right: 20px;
            width: 180px;
        }
        .svg-icon {
            margin-right: 10px;
        }
    }

    .dialog-footer {
        margin-top: 20px;
        text-align: right;
        .el-button {
            width: 100px;
            height: 40px;
            &.el-button--default {
                color: $dangerColor;
            }
            &.el-button--default.el-button--primary {
                color: #A3D0FD;
            }
            &:first-child {
                margin-left: 10px;
            }
        }
    }

    .el-table {
        margin: 10px 0px !important;
    }

</style>

<style lang="scss">

    #select-multiple-video {
        #select-all {
            padding-left: 24px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .el-checkbox {
                padding: 0 0 24px 0;
                &.is-checked, &.is-focus {
                    .el-checkbox__label {
                        font-size: 14px;
                        font-weight: 400;
                        color: rgba(99, 116, 151, 1);
                    }
                }
            }
            .el-checkbox__inner {
                width: 14px;
                height: 14px;
                border-radius: 2px;
                border: 1px solid rgba(99, 116, 151, 1);
            }
            .el-checkbox__label {
                font-size: 14px;
                font-weight: 400;
                color: rgba(99, 116, 151, 1);
            }
        }
        #select-steps {
            margin-top: 15px;
            margin-bottom: 47px;
            display: flex;
            align-items: center;
            justify-content: center;
            div {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                &:last-child {
                    label {
                        background: #0062C4;
                    }
                    span {
                        color: rgba(255, 255, 255, 1);
                    }
                }
                label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: #3AC26F;
                    font-size: 20px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                }
                span {
                    margin-top: 12px;
                    font-size: 14px;
                    font-weight: 400;
                    color: #3AC26F;
                }
            }
            i {
                margin-right: -10px;
                margin-bottom: 36px;
                width: 300px;
                height: 2px;
                background: #3AC26F;
                border-radius: 1px;
            }
        }
    }

</style>
