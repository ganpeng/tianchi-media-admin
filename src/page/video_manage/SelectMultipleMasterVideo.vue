<!--多选主站上的视频列表组件（已筛选除了子站视频）-->
<template>
    <div class="video-table-container text-left" @keyup.enter="getVideoList">
        <div class="search-field-item">
            <el-input
                v-model="listQueryParams.keyword"
                clearable
                class="border-input"
                placeholder="搜索你想要的信息">
            </el-input>
            <el-button
                class="btn-style-one"
                @click="getVideoList"
                icon="el-icon-search"
                type="primary"
                plain>
                搜索
            </el-button>
            <el-input v-show="false"></el-input>
            <el-select
                v-model="listQueryParams.suffix"
                clearable
                placeholder="请选择视频后缀">
                <el-option
                    v-for="(item, index) in suffixOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <el-table
            ref="selectMultipleVideoTable"
            :data="videoList"
            header-row-class-name="common-table-header"
            border
            @select="selectVideo"
            @select-all="selectAll"
            style="width:100%;margin:20px 0;">
            <el-table-column
                align="center"
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="code"
                align="center"
                width="120px"
                label="编号">
            </el-table-column>
            <el-table-column
                prop="originName"
                align="center"
                width="300px"
                label="视频名称">
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
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQueryParams.pageNum"
            :page-sizes="[10, 20, 50,100,200]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <div slot="footer" class="dialog-footer">
            <el-button @click="closeSelectVideoDialog">取 消</el-button>
            <el-button type="primary" @click="pullVideoFromMaster">确 定</el-button>
        </div>
    </div>
</template>
<script>
    import role from '@/util/config/role';

    export default {
        name: 'SelectMultipleMasterVideo',
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    suffix: '',
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                suffixOptions: role.VIDEO_SUFFIX_OPTIONS,
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
                        return '---';
                }
            }
        },
        created() {
            this.getVideoList();
        },
        methods: {
            // 获取视频的列表
            getVideoList() {
                this.$service.getMasterVideoList(this.listQueryParams).then(response => {
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
                    }
                });
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
            // 从主站拉取视频到本地
            pullVideoFromMaster() {
                if (!this.selectedMultipleVideo || this.selectedMultipleVideo.length === 0) {
                    this.$message.warning('请选择相应的视频');
                    return;
                }
                this.$emit('pullVideoFromMaster', this.selectedMultipleVideo);
                this.$emit('closeSelectVideoDialog');
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getVideoList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getVideoList();
            },
            closeSelectVideoDialog() {
                this.$emit('closeSelectVideoDialog');
            }
        }
    };
</script>

<style lang="scss" scoped>

    .search-field-item {
        margin-top: 24px;
        margin-left: 40px;
        margin-bottom: 20px;
        .el-input {
            margin-right: 20px;
            width: 180px;
        }
        .el-select {
            margin-left: 30px;
        }
    }

    .dialog-footer {
        margin-top: 50px;
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

</style>
