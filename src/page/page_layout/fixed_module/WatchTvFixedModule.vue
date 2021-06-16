<template>
    <div class="recommend-fixed-module-container">
        <div class="module-row-one">
            <div v-if="!isEdit" class="btn-field text-right">
                <el-button @click="editFixedModuleHandler" class="btn-style-five">
                    <svg-icon icon-class="edit"></svg-icon>
                </el-button>
            </div>
            <div class="content-field">
                <div class="left-field">
                    <div v-if="channel.id" class="channel">
                        <img :src="channel.logoUri" alt="">
                        <div class="text-info">
                            <p class="title">当前直播频道</p>
                            <p class="name">{{channel.no}}&nbsp;&nbsp;{{channel.name}}</p>
                        </div>
                    </div>
                    <div class="center-block">
                        <div v-if="!channel.id" class="no-channel">
                            <div class="icon-warning">
                                <svg-icon icon-class="icon_warning"></svg-icon>
                            </div>
                            <p class="text">暂未设置频道</p>
                        </div>
                        <el-button v-if="isEdit" @click="selectLiveChannel" class="btn-style-two">
                            设置频道
                        </el-button>
                    </div>
                    <div class="live">
                        <svg-icon icon-class="live"></svg-icon>
                    </div>
                </div>
                <div class="right-field">
                    <div class="right-field-item one"></div>
                    <div :style="styleBgImageStr(0)" class="right-field-item two">'
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="setChannelHandler(0)" class="btn-style-two">设置频道</el-button>
                        </div>
                        <div v-if="isEdit" class="mask"></div>
                    </div>
                    <div :style="styleBgImageStr(1)" class="right-field-item two">'
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="setChannelHandler(1)" class="btn-style-two">设置频道</el-button>
                        </div>
                        <div v-if="isEdit" class="mask"></div>
                    </div>
                    <div :style="styleBgImageStr(2)" class="right-field-item two">'
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="setChannelHandler(2)" class="btn-style-two">设置频道</el-button>
                        </div>
                        <div v-if="isEdit" class="mask"></div>
                    </div>
                    <div :style="styleBgImageStr(3)" class="right-field-item two">'
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="setChannelHandler(3)" class="btn-style-two">设置频道</el-button>
                        </div>
                        <div v-if="isEdit" class="mask"></div>
                    </div>
                    <div :style="styleBgImageStr(4)" class="right-field-item two">'
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="setChannelHandler(4)" class="btn-style-two">设置频道</el-button>
                        </div>
                        <div v-if="isEdit" class="mask"></div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <edit-channel :selectChannelSuccessHandler="selectChannelSuccessHandler"
                      ref="changeLiveChannelDialog"></edit-channel>
        <channel-dialog
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectChannelDialog">
            >
        </channel-dialog>
    </div>
