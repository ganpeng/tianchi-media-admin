<!--视频资源管理-下载列表-->
<template>
    <div>
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row" @keyup.enter="getDownloadVideoList">
                    <div class="search-field-item">
                        <el-input
                            v-model="listQueryParams.keyword"
                            @change="getDownloadVideoList"
                            clearable
                            class="border-input"
                            placeholder="请填写视频名称或编号">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="getDownloadVideoList" type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">下载时间</label>
                        <el-date-picker
                            v-model="createRangeTime"
                            type="daterange"
                            @change="getDownloadVideoList"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <div class="search-field-item">
                        <label class="search-field-item-label">状态</label>
                        <el-select
                            v-model="listQueryParams.status"
                            @change="getDownloadVideoList"
                            clearable
                            placeholder="请选择视频下载状态">
                            <el-option
                                v-for="(item, index) in statusOptions"
                                :key="index"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <el-button
                        class="btn-style-one"
                        type="primary"
                        @click="clearFilters"
                        plain>
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">下载视频列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                        <el-dropdown
                            trigger="click"
                            class="my-dropdown"
                            :class="{'is-disabled':multipleSelection.length === 0}">
                            <span class="el-dropdown-link">
                                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <span @click="retryDownloadBatchVideos">批量重试</span>
                                </el-dropdown-item>
                                <el-dropdown-item>
                                    <span @click="removeBatchVideos">批量删除</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="float-right">
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="exportAllList">
                            <svg-icon icon-class="add"></svg-icon>
                            导出
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="block-box">
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
                <el-table-column align="center" label="服务器地址">
                    <template slot-scope="scope">
                        {{scope.row.host}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status">
                            <span v-if="scope.row.status === 'SUCCESS'" class="status-normal">成功</span>
                            <span v-if="scope.row.status === 'FAILED'" class="status-abnormal">失败</span>
                            <span v-if="scope.row.status === 'DOWNLOADING'" class="status-on-going">下载中</span>
                            <span
                                v-if="scope.row.status === 'FAILED'"
                                class="retry-text-btn"
                                @click="requestForDownloadVideo([scope.row.id])">
                                重试
                           </span>
                        </template>
                        <span v-else>---</span>
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
                    align="center"
                    width="100px"
                    label="操作"
                    class="operate">
                    <template slot-scope="scope">
                        <div class="operator-btn-wrapper">
                            <span class="btn-text text-danger" @click="removeVideo(scope.row)">删除</span>
                        </div>
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
            <div class="text-left table-dropdow-box">
                <el-dropdown
                    trigger="click"
                    class="my-dropdown"
                    :class="{'is-disabled':multipleSelection.length === 0}">
                            <span class="el-dropdown-link">
                                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <span @click="retryDownloadBatchVideos">批量重试</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="removeBatchVideos">批量删除</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
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
                    status: '',
                    startedAt: '',
                    endedAt: '',
                    pageNum: 1,
                    pageSize: 10
                },
                createRangeTime: [],
                total: 0,
                statusOptions: [
                    {label: '下载中', value: 'DOWNLOADING'},
                    {label: '成功', value: 'SUCCESS'},
                    {label: '失败', value: 'FAILED'}
                ],
                removeDisabled: true,
                videoList: [],
                multipleSelection: [],
                exportQueryParams: {
                    pageNum: 1,
                    pageSize: 100000
                },
                requestNo: 0
            };
        },
        mounted() {
            this.getDownloadVideoList();
        },
        methods: {
            // 获取下载视频列表
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
                this.removeDisabled = this.multipleSelection.length === 0;
            },
            clearFilters() {
                this.listQueryParams.keyword = '';
                this.listQueryParams.startedAt = '';
                this.listQueryParams.endedAt = '';
                this.createRangeTime = [];
                this.listQueryParams.status = '';
                this.getDownloadVideoList();
            },
            // 导出下载视频列表
            exportAllList() {
                this.$service.getDownloadVideoList(this.exportQueryParams).then(response => {
                    if (response && response.code === 0) {
                        let exportChannelData = [];
                        // 设置导出的数据
                        response.data.list.map(video => {
                            let exportVideo = {};
                            exportVideo['视频编号'] = video.id;
                            exportVideo['视频文件名'] = video.originName;
                            exportVideo['服务器地址'] = video.host;
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
                });
            },
            // 批量重试下载视频
            retryDownloadBatchVideos() {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择视频');
                    return;
                }
                let videoIdList = [];
                this.multipleSelection.map(video => {
                    videoIdList.push(video.id);
                });
                this.requestForDownloadVideo(videoIdList);
            },
            // 请求重新下载视频
            requestForDownloadVideo(idList) {
                this.$message.success('正在请求下载视频文件，请稍等');
                this.$service.exportTsVideos({videoIdList: idList, isRetry: true}).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('开始重新下载视频文件，稍后可在当前页面查看');
                        this.getDownloadVideoList();
                    }
                });
            },
            // 批量删除视频
            removeBatchVideos() {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择视频');
                    return;
                }
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
                        if (index === undefined) {
                            this.getDownloadVideoList();
                        }
                    }
                    if (index !== undefined && this.requestNo === this.multipleSelection.length) {
                        this.removeDisabled = false;
                        setTimeout(function () {
                            that.$message(that.multipleSelection.length + '个视频删除完成');
                            that.getDownloadVideoList();
                        }, 1000);
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
