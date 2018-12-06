<!--视频资源管理-视频列表-检查时长-->
<template>
    <div>
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <div class="search-field">
                <div class="field-row" @keyup.enter="getDiffTimeVideoList">
                    <div class="search-field-item">
                        <el-input
                            v-model="listQueryParams.keyword"
                            @change="getDiffTimeVideoList"
                            clearable
                            class="border-input"
                            placeholder="请填写视频名称或编号">
                        </el-input>
                    </div>
                    <el-button class="btn-style-one" @click="getDiffTimeVideoList" type="primary">
                        <svg-icon icon-class="search"></svg-icon>
                        搜索
                    </el-button>
                    <div class="search-field-item">
                        <label class="search-field-item-label">时间</label>
                        <el-date-picker
                            v-model="createRangeTime"
                            @change="getDiffTimeVideoList"
                            type="daterange"
                            value-format="timestamp"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                    <el-button class="btn-style-one" type="primary" @click="clearFilters" plain>
                        <svg-icon icon-class="reset"></svg-icon>
                        重置
                    </el-button>
                </div>
            </div>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">检查视频列表</h2>
                <div class="table-operator-field clearfix">
                    <div class="float-left">
                        <el-dropdown
                            trigger="click"
                            class="my-dropdown">
                            <span class="el-dropdown-link">
                                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
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
                            全部导出
                        </el-button>
                        <el-button
                            class="btn-style-two contain-svg-icon"
                            @click="toVideoList">
                            <svg-icon icon-class="add"></svg-icon>
                            返回
                        </el-button>
                    </div>
                </div>
            </div>
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
            <el-table-column width="420px" prop="originName" align="center" label="视频名称">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" placement="top">
                        <div class="gan-tooltip" slot="content">{{scope.row.originName}}</div>
                        <span class="ellipsis-two">{{scope.row.originName}}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column width="120px" prop="takeTimeInSec" align="center" label="转码前时长">
                <template slot-scope="scope">
                    <span>{{scope.row.takeTimeInSec | fromSecondsToTime}}</span>
                </template>
            </el-table-column>
            <el-table-column width="120px" prop="realDuration" align="center" label="转码后时长">
                <template slot-scope="scope">
                    <span>{{scope.row.realDuration | fromSecondsToTime}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="时间相差（s）">
                <template slot-scope="scope">
                    <span>{{parseInt(scope.row.takeTimeInSec - scope.row.realDuration)}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="link" align="center" label="预览视频">
                <template slot-scope="scope">
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For4K"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For4K, scope.row.originName)"
                        >4K
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For4K"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For4K)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For1080P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For1080P, scope.row.originName)"
                        >1080
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For1080P"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For1080P)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For720P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For720P, scope.row.originName)"
                        >720
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For720P"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For720P)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For480P"
                            type="text"
                            size="small"
                            @click="displayVideoPlayer(scope.row.m3u8For480P, scope.row.originName)"
                        >480
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For480P"
                            icon-class="copy_btn"
                            class-name="copy-btn pointer"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For480P)">
                        </svg-icon>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="注入状态">
                <template slot-scope="scope">
                    <span>成功</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="上传日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="更新日期">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
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
        <display-video-dialog
            :url="url"
            :title="title"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="displayVideoDialogVisible = false">
        </display-video-dialog>
    </div>
</template>

<script>
    import XLSX from 'xlsx';
    import DisplayVideoDialog from './DisplayVideoDialog';

    export default {
        name: 'DiffTimeVideoList',
        components: {
            DisplayVideoDialog
        },
        data() {
            return {
                listQueryParams: {
                    durationDiffGt: 2,
                    durationDiffLt: -2,
                    keyword: '',
                    startedAt: '',
                    endedAt: '',
                    pageNum: 1,
                    pageSize: 10
                },
                createRangeTime: [],
                total: 0,
                videoList: [],
                multipleSelection: [],
                exportQueryParams: {
                    durationDiffGt: 2,
                    durationDiffLt: -2,
                    pageNum: 1,
                    pageSize: 1000
                },
                url: '',
                title: '',
                displayVideoDialogVisible: false
            };
        },
        mounted() {
            this.getDiffTimeVideoList();
        },
        methods: {
            getDiffTimeVideoList() {
                if (this.createRangeTime && this.createRangeTime.length === 2) {
                    this.listQueryParams.startedAt = this.createRangeTime[0];
                    this.listQueryParams.endedAt = this.createRangeTime[1];
                } else {
                    this.listQueryParams.startedAt = '';
                    this.listQueryParams.endedAt = '';
                }
                this.$service.getDurationDiffVideoList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.videoList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getDiffTimeVideoList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getDiffTimeVideoList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            getVideoUrl() {
                return (uri) => {
                    let baseUri = window.localStorage.getItem('videoBaseUri');
                    return `${baseUri}${uri}`;
                };
            },
            displayVideoPlayer(url, name) {
                this.displayVideoDialogVisible = true;
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.url = `${baseUri}${url}`;
                this.title = name;
            },
            clearFilters() {
                this.listQueryParams.keyword = '';
                this.listQueryParams.startedAt = '';
                this.listQueryParams.endedAt = '';
                this.createRangeTime = [];
                this.getDiffTimeVideoList();
            },
            // 导出问题时长视频列表
            exportAllList() {
                this.$service.getDurationDiffVideoList(this.exportQueryParams).then(response => {
                    if (response && response.code === 0) {
                        if (response && response.code === 0) {
                            let exportChannelData = [];
                            // 设置导出的数据
                            response.data.list.map(video => {
                                let exportVideo = {};
                                exportVideo['视频文件名'] = video.originName;
                                exportVideo['转码前时长（单位：秒）'] = this.$util.fromSecondsToTime(video.takeTimeInSec);
                                exportVideo['转码后时长（单位：秒）'] = this.$util.fromSecondsToTime(video.realDuration);
                                exportVideo['相差（单位：秒）'] = video.takeTimeInSec - video.realDuration;
                                exportVideo['上传成功时间'] = this.$util.formatDate(new Date(video.createdAt), 'yyyy-MM-DD HH:mm:SS');
                                exportVideo['转码成功时间'] = this.$util.formatDate(new Date(video.updatedAt), 'yyyy-MM-DD HH:mm:SS');
                                exportVideo['视频地址1080P'] = video.m3u8For1080P ? window.localStorage.getItem('videoBaseUri') + video.m3u8For1080P : '';
                                exportVideo['视频地址720P'] = video.m3u8For720P ? window.localStorage.getItem('videoBaseUri') + video.m3u8For720P : '';
                                exportVideo['视频地址4K'] = video.m3u8For4K ? window.localStorage.getItem('videoBaseUri') + video.m3u8For4K : '';
                                exportChannelData.push(exportVideo);
                            });
                            let wb = XLSX.utils.book_new();
                            let newWsName = '表1';
                            let ws = XLSX.utils.json_to_sheet(exportChannelData);
                            XLSX.utils.book_append_sheet(wb, ws, newWsName);
                            XLSX.writeFile(wb, '视频时长检测表_' + new Date() + '.xlsx');
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
                    this.$service.deleteVideoById(video.id).then(res => {
                        if (res && res.code === 0) {
                            this.$message.success('"' + video.originName + '"' + '已成功删除');
                            this.getDiffTimeVideoList();
                        } else if (res && res.code === 3306) {
                            this.$message({
                                type: 'error',
                                message: `该视频在如下节目 [${res.data.join(', ')}] 中有引用`,
                                duration: 5000
                            });
                        } else if (res && res.code === 3308) {
                            this.$message({
                                type: 'error',
                                message: `该视频在如下频道 [${res.data.join(', ')}] 中有引用`,
                                duration: 5000
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消批量删除'
                    });
                });
            },
            // 批量删除视频
            removeBatchVideos() {
                let idList = this.multipleSelection.map((item) => {
                    return item.id;
                });
                if (idList.length > 0) {
                    this.$confirm(`您确定要删除吗, 是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.$service.deleteVideoByIdList(idList).then((res) => {
                            if (res && res.code === 0) {
                                this.$message.success('批量删除成功');
                                this.getDiffTimeVideoList();
                            } else {
                                this.$message.error('批量删除失败');
                            }
                        });
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消批量删除'
                        });
                    });
                }
            },
            toVideoList() {
                this.$router.push({name: 'VideoList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>
