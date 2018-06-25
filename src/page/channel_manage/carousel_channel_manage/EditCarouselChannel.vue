<!--轮播频道编辑页面-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>轮播频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑<label class="channel-name">{{channelInfo.name}}</label>轮播频道</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tag class="title">频道基本信息</el-tag>
        <el-form :model="channelInfo" :rules="infoRules" status-icon ref="channelInfo"
                 label-width="80px"
                 class="form-block">
            <el-form-item label="名称" prop="name" required>
                <el-input v-model="channelInfo.name" placeholder="请填写9个字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="编号" required>
                <label>{{channelInfo.code}}</label>
            </el-form-item>
            <el-form-item label="类别" required>
                <el-select v-model="channelInfo.categoryList" multiple placeholder="请选择频道类别">
                    <el-option
                        v-for="item in channelCategoryOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" required>
                <el-select v-model="channelInfo.status" placeholder="请选择频道状态">
                    <el-option
                        v-for="item in statusOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-tag class="title">频道节目信息</el-tag>
        <el-form label-position="right" label-width="90px">
            <el-form-item label="当前播放：">
                <label>{{channelInfo.currentProgramme}}</label>
            </el-form-item>
            <el-form-item label="播放时段：">
                <label>{{channelInfo.duration}}</label>
            </el-form-item>
        </el-form>
        <el-table
            :data="videoList"
            border
            style="width: 100%">
            <el-table-column
                width="100px"
                label="播放顺序">
                <template slot-scope="scope">
                    <label>{{scope.row.sort}}</label>
                </template>
            </el-table-column>
            <el-table-column
                prop="code"
                label="视频编号">
            </el-table-column>
            <el-table-column
                prop="name"
                label="视频文件名">
            </el-table-column>
            <el-table-column
                prop="duration"
                label="时长">
            </el-table-column>
            <el-table-column
                prop="url"
                label="视频地址">
            </el-table-column>
            <el-table-column
                width="100px"
                label="视频状态">
                <template slot-scope="scope">
                    <label>{{scope.row.status === 'NORMAL' ? '正常':'禁播'}}</label>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作"
                             class="operate">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="previewVideo(scope.row)">预览</el-button>
                    <el-button v-if="scope.row.status === 'NORMAL'" type="danger" size="mini" plain
                               @click="disabledConfirm(scope.row)">
                        禁播
                    </el-button>
                    <el-button v-else type="success" size="mini" plain
                               @click="recoverConfirm(scope.row)">
                        恢复
                    </el-button>
                    <el-button type="danger" size="mini" plain
                               @click="removeConfirm(scope.$index)">删除
                    </el-button>
                    <el-button type="text" size="small" @click="appendVideo(scope.$index)">下方添加视频</el-button>
                </template>
            </el-table-column>
        </el-table>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <div class="text-center update-box">
            <el-button type="success" @click="updateInfo">保存</el-button>
        </div>
        <el-dialog
            title="选择相应的视频"
            :visible.sync="selectDialogVisible"
            width="80%">
            <select-video
                v-on:appendChannel="appendChannel">
            </select-video>
            <span slot="footer" class="dialog-footer">
              <el-button @click="selectDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="selectDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';
    import SelectVideo from './SelectVideo';

    export default {
        name: 'EditCarouselChannel',
        components: {
            DisplayVideoDialog,
            SelectVideo
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('专题名称不能为空'));
                } else if (this.$util.trim(value).length > 9) {
                    return callback(new Error('专题名称不能超过9个字'));
                } else {
                    callback();
                }
            };
            let checkCategoryList = (rule, value, callback) => {
                if (!this.channelInfo.categoryList) {
                    return callback(new Error('请选择频道类别'));
                } else {
                    callback();
                }
            };
            let checkStatus = (rule, value, callback) => {
                if (!this.channelInfo.status) {
                    return callback(new Error('请选择频道状态'));
                } else {
                    callback();
                }
            };
            return {
                selectDialogVisible: false,
                channelInfo: {
                    id: '001',
                    name: '甄嬛传',
                    code: '001',
                    status: 'NORMAL',
                    categoryList: [1],
                    currentProgramme: '甄嬛传第45集',
                    duration: '2018.6.4 12:00:00 - 2018.6.4 14:30:25'
                },
                channelCategoryOptions: [{
                    id: 1,
                    name: '电影'
                }, {
                    id: 2,
                    name: '电视剧'
                }, {
                    id: 3,
                    name: '娱乐'
                }],
                videoList: [{
                    id: '001',
                    sort: 1,
                    code: '20180621034504',
                    name: '甄嬛传第1集（甄嬛初入宫）',
                    duration: '00:46:04',
                    status: 'NORMAL',
                    url: 'http://dev-video.tianchiapi.com/group3/M00/00/1E/CgEBJlsrclGAWI8VAAAQ_Iaf3lM51.m3u8'
                }, {
                    id: '002',
                    sort: 2,
                    code: '20180621034505',
                    name: '甄嬛传第2集（甄嬛装病）',
                    duration: '00:46:04',
                    status: 'NORMAL',
                    url: 'http://dev-video.tianchiapi.com/group3/M00/00/1E/CgEBJlsrclGAWI8VAAAQ_Iaf3lM51.m3u8'
                }, {
                    id: '003',
                    sort: 3,
                    code: '20180621056504',
                    name: '甄嬛传第3集（甄嬛偶遇果郡王）',
                    duration: '00:46:56',
                    status: 'DISABLED',
                    url: 'http://dev-video.tianchiapi.com/group3/M00/00/1E/CgEBJlsrclGAWI8VAAAQ_Iaf3lM51.m3u8'
                }, {
                    id: '004',
                    sort: 4,
                    code: '20180621035605',
                    name: '甄嬛传第4集（甄嬛密谋）',
                    duration: '00:48:04',
                    status: 'NORMAL',
                    url: 'http://dev-video.tianchiapi.com/group3/M00/00/1E/CgEBJlsrclGAWI8VAAAQ_Iaf3lM51.m3u8'
                }],
                previewVideoInfo: {
                    url: '',
                    visible: false
                },
                statusOptions: [{
                    id: 'NORMAL',
                    name: '正常'
                }, {
                    id: 'DISABLED',
                    name: '禁播'
                }],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    categoryList: [
                        {validator: checkCategoryList, trigger: 'change'}
                    ],
                    status: [
                        {validator: checkStatus, trigger: 'change'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            // 初始化数据
            init() {
            },
            // 添加相应的视频
            appendChannel(item, index) {

            },
            // 预览视频
            previewVideo(videoInfo) {
                this.previewVideoInfo.url = videoInfo.url;
                this.previewVideoInfo.visible = true;
            },
            // 关闭视频预览
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            },
            // 禁播视频
            disabledConfirm(videoItem) {
                this.$confirm('此操作将禁播该视频, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    videoItem.status = 'DISABLED';
                    this.$message({
                        type: 'success',
                        message: '禁播成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消禁播'
                    });
                });
            },
            // 恢复视频播放
            recoverConfirm(videoItem) {
                this.$confirm('此操作将恢复播出该视频, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    videoItem.status = 'NORMAL';
                    this.$message({
                        type: 'success',
                        message: '恢复成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消恢复'
                    });
                });
            },
            // 删除视频
            removeConfirm(index) {
                this.$confirm('此操作将删除该视频, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.videoList.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 添加视频
            appendVideo() {
                this.selectDialogVisible = true;
            },
            // 更新频道信息
            updateInfo() {
                this.$message('保存成功');
            }
        }
    };
</script>

<style lang="less" scoped>

    .channel-name {
        font-style: italic;
        font-weight: bold;
        font-size: 16px;
    }

    .block-box {
        margin-top: 50px;
    }

    .el-input, .el-select {
        width: 600px;
    }

    .title {
        margin: 50px 0 30px 30px;
    }

    .update-box {
        margin: 60px 0px 40px 0px;
    }
</style>
