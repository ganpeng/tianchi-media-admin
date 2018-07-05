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
                <el-input v-model="channelInfo.name" placeholder="请填写10个字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="编号" required>
                <label>{{channelInfo.code}}</label>
            </el-form-item>
            <el-form-item label="类别" prop="typeIdList" required>
                <el-select v-model="typeIdList" multiple placeholder="请选择频道类别">
                    <el-option
                        v-for="item in typeOptions"
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
        <el-button type="success" class="add-video" @click="popAppendVideoDialogue(0)">点击在列表最上方添加视频</el-button>
        <el-table
            :data="currentSelectedVideoList"
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
                prop="originName"
                label="视频文件名">
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
                    <el-button type="text" size="small" @click="popAppendVideoDialogue(scope.$index + 1)">下方添加视频
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <div class="text-center update-box">
            <el-button type="danger" @click="disableChannel">{{channelInfo.visible ? '禁播' : '恢复'}}频道</el-button>
            <el-button v-if="!channelInfo.visible" type="danger" @click="removeChannel">删除频道</el-button>
            <el-button type="success" @click="updateInfo">保 存</el-button>
        </div>
        <el-dialog
            title="选择相应的视频"
            :visible.sync="selectDialogVisible"
            center
            width="80%">
            <select-multiple-video
                v-if="selectDialogVisible"
                :currentSelectedVideoList="currentSelectedVideoList"
                v-on:appendVideo="appendVideo"
                v-on:closeSelectVideoDialog="selectDialogVisible = false">
            </select-multiple-video>
        </el-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';
    import SelectMultipleVideo from './SelectMultipleVideo';

    export default {
        name: 'EditCarouselChannel',
        components: {
            DisplayVideoDialog,
            SelectMultipleVideo
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道名称不能为空'));
                } else if (this.$util.trim(value).length > 10) {
                    return callback(new Error('频道名称不能超过10个字'));
                } else {
                    callback();
                }
            };
            let checkTypeIdList = (rule, value, callback) => {
                if (!this.channelInfo.typeIdList) {
                    return callback(new Error('请选择频道类别'));
                } else {
                    callback();
                }
            };
            return {
                selectDialogVisible: false,
                channelInfo: {},
                typeIdList: [],
                typeOptions: [],
                // 当前的频道含有的视频列表
                currentSelectedVideoList: [],
                currentVideoIndex: '',
                previewVideoInfo: {
                    url: '',
                    visible: false
                },
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    typeIdList: [
                        {validator: checkTypeIdList, trigger: 'change'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getChannelType().then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
                this.$service.getChannelDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        this.channelInfo = response.data;
                        response.data.typeList.map(type => {
                            this.typeIdList.push(type.id);
                        });
                        this.currentSelectedVideoList = response.data.carouselVideoList;
                    }
                });
            },
            // 打开视频列表，设置当前点击的某一行视频
            popAppendVideoDialogue(index) {
                this.currentVideoIndex = index;
                this.selectDialogVisible = true;
            },
            // 添加相应的视频
            appendVideo(selectedVideoList) {
                for (let i = 0; i < selectedVideoList.length; i++) {
                    this.currentSelectedVideoList.splice(this.currentVideoIndex + i, 0, selectedVideoList[i]);
                }
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
                    this.currentSelectedVideoList.splice(index, 1);
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
            // 禁播/恢复频道
            disableChannel() {
                let operateWords = this.channelInfo.visible ? '禁播' : '恢复';
                this.$confirm('此操作将' + operateWords + '该频道, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 接口调用禁播频道
                    this.$message({
                        type: 'success',
                        message: operateWords + '成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + operateWords
                    });
                });
            },
            // 删除频道
            removeChannel() {
                this.$confirm('此操作将删除该频道, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteChannelById(this.$route.params.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '成功删除频道!'
                            });
                            this.$router.push({name: 'CarouselChannelList'});
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 更新频道信息
            updateInfo() {
                this.channelInfo.carouselVideoList = this.currentSelectedVideoList;
                this.channelInfo.typeList = [];
                this.typeIdList.map(typeId => {
                    this.typeOptions.map(type => {
                        if (typeId === type.id) {
                            this.channelInfo.typeList.push(type);
                        }
                    });
                });
                this.$service.updateChannelById(
                    this.$route.params.id,
                    this.channelInfo
                ).then(response => {
                    if (response && response.code === 0) {
                        this.$message('保存频道信息成功');
                    }
                });
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

    .add-video {
        margin-top: 30px;
        margin-left: 20px;
    }

    .update-box {
        margin: 60px 0px 40px 0px;
    }
</style>
