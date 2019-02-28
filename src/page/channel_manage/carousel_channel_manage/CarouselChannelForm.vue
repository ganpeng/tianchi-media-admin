<!--轮播频道编辑页面-->
<template>
    <div>
        <div class="seperator-line"></div>
        <!--基本信息-->
        <el-form
            ref="channelInfo"
            :model="channelInfo"
            :rules="infoRules"
            status-icon
            label-width="110px"
            class="form-block">
            <el-form-item label="频道名称" prop="name" required>
                <el-input
                    v-model="channelInfo.name"
                    size="medium"
                    placeholder="请填写20个字以内的频道名称">
                </el-input>
            </el-form-item>
            <el-form-item label="内部名称" prop="innerName" required>
                <el-input
                    v-model="channelInfo.innerName"
                    size="medium"
                    placeholder="请填写20个字以内的内部名称">
                </el-input>
            </el-form-item>
            <el-form-item label="频道编号" prop="no" required>
                <el-input
                    v-model="channelInfo.no"
                    type="number"
                    size="medium"
                    placeholder="请填写频道编号数字，例如'001'">
                </el-input>
            </el-form-item>
            <el-form-item label="频道类别" prop="typeIdList" required>
                <el-select
                    v-model="channelInfo.typeIdList"
                    multiple
                    size="medium"
                    placeholder="请选择频道类别">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公共频道" prop="common" required>
                {{channelInfo.common ? '是' : '否'}}
            </el-form-item>
            <el-form-item label="区域码" prop="companyCodeList" required>
                <el-select
                    v-model="channelInfo.companyCodeList"
                    @change="setCompanies"
                    multiple
                    size="medium"
                    placeholder="请选择区域码">
                    <el-option
                        v-for="item in companyOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.code">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="组播地址" prop="multicastIp" required>
                <el-input
                    v-model="channelInfo.multicastIp"
                    size="medium"
                    placeholder="请填写组播地址">
                </el-input>
            </el-form-item>
            <el-form-item label="端口号" prop="multicastPort" required>
                <el-input
                    v-model="channelInfo.multicastPort"
                    type="number"
                    size="medium"
                    placeholder="请填写端口号">
                </el-input>
            </el-form-item>
            <el-form-item label="推流方式" prop="protocolList" required>
                <el-checkbox-group v-model="channelInfo.protocolList">
                    <el-checkbox label="HLS"></el-checkbox>
                    <el-checkbox label="UDP"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="tsID" prop="tsId">
                <el-input
                    v-model="channelInfo.tsId"
                    type="number"
                    size="medium"
                    placeholder="请填写tsId">
                </el-input>
            </el-form-item>
            <el-form-item label="serviceID" prop="serviceId">
                <el-input
                    v-model="channelInfo.serviceId"
                    type="number"
                    size="medium"
                    placeholder="请填写serviceId">
                </el-input>
            </el-form-item>
            <el-form-item label="所属服务器" prop="pushServer" required>
                <el-input
                    v-model="channelInfo.pushServer"
                    size="medium"
                    placeholder="请填写所属服务器的IP地址">
                </el-input>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required v-if="status === 'CREATE_CHANNEL'">
                <label>禁播</label>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required v-if="status === 'EDIT_CHANNEL'">
                <el-radio-group v-model="channelInfo.visible">
                    <el-radio :label="true">正常</el-radio>
                    <el-radio :label="false">禁播</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="频道图" prop="logoUri" required>
                <label class="tips">(260*260 频道图)</label>
                <div>
                    <img v-if="channelInfo.logoUri" :src="channelInfo.logoUri | imageUrl" class="logo-image">
                    <single-image-uploader
                        :allowResolutions="allowResolutions"
                        :uploadSuccessHandler="uploadSuccessHandler">
                    </single-image-uploader>
                </div>
            </el-form-item>
        </el-form>
        <div class="seperator-line"></div>
        <!--频道节目信息-->
        <div class="text-left" v-if="status === 'EDIT_CHANNEL'">
            <h3 class="content-sub-title">频道节目信息</h3>
            <ul>
                <li>
                    <span>当前播放：</span>
                    <label class="on-play">
                        {{channelInfo.currentProgramme ? channelInfo.currentProgramme : '暂无当前播放节目'}}
                    </label>
                </li>
                <li>
                    <span>播放时段：</span>
                    <label class="duration">{{channelInfo.duration}}</label></li>
                <li>
                    <span>视频个数：</span>
                    <label class="count">
                        {{currentSelectedVideoList ? currentSelectedVideoList.length : 0}}个
                    </label>
                </li>
            </ul>
            <div class="seperator-line"></div>
        </div>
        <!--频道内节目-->
        <div class="content-sub-title">频道内节目
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
                width="210px"
                align="center"
                label="文件名">
            </el-table-column>
            <el-table-column
                prop="name"
                min-width="360px"
                align="center"
                label="展示名">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.name"></el-input>
                </template>
            </el-table-column>
            <el-table-column
                prop="link"
                align="center"
                width="90px"
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
                width="90px"
                align="center"
                label="时长">
                <template slot-scope="scope">
                    {{scope.row.takeTimeInSec | fromSecondsToTime}}
                </template>
            </el-table-column>
            <el-table-column
                width="60px"
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        v-model="scope.row.visible"
                        :checked="scope.row.visible"
                        @click.prevent="updateVideoStatus(scope.row)"/>
                    <i v-if="scope.row.visible" class="on-the-shelf">正常</i>
                    <i v-else class="off-the-shelf">禁播</i>
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
        <!--排序工具-->
        <div id="sort-tool" v-if="currentSelectedVideoList.length !== 0">
            <div class="sort-header" @click="sortToolVisible = !sortToolVisible">
                <label>排序工具</label>
                <i class="el-icon-arrow-down" v-if="sortToolVisible"></i>
                <i class="el-icon-arrow-right" v-else></i>
            </div>
            <div class="sort-body" v-if="sortToolVisible">
                <ul>
                    <li v-for="(item, index) in sectionList" :key="index">
                        <el-input v-model="item.name" placeholder="请填写'部'的名称"></el-input>
                        <span @click="removeSection(index)" v-if="sectionList.length !== 1">
                            <svg-icon icon-class="remove"></svg-icon>
                        </span>
                        <span @click="addSection" v-show="index === sectionList.length - 1">
                            <svg-icon icon-class="add"></svg-icon>
                        </span>
                    </li>
                </ul>
                <div class="sort-operate">
                    <el-tooltip content="根据填写的部的名称列表，例如'还珠格格2'，以及视频的展示名称，例如'还珠格格2-02'进行自动排序" placement="top"
                                effect="light">
                        <el-button type="primary" plain class="btn-style-four" @click="autoSort">自动排序</el-button>
                    </el-tooltip>
                    <el-tooltip content="拖动排序功能" placement="top" effect="light">
                        <el-button type="text" @click="sortVideoList">视频拖动排序</el-button>
                    </el-tooltip>
                    <el-tooltip content="反转当前视频列表功能" placement="top" effect="light">
                        <el-button type="text" @click="revertVideoList">反转列表</el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <!--设置展示名称-->
        <div id="display-name-setting" v-if="currentSelectedVideoList.length !== 0">
            <div class="display-name-header" @click="displayNameSettingVisible = !displayNameSettingVisible">
                <label>设置展示名称</label>
                <i class="el-icon-arrow-down" v-if="displayNameSettingVisible"></i>
                <i class="el-icon-arrow-right" v-else></i>
            </div>
            <div class="display-name-body" v-if="displayNameSettingVisible">
                <div class="replace-other-setting">
                    <ul>
                        <li>
                            <label>删除原始文件名称第一部分：</label>
                            <el-input
                                v-model="originNameParams.prefix"
                                placeholder="请填写前缀等需要删除的连续文字，例如'（高清）'等">
                            </el-input>
                        </li>
                        <li>
                            <label>删除原始文件名称第二部分：</label>
                            <el-input
                                v-model="originNameParams.midWords"
                                placeholder="请填写中间等需要删除的连续文字，例如'（高清）'等">
                            </el-input>
                        </li>
                        <li>
                            <label>删除原始文件名称第三部分：</label>
                            <el-input
                                v-model="originNameParams.suffix"
                                placeholder="请填写后缀等需要删除的连续文字，例如'.mpg'等">
                            </el-input>
                        </li>
                    </ul>
                    <el-tooltip
                        content="根据填写的视频文件名称需要删除的部分，对视频原始文件名称进行截取删除操作，并填写到展示名称处"
                        placement="top"
                        effect="light">
                        <el-button type="primary" plain class="btn-style-four" @click="setDisplayNameFromOriginName">
                            填写展示名称
                        </el-button>
                    </el-tooltip>
                </div>
                <div class="replace-self-setting">
                    <span>根据视频展示名对视频展示名称进行设置：</span>
                    <ul>
                        <li>
                            <label>被替换视频展示名部分：</label>
                            <el-input
                                v-model="displayNameParams.words"
                                placeholder="请填写需要被替换的连续文字，例如'（高清）'等">
                            </el-input>
                        </li>
                        <li>
                            <label>替换为视频展示名部分：</label>
                            <el-input
                                v-model="displayNameParams.replacer"
                                placeholder="请填写需要替换为的连续文字，例如'-'等">
                            </el-input>
                        </li>
                    </ul>
                    <el-tooltip
                        content="根据填写的展示名称需要删除的部分，对视频展示名进行截取删除操作，并填回到展示名称处"
                        placement="top"
                        effect="light">
                        <el-button type="primary" plain class="btn-style-four" @click="setDisplayNameFromSelf">填写展示名称
                        </el-button>
                    </el-tooltip>
                </div>
                <div class="display-name-operate">
                    <el-tooltip
                        content="分割原始文件名'&&'，自动填写展示名称，例如原始文件名称为'（高清）新还珠格格（收录）01&&新还珠格格-01.mpg'"
                        placement="top"
                        effect="light">
                        <el-button type="text" @click="setVideoNameList">设置展示名称</el-button>
                    </el-tooltip>
                    <el-tooltip content="删除当前视频中的展示名称中的最后面的数字" placement="top" effect="light">
                        <el-button type="text" @click="removeDisplayNameNo">删除展示名称后面的数字</el-button>
                    </el-tooltip>
                    <el-tooltip content="在展示名称的文字最后插入'-'，例如'天龙八部01'改为'天龙八部-01'" placement="top" effect="light">
                        <el-button type="text" @click="insertShortLine">插入'-'</el-button>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :title="previewVideoInfo.title"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveChannelInfo" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toChannelList" plain>返回列表</el-button>
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
    </div>
