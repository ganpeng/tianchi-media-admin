<template>
    <div id="child-fixed-module" class="child-fixed-module">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-five">
                <svg-icon icon-class="edit"></svg-icon>
            </el-button>
        </div>
        <div class="content-field">
            <div class="wrapper">
                <div class="left-field">
                </div>
            </div>
            <div class="wrapper middle-wrapper">
                <div :style="styleBgImageStr(0)" class="middle-field">
                    <corner-mark :squareIndex="0" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 0)"></corner-mark>
                    <div v-if="isEdit" class="btn-wrapper">
                        <el-button @click="selectProgramme(0)" class="btn-style-two btn130">
                            选择节目
                        </el-button>
                        <el-button @click="selectProgrammeSubject(0)" class="btn-style-two btn130">
                            选择节目专题
                        </el-button>
                        <el-button @click="selectProgrammeVideo(0)" class="btn-style-two btn130">
                            选择视频
                        </el-button>
                        <el-button @click="selectLink(0)" class="btn-style-two btn130">
                            选择网页
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(1)" class="right-field">
                    <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 1)"></corner-mark>
                    <div v-if="isEdit" class="btn-wrapper">
                        <el-button @click="selectProgramme(1)" class="btn-style-two btn130">
                            选择节目
                        </el-button>
                        <el-button @click="selectProgrammeSubject(1)" class="btn-style-two btn130">
                            选择节目专题
                        </el-button>
                        <el-button @click="selectProgrammeVideo(1)" class="btn-style-two btn130">
                            选择视频
                        </el-button>
                        <el-button @click="selectLink(1)" class="btn-style-two btn130">
                            选择网页
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <programme-without4-step-dialog :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeDialog"></programme-without4-step-dialog>
        <edit-programme-subject :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeSubjectDialog"></edit-programme-subject>
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
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import ProgrammeWithout4StepDialog from '../add_edit_module/ProgrammeWithout4StepDialog';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
import CornerMark from '../CornerMark';

//  新增
import EditProgrammeVideo from '../add_edit_module/EditProgrammeVideo';
import LinkDialog from '../add_edit_module/LinkDialog';
export default {
    name: 'ChildFixedModule',
    components: {
        ProgrammeWithout4StepDialog,
        EditProgrammeSubject,
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
            squareIndex: 0,
            navbarId: '',
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
    methods: {
        ...mapMutations({
            saveLayoutToStore: 'pageLayout/saveLayoutToStore'
        }),
        editFixedModuleHandler() {
            let {navbarId} = this.$route.params;
            this.$router.push({ name: 'EditFixedModule', params: {navbarId, index: 0} });
        },
        selectProgramme(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectProgrammeDialog.showDialog('PROGRAMME');
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
        selectProgrammeSubject(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectProgrammeSubjectDialog.showDialog('PROGRAMME_SUBJECT');
        },
        selectFilter(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectFilterDialog.showDialog('FILTER');
        },
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
        setAllowResolutions(squareIndex) {
            switch (squareIndex) {
                case 0:
                    this.allowResolutions = [{width: 738, height: 472}];
                    break;
                case 1:
                    this.allowResolutions = [{width: 472, height: 472}];
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
.child-fixed-module {
    margin-top: 20px;
    .btn-field {
        display: flex;
        justify-content: flex-end;
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        .wrapper {
            &:first-child,
            &:last-child {
                width: 26.7552%
            }
            &.middle-wrapper {
                flex: 1;
                margin: 0 2%;
            }
            .left-field {
                @include paddingBg(100%);
                border-radius: 30px;
                background-image: url('../../../assets/img/children_history.png');
                background-size: cover;
            }
            .middle-field {
                @include paddingBg(63%);
                border-radius: 30px;
            }
            .right-field {
                @include paddingBg(100%);
                border-radius: 30px;
            }
            .left-field,
            .middle-field,
            .right-field {
                .btn-wrapper {
                    @include btnWrapper();
                }
                &:hover {
                    .btn-wrapper {
                        display: block;
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss">
#child-fixed-module {
    .mark-container {
        .mask {
            border-radius: 30px;
        }
    }
}
</style>
