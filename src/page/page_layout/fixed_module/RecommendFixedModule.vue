<template>
    <div class="recommend-fixed-module-container">
        <div class="module-row-one">
            <div v-if="!isEdit" class="btn-field text-right">
                <el-button @click="editFixedModuleHandler" class="btn-style-five">
                    <svg-icon icon-class="edit"></svg-icon>
                </el-button>
            </div>
            <div class="content-field">
                <div class="left-field-wrapper">
                    <div class="left-field">
                        <div v-if="isEdit" style="width: 150px" class="btn-wrapper">
                            <p class="text">设置直播频道</p>
                            <el-button @click="selectChannel" class="btn-style-two">
                                选择
                            </el-button>
                        </div>
                        <div class="channel">
                            <img :src="channel.logoUri" alt="">
                            <div class="text-info">
                                <p class="title">当前直播频道</p>
                                <p class="name">{{channel.no}}&nbsp;&nbsp;{{channel.name}}</p>
                            </div>
                        </div>
                        <div class="live">
                            <svg-icon icon-class="live"></svg-icon>
                        </div>
                    </div>
                </div>
                <div class="right-field-wrapper">
                    <div class="right-top-field">
                        <span class="prompt-text">此区域不可编辑</span>
                    </div>
                    <div class="wrapper">
                        <div :style="styleBgImageStr(0)" class="right-bottom-field">
                            <corner-mark :squareIndex="0" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 0)"></corner-mark>
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click="selectProgramme(0)" class="btn-style-two btn130">
                                    选择新闻节目
                                </el-button>
                                <el-button @click="selectProgrammeSubject(0)" class="btn-style-two btn130">
                                    选择节目专题
                                </el-button>
                                <el-button @click="selectProgrammeVideo(0)" class="btn-style-two btn130">
                                    选择视频
                                </el-button>
                                <!-- <el-button @click="selectLink(0)" class="btn-style-two btn130">
                                    选择网页
                                </el-button> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="module-row-two">
            <div class="content-field">
                <div class="top-field">
                    <div class="wrapper">
                        <div :style="styleBgImageStr(1)" class="top-left-field">
                            <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 1)"></corner-mark>
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click="selectProgramme(1)" class="btn-style-two btn130">
                                    选择节目
                                </el-button>
                                <br />
                                <el-button @click="selectProgrammeSubject(1)" class="btn-style-two btn130">
                                    选择节目专题
                                </el-button>
                                <el-button @click="selectProgrammeVideo(1)" class="btn-style-two btn130">
                                    选择视频
                                </el-button>
                                <!-- <el-button @click="selectLink(1)" class="btn-style-two btn130">
                                    选择网页
                                </el-button> -->
                            </div>
                        </div>
                    </div>
                    <div class="wrapper">
                        <div :style="styleBgImageStr(2)" class="top-right-field">
                            <corner-mark :squareIndex="2" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 2)"></corner-mark>
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click="selectProgramme(2)" class="btn-style-two btn130">
                                    选择节目
                                </el-button>
                                <br />
                                <el-button @click="selectProgrammeSubject(2)" class="btn-style-two btn130">
                                    选择节目专题
                                </el-button>
                                <el-button @click="selectProgrammeVideo(2)" class="btn-style-two btn130">
                                    选择视频
                                </el-button>
                                <!-- <el-button @click="selectLink(2)" class="btn-style-two btn130">
                                    选择网页
                                </el-button> -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bottom-field">
                    <div class="wrapper">
                        <div :style="styleBgImageStr(3)" class="bottom-left-field">
                            <corner-mark :squareIndex="3" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 3)"></corner-mark>
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click="selectProgramme(3)" class="btn-style-two btn130">
                                    选择节目
                                </el-button>
                                <br />
                                <el-button @click="selectProgrammeSubject(3)" class="btn-style-two btn130">
                                    选择节目专题
                                </el-button>
                                <el-button @click="selectProgrammeVideo(3)" class="btn-style-two btn130">
                                    选择视频
                                </el-button>
                                <!-- <el-button @click="selectLink(3)" class="btn-style-two btn130">
                                    选择网页
                                </el-button> -->
                            </div>
                        </div>
                    </div>
                    <div class="wrapper">
                        <div :style="styleBgImageStr(4)" class="bottom-middle-field">
                            <corner-mark :squareIndex="4" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 4)"></corner-mark>
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click="selectProgramme(4)" class="btn-style-two btn130">
                                    选择节目
                                </el-button>
                                <br />
                                <el-button @click="selectProgrammeSubject(4)" class="btn-style-two btn130">
                                    选择节目专题
                                </el-button>
                                <el-button @click="selectProgrammeVideo(4)" class="btn-style-two btn130">
                                    选择视频
                                </el-button>
                                <!-- <el-button @click="selectLink(4)" class="btn-style-two btn130">
                                    选择网页
                                </el-button> -->
                            </div>
                        </div>
                    </div>
                    <div class="wrapper">
                        <div :style="styleBgImageStr(5)" class="bottom-right-field">
                            <corner-mark :squareIndex="5" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 5)"></corner-mark>
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click="selectProgramme(5)" class="btn-style-two btn130">
                                    选择节目
                                </el-button>
                                <br />
                                <el-button @click="selectProgrammeSubject(5)" class="btn-style-two btn130">
                                    选择节目专题
                                </el-button>
                                <el-button @click="selectProgrammeVideo(5)" class="btn-style-two btn130">
                                    选择视频
                                </el-button>
                                <!-- <el-button @click="selectLink(5)" class="btn-style-two btn130">
                                    选择网页
                                </el-button> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <programme-without4-step-dialog :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeDialog"></programme-without4-step-dialog>
        <edit-programme-subject :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeSubjectDialog"></edit-programme-subject>
        <edit-channel :selectChannelSuccessHandler="selectChannelSuccessHandler" ref="selectChannelDialog"></edit-channel>
        <!-- 新增 -->
        <edit-programme-video :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeVideoDialog"></edit-programme-video>
        <link-dialog
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectLinkDialog">
        ></link-dialog>
    </div>
