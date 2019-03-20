<template>
    <div class="news-fixed-module">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-five">
                <svg-icon icon-class="edit"></svg-icon>
            </el-button>
        </div>
        <div class="content-field">
            <div class="top-field">
                <div class="wrapper-top">
                    <div class="wrapper">
                        <div :style="styleBgImageStr(0)" class="top-left-field">
                            <corner-mark :squareIndex="0"></corner-mark>
                            <shuffle-btn
                                v-if="isEdit"
                                :addShuffleLayout="addShuffleLayout(0)"
                            ></shuffle-btn>
                        </div>
                    </div>
                </div>
                <div class="wrapper-top">
                    <div class="top-right-field">
                        <div class="top-right-top-field">
                            <div class="wrapper">
                                <div :style="styleBgImageStr(1)" class="top-right-top-left-field">
                                    <corner-mark :squareIndex="1"></corner-mark>
                                    <shuffle-btn
                                        v-if="isEdit"
                                        :addShuffleLayout="addShuffleLayout(1)"
                                    ></shuffle-btn>
                                </div>
                            </div>
                            <div class="wrapper">
                                <div :style="styleBgImageStr(2)" class="top-right-top-right-field">
                                    <corner-mark :squareIndex="2"></corner-mark>
                                    <shuffle-btn
                                        v-if="isEdit"
                                        :addShuffleLayout="addShuffleLayout(2)"
                                    ></shuffle-btn>
                                </div>
                            </div>
                        </div>
                        <div class="top-right-bottom-field">
                            <div class="wrapper">
                                <div :style="styleBgImageStr(3)" class="top-right-bottom-left-field">
                                    <corner-mark :squareIndex="3"></corner-mark>
                                    <shuffle-btn
                                        v-if="isEdit"
                                        :addShuffleLayout="addShuffleLayout(3)"
                                    ></shuffle-btn>
                                </div>
                            </div>
                            <div class="wrapper">
                                <div :style="styleBgImageStr(4)" class="top-right-bottom-right-field">
                                    <corner-mark :squareIndex="4"></corner-mark>
                                    <shuffle-btn
                                        v-if="isEdit"
                                        :addShuffleLayout="addShuffleLayout(4)"
                                    ></shuffle-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(5)" class="bottom-field-item">
                        <corner-mark :squareIndex="5"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(5)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(6)" class="bottom-field-item">
                        <corner-mark :squareIndex="6"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(6)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(7)" class="bottom-field-item">
                        <corner-mark :squareIndex="7"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(7)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(8)" class="bottom-field-item">
                        <corner-mark :squareIndex="8"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(8)"
                        ></shuffle-btn>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <edit-filter :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectFilterDialog"></edit-filter>
        <edit-programme-video :squareIndex="squareIndex" :layoutItemType="layoutItemType" :allowResolutions="allowResolutions" ref="selectProgrammeVideoDialog"></edit-programme-video>

        <!-- 新增 -->
        <programme-without4-step-dialog :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeDialog"></programme-without4-step-dialog>
        <edit-programme-subject :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeSubjectDialog"></edit-programme-subject>
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
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import EditFilter from '../add_edit_module/EditFilter';
import EditProgrammeVideo from '../add_edit_module/EditProgrammeVideo';
import CornerMark from '../CornerMark';

//  新增
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
import ProgrammeWithout4StepDialog from '../add_edit_module/ProgrammeWithout4StepDialog';
import LinkDialog from '../add_edit_module/LinkDialog';

