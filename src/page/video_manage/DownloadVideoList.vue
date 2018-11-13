<!--视频资源管理-下载列表-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'视频资源管理'},
            {name:'下载列表'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <div @keyup.enter="getDownloadVideoList" class="text-left">
                <el-form :inline="true" class="filter-form">
                    <el-form-item>
                        <el-input v-model="listQueryParams.keyword" placeholder="请填写视频名称或编号"></el-input>
                    </el-form-item>
                    <el-form-item label="下载时间">
                        <el-date-picker
                            v-model="createRangeTime"
                            type="daterange"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain icon="el-icon-search" @click="getDownloadVideoList">搜索
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" plain class="clear-filter" @click="clearFilters">
                            <svg-icon
                                icon-class="clear_filter">
                            </svg-icon>
                            清空筛选条件
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-table
                header-row-class-name="common-table-header"
                class="my-table-style"
                @selection-change="handleSelectionChange"
                :data="videoList"
                border>
                <el-table-column
                    type="selection"
                    align="center"
                    width="55">
                </el-table-column>
                <el-table-column prop="id" align="center" width="118" label="编号"></el-table-column>
                <el-table-column prop="originName" align="center" label="视频名称">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="top">
                            <div class="gan-tooltip" slot="content">{{scope.row.originName}}</div>
                            <span class="ellipsis-two">{{scope.row.originName}}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="上传时间">
                    <template slot-scope="scope">
                        {{scope.row.uploadedAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="下载时间">
                    <template slot-scope="scope">
                        {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    align="center"
                    width="100px"
                    label="操作"
                    class="operate">
                    <template slot-scope="scope">
                        <el-button
                            class="remove-btn"
                            type="text"
                            size="small"
                            @click="removeVideo(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="listQueryParams.pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="listQueryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <div class="visible-item">
                <el-button
                    class="create-blue-btn"
                    size="small"
                    @click="exportAllList">
                    全部导出
                </el-button>
                <el-button
                    :class="'disabled-red-btn ' + (multipleSelection.length === 0 ? 'is-disabled' : '')"
                    size="small"
                    :disabled="removeDisabled"
                    @click="removeBatchVideos">
                    批量删除
                </el-button>
            </div>
            <el-button class="create-blue-btn back-list" @click="toVideoList">返回视频列表</el-button>
        </div>
    </div>
</template>

<script>
    import XLSX from 'xlsx';

    export default {
        name: 'DownloadVideoList',
        data() {
            return {
                listQueryParams: {
                    keyword: '',
                    startedAt: '',
                    endedAt: '',
                    pageNum: 1,
                    pageSize: 10
                },
                createRangeTime: [],
                total: 0,
                removeDisabled: false,
                videoList: [],
                multipleSelection: [],
                exportQueryParams: {
                    page: 1,
                    size: 100000
                },
                requestNo: 0
            };
        },
        mounted() {
            this.getDownloadVideoList();
        },
        methods: {
            getDownloadVideoList() {
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.startedAt = this.createRangeTime[0];
                    this.listQueryParams.endedAt = this.createRangeTime[1];
                } else {
                    this.listQueryParams.startedAt = '';
                    this.listQueryParams.endedAt = '';
                }
                this.$service.getDownloadVideoList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.videoList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getDownloadVideoList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getDownloadVideoList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            clearFilters() {
                this.listQueryParams.keyword = '';
                this.listQueryParams.startedAt = '';
                this.listQueryParams.endedAt = '';
                this.createRangeTime = [];
            },
            // 导出问题时长视频列表
            exportAllList() {
                this.$service.getDownloadVideoList(this.exportQueryParams).then(response => {
                    if (response && response.code === 0) {
                        if (response && response.code === 0) {
                            let exportChannelData = [];
                            // 设置导出的数据
                            response.data.list.map(video => {
                                let exportVideo = {};
                                exportVideo['视频编号'] = video.id;
                                exportVideo['视频文件名'] = video.originName;
                                exportVideo['上传时间'] = this.$util.formatDate(new Date(video.uploadedAt), 'yyyy-MM-DD HH:mm:SS');
                                exportVideo['下载时间'] = this.$util.formatDate(new Date(video.createdAt), 'yyyy-MM-DD HH:mm:SS');
                                exportChannelData.push(exportVideo);
                            });
                            let wb = XLSX.utils.book_new();
                            let newWsName = '表1';
                            let ws = XLSX.utils.json_to_sheet(exportChannelData);
                            XLSX.utils.book_append_sheet(wb, ws, newWsName);
                            XLSX.writeFile(wb, '视频下载列表_' + new Date() + '.xlsx');
                        }
                    }
                });
            },
            // 删除某个视频
            removeVideo(video) {
                this.$confirm(`您确定要删除吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.removeSingleVideo(video);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消批量删除'
                    });
                });
            },
            // 批量删除视频
            removeBatchVideos() {
                let that = this;
                this.requestNo = 0;
                this.removeDisabled = true;
                this.$message('当前有' + this.multipleSelection.length + '个视频,大约需要' + this.multipleSelection.length + '秒,请耐心等待');
                // 依次删除视频
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    let newFunction = function () {
                        return (function (i) {
                            that.removeSingleVideo(that.multipleSelection[i], i);
                        })(i);
                    };
                    setTimeout(newFunction, i * 1000);
                }
            },
            removeSingleVideo(video, index) {
                let that = this;
                this.$service.deleteSomeServerVideoById({
                    host: video.host,
                    port: video.port,
                    id: video.id
                }).then(response => {
                    if (index !== undefined) {
                        this.requestNo++;
                    }
                    if (response && response.code === 0) {
                        this.$message.success('"' + video.originName + '"' + '删除成功');
                    }
                    if (this.requestNo === this.multipleSelection.length) {
                        this.removeDisabled = false;
                        setTimeout(function () {
                            that.$message(that.multipleSelection.length + '个视频删除完成');
                        }, 1000);
                    }
                });
            },
            toVideoList() {
                this.$router.push({name: 'VideoList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .block-box {
        position: relative;
        padding-top: 55px;
    }

    .back-list {
        position: absolute;
        right: 0px;
        top: 10px;
    }

    .el-table {
        margin-top: 0px;
    }

    .el-pagination {
        margin-bottom: 50px;
    }

    .visible-item {
        position: absolute;
        right: 0px;
        top: 85px;
    }

</style>