</template>

<script>
    import Vue from 'vue';
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';
    import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
    import SelectMultipleVideo from './SelectMultipleVideo';
    import SortDialog from 'sysComponents/custom_components/custom/SortDialog';
    import {CHANNEL_LOGO_DIMENSION} from '@/util/config/dimension';

    const ClipboardJS = require('clipboard');

    export default {
        name: 'EditCarouselChannel',
        props: {
            // 创建：'CREATE_CHANNEL'，编辑：'EDIT_CHANNEL'
            status: {
                type: String,
                default: function () {
                    return 'CREATE_CHANNEL';
                }
            }
        },
        components: {
            DisplayVideoDialog,
            SelectMultipleVideo,
            SortDialog,
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
            let checkCompanyCodeList = (rule, value, callback) => {
                if (this.channelInfo.companyCodeList.length === 0) {
                    return callback(new Error('请选择区域码'));
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
            let checkProtocolList = (rule, value, callback) => {
                if (value.length === 0) {
                    return callback(new Error('请勾选推流方式'));
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
                isLoading: false,
                displayNameSettingVisible: false,
                sortToolVisible: true,
                allowResolutions: CHANNEL_LOGO_DIMENSION,
                originNameParams: {
                    prefix: '',
                    midWords: '',
                    suffix: ''
                },
                displayNameParams: {
                    words: '',
                    replacer: ''
                },
                sortDialogVisible: false,
                selectDialogVisible: false,
                channelInfo: {
                    category: 'CAROUSEL',
                    typeIdList: [],
                    common: false,
                    companyCodeList: [],
                    protocolList: [],
                    multicastIp: '',
                    pushServer: '',
                    visible: false,
                    logoUri: ''
                },
                sectionList: [{name: ''}],
                typeOptions: [],
                companyOptions: [],
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
                    companyCodeList: [
                        {validator: checkCompanyCodeList, trigger: 'change'}
                    ],
                    multicastIp: [
                        {validator: checkMulticastIp, trigger: 'blur'}
                    ],
                    multicastPort: [
                        {validator: checkMulticastPort, trigger: 'blur'}
                    ],
                    protocolList: [
                        {validator: checkProtocolList, trigger: 'change'}
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
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getChannelType({category: 'CAROUSEL'}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
                // 获取所属区域的数据
                this.$service.getFilialeList().then(response => {
                    if (response && response.code === 0) {
                        this.companyOptions = response.data;
                        this.companyOptions.unshift({id: '0', code: '0', name: '全选'});
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
                if (this.status === 'EDIT_CHANNEL') {
                    this.getChannelDetail();
                }
            },
            getChannelDetail() {
                this.$service.getChannelDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            if (!response.data.protocolList) {
                                this.channelInfo.protocolList = [];
                            } else {
                                this.channelInfo[key] = response.data[key];
                            }
                        }
                        response.data.typeList.map(type => {
                            this.channelInfo.typeIdList.push(type.id);
                        });
                        response.data.companyList.map(company => {
                            this.channelInfo.companyCodeList.push(company.code);
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
            },
            // 设置区域码，对全选进行处理
            setCompanies() {
                if (this.channelInfo.companyCodeList.length !== (this.companyOptions.length - 1)) {
                    this.channelInfo.common = false;
                } else {
                    this.channelInfo.common = true;
                }
                this.channelInfo.companyCodeList.map(companyCode => {
                    if (companyCode === '0') {
                        this.channelInfo.companyCodeList = [];
                        this.companyOptions.map(companyOption => {
                            if (companyOption.name !== '全选') {
                                this.channelInfo.companyCodeList.push(companyOption.code);
                            }
                        });
                        this.channelInfo.common = true;
                    }
                });
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
            uploadSuccessHandler(image) {
                this.channelInfo.logoUri = image.uri;
            },
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
            // 禁播、恢复视频,当前正在播放视频可以禁播-2018.08.09
            updateVideoStatus(videoItem) {
                this.$confirm('是否确认' + (videoItem.visible ? '禁播' : '恢复') + '视频，此操作将在点击保存时生效，请知晓。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    videoItem.visible = !videoItem.visible;
                    this.$message.success((videoItem.visible ? '禁播' : '恢复') + '视频成功!');
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + (videoItem.visible ? '禁播' : '恢复')
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
            // 保存频道信息
            saveChannelInfo() {
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
                            message: '当前正常频道中不含能正常播放的视频，不能保存',
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
                        this.channelInfo.companyList = [];
                        this.channelInfo.companyCodeList.map(companyCode => {
                            this.companyOptions.map(company => {
                                if (companyCode === company.code) {
                                    this.channelInfo.companyList.push(company);
                                }
                            });
                        });
                        this.isLoading = true;
                        switch (this.status) {
                            case 'CREATE_CHANNEL':
                                this.$service.createChannels(this.channelInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('成功创建频道');
                                        this.toChannelList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            case 'EDIT_CHANNEL':
                                this.$service.updateChannelById(
                                    this.$route.params.id,
                                    this.channelInfo
                                ).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('保存频道信息成功');
                                        this.toChannelList();
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
            toChannelList() {
                this.$router.push({name: 'CarouselChannelList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    /*设置展示名称*/
    #display-name-setting {
        margin-top: 20px;
        margin-bottom: 20px;
        background: #2A3040;
        border-radius: 8px;
        .display-name-header {
            height: 50px;
            line-height: 50px;
            overflow: hidden;
            cursor: pointer;
            label {
                float: left;
                padding-left: 10px;
                font-size: 18px;
                color: #A8ABB3;
            }
            i {
                float: right;
                padding-right: 5px;
                margin-top: 20px;
                font-size: 14px;
                color: #3E495E;
                cursor: pointer;
            }
        }
        .display-name-body {
            border-top: 1px solid #3E495E;
            .el-input {
                margin-right: 20px;
                width: 300px;
            }
            .replace-other-setting {
                text-align: left;
                ul {
                    padding-left: 20px;
                    margin-top: 20px;
                    text-align: left;
                    li {
                        margin-bottom: 20px;
                        label {
                            color: #fff;
                        }
                    }
                }
                .el-tooltip {
                    margin-left: 160px;
                }
            }
            .replace-self-setting {
                margin-top: 40px;
                text-align: left;
                span {
                    padding-left: 20px;
                    font-size: 16px;
                    color: #A8ABB3;
                }
                ul {
                    padding-left: 20px;
                    margin-top: 20px;
                    text-align: left;
                    li {
                        margin-bottom: 20px;
                        label {
                            color: #fff;
                        }
                    }
                }
                .el-tooltip {
                    margin-left: 160px;
                }
            }
            .display-name-operate {
                margin-top: 40px;
                padding-left: 20px;
                padding-bottom: 20px;
                text-align: left;
                .el-tooltip {
                    margin-right: 50px;
                }
            }
        }
    }

    /*排序工具*/
    #sort-tool {
        margin-top: 40px;
        margin-bottom: 20px;
        background: #2A3040;
        border-radius: 8px;
        .sort-header {
            height: 50px;
            line-height: 50px;
            overflow: hidden;
            cursor: pointer;
            label {
                float: left;
                padding-left: 10px;
                font-size: 18px;
                color: #A8ABB3;
            }
            i {
                float: right;
                padding-right: 5px;
                margin-top: 20px;
                font-size: 14px;
                color: #3E495E;
                cursor: pointer;
            }
        }
        .sort-body {
            border-top: 1px solid #3E495E;
            .el-input {
                margin-right: 20px;
                width: 300px;
            }
            ul {
                padding-left: 20px;
                margin-top: 20px;
                text-align: left;
                li {
                    margin-bottom: 20px;
                    span {
                        margin-right: 15px;
                        width: auto;
                        cursor: pointer;
                    }
                }
            }
            .sort-operate {
                padding-top: 5px;
                padding-left: 20px;
                padding-bottom: 20px;
                text-align: left;
                .el-tooltip {
                    margin-right: 50px;
                }
            }
        }
    }

    .el-input, .el-select {
        width: 600px;
    }

    /*频道基本信息*/
    .el-form {
        margin-top: 20px;
        .logo-image {
            display: inline-block;
            margin-right: 30px;
            width: 78px;
            height: 78px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.50);
        }
        .single-image-uploader-container {
            display: inline-block;
        }
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

    .tips {
        color: #A8ABB3;
    }

    /*频道内关联的视频*/
    .el-table {
        .el-input {
            width: 100%;
        }
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

    // 操作
    .operate-block {
        position: fixed;
        bottom: 10px;
        left: 0px;
        right: 0px;
        margin: auto;
        width: 500px;
        height: 80px;
        line-height: 90px;
        background: #293550;
        box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.20);
        border-radius: 8px;
        z-index: 600;
        .el-button:last-child {
            margin-left: 40px;
        }
    }

    .svg-icon-remove {
        fill: #1989FA;
    }

    .svg-icon-video {
        height: 15px !important;
        width: 20px !important;
    }

    .el-checkbox-group {
        .el-checkbox {
            padding: 0;
        }
    }

</style>
