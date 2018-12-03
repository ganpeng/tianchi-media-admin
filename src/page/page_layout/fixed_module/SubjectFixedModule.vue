<template>
    <div class="subject-fixed-module-container">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-two">编辑</el-button>
        </div>
        <div class="content-field">
            <div class="top-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(0)" class="left-field">
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="selectProgramme(0)" class="btn-style-two">
                                选择节目
                            </el-button>
                            <br />
                            <el-button @click="selectProgrammeSubject(0)" class="btn-style-two">
                                选择节目专题
                            </el-button>
                        </div>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(1)" class="right-field">
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="selectProgramme(1)" class="btn-style-two">
                                选择节目
                            </el-button>
                            <br />
                            <el-button @click="selectProgrammeSubject(1)" class="btn-style-two">
                                选择节目专题
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(2)" class="bottom-left-field">
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="selectProgramme(2)" class="btn-style-two">
                                选择节目
                            </el-button>
                            <br />
                            <el-button @click="selectProgrammeSubject(2)" class="btn-style-two">
                                选择节目专题
                            </el-button>
                        </div>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(3)" class="bottom-middle-field">
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="selectProgramme(3)" class="btn-style-two">
                                选择节目
                            </el-button>
                            <br />
                            <el-button @click="selectProgrammeSubject(3)" class="btn-style-two">
                                选择节目专题
                            </el-button>
                        </div>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(4)" class="bottom-right-field">
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="selectProgramme(4)" class="btn-style-two">
                                选择节目
                            </el-button>
                            <br />
                            <el-button @click="selectProgrammeSubject(4)" class="btn-style-two">
                                选择节目专题
                            </el-button>
                        </div>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(5)" class="bottom-right-field">
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="selectProgramme(5)" class="btn-style-two">
                                选择节目
                            </el-button>
                            <br />
                            <el-button @click="selectProgrammeSubject(5)" class="btn-style-two">
                                选择节目专题
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <edit-programme-subject :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeSubjectDialog"></edit-programme-subject>
        <programme-without4-step-dialog :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeDialog"></programme-without4-step-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
import ProgrammeWithout4StepDialog from '../add_edit_module/ProgrammeWithout4StepDialog';
export default {
    name: 'SubjectFixedModule',
    components: {
        EditProgrammeSubject,
        ProgrammeWithout4StepDialog
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
            allowResolutions: []
        };
    },
    computed: {
        ...mapGetters({
            layout: 'pageLayout/layout'
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
            this.$refs.selectProgrammeDialog.showDialog();
        },
        selectProgrammeSubject(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectProgrammeSubjectDialog.showDialog();
        },
        saveHandler() {
            let {navbarId} = this.$route.params;
            this.saveLayoutToStore();
            this.$message.success('保存成功');
            this.$router.push({ name: 'PageLayout', params: {navbarId} });
        },
        setAllowResolutions(squareIndex) {
            switch (squareIndex) {
                case 0:
                    this.allowResolutions = [{width: 1310, height: 472}];
                    break;
                case 1:
                    this.allowResolutions = [{width: 410, height: 472}];
                    break;
                case 2:
                case 3:
                case 4:
                case 5:
                    this.allowResolutions = [{width: 410, height: 216}];
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
        .el-button {
            &:last-child {
                padding: 0 10px;
                margin-top: 10px;
            }
        }
    }
    &:hover {
        .btn-wrapper {
            display: block;
        }
    }
}
.subject-fixed-module-container {
    margin-top: 20px;
    .btn-field {
        margin: 40px 0 10px 0;
    }
    .content-field {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                &:first-child {
                    width: 75.0286%;
                    margin-right: 2%;
                }
                &:last-child {
                    width: 23.4822%
                }
                .left-field {
                    @include paddingBg(36.0305%);
                    @include btnWrapper()
                }
                .right-field {
                    @include paddingBg(115.1219%);
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