//  2.2.0新增的逻辑
import ShuffleBtn from '../mixed_module/ShuffleBtn';
import PersonSubjectDialog from '../add_edit_module/PersonSubjectDialog';
import ChannelDialog from '../add_edit_module/ChannelDialog';
import SubjectVideo from '../add_edit_module/SubjectVideo';
export default {
    name: 'NewsFixedModule',
    components: {
        EditFilter,
        EditProgrammeVideo,
        CornerMark,
        //  新增
        ProgrammeWithout4StepDialog,
        EditProgrammeSubject,
        LinkDialog,

        //  2.2.0新增
        ShuffleBtn,
        PersonSubjectDialog,
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
            layoutItemType: '',
            allowResolutions: []
        };
    },
    created() {
        let {navbarId} = this.$route.params;
        this.navbarId = navbarId;
    },
    computed: {
        ...mapGetters({
            layout: 'pageLayout/layout',
            selectAll: 'pageLayout/selectAll'
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
    methods: {
        ...mapMutations({
            saveLayoutToStore: 'pageLayout/saveLayoutToStore'
        }),
        editFixedModuleHandler() {
            let {navbarId} = this.$route.params;
            this.$router.push({ name: 'EditFixedModule', params: {navbarId, index: 0} });
        },
        selectProgrammeVideo(squareIndex) {
            this.squareIndex = squareIndex;
            this.layoutItemType = 'PROGRAMME_LIST';
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectProgrammeVideoDialog.showDialog('PROGRAMME_LIST', 'NEWS');
        },
        selectFilter(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectFilterDialog.showDialog('FILTER');
        },
        //  新增
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
        selectLink(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectLinkDialog.showDialog('LINK');
        },
        //  新增结束
        saveHandler() {
            let {navbarId} = this.$route.params;
            if (!this.selectAll(navbarId, 0)) {
                this.saveLayoutToStore(navbarId);
                this.$message.success('保存成功');
                this.$router.push({ name: 'PageLayout', params: {navbarId} });
            } else {
                this.$message.error('色块必须全部选择');
            }
        },
        addShuffleLayout(squareIndex) {
            return (layoutItemType) => {
                this.squareIndex = squareIndex;
                this.layoutItemType = layoutItemType;
                this.setAllowResolutions(this.squareIndex);
                switch (layoutItemType) {
                    case 'PROGRAMME':
                        this.$refs.selectProgrammeDialog.showDialog('PROGRAMME');
                        break;
                    case 'PROGRAMME_VIDEO':
                        this.layoutItemType = 'PROGRAMME_LIST';
                        this.$refs.selectProgrammeVideoDialog.showDialog('PROGRAMME_LIST', 'NEWS');
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
                    this.allowResolutions = [{width: 860, height: 472}];
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                    this.allowResolutions = [{width: 410, height: 216}];
                    break;
                case 5:
                case 6:
                case 7:
                case 8:
                    this.allowResolutions = [{width: 410, height: 180}];
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
@mixin toggleBtn() {
    .el-button {
        display: none;
    }
    &:hover {
        .el-button {
            display: block;
        }
    }
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

.news-fixed-module {
    margin-top: 20px;
    .btn-field {
        display: flex;
        justify-content: flex-end;
        margin: 40px 0 10px 0;
    }
    .top-field {
        display: flex;
        margin-bottom: 2%;
        .wrapper-top {
            flex: 1;
            &:first-child {
                margin-right: 2%;
            }
            .top-left-field {
                position: relative;
                @include paddingBg(50.998%);
                @include btnWrapper();
            }
            .top-right-field {
                display: flex;
                flex-direction: column;
                .top-right-top-field {
                    margin-bottom: 4%;
                }
                .top-right-top-field,
                .top-right-bottom-field {
                    display: flex;
                    .wrapper {
                        flex: 1;
                        &:first-child {
                            margin-right: 2%;
                        }
                        .top-right-top-left-field,
                        .top-right-top-right-field,
                        .top-right-bottom-left-field,
                        .top-right-bottom-right-field {
                            position: relative;
                            @include paddingBg(48.6748%);
                            @include btnWrapper();
                        }
                    }
                }
            }
        }
    }
    .top-field,
    .bottom-field {
        display: flex;
        .wrapper {
            flex: 1;
            .bottom-field-item {
                position: relative;
                @include paddingBg(44.03292%);
                @include btnWrapper();
                &:hover {
                    .el-button {
                        display: block;
                    }
                }
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
}
</style>
