<!-- 直播频道表单 -->
<template>
    <div class="live-channel-form-container form-container">
        <el-col :span="8">
            <el-form :model="liveChannel" :rules="inputRules" ref="liveChannelForm" @submit.native.prevent class="form-block my-form" label-width="120px">
                <el-form-item label="频道名称" prop="innerName">
                    <el-input
                        :value="liveChannel.innerName"
                        :maxlength="20"
                        placeholder="请输入直播频道名称"
                        @input="inputHandler($event, 'innerName')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="展示名" prop="name">
                    <el-input
                        :value="liveChannel.name"
                        :maxlength="20"
                        placeholder="请输入直播频道展示名"
                        @input="inputHandler($event, 'name')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="展示编号" prop="no">
                    <el-input
                        type="number"
                        :value="liveChannel.no"
                        placeholder="请输入直播频道展示编号"
                        @input="inputHandler($event, 'no')"
                    ></el-input>
                </el-form-item>
                <el-form-item label="频道IP" prop="multicastIp">
                    <el-input
                        placeholder="请输入频道IP"
                        :value="liveChannel.multicastIp"
                        @input="inputHandler($event, 'multicastIp')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="服务器组" prop="serverGroup">
                    <el-input
                        placeholder="请输入所属服务器组"
                        :value="liveChannel.serverGroup"
                        @input="inputHandler($event, 'serverGroup')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="频道端口" prop="multicastPort">
                    <el-input
                        type="number"
                        placeholder="请输入频道端口"
                        :value="liveChannel.multicastPort"
                        @input="inputHandler($event, 'multicastPort')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="推流方式" prop="protocolList">
                    <el-checkbox :value="methodsChecked('HLS')" @change="methodsHandler($event, 'HLS')">HLS</el-checkbox>
                    <el-checkbox :value="methodsChecked('UDP')" @change="methodsHandler($event, 'UDP')">UDP</el-checkbox>
                </el-form-item>
                <el-form-item label="服务器转码" prop="transcode">
                    <el-radio @input="inputHandler(true, 'transcode')" :value="liveChannel.transcode" :label="true">是</el-radio>
                    <el-radio @input="inputHandler(false, 'transcode')" :value="liveChannel.transcode" :label="false">否</el-radio>
                </el-form-item>
                <el-form-item v-if="showVolume" label="转码音量" prop="volume">
                    <el-input
                        placeholder="请输入转码音量"
                        :value="liveChannel.volume"
                        @input="inputHandler($event, 'volume')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="录制IP" prop="recordIp">
                    <el-input
                        placeholder="请输入录制IP"
                        :value="liveChannel.recordIp"
                        @input="inputHandler($event, 'recordIp')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="录制端口" prop="recordPort">
                    <el-input
                        type="number"
                        placeholder="请输入录制端口"
                        :value="liveChannel.recordPort"
                        @input="inputHandler($event, 'recordPort')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="videoPid" prop="videoPid">
                    <el-input
                        placeholder="请输入videoPid"
                        :value="liveChannel.videoPid"
                        @input="inputHandler($event, 'videoPid')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="audioPid" prop="audioPid">
                    <el-input
                        placeholder="请输入audioPid"
                        :value="liveChannel.audioPid"
                        @input="inputHandler($event, 'audioPid')"
                    >
                    </el-input>
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
                    <el-radio @input="inputHandler(true, 'record')" :value="liveChannel.record" :label="true">是</el-radio>
                    <el-radio @input="inputHandler(false, 'record')" :value="liveChannel.record" :label="false">否</el-radio>
                </el-form-item>
                <el-form-item label="频道图片" prop="logoUri">
                    <single-image-uploader
                        :uri="liveChannel.logoUri ? liveChannel.logoUri : ''"
                        :deleteImage="deleteLogoUri"
                        :uploadSuccessHandler="uploadSuccessHandler"
                        :allowResolutions="[{width: 260, height: 260}]"
                    ></single-image-uploader>
                </el-form-item>
                <el-form-item label="会员" prop="paymentType">
                    <el-radio @input="inputHandler('VIP', 'paymentType')" :value="liveChannel.paymentType" :label="'VIP'">是</el-radio>
                    <el-radio @input="inputHandler('FREE', 'paymentType')" :value="liveChannel.paymentType" :label="'FREE'">否</el-radio>
                </el-form-item>
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
            inputRules: {
                name: [
                    { required: true, message: '请输直播频道名称' }
                ],
                no: [
                    { required: true, message: '请输入直播频道展示编号' },
                    { validator: checkChannelNo }
                ],
                innerName: [
                    { required: true, message: '请输入直播频道展示名称' }
                ],
                multicastIp: [
                    { required: true, message: '请选择直播频道IP' },
                    { validator: checkIP }
                ],
                multicastPort: [
                    { required: true, message: '请输入直播频道端口' },
                    { validator: checkPort }
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
                    { required: true, message: '请输入所属服务器地址' },
                    { validator: checkIp }
                ],
                serverGroup: [
                    { required: true, message: '请输入所属服务器组' }
                ],
                record: [
                    { required: true, message: '请选择是否录制直播回看' }
                ],
                paymentType: [
                    { required: true, message: '请选择是否为会员' }
                ],
                typeList: [
                    { required: true, message: '请选择直播频道类别' }
                ],
                companyList: [
                    { required: true, message: '请选择所属区域' }
                ],
                protocolList: [
                    { required: true, message: '请选择推流方式' }
                ],
                logoUri: [
                    { required: true, message: '请上传直播频道logo' }
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
        }
    },
    created() {
        this.getFilialeList();
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
