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
                            <el-button @click="selectLiveChannel" class="btn-style-two">
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
                            <shuffle-btn
                                v-if="isEdit"
                                :addShuffleLayout="addShuffleLayout(0)"
                            ></shuffle-btn>
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
                            <shuffle-btn
                                v-if="isEdit"
                                :addShuffleLayout="addShuffleLayout(1)"
                            ></shuffle-btn>
                        </div>
                    </div>
                    <div class="wrapper">
                        <div :style="styleBgImageStr(2)" class="top-right-field">
                            <corner-mark :squareIndex="2" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 2)"></corner-mark>
                            <shuffle-btn
                                v-if="isEdit"
                                :addShuffleLayout="addShuffleLayout(2)"
                            ></shuffle-btn>
                        </div>
                    </div>
                </div>
                <div class="bottom-field">
                    <div class="wrapper">
                        <div :style="styleBgImageStr(3)" class="bottom-left-field">
                            <corner-mark :squareIndex="3" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 3)"></corner-mark>
                            <shuffle-btn
                                v-if="isEdit"
                                :addShuffleLayout="addShuffleLayout(3)"
                            ></shuffle-btn>
                        </div>
                    </div>
                    <div class="wrapper">
                        <div :style="styleBgImageStr(4)" class="bottom-middle-field">
                            <corner-mark :squareIndex="4" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 4)"></corner-mark>
                            <shuffle-btn
                                v-if="isEdit"
                                :addShuffleLayout="addShuffleLayout(4)"
                            ></shuffle-btn>
                        </div>
                    </div>
                    <div class="wrapper">
                        <div :style="styleBgImageStr(5)" class="bottom-right-field">
                            <corner-mark :squareIndex="5" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 5)"></corner-mark>
                            <shuffle-btn
                                v-if="isEdit"
                                :addShuffleLayout="addShuffleLayout(5)"
                            ></shuffle-btn>
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
        <edit-channel :selectChannelSuccessHandler="selectChannelSuccessHandler" ref="changeLiveChannelDialog"></edit-channel>
        <!-- 新增 -->
        <edit-programme-video :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeVideoDialog"></edit-programme-video>
        <link-dialog
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectLinkDialog">
        ></link-dialog>

        <!--  2.2.0 新增的逻辑 -->
        <person-subject-dialog
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="personSubjectDialog"
        ></person-subject-dialog>
        <edit-filter
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectFilterDialog">
        ></edit-filter>
        <channel-dialog
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectChannelDialog">
        ></channel-dialog>
        <subject-video
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="subjectVideoDialog"
        ></subject-video>
    </div>
</template>
<script>
import _ from 'lodash';
import {mapGetters, mapMutations, mapActions} from 'vuex';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
import EditChannel from '../add_edit_module/EditChannel';
import ProgrammeWithout4StepDialog from '../add_edit_module/ProgrammeWithout4StepDialog';
import CornerMark from '../CornerMark';

//  新增
import EditProgrammeVideo from '../add_edit_module/EditProgrammeVideo';
import LinkDialog from '../add_edit_module/LinkDialog';

//  2.2.0新增的逻辑
import ShuffleBtn from '../mixed_module/ShuffleBtn';
import PersonSubjectDialog from '../add_edit_module/PersonSubjectDialog';
import EditFilter from '../add_edit_module/EditFilter';
import ChannelDialog from '../add_edit_module/ChannelDialog';
import SubjectVideo from '../add_edit_module/SubjectVideo';
export default {
    name: 'RecommendFixedModule',
    components: {
        EditProgrammeSubject,
        EditChannel,
        ProgrammeWithout4StepDialog,
        CornerMark,
        //  新增
        EditProgrammeVideo,
        LinkDialog,

        //  2.2.0新增
        ShuffleBtn,
        PersonSubjectDialog,
        EditFilter,
        ChannelDialog,
        SubjectVideo
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
            selectAll: 'pageLayout/selectAll',
            getLayoutItemCornerMark: 'pageLayout/getLayoutItemCornerMark',
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
            this.$router.push({ name: 'EditFixedModule', params: {navbarId, index: 0}, query: {id} });
        },
        selectLiveChannel() {
            this.$refs.changeLiveChannelDialog.showDialog('CHANNEL');
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
            this.$refs.selectLinkDialog.showDialog('LINK');
        },
        //  新增结束
        selectFilter(squareIndex) {
            this.squareIndex = squareIndex;
            this.$refs.selectFilterDialog.showDialog('FILTER');
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
                    this.$router.push({ name: 'PageLayout', params: {navbarId: this.navbarId} });
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
        },
        addShuffleLayout(squareIndex) {
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
                    case 'PROGRAMME_VIDEO':
                        this.$refs.selectProgrammeVideoDialog.showDialog('PROGRAMME_VIDEO');
                        break;
                    case 'PROGRAMME_SUBJECT':
                        this.$refs.selectProgrammeSubjectDialog.showDialog('PROGRAMME_SUBJECT');
                        break;
                    case 'LINK':
                        this.$refs.selectLinkDialog.showDialog('LINK');
                        break;
                        //  新增加的部分
                    case 'FIGURE_SUBJECT':
                        this.$refs.personSubjectDialog.showDialog('FIGURE_SUBJECT');
                        break;
                    case 'FILTER':
                        this.$refs.selectFilterDialog.showDialog();
                        break;
                    case 'CHANNEL':
                        this.$refs.selectChannelDialog.showDialog('CHANNEL');
                        break;
                        //  2.2.0新增
                    case 'SUBJECT_VIDEO':
                        this.$refs.subjectVideoDialog.showDialog('SUBJECT_VIDEO');
                        break;
                    default:
                        throw new Error('layoutItemType类型错误');
                }
            };
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
