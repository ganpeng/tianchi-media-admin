<!--轮播频道编辑页面-->
<template>
    <div class="text-left">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>轮播频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑<label class="channel-name">{{channelInfo.innerName}}</label>轮播频道</el-breadcrumb-item>
        </el-breadcrumb>
        <el-tag class="title">频道基本信息</el-tag>
        <el-form :model="channelInfo" :rules="infoRules" status-icon ref="channelInfo"
                 label-width="80px"
                 class="form-block">
            <el-form-item label="名称" prop="innerName" required>
                <el-input v-model="channelInfo.innerName" placeholder="请填写10个字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="编号" prop="no" required>
                <el-input v-model="channelInfo.no" placeholder="请填写三位频道编号数字，例如'001'"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="typeIdList" required>
                <el-select v-model="channelInfo.typeIdList" multiple placeholder="请选择频道类别">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="组播地址" prop="multicastIp" required>
                <el-input v-model="channelInfo.multicastIp" placeholder="请填写组播地址"></el-input>
            </el-form-item>
            <el-form-item label="端口号" prop="multicastPort" required>
                <el-input v-model="channelInfo.multicastPort" placeholder="请填写端口号"></el-input>
            </el-form-item>
            <el-form-item label="tsId" prop="tsId">
                <el-input v-model="channelInfo.tsId" placeholder="请填写tsId"></el-input>
            </el-form-item>
            <el-form-item label="serviceId" prop="serviceId">
                <el-input v-model="channelInfo.serviceId" placeholder="请填写serviceId"></el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="visible">
                <label>{{channelInfo.visible ? '正常' : '禁播'}}</label>
            </el-form-item>
            <el-form-item label="频道封面" prop="logoUri" required>
                <el-button type="success" @click="imageUploadDialogVisible = true">设置封面</el-button>
                <div v-if="channelInfo.logoUri" class="image-box">
                    <img :src="channelInfo.logoUri | imageUrl">
                </div>
            </el-form-item>
        </el-form>
        <el-tag class="title">频道节目信息</el-tag>
        <el-form label-position="right" label-width="90px">
            <el-form-item label="当前播放：">
                <label>{{channelInfo.currentProgramme ? channelInfo.currentProgramme : '暂无当前播放节目'}}</label>
            </el-form-item>
            <el-form-item label="播放时段：" v-if="channelInfo.currentProgramme">
                <label>{{channelInfo.duration}}</label>
            </el-form-item>
        </el-form>
        <el-button v-if="currentSelectedVideoList.length === 0" type="success" class="add-video"
                   @click="popAppendVideoDialogue(0)">点击添加视频
        </el-button>
        <el-table
            :data="currentSelectedVideoList"
            border
            style="width: 100%">
            <el-table-column
                width="100px"
                label="播放顺序">
                <template slot-scope="scope">
                    {{scope.$index + 1}}
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
                prop="name"
                label="视频展示名">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.name"></el-input>
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
                    <label>{{scope.row.visible ? '正常':'禁播'}}</label>
                </template>
            </el-table-column>
            <el-table-column align="center"
                             label="操作"
                             class="operate">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.visible" type="danger" size="mini" plain
                               @click="disabledConfirm(scope.row)">
                        禁播
                    </el-button>
                    <el-button v-else type="success" size="mini" plain
                               @click="recoverConfirm(scope.row)">
                        恢复
                    </el-button>
                    <el-button type="danger" size="mini" plain
                               @click="removeConfirm(scope.$index,scope.row)">删除
                    </el-button>
                    <el-button type="text" size="small" @click="popAppendVideoDialogue(scope.$index)">上方添加视频
                    </el-button>
                    <el-button type="text" size="small" @click="popAppendVideoDialogue(scope.$index + 1)">下方添加视频
                    </el-button>
                    <el-button type="text" size="small" @click="moveUpVideo(scope.$index)">
                        上移
                    </el-button>
                    <el-button type="text" size="small" @click="moveDownVideo(scope.$index)">
                        下移
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="preview-sort">
            <el-button type="success" @click="sortVideoList">点击视频排序</el-button>
            <el-button type="success" @click="revertVideoList">反转当前视频列表</el-button>
            <el-button type="success" @click="setVideoNameList">设置视频展示名称</el-button>
        </div>
        <div id="auto-sort">
            <div v-for="(item, index) in sectionList" :key="index">
                <el-input v-model="item.name" placeholder="请填写名称"></el-input>
                <el-button type="primary" plain @click="removeSection(index)" v-if="sectionList.length !== 1">
                    删除
                </el-button>
            </div>
            <el-button type="primary" @click="addSection">添加名称</el-button>
            <div class="text-center">
                <el-button type="primary" @click="autoSort">自动化排序</el-button>
            </div>
        </div>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <div class="text-center update-box">
            <el-button :disabled="channelInfo.visible" type="danger" @click="removeChannel">删除频道</el-button>
            <el-button type="success" @click="updateInfo">保 存</el-button>
        </div>
        <el-dialog
            title="选择相应的视频"
            :visible.sync="selectDialogVisible"
            center
            width="60%">
            <select-multiple-video
                v-if="selectDialogVisible"
                :currentSelectedVideoList="currentSelectedVideoList"
                v-on:appendVideo="appendVideo"
                v-on:closeSelectVideoDialog="selectDialogVisible = false">
            </select-multiple-video>
        </el-dialog>
        <sort-dialog
            v-if="sortDialogVisible"
            title="视频排序"
            :sourceList="currentSelectedVideoList"
            sortKey="sort"
            uniqueKey="storageVideoId"
            displayKey="name"
            v-on:closeDialog="sortDialogVisible = false"
            v-on:setSortedList="setSortedList">
        </sort-dialog>
        <upload-image
            :size='size'
            title="上传频道封面图片"
            :successHandler="setChannelLogo"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';
    import SelectMultipleVideo from './SelectMultipleVideo';
    import SortDialog from 'sysComponents/custom_components/custom/SortDialog';
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import {CHANNEL_LOGO_DIMENSION} from '@/util/config/dimension';

    export default {
        name: 'EditCarouselChannel',
        components: {
            DisplayVideoDialog,
            SelectMultipleVideo,
            SortDialog,
            UploadImage
        },
        data() {
            let checkInnerName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道名称不能为空'));
                } else if (this.$util.trim(value).length > 10) {
                    return callback(new Error('频道名称不能超过10个字'));
                } else {
                    callback();
                }
            };
            let checkNo = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道编号不能为空'));
                } else if (!this.$util.isChannelNo(value)) {
                    return callback(new Error('请填写三位频道编号数字，例如"001"'));
                } else {
                    callback();
                }
            };
            let checkTypeIdList = (rule, value, callback) => {
                if (this.channelInfo.typeIdList.length === 0) {
                    return callback(new Error('请选择频道类别'));
                } else {
                    callback();
                }
            };
            let checkMulticastIp = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('组播地址不能为空'));
                } else if (!this.$util.isMulticastIPAddress(value)) {
                    return callback(new Error('请填写正确的组播地址'));
                } else {
                    callback();
                }
            };
            let checkMulticastPort = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('端口号不能为空'));
                } else if (!this.$util.isPort(value)) {
                    return callback(new Error('请填写正确的端口号'));
                } else {
                    callback();
                }
            };
            let checkServiceId = (rule, value, callback) => {
                if (!this.$util.isEmpty(value) && !this.$util.isChannelServiceId(value)) {
                    return callback(new Error('请填写正确的serviceId'));
                } else {
                    callback();
                }
            };
            let checkTsId = (rule, value, callback) => {
                if (!this.$util.isEmpty(value) && !this.$util.isChannelTsId(value)) {
                    return callback(new Error('请填写正确的tsId'));
                } else {
                    callback();
                }
            };
            let checkLogoUri = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请设置频道的封面图片'));
                } else {
                    callback();
                }
            };
            return {
                size: CHANNEL_LOGO_DIMENSION,
                imageUploadDialogVisible: false,
                sortDialogVisible: false,
                selectDialogVisible: false,
                channelInfo: {
                    typeIdList: [],
                    visible: ''
                },
                sectionList: [{name: ''}],
                typeOptions: [],
                // 当前的频道含有的视频列表
                currentSelectedVideoList: [],
                currentVideoIndex: '',
                previewVideoInfo: {
                    url: '',
                    visible: false
                },
                infoRules: {
                    innerName: [
                        {validator: checkInnerName, trigger: 'blur'}
                    ],
                    no: [
                        {validator: checkNo, trigger: 'blur'}
                    ],
                    typeIdList: [
                        {validator: checkTypeIdList, trigger: 'change'}
                    ],
                    multicastIp: [
                        {validator: checkMulticastIp, trigger: 'blur'}
                    ],
                    multicastPort: [
                        {validator: checkMulticastPort, trigger: 'blur'}
                    ],
                    tsId: [
                        {validator: checkTsId, trigger: 'blur'}
                    ],
                    serviceId: [
                        {validator: checkServiceId, trigger: 'blur'}
                    ],
                    logoUri: [
                        {validator: checkLogoUri, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getChannelType({category: 'CAROUSEL'}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
                this.$service.getChannelDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.channelInfo[key] = response.data[key];
                        }
                        response.data.typeList.map(type => {
                            this.channelInfo.typeIdList.push(type.id);
                        });
                        this.currentSelectedVideoList = response.data.carouselVideoList;
                        this.currentSelectedVideoList.map(video => {
                            if (video.onPlay) {
                                this.channelInfo.currentProgramme = video.originName;
                                this.channelInfo.duration = this.$util.formatDate(video.lastPlayTime) + '-' + this.$util.formatDate(video.lastPlayTime + video.takeTimeInSec * 1000);
                            }
                        });
                    }
                });
            },
            // 设置频道封面的uri
            setChannelLogo(newPosterImage) {
                this.channelInfo.logoUri = newPosterImage.posterImage.uri;
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            // 打开视频列表，设置当前点击的某一行视频
            popAppendVideoDialogue(index) {
                this.currentVideoIndex = index;
                this.selectDialogVisible = true;
            },
            // 视频上移
            moveUpVideo(index) {
                if (index === 0) {
                    this.$message('当前视频不能向上移动');
                    return;
                }
                let moveItem = this.currentSelectedVideoList.splice(index, 1)[0];
                this.currentSelectedVideoList.splice(index - 1, 0, moveItem);
            },
            // 视频下移
            moveDownVideo(index) {
                if (index === this.currentSelectedVideoList.length - 1) {
                    this.$message('当前视频不能向下移动');
                    return;
                }
                let moveItem = this.currentSelectedVideoList.splice(index, 1)[0];
                this.currentSelectedVideoList.splice(index + 1, 0, moveItem);
            },
            // 添加相应的视频
            appendVideo(selectedVideoList) {
                for (let i = 0; i < selectedVideoList.length; i++) {
                    selectedVideoList[i].storageVideoId = selectedVideoList[i].id;
                    // 添加的视频统一设置 status 为 NORMAL
                    selectedVideoList[i].status = 'NORMAL';
                    // 添加的视频设置为默认正常
                    selectedVideoList[i].visible = true;
                    delete selectedVideoList[i].id;
                    this.currentSelectedVideoList.splice(this.currentVideoIndex + i, 0, selectedVideoList[i]);
                }
            },
            // 视频列表排序
            sortVideoList() {
                /** 在频道排序时，含有的视频必须有展示名称  */
                for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                    if (!this.currentSelectedVideoList[i].name) {
                        this.$message({
                            message: '请先完整填写当前频道中的视频展示名称',
                            type: 'warning'
                        });
                        return;
                    }
                }
                this.sortDialogVisible = true;
            },
            // 设置视频列表中每个视频的展示名称,'（高清）新还珠格格（收录）01&&新还珠格格-01.mpg'
            setVideoNameList() {
                this.currentSelectedVideoList.map(video => {
                    if (video.originName.indexOf('&&') === -1) {
                        video.name = '';
                    } else {
                        video.name = video.originName.split('&&')[1].split('.')[0];
                    }
                });
            },
            revertVideoList() {
                let array = [];
                for (let i = this.currentSelectedVideoList.length - 1; i > -1; i--) {
                    array.push(this.currentSelectedVideoList[i]);
                }
                this.currentSelectedVideoList = array;
            },
            removeSection(index) {
                this.sectionList.splice(index, 1);
            },
            // 自动化排序
            autoSort() {
                // 检测是否全部填写部的列表
                let sectionTag = true;
                this.sectionList.map(section => {
                    if (!section.name) {
                        sectionTag = false;
                    }
                });
                if (!sectionTag) {
                    this.$message('请完整部填写名称');
                    return;
                }
                // 检测是否完整填写展示名称
                for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                    if (!this.currentSelectedVideoList[i].name) {
                        this.$message({
                            message: '请完整填写当前频道中的视频展示名称',
                            type: 'warning'
                        });
                        return;
                    }
                }
                // 检测部的列表中的名称是否完整包含当前视频列表
                for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                    let tag = false;
                    for (let k = 0; k < this.sectionList.length; k++) {
                        if (this.currentSelectedVideoList[i].name.split('-')[0] === this.sectionList[k].name) {
                            tag = true;
                        }
                    }
                    if (!tag) {
                        this.$message({
                            message: '第' + (i + 1) + '个视频的名称没有包含在部的名称列表中',
                            type: 'warning'
                        });
                        return;
                    }
                }
                // 对每一部进行分类
                let videoTwoDimension = [];
                for (let k = 0; k < this.sectionList.length; k++) {
                    videoTwoDimension.push([]);
                    // 分析所有的视频是否属于当前的部的名称中，并添加
                    for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                        if (this.currentSelectedVideoList[i].name.split('-')[0] === this.sectionList[k].name) {
                            videoTwoDimension[k].push(this.currentSelectedVideoList[i]);
                        }
                    }
                }
                this.currentSelectedVideoList = this.sortTwoDimension(videoTwoDimension);
            },
            sortTwoDimension(videoTwoDimension) {
                for (let k = 0; k < videoTwoDimension.length; k++) {
                    videoTwoDimension[k].sort(function (pre, next) {
                        return parseInt(pre.name.split('-')[1]) > parseInt(next.name.split('-')[1]);
                    });
                }
                let array = [];
                for (let k = 0; k < videoTwoDimension.length; k++) {
                    for (let i = 0; i < videoTwoDimension[k].length; i++) {
                        array.push(videoTwoDimension[k][i]);
                    }
                }
                return array;
            },
            addSection() {
                this.sectionList.push({name: ''});
            },
            // 设置排序完成的列表
            setSortedList(sortedList) {
                this.currentSelectedVideoList = sortedList;
                this.sortDialogVisible = false;
                this.$message('视频列表排序成功');
            },
            // 预览视频
            displayVideo(url) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.previewVideoInfo.url = `${baseUri}${url}`;
                this.previewVideoInfo.visible = true;
            },
            // 关闭视频预览
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            },
            // 禁播视频
            disabledConfirm(videoItem) {
                // 当前正在播放视频不能禁播
                if (this.channelInfo.currentProgramme === videoItem.originName) {
                    this.$message({
                        message: '当前视频正在播放，不能禁播',
                        type: 'warning'
                    });
                    return;
                }
                this.$confirm('此操作将禁播该视频, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    videoItem.visible = false;
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
                    videoItem.visible = true;
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
            removeConfirm(index, videoItem) {
                // 当前正在播放视频不能删除
                if (this.channelInfo.currentProgramme === videoItem.originName) {
                    this.$message({
                        message: '当前视频正在播放，不能删除',
                        type: 'warning'
                    });
                    return;
                }
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
                /** 在正常频道保存时，必须含有视频  */
                if (this.channelInfo.visible && this.currentSelectedVideoList.length === 0) {
                    this.$message({
                        message: '当前正常频道中不含有视频，不能更新保存',
                        type: 'warning'
                    });
                    return;
                }
                /** 在频道保存时，含有的视频必须有展示名称  */
                for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                    if (!this.currentSelectedVideoList[i].name) {
                        this.$message({
                            message: '请完整填写当前频道中的视频展示名称',
                            type: 'warning'
                        });
                        return;
                    }
                }
                this.$refs['channelInfo'].validate((valid) => {
                    if (valid) {
                        for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                            this.currentSelectedVideoList[i].sort = i;
                        }
                        this.channelInfo.carouselVideoList = this.currentSelectedVideoList;
                        this.channelInfo.typeList = [];
                        this.channelInfo.typeIdList.map(typeId => {
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
                            } else {
                                this.$message({
                                    message: response.message,
                                    type: 'warning'
                                });
                            }
                        });
                    } else {
                        return false;
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

    .preview-sort {
        padding-left: 10px;
    }

    .update-box {
        margin: 60px 0px 40px 0px;
    }

    .image-box {
        margin-top: 20px;
    }

    .el-table {
        .el-input {
            width: 100%;
        }
    }

    #auto-sort {
        padding: 30px;
        margin-top: 30px;
        border: 1px solid gray;
        .el-button {
            margin-bottom: 30px;
        }
        .el-input {
            margin-bottom: 20px;
        }
    }
</style>
