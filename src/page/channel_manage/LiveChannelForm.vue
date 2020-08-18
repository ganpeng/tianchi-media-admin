<!-- 直播频道表单 -->
<template>
    <div class="live-channel-form-container form-container">
        <el-col :span="8">
            <el-form :model="liveChannel" :rules="inputRules" ref="liveChannelForm" @submit.native.prevent
                     class="form-block my-form" label-width="120px">
                <el-form-item label="频道名称" prop="innerName">
                    <el-input
                        :value="liveChannel.innerName"
                        :maxlength="20"
                        placeholder="请输入直播频道名称"
                        @input="inputHandler($event, 'innerName')">
                    </el-input>
                </el-form-item>
                <el-form-item label="展示名" prop="name">
                    <el-input
                        :value="liveChannel.name"
                        :maxlength="20"
                        placeholder="请输入直播频道展示名"
                        @input="inputHandler($event, 'name')">
                    </el-input>
                </el-form-item>
                <el-form-item label="展示编号" prop="no">
                    <el-input
                        type="number"
                        :value="liveChannel.no"
                        placeholder="请输入直播频道展示编号"
                        @input="inputHandler($event, 'no')">
                    </el-input>
                </el-form-item>
                <el-form-item label="CDN拉流" prop="cdnPush">
                    <el-radio @input="inputHandler(true, 'cdnPush')" :value="liveChannel.cdnPush" :label="true">是
                    </el-radio>
                    <el-radio @input="inputHandler(false, 'cdnPush')" :value="liveChannel.cdnPush" :label="false">否
                    </el-radio>
                </el-form-item>
                <!--
                <el-form-item v-if="liveChannel.cdnPush" label="推流地址" prop="pushAddress">
                    <el-input
                        placeholder="请输入pushAddress"
                        :value="liveChannel.pushAddress"
                        maxlength="300"
                        @input="inputHandler($event, 'pushAddress')"
                    >
                    </el-input>
                </el-form-item>
                -->
                <el-form-item v-if="!liveChannel.cdnPush" label="频道IP" prop="multicastIp">
                    <el-input
                        placeholder="请输入频道IP"
                        :value="liveChannel.multicastIp"
                        @input="inputHandler($event, 'multicastIp')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item v-if="!liveChannel.cdnPush" label="频道端口" prop="multicastPort">
                    <el-input
                        type="number"
                        placeholder="请输入频道端口"
                        :value="liveChannel.multicastPort"
                        @input="inputHandler($event, 'multicastPort')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item v-if="liveChannel.cdnPush" label="拉流地址" prop="pullAddress">
                    <el-input
                        placeholder="请输入拉流地址"
                        :value="liveChannel.pullAddress"
                        maxlength="300"
                        @input="inputHandler($event, 'pullAddress')">
                    </el-input>
                </el-form-item>
                <!-- 直播服务器组,2.8 改为下拉 -->
                <el-form-item label="直播服务器组" prop="serverGroup">
                    <el-select
                        clearable
                        filterable
                        :value="liveChannel.serverGroup"
                        placeholder="请选择所属服务器组"
                        @input="inputHandler($event, 'serverGroup')">
                        <el-option
                            v-for="(item, index) in serverGroupOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.name">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right">{{item.currentCount}}/{{item.totalCount}}</span>
                        </el-option>
                    </el-select>
                    <!--<el-input-->
                    <!--placeholder="请输入所属服务器组"-->
                    <!--:value="liveChannel.serverGroup"-->
                    <!--@input="inputHandler($event, 'serverGroup')">-->
                    <!--</el-input>-->
                </el-form-item>
                <!-- 2.8 -->
                <el-form-item label="直播videoPid" prop="liveVideoPid">
                    <el-input
                        placeholder="请输入直播videoPid"
                        :value="liveChannel.liveVideoPid"
                        @input="inputHandler($event, 'liveVideoPid')">
                    </el-input>
                </el-form-item>
                <el-form-item label="直播audioPid" prop="liveAudioPid">
                    <el-input
                        placeholder="请输入直播audioPid"
                        :value="liveChannel.liveAudioPid"
                        @input="inputHandler($event, 'liveAudioPid')">
                    </el-input>
                </el-form-item>
                <!-- 推流方式 -->
                <el-form-item ref="protocolListFormItem" label="推流方式" prop="protocolList">
                    <el-checkbox :value="methodsChecked('HLS')" @change="methodsHandler($event, 'HLS')">HLS
                    </el-checkbox>
                    <el-checkbox v-if="!liveChannel.cdnPush" :value="methodsChecked('UDP')"
                                 @change="methodsHandler($event, 'UDP')">UDP
                    </el-checkbox>
                </el-form-item>
                <!-- 只有选择hls的时候出现视频、服务器、音频转码 -->
                <el-form-item v-if="withHls" label="视频转码" prop="videoTranscode" required>
                    <el-radio @input="inputHandler(true, 'videoTranscode')" :value="liveChannel.videoTranscode"
                              :label="true">是
                    </el-radio>
                    <el-radio @input="inputHandler(false, 'videoTranscode')" :value="liveChannel.videoTranscode"
                              :label="false">
                        否
                    </el-radio>
                </el-form-item>
                <el-form-item v-if="withHls" label="音频转码" prop="audioTranscode" required>
                    <el-radio @input="inputHandler(true, 'audioTranscode')" :value="liveChannel.audioTranscode"
                              :label="true">是
                    </el-radio>
                    <el-radio @input="inputHandler(false, 'audioTranscode')" :value="liveChannel.audioTranscode"
                              :label="false">
                        否
                    </el-radio>
                </el-form-item>
                <!-- 音频转码在是的时候显示 -->
                <el-form-item v-if="liveChannel.audioTranscode" label="转码音量" prop="volume">
                    <el-input
                        placeholder="请输入转码音量"
                        :value="liveChannel.volume"
                        @input="inputHandler($event, 'volume')">
                    </el-input>
                </el-form-item>
                <el-form-item v-if="withHls" label="服务器转码" prop="transcode">
                    <el-radio @input="inputHandler(true, 'transcode')" :value="liveChannel.transcode" :label="true">是
                    </el-radio>
                    <el-radio @input="inputHandler(false, 'transcode')" :value="liveChannel.transcode" :label="false">
                        否
                    </el-radio>
                </el-form-item>
                <el-form-item label="频道类别" prop="typeList">
                    <div class="my-tags">
                        <draggable v-model="liveCategoryList">
                            <el-tag
                                :key="index"
                                v-for="(type, index) in liveCategoryList"
                                closable
                                :disable-transitions="false"
                                @close="deleteLiveCategoryHandler(type.id)">
                                {{type.name}}
                            </el-tag>
                        </draggable>
                    </div>
                    <channel-type-search
                        :handleSelect="selectLiveCategoryHandler"
                    ></channel-type-search>
                </el-form-item>
                <el-form-item label="回看" prop="record">
                    <el-radio @input="inputHandler(true, 'record')" :value="liveChannel.record" :label="true">是
                    </el-radio>
                    <el-radio @input="inputHandler(false, 'record')" :value="liveChannel.record" :label="false">否
                    </el-radio>
                </el-form-item>
                <!-- 回看选择是的时候，显示 使用直播配置 -->
                <el-form-item v-if="liveChannel.record" label="使用直播配置" prop="useLiveConfig"
                              required="liveChannel.record">
                    <el-radio @input="inputHandler(true, 'useLiveConfig')" :value="liveChannel.useLiveConfig"
                              :label="true">是
                    </el-radio>
                    <el-radio @input="inputHandler(false, 'useLiveConfig')" :value="liveChannel.useLiveConfig"
                              :label="false">
                        否
                    </el-radio>
                </el-form-item>
                <el-form-item v-if="liveChannel.record" label="录制IP" prop="recordIp">
                    <el-input
                        placeholder="请输入录制IP"
                        :value="liveChannel.recordIp"
                        @input="inputHandler($event, 'recordIp')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item v-else label="录制IP">
                    <el-input
                        placeholder="请输入录制IP"
                        :value="liveChannel.recordIp"
                        @input="inputHandler($event, 'recordIp')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item v-if="liveChannel.record" label="录制端口" prop="recordPort">
                    <el-input
                        type="number"
                        placeholder="请输入录制端口"
                        :value="liveChannel.recordPort"
                        @input="inputHandler($event, 'recordPort')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item v-else label="录制端口">
                    <el-input
                        type="number"
                        placeholder="请输入录制端口"
                        :value="liveChannel.recordPort"
                        @input="inputHandler($event, 'recordPort')"
                    >
                    </el-input>
                </el-form-item>
                <!-- 回看服务器组,2.8 改为下拉 -->
                <el-form-item label="回看服务器组" prop="recordServerGroup" required>
                    <el-select
                        clearable
                        filterable
                        :value="liveChannel.recordServerGroup"
                        placeholder="请选择所属服务器组"
                        @input="inputHandler($event, 'recordServerGroup')">
                        <el-option
                            v-for="(item, index) in serverGroupOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.name">
                            <span style="float: left">{{ item.name }}</span>
                            <span style="float: right">{{item.currentCount}}/{{item.totalCount}}</span>
                        </el-option>
                    </el-select>
                    <!--<el-input-->
                    <!--placeholder="请输入所属服务器组"-->
                    <!--:value="liveChannel.serverGroup"-->
                    <!--@input="inputHandler($event, 'serverGroup')">-->
                    <!--</el-input>-->
                </el-form-item>
                <el-form-item label="回看videoPid" prop="videoPid">
                    <el-input
                        placeholder="请输入回看videoPid"
                        :value="liveChannel.videoPid"
                        @input="inputHandler($event, 'videoPid')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="回看audioPid" prop="audioPid">
                    <el-input
                        placeholder="请输入回看audioPid"
                        :value="liveChannel.audioPid"
                        @input="inputHandler($event, 'audioPid')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="会员" prop="paymentType">
                    <el-radio @input="inputHandler('VIP', 'paymentType')" :value="liveChannel.paymentType"
                              :label="'VIP'">是
                    </el-radio>
                    <el-radio @input="inputHandler('FREE', 'paymentType')" :value="liveChannel.paymentType"
                              :label="'FREE'">否
                    </el-radio>
                </el-form-item>
                <el-form-item ref="applicableClientListFormItem" label="适用客户端" prop="applicableClientList">
                    <el-checkbox :value="clientChecked('TV')" @change="clientCheckedHandler($event, 'TV')">TV
                    </el-checkbox>
                    <el-checkbox :value="clientChecked('APP')" @change="clientCheckedHandler($event, 'APP')">APP
                    </el-checkbox>
                </el-form-item>
                <el-form-item label="频道图片" prop="logoUri">
                    <single-image-uploader
                        :uri="liveChannel.logoUri ? liveChannel.logoUri : ''"
                        :deleteImage="deleteLogoUri"
                        :uploadSuccessHandler="uploadSuccessHandler"
                        :allowResolutions="[{width: 260, height: 260}]"
                    ></single-image-uploader>
                </el-form-item>
                <!--
                <el-form-item label="公共频道">
                    <span>{{liveChannel.common ? '是' : '否'}}</span>
                </el-form-item>
                <el-form-item label="区域码" prop="companyList" style="min-width:1050px;">
                    <div class="my-tags">
                        <el-tag
                            :key="index"
                            v-for="(company, index) in liveChannel.companyList"
                            closable
                            @close="deleteCompanyHandler(company)"
                            :disable-transitions="false">
                            {{company.name}}
                        </el-tag>
                    </div>
                    <area-code-search
                        :showDeleteBtn="liveChannel.companyList.length > 0"
                        :handleSelect="selectAreaCodeHandler"
                        :clearHandler="clearCompanyListHandler"
                    ></area-code-search>
                </el-form-item>
                -->
            </el-form>
        </el-col>
    </div>