</template>
<script>
import _ from 'lodash';
import {mapGetters, mapMutations} from 'vuex';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
import EditChannel from '../add_edit_module/EditChannel';
import ProgrammeWithout4StepDialog from '../add_edit_module/ProgrammeWithout4StepDialog';
import CornerMark from '../CornerMark';

//  新增
import EditProgrammeVideo from '../add_edit_module/EditProgrammeVideo';
import LinkDialog from '../add_edit_module/LinkDialog';
export default {
    name: 'RecommendFixedModule',
    components: {
        EditProgrammeSubject,
        EditChannel,
        ProgrammeWithout4StepDialog,
        CornerMark,
        //  新增
        EditProgrammeVideo,
        LinkDialog
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
            allowResolutions: [],
            channel: {},
            reqBody: []
        };
    },
    computed: {
        ...mapGetters({
            layout: 'pageLayout/layout',
            selectAll: 'pageLayout/selectAll',
            getLayoutItemCornerMark: 'pageLayout/getLayoutItemCornerMark'
        }),
        getImageUriByKeyAndIndex() {
            return (key, squareIndex) => {
                let {navbarId} = this.$route.params;
                let uri = _.get(this.layout, `${navbarId}.data.0.layoutItemMultiList.${squareIndex}.${key}.uri`);
                return uri;
            };
        },
        styleBgImageStr() {
            return (squareIndex) => {
                let bgStr = `background-image: url(${this.getImageUriByKeyAndIndex('coverImage', squareIndex)})`;
                return bgStr;
            };
        }
    },
    created() {
        let {navbarId} = this.$route.params;
        this.navbarId = navbarId;
        this.$service.getChannelLayout({navBarId: navbarId})
            .then((res) => {
                if (res && res.code === 0) {
                    let obj = res.data.list[0];
                    this.channel = obj && obj.channel ? obj.channel : {};
                }
            });
    },
    methods: {
        ...mapMutations({
            saveLayoutToStore: 'pageLayout/saveLayoutToStore'
        }),
        editFixedModuleHandler() {
            let {navbarId} = this.$route.params;
            this.$router.push({ name: 'EditFixedModule', params: {navbarId, index: 0} });
        },
        selectChannel() {
            this.$refs.selectChannelDialog.showDialog('CHANNEL');
        },
        selectProgramme(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            if (this.squareIndex === 0) {
                this.$refs.selectProgrammeDialog.showDialog('PROGRAMME', 'NEWS');
            } else {
                this.$refs.selectProgrammeDialog.showDialog('PROGRAMME');
            }
        },
        selectProgrammeSubject(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectProgrammeSubjectDialog.showDialog('PROGRAMME_SUBJECT');
        },
        //  新增
        selectProgrammeVideo(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectProgrammeVideoDialog.showDialog('PROGRAMME_VIDEO');
        },
        selectLink(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectLinkDialog.showDialog('Link');
        },
        //  新增结束
        selectFilter(squareIndex) {
            this.squareIndex = squareIndex;
            this.$refs.selectFilterDialog.showDialog('FILTER');
        },
        async saveHandler() {
            let {navbarId} = this.$route.params;
            if (!this.selectAll(navbarId, 0)) {
                this.saveLayoutToStore(navbarId);

                let res = await this.$service.postChannelLayout(this.reqBody);
                if (res && res.code === 0) {
                    console.log('直播频道保存成功');
                } else {
                    this.$message.error('直播频道保存失败');
                }

                this.$message.success('保存成功');
                this.$router.push({ name: 'PageLayout', params: {navbarId} });
            } else {
                this.$message.error('色块必须全部选择');
            }
        },
        selectChannelSuccessHandler(reqBody) {
            let channel = _.get(reqBody, '0.channel');
            this.reqBody = _.cloneDeep(reqBody);
            this.channel = _.cloneDeep(channel);
        },
        setAllowResolutions(squareIndex) {
            switch (squareIndex) {
                case 0:
                    this.allowResolutions = [{width: 560, height: 222}];
                    break;
                case 1:
                case 2:
                    this.allowResolutions = [{width: 860, height: 440}];
                    break;
                case 3:
                case 4:
                case 5:
                    this.allowResolutions = [{width: 560, height: 300}];
                    break;
                default:
                    throw new Error('未知的索引');
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
            height: 24px;
            line-height: 24px;
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
            .left-field-wrapper {
                width: 66.0535%;
                margin-right: 2%;
                .left-field {
                    @include paddingBg(56%);
                    @include btnWrapper();
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
                                color: #6F7480;
                                border-bottom: 1px solid #6F7480;
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
                    background: rgba(46,56,77,0.60);
                    border-radius: 8px;
                    padding: 0 10px;
                }
            }
        }
    }
    .module-row-two {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                flex: 1;
                &:first-child {
                    margin-right: 2%;
                }
                .top-left-field,
                .top-right-field {
                    @include paddingBg(50.94%);
                    @include btnWrapper();
                }
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
                &:nth-child(2) {
                    margin: 0 2%;
                }
                .bottom-left-field,
                .bottom-middle-field,
                .bottom-right-field {
                    @include paddingBg(53.54%);
                    @include btnWrapper();
                }
            }
        }
    }
}
</style>