</template>
<script>
    import _ from 'lodash';
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import EditChannel from '../add_edit_module/EditChannel';
    //  2.2.0新增的逻辑
    import ChannelDialog from '../add_edit_module/ChannelDialog';

    export default {
        name: 'WatchTvFixedModule',
        components: {
            EditChannel,
            ChannelDialog
        },
        props: {
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                navbarId: '',
                squareIndex: 0,
                allowResolutions: [{width: 320, height: 142}],
                channel: {},
                reqBody: []
            };
        },
        computed: {
            ...mapGetters({
                selectAll: 'pageLayout/selectAll',
                //  2.3.0新增
                activeLayout: 'pageLayout/getActiveLayout'
            }),
            styleBgImageStr() {
                return (squareIndex) => {
                    let url = _.get(this.activeLayout, `0.layoutItemMultiList.${squareIndex}.coverImage.uri`);
                    let bgStr = `background-image: url(${url})`;
                    return bgStr;
                };
            }
        },
        async created() {
            try {
                let {navbarId} = this.$route.params;
                this.navbarId = navbarId;
                let res = await this.$service.getChannelLayout({navBarId: navbarId});
                if (res && res.code === 0) {
                    let obj = res.data.list[0];
                    this.channel = obj && obj.channel ? obj.channel : {};
                }
            } catch (err) {
                console.log(err);
            }
        },
        methods: {
            ...mapMutations({}),
            ...mapActions({
                //  2.3.0 新增的部分
                getLayoutByNavbarId: 'pageLayout/getLayoutByNavbarId'
            }),
            editFixedModuleHandler() {
                if (!this.$authority.isHasAuthority('content:layoutBlock:put')) {
                    return;
                }
                let {navbarId} = this.$route.params;
                let id = _.get(this.activeLayout, '0.id');
                this.$router.push({name: 'EditFixedModule', params: {navbarId, index: 0}, query: {id}});
            },
            selectLiveChannel() {
                this.$refs.changeLiveChannelDialog.showDialog('CHANNEL');
            },
            setChannelHandler(squareIndex) {
                if (!this.$authority.isHasAuthority('content:layoutBlock:add')) {
                    return;
                }
                this.squareIndex = squareIndex;
                this.$refs.selectChannelDialog.showDialog('CHANNEL');
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
                                let putLayoutBlockRes = await this.$service.putLayoutBlock(id, layoutBlock);
                                if (putLayoutBlockRes && putLayoutBlockRes.code === 0) {
                                    console.log('success');
                                }
                            }
                        }

                        let res = await this.$service.postChannelLayout(this.reqBody);
                        if (res && res.code === 0) {
                            console.log('直播频道保存成功');
                        } else {
                            this.$message.error('直播频道保存失败');
                        }

                        this.$message.success('保存成功');
                        this.$router.push({name: 'PageLayout', params: {navbarId: this.navbarId}});
                    } else {
                        this.$message.error('色块必须全部选择');
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            selectChannelSuccessHandler(reqBody) {
                let channel = _.get(reqBody, '0.channel');
                this.reqBody = _.cloneDeep(reqBody);
                this.channel = _.cloneDeep(channel);
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
    }

    @mixin btnWrapper() {
        .btn-wrapper {
            display: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 20;
            width: 130px;
            .el-button {
                font-size: 12px;
                margin-top: 5px;
                margin-left: 0;
                width: 94px;
                height: 34px;
                line-height: 34px;
            }
        }
        &:hover {
            .btn-wrapper {
                display: block;
            }
        }
    }

    .recommend-fixed-module-container {
        .btn-field {
            display: flex;
            justify-content: flex-end;
            margin: 40px 0 10px 0;
        }
        .module-row-one {
            margin-bottom: 2%;
            .content-field {
                display: flex;
                .left-field {
                    width: 80.6722%;
                    margin-right: 2.1848%;
                    @include paddingBg(45.21%);
                    @include btnWrapper();
                    background-image: url("../../../assets/img/page_layout_watch_tv_icon2.png");
                    border-radius: 0;
                    background-color: transparent;
                    .live {
                        position: absolute;
                        bottom: 30px;
                        right: 30px;
                        .svg-icon {
                            width: 120px;
                            height: 66px;
                        }
                    }
                    .text {
                        font-size: 24px;
                        color: #6F7480;
                    }
                    //  频道样式
                    .channel {
                        position: absolute;
                        display: flex;
                        top: 20px;
                        left: 20px;
                        img {
                            display: block;
                            width: 200px;
                            height: 200px;
                            margin-right: 30px;
                            border-radius: 8px;
                        }
                        .text-info {
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: flex-start;
                            .title {
                                font-size: 16px;
                                line-height: 22px;
                                color: #9AC4EF;
                                border-bottom: 1px solid #9AC4EF;
                            }
                            .name {
                                border: 1px solid #1989FA;
                                border-radius: 8px;
                                font-size: 22px;
                                color: #1989FA;
                                padding: 6px 10px;
                                margin-top: 20px;
                            }
                        }
                    }
                    .center-block {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        .svg-icon {
                            width: 32px;
                            height: 32px;
                        }
                        .text {
                            color: rgba(255, 255, 255, 0.5);
                            margin-top: 10px;
                            margin-bottom: 24px;
                        }
                    }
                }
                .right-field {
                    width: 17.9831%;
                    @include paddingBg(45.21%);
                    background-color: transparent;
                    .right-field-item {
                        &.one {
                            width: 100%;
                            @include paddingBg(22.4299%);
                            background-image: url('../../../assets/img/page_layout_watch_tv_icon1.png');
                            border-radius: 0;
                            border-top-left-radius: 8px;
                            border-top-right-radius: 8px;
                        }
                        &.two {
                            position: relative;
                            width: 100%;
                            @include paddingBg(43.9252%);
                            @include btnWrapper();
                            background-color: rgba(255, 255, 255, 0.1);
                            border-radius: 0;
                            .mask {
                                display: none;
                                position: absolute;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background-color: rgba(0, 0, 0, 0.8);
                            }
                            &:hover {
                                .mask {
                                    display: block;
                                }
                            }
                        }
                    }
                    .right-field-item + .right-field-item {
                        margin-top: 1.8691%;
                    }
                    .right-field-item:last-child {
                        border-bottom-left-radius: 8px;
                        border-bottom-right-radius: 8px;
                    }
                }
                .right-field-wrapper {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    justify-content: space-between;
                    .right-top-field {
                        @include paddingBg(69.5538%);
                        background-image: url('../../../assets/img/watch_history.png');
                    }
                    .right-bottom-field {
                        @include paddingBg(39.7368%);
                        @include btnWrapper();
                    }
                    .prompt-text {
                        position: absolute;
                        bottom: 10px;
                        left: 10px;
                        font-size: 12px;
                        height: 30px;
                        line-height: 30px;
                        color: #6F7480;
                        background: rgba(46, 56, 77, 0.60);
                        border-radius: 8px;
                        padding: 0 10px;
                    }
                }
            }
        }
    }
</style>
