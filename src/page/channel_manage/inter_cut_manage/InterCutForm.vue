<!--轮播插播编辑页面-->
<template>
    <div>
        <div class="seperator-line"></div>
        <!--基本信息-->
        <el-form
            ref="interCutInfo"
            :model="interCutInfo"
            :rules="infoRules"
            status-icon
            label-width="110px"
            class="form-block">
            <el-form-item label="插播名称" prop="name" required>
                <el-input
                    v-model="interCutInfo.name"
                    size="medium"
                    clearable
                    placeholder="请填写20个字以内的插播名称">
                </el-input>
            </el-form-item>
            <el-form-item label="定时" prop="scheduled" required>
                <el-radio-group v-model="interCutInfo.scheduled" @change="selectScheduled($event)">
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
                <el-date-picker
                    v-model="interCutInfo.startDate"
                    :disabled="!interCutInfo.scheduled"
                    type="date"
                    value-format="timestamp"
                    size="medium"
                    placeholder="请选择日期">
                </el-date-picker>
                <el-time-picker
                    v-model="interCutInfo.startPoint"
                    :disabled="!interCutInfo.scheduled"
                    value-format="timestamp"
                    size="medium"
                    placeholder="请选择时间">
                </el-time-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <label>{{endTime | formatDate('yyyy-MM-DD HH:mm:SS')}}</label>
            </el-form-item>
            <el-form-item label="插播频道" prop="channelList" required>
                <div class="my-tags">
                    <el-tag
                        :key="index"
                        v-for="(item, index) in interCutInfo.channelList"
                        closable
                        @close="removeChannel(item, index)"
                        :disable-transitions="false">
                        {{item.innerName}}
                    </el-tag>
                </div>
                <el-autocomplete
                    class="inline-input"
                    :fetch-suggestions="querySearch"
                    placeholder="请选择执行插播的频道"
                    @blur="validateChannelList"
                    @select="setChannels">
                    <template slot-scope="{ item }">
                        <div class="name">{{ item.innerName }}</div>
                    </template>
                    <i v-if="interCutInfo.channelList.length !== 0"
                       slot="suffix"
                       @click="removeAllChannel"
                       class="close-btn el-select__caret el-input__icon el-icon-circle-close is-show-close"></i>
                </el-autocomplete>
            </el-form-item>
        </el-form>
        <div class="seperator-line"></div>
        <!--频道内节目-->
        <div class="content-sub-title">频道内视频
            <el-button @click="popAppendVideoDialogue(0)" class="contain-svg-icon btn-style-four">
                <svg-icon icon-class="video"></svg-icon>
                关联视频
            </el-button>
        </div>
        <el-table
            v-if="currentSelectedVideoList.length !== 0"
            header-row-class-name="common-table-header"
            :data="currentSelectedVideoList"
            row-class-name=video-larger-row
            border
            style="width: 100%">
            <el-table-column
                width="60px"
                align="center"
                label="顺序">
                <template slot-scope="scope">
                    {{scope.$index + 1}}
                </template>
            </el-table-column>
            <el-table-column
                width="120px"
                align="center"
                prop="code"
                label="ID">
            </el-table-column>
            <el-table-column
                prop="originName"
                min-width="210px"
                align="center"
                label="文件名">
            </el-table-column>
            <el-table-column
                prop="link"
                align="center"
                min-width="90px"
                label="预览">
                <template slot-scope="scope">
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For4K"
                            type="text"
                            size="small"
                            @click="displayVideo(scope.row.m3u8For4K,scope.row.originName)">
                            4K
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For4K"
                            icon-class="copy_btn"
                            class-name="copy-btn"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For4K)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For1080P"
                            type="text"
                            size="small"
                            @click="displayVideo(scope.row.m3u8For1080P,scope.row.originName)">
                            1080
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For1080P"
                            icon-class="copy_btn"
                            class-name="copy-btn"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For1080P)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For720P"
                            type="text"
                            size="small"
                            @click="displayVideo(scope.row.m3u8For720P,scope.row.originName)">
                            720
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For720P"
                            icon-class="copy_btn"
                            class-name="copy-btn"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For720P)">
                        </svg-icon>
                    </div>
                    <div class="btn-icon-container">
                        <el-button
                            v-if="scope.row.m3u8For480P"
                            type="text"
                            size="small"
                            @click="displayVideo(scope.row.m3u8For480P,scope.row.originName)">
                            480
                        </el-button>
                        <svg-icon
                            v-if="scope.row.m3u8For480P"
                            icon-class="copy_btn"
                            class-name="copy-btn"
                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For480P)">
                        </svg-icon>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="takeTimeInSec"
                min-width="90px"
                align="center"
                label="时长">
                <template slot-scope="scope">
                    {{scope.row.takeTimeInSec | fromSecondsToTime}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="排序"
                width="126px"
                class="operate">
                <template slot-scope="scope">
                    <div class="sort">
                        <span @click="movePosition('UP',scope.row,scope.$index)">
                            <svg-icon icon-class="move_up"></svg-icon>
                            上移
                        </span>
                        <span @click="movePosition('TOP',scope.row,scope.$index)">
                            置顶
                            <svg-icon icon-class="move_top"></svg-icon></span>
                        <span @click="movePosition('DOWN',scope.row,scope.$index)">
                            <svg-icon icon-class="move_down"></svg-icon>
                            下移
                        </span>
                        <span @click="movePosition('BOTTOM',scope.row,scope.$index)">
                            置底
                            <svg-icon icon-class="move_bottom"></svg-icon>
                        </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="110px"
                class="operate">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="popAppendVideoDialogue(scope.$index + 1)">添加</span>
                        <span class="btn-text text-danger" @click="removeConfirm(scope.$index,scope.row)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :title="previewVideoInfo.title"
            ref="displayVideoPlayer"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveInterCutInfo" :loading="isLoading">保存
            </el-button>
            <el-button class="btn-style-three" @click="toInterCutList" plain>返回列表</el-button>
        </div>
        <el-dialog
            title="选择相应的视频"
            :close-on-click-modal=false
            :visible.sync="selectDialogVisible"
            custom-class="normal-dialog"
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
    import DisplayVideoDialog from 'sysComponents/custom_components/custom/DisplayVideoDialog';
    import SelectMultipleVideo from '../carousel_channel_manage/SelectMultipleVideo';
    import _ from 'lodash';

    const ClipboardJS = require('clipboard');

    export default {
        name: 'EditInterCut',
        props: {
            // 创建：'CREATE_INTER_CUT'，编辑：'EDIT_INTER_CUT'
            status: {
                type: String,
                default: function () {
                    return 'CREATE_INTER_CUT';
                }
            }
        },
        components: {
            DisplayVideoDialog,
            SelectMultipleVideo
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('插播名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('插播名称不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkScheduled = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    return callback(new Error('请选择是否定时'));
                } else {
                    callback();
                }
            };
            let checkStartTime = (rule, value, callback) => {
                if (this.interCutInfo.scheduled) {
                    if (!this.interCutInfo.startDate || !this.interCutInfo.startPoint) {
                        return callback(new Error('请完整选择开始时间'));
                    } else if ((parseInt(this.interCutInfo.startDate) + this.getTimePointMilliseconds(this.interCutInfo.startPoint)) < Date.now()) {
                        return callback(new Error('开始时间应大于当前时间'));
                        //    检测生效时间是否冲突
                    } else if (this.interCutInfo.channelList.length !== 0 && this.currentSelectedVideoList.length !== 0) {
                        let channelIdList = [];
                        this.interCutInfo.channelList.map(channel => {
                            channelIdList.push(channel.id);
                        });
                        let startTime = parseInt(this.interCutInfo.startDate) + this.getTimePointMilliseconds(this.interCutInfo.startPoint);
                        let milliSeconds = 0;
                        for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                            milliSeconds = milliSeconds + this.currentSelectedVideoList[i].takeTimeInSec * 1000;
                        }
                        this.$service.getInterCutConflicting({
                            channelIdList: channelIdList,
                            startTime: startTime,
                            endTime: startTime + milliSeconds,
                            excludedInterCutId: this.$route.params.id ? this.$route.params.id : ''
                        }).then(response => {
                            if (response && response.code === 0) {
                                if (response.data.length === 0) {
                                    callback();
                                } else {
                                    let errorMessage = '';
                                    response.data.map(item => {
                                        errorMessage = errorMessage + '、' + item.name;
                                    });
                                    return callback(new Error('以下插播与当前生效时间冲突：' + errorMessage.slice(1)));
                                }
                            } else {
                                return callback(new Error('暂时无法判断开始时间是否冲突'));
                            }
                        });
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            let checkChannelList = (rule, value, callback) => {
                if (this.interCutInfo.channelList.length === 0) {
                    return callback(new Error('请选择执行插播的频道'));
                } else {
                    callback();
                }
            };
            return {
                isLoading: false,
                selectDialogVisible: false,
                interCutInfo: {
                    name: '',
                    scheduled: false,
                    startTime: '',
                    endTime: '',
                    startDate: '',
                    startPoint: '',
                    channelList: [],
                    videoList: [],
                    totalDuration: ''
                },
                channelOptions: [],
                // 当前的频道含有的视频列表
                currentSelectedVideoList: [],
                currentVideoIndex: '',
                previewVideoInfo: {
                    url: '',
                    title: '',
                    visible: false
                },
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    scheduled: [
                        {validator: checkScheduled, trigger: 'change'}
                    ],
                    startTime: [
                        {validator: checkStartTime, trigger: 'change'}
                    ],
                    channelList: [
                        {validator: checkChannelList, trigger: 'blur'}
                    ]
                }
            };
        },
        computed: {
            getVideoUrl() {
                return (uri) => {
                    let baseUri = window.localStorage.getItem('videoBaseUri');
                    return `${baseUri}${uri}`;
                };
            },
            endTime() {
                if (!this.interCutInfo.startDate || !this.interCutInfo.startPoint) {
                    return '';
                } else {
                    let milliSeconds = 0;
                    for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                        milliSeconds = milliSeconds + this.currentSelectedVideoList[i].takeTimeInSec * 1000;
                    }
                    this.validateEffectTime();
                    return milliSeconds + parseInt(this.interCutInfo.startDate) + parseInt(this.getTimePointMilliseconds(this.interCutInfo.startPoint));
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getChannelList({
                    category: 'CAROUSEL',
                    pageNum: 0,
                    pageSize: 10000
                }).then(response => {
                    if (response && response.code === 0) {
                        this.channelOptions = response.data.list;
                        this.channelOptions.unshift({id: '0', code: '0', innerName: '全选'});
                    }
                });
                let that = this;
                let clipboard = new ClipboardJS('.copy-btn');
                clipboard.on('success', function (e) {
                    that.$message.success('视频链接复制成功');
                    e.clearSelection();
                });
                clipboard.on('error', function (e) {
                    that.$message.error('视频链接复制失败');
                });
                if (this.status === 'EDIT_INTER_CUT') {
                    this.getInterCutDetail();
                }
            },
            getInterCutDetail() {
                this.$service.getInterCutDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            this.interCutInfo[key] = response.data[key];
                        }
                        // 对开始时间进行设置
                        if (this.interCutInfo.scheduled) {
                            let startDate = new Date(this.interCutInfo.startTime);
                            this.interCutInfo.startDate = this.interCutInfo.startTime - (startDate.getHours() * 60 * 60 + startDate.getMinutes() * 60 + startDate.getSeconds()) * 1000;
                            let currentDate = new Date();
                            this.interCutInfo.startPoint = currentDate.valueOf() - (currentDate.getHours() * 60 * 60 + currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000 + (startDate.getHours() * 60 * 60 + startDate.getMinutes() * 60 + startDate.getSeconds()) * 1000;
                        }
                        this.currentSelectedVideoList = response.data.videoList;
                    }
                });
            },
            // 选择定时为'否'时清除时间数据
            selectScheduled(isScheduled) {
                if (!isScheduled) {
                    this.interCutInfo.startDate = '';
                    this.interCutInfo.startPoint = '';
                    this.interCutInfo.startTime = '';
                    this.interCutInfo.endTime = '';
                    // 清除时间错误提醒
                    this.validateEffectTime();
                }
            },
            // 将当前时间选择器的毫秒数改为只是小时、分钟、秒的毫秒数
            getTimePointMilliseconds(milliseconds) {
                let currentDate = new Date(milliseconds);
                return (currentDate.getHours() * 60 * 60 + currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000;
            },
            validateEffectTime() {
                this.$refs['interCutInfo'].validateField('startTime');
            },
            validateChannelList() {
                this.$refs['interCutInfo'].validateField('channelList');
            },
            removeAllChannel() {
                this.interCutInfo.channelList.splice(0);
                this.validateChannelList();
                this.validateEffectTime();
            },
            removeChannel(channel, index) {
                this.interCutInfo.channelList.splice(index, 1);
                this.validateChannelList();
                this.validateEffectTime();
            },
            querySearch(queryString, cb) {
                let results = queryString ? this.channelOptions.filter(this.createFilter(queryString)) : this.channelOptions;
                cb(results);
            },
            createFilter(queryString) {
                return (channelOptions) => {
                    return (channelOptions.innerName.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            // 设置频道，对全选进行处理
            setChannels(item) {
                // 对全选进行处理
                if (item.innerName === '全选') {
                    this.interCutInfo.channelList.splice(0);
                    this.channelOptions.map(channel => {
                        if (channel.innerName !== '全选') {
                            this.interCutInfo.channelList.push(channel);
                        }
                    });
                } else {
                    // 对非全选进行处理
                    this.interCutInfo.channelList.push({
                        id: item.id,
                        innerName: item.innerName,
                        name: item.name,
                        no: item.no
                    });
                    this.interCutInfo.channelList = _.uniqBy(this.interCutInfo.channelList, 'id');
                }
                this.validateChannelList();
                this.validateEffectTime();
            },
            // 对关联的视频进行排序
            movePosition(model, video, index) {
                switch (model) {
                    // 上移
                    case 'UP':
                        if (index === 0) {
                            this.$message.warning('当前视频不能向上移动');
                            return;
                        }
                        let moveUpItem = this.currentSelectedVideoList.splice(index, 1)[0];
                        this.currentSelectedVideoList.splice(index - 1, 0, moveUpItem);
                        this.$message.success('"' + video.name + '"' + '已向上移动');
                        break;
                    // 下移
                    case 'DOWN':
                        if (index === this.currentSelectedVideoList.length - 1) {
                            this.$message.warning('当前视频不能向下移动');
                            return;
                        }
                        let moveDownItem = this.currentSelectedVideoList.splice(index, 1)[0];
                        this.currentSelectedVideoList.splice(index + 1, 0, moveDownItem);
                        this.$message.success('"' + video.name + '"' + '已向下移动');
                        break;
                    // 置顶
                    case 'TOP':
                        if (index === 0) {
                            this.$message.warning('当前视频已在顶部');
                            return;
                        }
                        let moveTopItem = this.currentSelectedVideoList.splice(index, 1)[0];
                        this.currentSelectedVideoList.splice(0, 0, moveTopItem);
                        this.$message.success('"' + video.name + '"' + '已置顶');
                        break;
                    // 置底
                    case 'BOTTOM':
                        if (index === this.currentSelectedVideoList.length - 1) {
                            this.$message.warning('当前视频已在底部');
                            return;
                        }
                        let moveBottomItem = this.currentSelectedVideoList.splice(index, 1)[0];
                        this.currentSelectedVideoList.splice(this.currentSelectedVideoList.length, 0, moveBottomItem);
                        this.$message.success('"' + video.name + '"' + '已置底');
                        break;
                    default:
                        break;
                }
            },
            // 打开视频列表，设置当前点击的某一行视频
            popAppendVideoDialogue(index) {
                this.currentVideoIndex = index;
                this.selectDialogVisible = true;
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
                }
                this.currentSelectedVideoList = selectedVideoList;
            },
            // 预览视频
            displayVideo(url, title) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.previewVideoInfo.url = `${baseUri}${url}`;
                this.previewVideoInfo.title = title;
                this.previewVideoInfo.visible = true;
                this.$refs.displayVideoPlayer.showDialog();
            },
            // 关闭视频预览
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            },
            // 删除视频
            removeConfirm(index) {
                this.$confirm('是否确认删除视频，此操作将在点击保存时生效，请知晓。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.currentSelectedVideoList.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                });
            },
            // 保存
            saveInterCutInfo() {
                this.$refs['interCutInfo'].validate((valid) => {
                    if (valid) {
                        if (this.currentSelectedVideoList.length === 0) {
                            this.$message.warning('当前插播不含有视频，不能保存');
                            return;
                        }
                        //  设置开始时间
                        if (this.interCutInfo.scheduled) {
                            this.interCutInfo.startTime = parseInt(this.interCutInfo.startDate) + this.getTimePointMilliseconds(this.interCutInfo.startPoint);
                        } else {
                            this.interCutInfo.startTime = '';
                        }
                        // 设置持续时间秒数
                        this.interCutInfo.totalDuration = 0;
                        for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                            this.interCutInfo.totalDuration = this.interCutInfo.totalDuration + this.currentSelectedVideoList[i].takeTimeInSec;
                        }
                        for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                            this.currentSelectedVideoList[i].sort = i;
                        }
                        this.interCutInfo.videoList = this.currentSelectedVideoList;
                        this.isLoading = true;
                        switch (this.status) {
                            case 'CREATE_INTER_CUT':
                                this.$service.createInterCut(this.interCutInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('成功创建轮播插播');
                                        this.toInterCutList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            case 'EDIT_INTER_CUT':
                                this.$service.updateInterCutInfo(this.interCutInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('保存轮播插播信息成功');
                                        this.toInterCutList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    } else {
                        return false;
                    }
                });
            },
            toInterCutList() {
                this.$router.push({name: 'InterCutList'});
            }
        }
    }
    ;
</script>

<style lang="scss" scoped>

    /*频道基本信息*/
    .el-form {
        margin-top: 20px;
    }

    /*频道节目信息*/
    ul {
        padding-left: 40px;
        li {
            margin-bottom: 18px;
            span {
                display: inline-block;
                margin-right: 10px;
                width: 80px;
                height: 22px;
                font-size: 16px;
                color: #A8ABB3;
            }
            label {
                &.on-play {
                    padding: 6px 8px;
                    font-size: 12px;
                    color: #FFFFFF;
                    background: #0062C4;
                    border-radius: 4px;
                }
                &.duration {
                    font-size: 12px;
                    color: #A8ABB3;
                    line-height: 17px;
                }
                &.count {
                    font-size: 16px;
                    color: #A8ABB3;
                }
            }
        }
    }

    /*频道内关联的视频*/
    .el-table {
        margin-bottom: 50px;
        .sort {
            span {
                display: inline-block;
                font-size: 14px;
                color: #1989FA;
                cursor: pointer;
                &:first-child, &:nth-child(2) {
                    margin-bottom: 20px;
                }
                &:first-child, &:nth-child(3) {
                    margin-right: 8px;
                }
            }
        }
        .copy-btn {
            cursor: pointer;
        }
    }

    .svg-icon-remove {
        fill: #1989FA;
    }

    .svg-icon-video {
        height: 15px !important;
        width: 20px !important;
    }

    .my-tags {
        max-width: 1050px;
    }

</style>
