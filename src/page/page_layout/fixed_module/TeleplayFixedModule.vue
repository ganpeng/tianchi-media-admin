<template>
    <div class="teleplay-fixed-module-container">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-five">
                <svg-icon icon-class="edit"></svg-icon>
            </el-button>
        </div>
        <div class="content-field">
            <div class="top-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(0)" class="left-field">
                        <corner-mark :squareIndex="0" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 0)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(0)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper middle-wrapper">
                    <div :style="styleBgImageStr(1)" class="middle-field">
                        <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 1)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(1)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(2)" class="right-field">
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
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <edit-programme-subject :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeSubjectDialog"></edit-programme-subject>
        <programme-without4-step-dialog
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeDialog"
        ></programme-without4-step-dialog>

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
import {mapGetters, mapMutations, mapActions} from 'vuex';
import _ from 'lodash';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
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
    name: 'TeleplayFixedModule',
    components: {
        EditProgrammeSubject,
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
            squareIndex: 0,
            navbarId: '',
            allowResolutions: []
        };
    },
    async created() {
        try {
            let {navbarId} = this.$route.params;
            this.navbarId = navbarId;
        } catch (err) {
            console.log(err);
        }
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
        selectProgramme(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectProgrammeDialog.showDialog('PROGRAMME');
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
        async saveHandler() {
            try {
                if (!this.$authority.isHasAuthority('content:layoutBlock:add')) {
                    return;
                }
                let {navbarId} = this.$route.params;
                if (!this.selectAll(navbarId, 0)) {
                    let {id} = this.$route.query;
                    if (id) {
                        let layoutBlock = this.activeLayout.find((item) => item.id === id);
                        if (layoutBlock) {
                            let putLayoutBlockRes = await this.$service.putLayoutBlock(id, layoutBlock);
                            if (putLayoutBlockRes && putLayoutBlockRes.code === 0) {
                                this.$message.success('保存成功');
                                this.$router.push({ name: 'PageLayout', params: {navbarId} });
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
                case 2:
                    this.allowResolutions = [{width: 342, height: 472}];
                    break;
                case 1:
                    this.allowResolutions = [{width: 996, height: 472}];
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
.teleplay-fixed-module-container {
    margin-top: 20px;
    .btn-field {
        display: flex;
        justify-content: flex-end;
        margin: 40px 0 10px 0;
    }
    .content-field {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                &:first-child,
                &:last-child {
                    width: 19.3333%
                }
                &.middle-wrapper {
                    flex: 1;
                    margin: 0 2%;
                }
                .left-field {
                    @include paddingBg(138.4236%);
                    @include btnWrapper()
                }
                .middle-field {
                    @include paddingBg(46.6662%);
                    @include btnWrapper()
                }
                .right-field {
                    @include paddingBg(138.4236%);
                    @include btnWrapper()
                }
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
                .bottom-left-field,
                .bottom-middle-field,
                .bottom-right-field {
                    @include paddingBg(53.4534%);
                    @include btnWrapper();
                }

            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
        }
    }
}
</style>
