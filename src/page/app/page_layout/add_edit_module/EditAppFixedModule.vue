<template>
    <div class="edit-app-fixed-module">
        <div class="content-title">编辑首页推荐固定模块</div>
        <div class="seperator-line"></div>
        <div class="content">
            <ul v-if="isRecommend === 'yes'" class="block-cell-list">
                <li class="channel block-cell-item">
                    <el-button @click="selectLiveChannel" class="set-channel-btn btn-style-two">
                        设置直播频道
                    </el-button>
                    <span class="name">{{channel.no}}: {{channel.name}}</span>
                    <img :src="channel.logoUri" alt="">
                </li>
                <li class="block-cell-item hide"></li>
                <li class="block-cell-item hide"></li>
                <li class="block-cell-item hide"></li>
            </ul>
            <draggable filter=".ignore-element" element="ul" class="block-cell-list" v-model="layoutItemMultiList">
                <li v-for="(layoutItem, index) in layoutItemMultiList" :style="styleBgImageStr(index)" :key="index" class="block-cell-item">
                    <div class="mask"></div>
                    <corner-mark :squareIndex="index" :layoutItem="getLayoutItemDetail(navbarId, 0, index)" :cornerMark="getLayoutItemCornerMark(navbarId, 0, index)"></corner-mark>
                    <add-btn :addLayoutItem="addLayoutItem(index)"></add-btn>
                    <span v-if="layoutItemMultiList && layoutItemMultiList.length > 3" @click="deleteLayoutItemHandler(index)" class="delete-btn">
                        <svg-icon icon-class="remove_image_default"></svg-icon>
                    </span>
                </li>
                <li v-if="layoutItemMultiList && layoutItemMultiList.length < 5" class="upload-box ignore-element block-cell-item" @click="createLayoutItem">
                    <i class="el-icon-plus plus-icon"></i>
                </li>
            </draggable>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <add-programme :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeDialog"></add-programme>
        <edit-app-channel ref="changeLiveChannelDialog" :selectChannelSuccessHandler="selectChannelSuccessHandler"></edit-app-channel>
    </div>
</template>
<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';
import draggable from 'vuedraggable';
import _ from 'lodash';
import AddProgramme from './AddProgramme';
import AddBtn from '../AddBtn';
import CornerMark from '@/page/app/page_layout/CornerMark';
import EditAppChannel from './EditAppChannel';
export default {
    name: 'EditAppFixedModule',
    components: {draggable, AddProgramme, AddBtn, CornerMark, EditAppChannel},
    data() {
        return {
            squareIndex: 0,
            navbarId: '',
            layoutItemType: '',
            allowResolutions: [],
            // 直播频道相关
            reqBody: [],
            channel: {},
            isRecommend: false
        };
    },
    async created() {
        try {
            let {navbarId} = this.$route.params;
            this.navbarId = navbarId;
            let {isRecommend} = this.$route.query;
            this.isRecommend = isRecommend;

            await this.getAppNavbarList();
            await this.getAppLayoutByNavbarId(navbarId);

            if (this.isRecommend === 'yes') {
                let res = await this.$service.getAppChannelLayout({navBarId: navbarId});
                if (res && res.code === 0) {
                    let obj = res.data.list[0];
                    let reqBody = [{
                        navBarId: obj.navBarId,
                        navBarName: obj.navBarName,
                        channel: obj.channel,
                        channelCategory: obj.channelCategory
                    }];
                    this.channel = obj && obj.channel ? obj.channel : {};
                    this.reqBody = reqBody;
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            selectAll: 'appPageLayout/selectAll',
            getLayoutItemCornerMark: 'appPageLayout/getLayoutItemCornerMark',
            getLayoutItemDetail: 'appPageLayout/getLayoutItemDetail',
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
        layoutItemMultiList: {
            get() {
                return _.get(this.activeLayout, `0.layoutItemMultiList`);
            },
            set(value) {
                this.updateLayoutBlockDataByIndex({ key: 'layoutItemMultiList', index: 0, value });
            }
        }
    },
    methods: {
        ...mapMutations({
            addDetaultLayoutBlockByIndex: 'appPageLayout/addDetaultLayoutBlockByIndex',
            updateLayoutBlockDataByIndex: 'appPageLayout/updateLayoutBlockDataByIndex'
        }),
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
                case 4:
                    this.allowResolutions = [{width: 1122, height: 636}];
                    break;
                default:
                    throw new Error('未知的索引');
            }
        },
        async saveHandler() {
            try {
                if (!this.selectAll(this.navbarId, 0)) {
                    let {id} = this.$route.query;
                    if (id) {
                        let layoutBlock = this.activeLayout.find((item) => item.id === id);
                        if (layoutBlock) {
                            let res = await this.$service.putAppLayoutBlock(id, layoutBlock);
                            if (res && res.code === 0) {
                                if (this.isRecommend === 'yes') {
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
        },
        createLayoutItem() {
            if (this.layoutItemMultiList.length < 5) {
                this.addDetaultLayoutBlockByIndex();
            }
        },
        async deleteLayoutItemHandler(squareIndex) {
            try {
                let confirm = await this.$confirm(`您确定要删除该模块吗, 是否继续?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                });
                if (confirm) {
                    let layoutItemMultiList = this.layoutItemMultiList.filter((item, index) => index !== squareIndex);
                    this.updateLayoutBlockDataByIndex({ key: 'layoutItemMultiList', index: 0, value: layoutItemMultiList });
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
            flex-wrap: wrap;
            margin-bottom: 1.77%;
            .block-cell-item {
                // flex: 1;
                width: 23%;
                margin-bottom: 75px;
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
                .delete-btn {
                    display: none;
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    cursor: pointer;
                    .svg-icon {
                        width: 23px;
                        height: 23px;
                    }
                }
            }
            .block-cell-item {
                margin-left: 1.77%;
                &.ignore-element {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 110px;
                    height: 110px;
                    min-width: 110px;
                    border: 1px solid #3E495E;
                    border-radius: 4px;
                    background: transparent;
                    margin: 0 0 10px 0;
                    cursor: pointer;
                    padding-bottom: 0;
                    margin-left: 1.77%;
                    .svg-icon {
                        fill: #3E495E;
                        width: 20px;
                        height: 20px;
                    }
                    .plus-icon {
                        font-size: 20px;
                        color: #3E495E;
                    }
                    &:hover {
                        border-color: $mainColor;
                        .plus-icon {
                            color: $mainColor;
                        }
                    }
                }
            }
            .block-cell-item:nth-of-type(4n + 1) {
                margin-left: 0;
            }
            .block-cell-item:hover {
                .mask {
                    display: block!important;
                }
                .delete-btn {
                    display: block;
                }
            }
            .channel {
                position: relative;
                .set-channel-btn {
                    display: none;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 110px;
                    height: 30px;
                    line-height: 30px;
                }
                .name {
                    position: absolute;
                    left: 10px;
                    bottom: 18px;
                    font-size: 16px;
                    font-weight: 400;
                    color: rgba(255,255,255,1);
                    line-height: 22px;
                }
                img {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    width: 80px;
                    height: 80px;
                }
                &:hover {
                    .set-channel-btn {
                        display: block;
                    }
                }
            }
        }
        .block-cell-list + .block-cell-list {
            margin-bottom: 75px;
        }
    }
}
</style>