</template>
<script>
    import draggable from 'vuedraggable';
    import _ from 'lodash';
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import {checkIP, checkPort, checkChannelNo, checkIp} from '@/util/formValidate';
    import ChannelTypeSearch from './ChannelTypeSearch';
    import AreaCodeSearch from './AreaCodeSearch';
    import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';

    export default {
        name: 'LiveChannelForm',
        components: {
            draggable,
            ChannelTypeSearch,
            SingleImageUploader,
            AreaCodeSearch
        },
        data() {
            return {
                serverGroupOptions: [],
                inputRules: {
                    name: [
                        {required: true, message: '请输直播频道名称'}
                    ],
                    no: [
                        {required: true, message: '请输入直播频道展示编号'},
                        {validator: checkChannelNo}
                    ],
                    innerName: [
                        {required: true, message: '请输入直播频道展示名称'}
                    ],
                    multicastIp: [
                        {required: true, message: '请选择直播频道IP'},
                        {validator: checkIP}
                    ],
                    multicastPort: [
                        {required: true, message: '请输入直播频道端口'},
                        {validator: checkPort}
                    ],
                    recordIp: [
                        {required: true, message: '请输入录制IP'},
                        {validator: checkIP}
                    ],
                    recordPort: [
                        {required: true, message: '请输入录制端口'},
                        {validator: checkPort}
                    ],
                    pushServer: [
                        {required: true, message: '请输入所属服务器地址'},
                        {validator: checkIp}
                    ],
                    serverGroup: [
                        {required: true, message: '请输入所属直播服务器组'}
                    ],
                    recordServerGroup: [
                        {required: true, message: '请输入所属回看服务器组'}
                    ],
                    record: [
                        {required: true, message: '请选择是否录制直播回看'}
                    ],
                    paymentType: [
                        {required: true, message: '请选择是否为会员'}
                    ],
                    typeList: [
                        {required: true, message: '请选择直播频道类别'}
                    ],
                    companyList: [
                        {required: true, message: '请选择所属区域'}
                    ],
                    protocolList: [
                        {required: true, message: '请选择推流方式'}
                    ],
                    logoUri: [
                        {required: true, message: '请上传直播频道logo'}
                    ],
                    //  dev_v2.6 新增
                    applicableClientList: [
                        {required: true, message: '请选择适用客户端'}
                    ],
                    //  年后新增的字段
                    cdnPush: [
                        {required: true, message: '请选择是否为cdn推流'}
                    ],
                    //  2.8
                    audioTranscode: [
                        {required: true, message: '请选择是否音频转码'}
                    ],
                    videoTranscode: [
                        {required: true, message: '请选择是否视频转码'}
                    ],
                    useLiveConfig: [
                        {required: true, message: '请选择是否使用直播配置'}
                    ],
                    pullAddress: [
                        {required: true, message: '请输入cdn拉流地址'}
                    ],
                    //  红河新增
                    volume: [
                        {pattern: /^[dB0-9-]+$/, message: '请输入数字字符'}
                    ]
                }
            };
        },
        computed: {
            ...mapGetters({
                liveChannel: 'channel/liveChannel',
                typeIdList: 'channel/typeIdList',
                liveChannelTypeList: 'channel/liveChannelTypeList'
            }),
            liveCategoryList: {
                get() {
                    return this.liveChannel.typeList;
                },
                set(value) {
                    this.updateLiveChannel({key: 'typeList', value});
                }
            },
            methodsChecked() {
                return (key) => {
                    let index = this.liveChannel.protocolList.findIndex((item) => item === key);
                    return index > -1;
                };
            },
            //  dev_v2.6 适用客户端
            clientChecked() {
                return (key) => {
                    let index = this.liveChannel.applicableClientList.findIndex((item) => item === key);
                    return index > -1;
                };
            },
            appDisabled() {
                let hlsIndex = this.liveChannel.protocolList.findIndex((item) => item === 'HLS');
                return hlsIndex === -1;
            },
            withHls() {
                let hlsIndex = this.liveChannel.protocolList.findIndex((item) => item === 'HLS');
                return hlsIndex >= 0;
            }
        },
        created() {
            this.getFilialeList();
            this.$service.getChannelServerGroupList().then(res => {
                if (res && res.code === 0) {
                    this.serverGroupOptions = res.data;
                }
            });
        },
        methods: {
            ...mapMutations({
                updateLiveChannel: 'channel/updateLiveChannel',
                addLiveCategoryToList: 'channel/addLiveCategoryToList',
                deleteLiveCategoryById: 'channel/deleteLiveCategoryById',
                addCompanyToList: 'channel/addCompanyToList',
                deleteCompanyFromList: 'channel/deleteCompanyFromList'
            }),
            ...mapActions({
                getFilialeList: 'channel/getFilialeList'
            }),
            inputHandler(value, key) {
                this.updateLiveChannel({key, value});
                // 如果是useLiveConfig，
                // 展示直播配置选项时，必选，选择是，则
                //  回看录制IP 填充频道IP 中的数值。
                //  回看录制端口填充频道端口中的数值。
                //  回看 videoPid 填充直播 videoPid 中的数值。
                //  回看 audioPid 填充直播 audioPid 中的数值。
                //  如对应的直播字段数值为空，则不填充。
                // 展示直播配置选项时，选择否，则需手动输入；如已填充数值，则不清空。
                this.liveChannel.multicastIp = this.liveChannel.recordIp;
                this.liveChannel.multicastPort = this.liveChannel.recordPort;
                if (this.liveChannel.liveVideoPid) {
                    this.liveChannel.liveVideoPid = this.liveChannel.videoPid;
                }
                if (this.liveChannel.liveAudioPid) {
                    this.liveChannel.liveAudioPid = this.liveChannel.audioPid;
                }
            },
            methodsHandler(value, key) {
                let protocolList = _.cloneDeep(this.liveChannel.protocolList);
                if (value) {
                    protocolList.push(key);
                } else {
                    protocolList = protocolList.filter((item) => item !== key);
                }
                protocolList = _.uniq(protocolList);
                this.updateLiveChannel({key: 'protocolList', value: protocolList});
                if (this.liveChannel.protocolList.length > 0) {
                    this.$refs.protocolListFormItem.clearValidate();
                }

                if (this.appDisabled) {
                    let applicableClientList = this.liveChannel.applicableClientList.filter((item) => item !== 'APP');
                    this.updateLiveChannel({key: 'applicableClientList', value: applicableClientList});
                }
            },
            selectLiveCategoryHandler(liveCategory) {
                this.addLiveCategoryToList({liveCategory});
                this.clearvaidatorByProp('typeList');
            },
            deleteLiveCategoryHandler(id) {
                this.deleteLiveCategoryById({id});
            },
            selectAreaCodeHandler(company) {
                this.addCompanyToList({company});
                this.clearvaidatorByProp('companyList');
            },
            deleteCompanyHandler(company) {
                this.deleteCompanyFromList({company});
            },
            deleteLogoUri() {
                this.updateLiveChannel({key: 'logoUri', value: ''});
            },
            uploadSuccessHandler(image) {
                this.updateLiveChannel({key: 'logoUri', value: image.uri});
            },
            clearvaidatorByProp(prop) {
                let _prop = _.get(this.liveChannel, prop);
                if (_prop.length > 0) {
                    this.$refs.liveChannelForm.clearValidate(prop);
                }
            },
            clearCompanyListHandler() {
                this.updateLiveChannel({key: 'companyList', value: []});
            },
            //  dev_v2.6 适用客户端处理方法
            clientCheckedHandler(value, key) {
                let applicableClientList = _.cloneDeep(this.liveChannel.applicableClientList);
                if (value) {
                    applicableClientList.push(key);
                } else {
                    applicableClientList = applicableClientList.filter((item) => item !== key);
                }
                applicableClientList = _.uniq(applicableClientList);
                this.updateLiveChannel({key: 'applicableClientList', value: applicableClientList});
                if (this.liveChannel.applicableClientList.length > 0) {
                    this.$refs.applicableClientListFormItem.clearValidate();
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    .off-the-shelf,
    .on-the-shelf {
        display: inline-block;
    }

    .el-checkbox {
        padding: 0;
    }
</style>
