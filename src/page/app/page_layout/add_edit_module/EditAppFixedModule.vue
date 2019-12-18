<template>
    <div class="edit-app-fixed-module">
        <div class="content-title">编辑首页推荐固定模块</div>
        <div class="seperator-line"></div>
        <div class="content">
            <ul v-if="isRecommend" class="block-cell-list">
                <li class="block-cell-item">
                    <el-button @click="selectLiveChannel" class="btn-style-two">
                        设置直播频道
                    </el-button>
                    {{this.channel.name}}
                </li>
                <li class="block-cell-item hide"></li>
                <li class="block-cell-item hide"></li>
                <li class="block-cell-item hide"></li>
            </ul>
            <ul class="block-cell-list">
                <li :style="styleBgImageStr(0)" class="block-cell-item">
                    <div class="mask"></div>
                    <corner-mark :squareIndex="0" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 0)"></corner-mark>
                    <add-btn
                        :addLayoutItem="addLayoutItem(0)"
                    ></add-btn>
                </li>
                <li :style="styleBgImageStr(1)"  class="block-cell-item">
                    <div class="mask"></div>
                    <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 1)"></corner-mark>
                    <add-btn
                        :addLayoutItem="addLayoutItem(1)"
                    ></add-btn>
                </li>
                <li :style="styleBgImageStr(2)" class="block-cell-item">
                    <div class="mask"></div>
                    <corner-mark :squareIndex="2" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 2)"></corner-mark>
                    <add-btn
                        :addLayoutItem="addLayoutItem(2)"
                    ></add-btn>
                </li>
                <li :style="styleBgImageStr(3)" class="block-cell-item">
                    <div class="mask"></div>
                    <corner-mark :squareIndex="3" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 3)"></corner-mark>
                    <add-btn
                        :addLayoutItem="addLayoutItem(3)"
                    ></add-btn>
                </li>
            </ul>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <add-programme :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeDialog"></add-programme>
        <edit-app-channel ref="changeLiveChannelDialog" :selectChannelSuccessHandler="selectChannelSuccessHandler"></edit-app-channel>
    </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import _ from 'lodash';
import AddProgramme from './AddProgramme';
import AddBtn from '../AddBtn';
import CornerMark from '@/page/app/page_layout/CornerMark';
import EditAppChannel from './EditAppChannel';
export default {
    name: 'EditAppFixedModule',
    components: {AddProgramme, AddBtn, CornerMark, EditAppChannel},
    data() {
        return {
            squareIndex: 0,
            navbarId: '',
            layoutItemType: '',
            allowResolutions: [],
            // 直播频道相关
            reqBody: [],
            channel: {}
        };
    },
    async created() {
        try {
            let {navbarId} = this.$route.params;
            this.navbarId = navbarId;
            await this.getAppNavbarList();
            await this.getAppLayoutByNavbarId(navbarId);
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            selectAll: 'appPageLayout/selectAll',
            getLayoutItemCornerMark: 'appPageLayout/getLayoutItemCornerMark',
            //  2.3.0新增
            activeLayout: 'appPageLayout/activeLayout'
        }),
        styleBgImageStr() {
            return (squareIndex) => {
                let url = _.get(this.activeLayout, `0.layoutItemMultiList.${squareIndex}.coverImage.uri`);
                let bgStr = `background-image: url(${url})`;
                return bgStr;
            };
        },
        isRecommend() {
            let {isRecommend} = this.$route.query;
            return isRecommend;
        }
    },
    methods: {
        ...mapActions({
            getAppNavbarList: 'appPageLayout/getAppNavbarList',
            getAppLayoutByNavbarId: 'appPageLayout/getAppLayoutByNavbarId'
        }),
        //  直播频道相关
        selectLiveChannel() {
            this.$refs.changeLiveChannelDialog.showDialog();
        },
        selectChannelSuccessHandler(reqBody) {
            let channel = _.get(reqBody, '0.channel');
            this.reqBody = _.cloneDeep(reqBody);
            this.channel = _.cloneDeep(channel);
        },
        addLayoutItem(squareIndex) {
            return (layoutItemType) => {
                if (!this.$authority.isHasAuthority('content:layoutBlock:add')) {
                    return;
                }
                this.squareIndex = squareIndex;
                this.layoutItemType = layoutItemType;
                this.setAllowResolutions(this.squareIndex);
                switch (layoutItemType) {
                    case 'PROGRAMME':
                        this.$refs.selectProgrammeDialog.showDialog('PROGRAMME');
                        break;
                    default:
                        throw new Error('layoutItemType类型错误');
                }
            };
        },
        setAllowResolutions(squareIndex) {
            switch (squareIndex) {
                case 0:
                case 1:
                case 2:
                case 3:
                    this.allowResolutions = [{width: 860, height: 472}];
                    break;
                default:
                    throw new Error('未知的索引');
            }
        },
        async saveHandler() {
            try {
                if (!this.$authority.isHasAuthority('content:layoutBlock:add')) {
                    return;
                }
                if (!this.selectAll(this.navbarId, 0)) {
                    let {id} = this.$route.query;
                    if (id) {
                        let layoutBlock = this.activeLayout.find((item) => item.id === id);
                        if (layoutBlock) {
                            let res = await this.$service.putAppLayoutBlock(id, layoutBlock);
                            if (res && res.code === 0) {
                                if (this.isRecommend) {
                                    let channelRes = await this.$service.postAppChannelLayout(this.reqBody);
                                    if (channelRes && channelRes.code === 0) {
                                        this.$message.success('保存成功');
                                        this.$router.push({ name: 'AppPageLayout', params: {navbarId: this.navbarId} });
                                    } else {
                                        this.$message.error('直播频道保存失败');
                                    }
                                } else {
                                    this.$router.push({ name: 'AppPageLayout', params: {navbarId: this.navbarId} });
                                }
                            }
                        }
                    }
                } else {
                    this.$message.error('色块必须全部选择');
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    position: relative;
    height: 0;
    padding-bottom: $paddingNum;
    background-color: #2A3040;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-position: center center;
    border-radius: 8px;
    border: 1px solid #2A3040;
}

.edit-app-fixed-module {
    .content {
        margin-top: 20px;
        .block-cell-list {
            display: flex;
            .block-cell-item {
                flex: 1;
                @include paddingBg(13.34%);
                .mask {
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    border-radius: 8px;
                    border: 1px solid #1989FA;
                }
                &.hide {
                    visibility: hidden;
                }
            }
            .block-cell-item + .block-cell-item {
                margin-left: 1.77%;
                margin-bottom: 1.77%;
            }
            .block-cell-item:hover {
                .mask {
                    display: block!important;
                }
            }
        }
    }
}
</style>
