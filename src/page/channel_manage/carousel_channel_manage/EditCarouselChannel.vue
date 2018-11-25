<!--轮播频道编辑页面-->
<template>
    <div>
        <div class="content-title">添加轮播频道</div>
        <div class="seperator-line"></div>
        <!--基本信息-->
        <el-form
            ref="channelInfo"
            :model="channelInfo"
            :rules="infoRules"
            status-icon
            label-width="100px"
            class="form-block">
            <el-form-item label="频道名称" prop="name" required>
                <el-input v-model="channelInfo.name" placeholder="请填写20个字以内的频道名称"></el-input>
            </el-form-item>
            <el-form-item label="内部名称" prop="innerName" required>
                <el-input v-model="channelInfo.innerName" placeholder="请填写20个字以内的内部名称"></el-input>
            </el-form-item>
            <el-form-item label="频道编号" prop="no" required>
                <el-input v-model="channelInfo.no" type="number" placeholder="请填写频道编号数字，例如'001'"></el-input>
            </el-form-item>
            <el-form-item label="频道类别" prop="typeIdList" required>
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
                <el-input v-model="channelInfo.multicastPort" type="number" placeholder="请填写端口号"></el-input>
            </el-form-item>
            <el-form-item label="tsID" prop="tsId">
                <el-input v-model="channelInfo.tsId" type="number" placeholder="请填写tsId"></el-input>
            </el-form-item>
            <el-form-item label="serviceID" prop="serviceId">
                <el-input v-model="channelInfo.serviceId" type="number" placeholder="请填写serviceId"></el-input>
            </el-form-item>
            <el-form-item label="所属服务器" prop="pushServer" required>
                <el-input v-model="channelInfo.pushServer" placeholder="请填写所属服务器的IP地址"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required>
                <el-radio-group v-model="channelInfo.visible">
                    <el-radio :label="true">正常</el-radio>
                    <el-radio :label="false">禁播</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="频道图" prop="logoUri" required>
                <label>(260*260 频道图)</label>
                <div>
                    <div class="image-box" v-if="channelInfo.logoUri">
                        <img :src="channelInfo.logoUri | imageUrl">
                    </div>
                    <single-image-uploader
                        :allowResolutions="allowResolutions"
                        :uploadSuccessHandler="uploadSuccessHandler">
                    </single-image-uploader>
                </div>
            </el-form-item>
        </el-form>
        <!--频道封面-->
        <div class="vice-block text-left">
            <h3 class="block-vice-title">频道封面</h3>
            <el-button
                class="create-blue-btn contain-svg-icon"
                @click="imageUploadDialogVisible = true">
                <svg-icon icon-class="image"></svg-icon>
                添加频道封面
            </el-button>
            <div v-if="channelInfo.logoUri" class="image-box">
                <img :src="channelInfo.logoUri | imageUrl">
            </div>
        </div>
        <div class="vice-block text-left">
            <h3 class="block-vice-title">频道节目信息</h3>
            <el-card>
                <ul>
                    <li>
                        <span>当前播放</span>
                        <label class="on-play">
                            {{channelInfo.currentProgramme ? channelInfo.currentProgramme : '暂无当前播放节目'}}
                        </label>
                    </li>
                    <li><span>播放时段</span><label>{{channelInfo.duration}}</label></li>
                    <li>
                        <span>视频个数</span>
                        <label>
                            {{currentSelectedVideoList ? currentSelectedVideoList.length : ''}}个
                        </label>
                    </li>
                </ul>
            </el-card>
            <div class="text-left" v-if="currentSelectedVideoList.length === 0">
                <el-button
                    class="add-video create-blue-btn contain-svg-icon"
                    @click="popAppendVideoDialogue(0)">
                    <svg-icon icon-class="video"></svg-icon>
                    点击添加视频
                </el-button>
            </div>
            <el-table
                header-row-class-name="common-table-header"
                :data="currentSelectedVideoList"
                row-class-name=video-larger-row
                border
                style="width: 100%">
                <el-table-column
                    width="50px"
                    align="center"
                    label="播放顺序">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column
                    width="120px"
                    align="center"
                    prop="code"
                    label="视频编号">
                </el-table-column>
                <el-table-column
                    prop="originName"
                    width="200px"
                    align="center"
                    label="视频文件名">
                </el-table-column>
                <el-table-column
                    prop="name"
                    align="center"
                    label="视频展示名">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name"></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="link"
                    align="center"
                    width="160px"
                    label="预览视频">
                    <template slot-scope="scope">
                        <div class="btn-icon-container">
                            <el-button
                                v-if="scope.row.m3u8For4K"
                                type="text"
                                size="small"
                                @click="displayVideo(scope.row.m3u8For4K,scope.row.originName)"
                            >4K
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
                                @click="displayVideo(scope.row.m3u8For1080P,scope.row.originName)"
                            >1080
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
                                @click="displayVideo(scope.row.m3u8For720P,scope.row.originName)"
                            >720
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
                                @click="displayVideo(scope.row.m3u8For480P,scope.row.originName)"
                            >480
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
                    width="120px"
                    align="center"
                    label="视频时长">
                    <template slot-scope="scope">
                        {{scope.row.takeTimeInSec | fromSecondsToTime}}
                    </template>
                </el-table-column>
                <el-table-column
                    width="100px"
                    align="center"
                    label="视频状态">
                    <template slot-scope="scope">
                        <i class="status-normal" v-if="scope.row.visible">正常</i>
                        <i class="status-abnormal" v-else>禁播</i>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="操作"
                                 width="200px"
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
            <el-collapse id="channel-setting" v-model="activeNames">
                <el-collapse-item title="排序" name="1">
                    <el-card id="auto-sort">
                        <div slot="header" class="clearfix">
                            <div v-for="(item, index) in sectionList" :key="index">
                                <el-input v-model="item.name" placeholder="请填写部的名称"></el-input>
                                <el-button type="primary" plain @click="removeSection(index)"
                                           v-if="sectionList.length !== 1">
                                    删除
                                </el-button>
                            </div>
                            <el-tooltip content="填写部的名称，例如'还珠格格'、'还珠格格2'、'新还珠格格'等" placement="top" effect="light">
                                <el-button type="primary" plain @click="addSection">添加部的名称</el-button>
                            </el-tooltip>
                            <div class="text-center">
                                <el-tooltip content="根据填写的部的名称列表，例如'还珠格格2'，以及视频的展示名称，例如'还珠格格2-02'进行自动排序" placement="top"
                                            effect="light">
                                    <el-button type="primary" plain @click="autoSort">自动排序</el-button>
                                </el-tooltip>
                            </div>
                        </div>
                        <el-tooltip content="拖动排序功能" placement="top" effect="light">
                            <el-button type="primary" plain @click="sortVideoList">视频拖动排序</el-button>
                        </el-tooltip>
                        <el-tooltip content="反转当前视频列表功能" placement="top" effect="light">
                            <el-button type="primary" plain @click="revertVideoList">反转列表</el-button>
                        </el-tooltip>
                    </el-card>
                </el-collapse-item>
                <el-collapse-item title="设置展示名称" name="2">
                    <el-card id="fill-display-name">
                        <div slot="header" class="clearfix">
                            <div>
                                <label>删除原始文件名称第一部分：</label>
                                <el-input
                                    v-model="originNameParams.prefix"
                                    placeholder="请填写前缀等需要删除的连续文字，例如'（高清）'等">
                                </el-input>
                            </div>
                            <div>
                                <label>删除原始文件名称第二部分：</label>
                                <el-input
                                    v-model="originNameParams.midWords"
                                    placeholder="请填写中间等需要删除的连续文字，例如'（高清）'等">
                                </el-input>
                            </div>
                            <div>
                                <label>删除原始文件名称第三部分：</label>
                                <el-input
                                    v-model="originNameParams.suffix"
                                    placeholder="请填写后缀等需要删除的连续文字，例如'.mpg'等">
                                </el-input>
                            </div>
                            <div class="text-center">
                                <el-tooltip
                                    content="根据填写的视频文件名称需要删除的部分，对视频原始文件名称进行截取删除操作，并填写到展示名称处"
                                    placement="top"
                                    effect="light">
                                    <el-button type="primary" plain @click="setDisplayNameFromOriginName">填写展示名称
                                    </el-button>
                                </el-tooltip>
                            </div>
                        </div>
                        <div slot="header" class="clearfix">
                            <h3 class="block-vice-title">根据视频展示名对视频展示名称进行设置：</h3>
                            <div>
                                <label>被替换视频展示名部分：</label>
                                <el-input
                                    v-model="displayNameParams.words"
                                    placeholder="请填写需要被替换的连续文字，例如'（高清）'等">
                                </el-input>
                            </div>
                            <div>
                                <label>替换为视频展示名部分：</label>
                                <el-input
                                    v-model="displayNameParams.replacer"
                                    placeholder="请填写需要替换为的连续文字，例如'-'等">
                                </el-input>
                            </div>
                            <div class="text-center">
                                <el-tooltip
                                    content="根据填写的展示名称需要删除的部分，对视频展示名进行截取删除操作，并填回到展示名称处"
                                    placement="top"
                                    effect="light">
                                    <el-button type="primary" plain @click="setDisplayNameFromSelf">填写展示名称</el-button>
                                </el-tooltip>
                            </div>
                        </div>
                        <el-tooltip
                            content="分割原始文件名'&&'，自动填写展示名称，例如原始文件名称为'（高清）新还珠格格（收录）01&&新还珠格格-01.mpg'"
                            placement="top"
                            effect="light">
                            <el-button type="primary" plain @click="setVideoNameList">设置展示名称</el-button>
                        </el-tooltip>
                        <el-tooltip content="删除当前视频中的展示名称中的最后面的数字" placement="top" effect="light">
                            <el-button type="primary" plain @click="removeDisplayNameNo">删除展示名称后面的数字</el-button>
                        </el-tooltip>
                        <el-tooltip content="在展示名称的文字最后插入'-'，例如'天龙八部01'改为'天龙八部-01'" placement="top" effect="light">
                            <el-button type="primary" plain @click="insertShortLine">插入'-'</el-button>
                        </el-tooltip>
                    </el-card>
                </el-collapse-item>
            </el-collapse>
            <!--填写视频展示名称-->
        </div>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :title="previewVideoInfo.title"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <div class="text-center update-box">
            <el-button type="primary" @click="updateInfo" class="page-main-btn">保存</el-button>
            <el-button @click="toChannelList" class="page-main-btn">返回列表页</el-button>
        </div>
        <el-dialog
            title="选择相应的视频"
            :close-on-click-modal=false
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
        <sort-dialog
            v-if="sortDialogVisible"
            :close-on-click-modal=false
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
    import Vue from 'vue';
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';
    import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
    import SelectMultipleVideo from './SelectMultipleVideo';
    import SortDialog from 'sysComponents/custom_components/custom/SortDialog';
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import {CHANNEL_LOGO_DIMENSION} from '@/util/config/dimension';

    const ClipboardJS = require('clipboard');

    export default {
        name: 'EditCarouselChannel',
        components: {
            DisplayVideoDialog,
            SelectMultipleVideo,
            SortDialog,
            UploadImage,
            SingleImageUploader
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('频道名称不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkInnerName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('内部名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('内部名称不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkNo = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道编号不能为空'));
                } else if (!this.$util.isChannelNo(value)) {
                    return callback(new Error('请填写频道编号数字，例如"001"'));
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
                this.channelInfo.multicastIp = this.$util.trim(this.channelInfo.multicastIp);
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
            let checkPushServer = (rule, value, callback) => {
                this.channelInfo.pushServer = this.$util.trim(this.channelInfo.pushServer);
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请填写所属服务器'));
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
                allowResolutions: CHANNEL_LOGO_DIMENSION,
                activeNames: ['1'],
                originNameParams: {
                    prefix: '',
                    midWords: '',
                    suffix: ''
                },
                displayNameParams: {
                    words: '',
                    replacer: ''
                },
                size: CHANNEL_LOGO_DIMENSION,
                imageUploadDialogVisible: false,
                sortDialogVisible: false,
                selectDialogVisible: false,
                channelInfo: {
                    typeIdList: [],
                    multicastIp: '',
                    pushServer: '',
                    visible: ''
                },
                sectionList: [{name: ''}],
                typeOptions: [],
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
                    pushServer: [
                        {validator: checkPushServer, trigger: 'blur'}
                    ],
                    logoUri: [
                        {validator: checkLogoUri, trigger: 'blur'}
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
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            // 根据视频展示名在文字的最后添加'-'
            insertShortLine() {
                for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                    this.currentSelectedVideoList[i].name = this.currentSelectedVideoList[i].name.replace(/([\u4e00-\u9fa5]+)/, '$1-');
                    Vue.set(this.currentSelectedVideoList, i, this.currentSelectedVideoList[i]);
                }
                this.$message({
                    message: '已根据视频展示名在文字的最后添加"-"',
                    type: 'success'
                });
            },
            setDisplayNameFromOriginName() {
                for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                    this.currentSelectedVideoList[i].name = this.currentSelectedVideoList[i].originName.replace(this.originNameParams.prefix, '');
                    this.currentSelectedVideoList[i].name = this.currentSelectedVideoList[i].name.replace(this.originNameParams.midWords, '');
                    this.currentSelectedVideoList[i].name = this.currentSelectedVideoList[i].name.replace(this.originNameParams.suffix, '');
                    Vue.set(this.currentSelectedVideoList, i, this.currentSelectedVideoList[i]);
                }
                this.$message({
                    message: '已根据删除文字部分填写完成视频展示名称',
                    type: 'success'
                });
            },
            removeDisplayNameNo() {
                for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                    this.currentSelectedVideoList[i].name = this.currentSelectedVideoList[i].name.replace(/\d+$/, '');
                    Vue.set(this.currentSelectedVideoList, i, this.currentSelectedVideoList[i]);
                }
                this.$message({
                    message: '已删除展示名称后面的数字',
                    type: 'success'
                });
            },
            setDisplayNameFromSelf() {
                for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                    this.currentSelectedVideoList[i].name = this.currentSelectedVideoList[i].name.replace(this.displayNameParams.words, this.displayNameParams.replacer);
                    Vue.set(this.currentSelectedVideoList, i, this.currentSelectedVideoList[i]);
                }
                this.$message({
                    message: '已根据填写的删除部分对展示名称进行了处理',
                    type: 'success'
                });
            },
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
                                this.channelInfo.duration = this.$util.formatDate(new Date(video.lastPlayTime), 'yyyy年MM月DD日HH时mm分SS秒') + '---' + this.$util.formatDate(new Date(video.lastPlayTime + video.takeTimeInSec * 1000), 'yyyy年MM月DD日HH时mm分SS秒');
                            }
                        });
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
                for (let i = 0; i < this.currentSelectedVideoList.length; i++) {
                    if (this.currentSelectedVideoList[i].originName.indexOf('&&') === -1) {
                        this.currentSelectedVideoList[i].name = '';
                    } else {
                        this.currentSelectedVideoList[i].name = this.currentSelectedVideoList[i].originName.split('&&')[1].split('.')[0];
                    }
                    Vue.set(this.currentSelectedVideoList, i, this.currentSelectedVideoList[i]);
                }
                this.$message({
                    message: '设置视频展示名称已完成',
                    type: 'success'
                });
            },
            revertVideoList() {
                let array = [];
                for (let i = this.currentSelectedVideoList.length - 1; i > -1; i--) {
                    array.push(this.currentSelectedVideoList[i]);
                }
                this.currentSelectedVideoList = array;
                this.$message({
                    message: '视频列表已反转',
                    type: 'success'
                });
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
                this.$message('已完成根据部的名称列表以及视频展示名称对其进行排序');
            },
            sortTwoDimension(videoTwoDimension) {
                for (let k = 0; k < videoTwoDimension.length; k++) {
                    videoTwoDimension[k].sort(function (pre, next) {
                        return parseInt(pre.name.split('-')[1]) - parseInt(next.name.split('-')[1]);
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
            displayVideo(url, title) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.previewVideoInfo.url = `${baseUri}${url}`;
                this.previewVideoInfo.title = title;
                this.previewVideoInfo.visible = true;
            },
            // 关闭视频预览
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            },
            // 禁播视频,当前正在播放视频可以禁播-2018.08.09
            disabledConfirm(videoItem) {
                this.$confirm('是否确认禁播视频，此操作将在点击保存时生效，请知晓。', '提示', {
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
                this.$confirm('是否确认恢复视频，此操作将在点击保存时生效，请知晓。', '提示', {
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
            // 删除视频，当前正在播放视频可以删除-2018.08.09
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
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            // 更新频道信息
            updateInfo() {
                /** 在正常频道保存时，必须含有能正常播放的视频  */
                if (this.channelInfo.visible) {
                    let tag = false;
                    this.currentSelectedVideoList.map(video => {
                        if (video.visible) {
                            tag = true;
                        }
                    });
                    if (!tag) {
                        this.$message({
                            message: '当前正常频道中不含能正常播放的视频，不能更新保存',
                            type: 'warning'
                        });
                        return;
                    }
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
                                this.$message.success('保存频道信息成功');
                                this.toChannelList();
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
            },
            toChannelList() {
                this.$router.push({name: 'CarouselChannelList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-input, .el-select {
        width: 600px;
    }

    .el-card {
        display: inline-block;
        padding-right: 50px;
        ul {
            li {
                display: flex;
                margin-bottom: 10px;
                min-height: 32px;
                flex-direction: row;
                justify-content: left;
                align-items: center;
                > span {
                    margin-right: 80px;
                    width: 120px;
                    text-align: right;
                    flex-shrink: 0;
                    font-size: $largerFontSize;
                    color: $baseGray;
                }
                label {
                    min-width: 380px;
                    font-size: $normalFontSize;
                    color: #909399;
                    flex-shrink: 0;
                    line-height: 2;
                    text-align: left;
                    &.on-play {
                        color: $baseBlue;
                    }
                    .el-tag {
                        margin-right: 10px;
                    }
                }
            }
        }
    }

    .add-video {
        margin-top: 30px;
    }

    .update-box {
        margin: 120px 0px 80px 0px;
    }

    .image-box {
        margin-top: 20px;
    }

    .copy-btn {
        cursor: pointer;
    }

    .el-table {
        .el-input {
            width: 100%;
        }
    }

    #auto-sort, #fill-display-name {
        width: 100%;
        .el-button {
            margin-bottom: 30px;
            margin-right: 50px;
        }
        .el-input {
            margin-bottom: 20px;
        }
    }

</style>

<style lang="scss">
    #channel-setting {
        width: 100%;
        .el-collapse-item__header {
            padding-left: 20px;
            font-size: 16px;
        }
        .el-collapse-item__content {
            padding-bottom: 0px;
        }
        .el-collapse-item__wrap {
            background: $stillGray;
        }
    }
</style>
