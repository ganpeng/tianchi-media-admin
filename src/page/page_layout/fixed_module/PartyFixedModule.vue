<template>
    <div class="news-fixed-module">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-two">编辑</el-button>
        </div>
        <div class="top-field">
            <div class="wrapper">
                <div :style="styleBgImageStr(0)" class="top-left-field">
                    <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, 0, 0)"></corner-mark>
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
                <div class="top-right-field">
                    <div class="top-right-top-field">
                        <div class="wrapper">
                            <div :style="styleBgImageStr(1)" class="top-right-top-left-field">
                                <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, 0, 1)"></corner-mark>
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
                        <div class="wrapper">
                            <div :style="styleBgImageStr(2)" class="top-right-top-right-field">
                                <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, 0, 2)"></corner-mark>
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
                    </div>
                    <div class="top-right-bottom-field">
                        <div class="wrapper">
                            <div :style="styleBgImageStr(3)" class="top-right-bottom-left-field">
                                <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, 0, 3)"></corner-mark>
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
                            <div :style="styleBgImageStr(4)" class="top-right-bottom-right-field">
                                <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, 0, 4)"></corner-mark>
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
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-field">
            <div class="wrapper">
                <div :style="styleBgImageStr(5)" class="bottom-field-item">
                    <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, 0, 5)"></corner-mark>
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
            <div class="wrapper">
                <div :style="styleBgImageStr(6)" class="bottom-field-item">
                    <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, 0, 6)"></corner-mark>
                    <div v-if="isEdit" class="btn-wrapper">
                        <el-button @click="selectProgramme(6)" class="btn-style-two">
                            选择节目
                        </el-button>
                        <br />
                        <el-button @click="selectProgrammeSubject(6)" class="btn-style-two">
                            选择节目专题
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(7)" class="bottom-field-item">
                    <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, 0, 7)"></corner-mark>
                    <div v-if="isEdit" class="btn-wrapper">
                        <el-button @click="selectProgramme(7)" class="btn-style-two">
                            选择节目
                        </el-button>
                        <br />
                        <el-button @click="selectProgrammeSubject(7)" class="btn-style-two">
                            选择节目专题
                        </el-button>
                    </div>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(8)" class="bottom-field-item">
                    <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, 0, 8)"></corner-mark>
                    <div v-if="isEdit" class="btn-wrapper">
                        <el-button @click="selectProgramme(8)" class="btn-style-two">
                            选择节目
                        </el-button>
                        <br />
                        <el-button @click="selectProgrammeSubject(8)" class="btn-style-two">
                            选择节目专题
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
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import ProgrammeWithout4StepDialog from '../add_edit_module/ProgrammeWithout4StepDialog';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
import CornerMark from '../CornerMark';
import _ from 'lodash';
export default {
    name: 'PartyFixedModule',
    components: {
        ProgrammeWithout4StepDialog,
        EditProgrammeSubject,
        CornerMark
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
            this.$refs.selectProgrammeDialog.showDialog();
        },
        selectProgrammeSubject(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectProgrammeSubjectDialog.showDialog();
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
                    this.allowResolutions = [{width: 860, height: 472}];
                    break;
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
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

.news-fixed-module {
    margin-top: 20px;
    .btn-field {
        margin: 40px 0 10px 0;
    }
    .top-field {
        display: flex;
        margin-bottom: 2%;
        .wrapper {
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
                            margin-right: 4%;
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
    .bottom-field {
        display: flex;
        .wrapper {
            flex: 1;
            .bottom-field-item {
                position: relative;
                @include paddingBg(48.6748%);
                @include btnWrapper();
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
}
</style>
