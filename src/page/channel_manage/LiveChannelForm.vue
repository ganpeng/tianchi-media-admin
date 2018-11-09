<!-- 直播频道表单 -->
<template>
    <div class="live-channel-form-container form-container">
        <el-col :span="8">
            <el-form :model="liveChannel" :rules="inputRules" ref="liveChannelForm" @submit.native.prevent class="form-block" label-width="120px">
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
                <el-form-item label="频道端口" prop="multicastPort">
                    <el-input
                        type="number"
                        placeholder="请输入频道端口"
                        :value="liveChannel.multicastPort"
                        @input="inputHandler($event, 'multicastPort')"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="所属服务器" prop="pushServer">
                    <el-input
                        placeholder="请输入所属服务器地址"
                        :value="liveChannel.pushServer"
                        @input="inputHandler($event, 'pushServer')"
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
                    <el-radio  @input="inputHandler(true, 'record')" :value="liveChannel.record" :label="true">是</el-radio>
                    <el-radio  @input="inputHandler(false, 'record')" :value="liveChannel.record" :label="false">否</el-radio>
                </el-form-item>
            </el-form>
        </el-col>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import {mapGetters, mapMutations} from 'vuex';
import {checkIP, checkPort, checkChannelNo, checkIp} from '@/util/formValidate';
import ChannelTypeSearch from './ChannelTypeSearch';
export default {
    name: 'LiveChannelForm',
    components: {
        draggable,
        ChannelTypeSearch
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
                pushServer: [
                    { required: true, message: '请输入所属服务器地址' },
                    { validator: checkIp }
                ],
                record: [
                    { required: true, message: '请选择是否录制直播回看' }
                ],
                typeList: [
                    { required: true, message: '请选择直播频道类别' }
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
        }
    },
    methods: {
        ...mapMutations({
            updateLiveChannel: 'channel/updateLiveChannel',
            addLiveCategoryToList: 'channel/addLiveCategoryToList',
            deleteLiveCategoryById: 'channel/deleteLiveCategoryById'
        }),
        inputHandler(value, key) {
            this.updateLiveChannel({key, value});
        },
        toggleDeviceStatus() {
        },
        selectLiveCategoryHandler(liveCategory) {
            this.addLiveCategoryToList({liveCategory});
        },
        deleteLiveCategoryHandler(id) {
            this.deleteLiveCategoryById({id});
        }
    }
};
</script>
<style lang="scss" scoped>
.off-the-shelf,
.on-the-shelf {
    display: inline-block;
}
</style>
