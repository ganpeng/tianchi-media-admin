<template>
    <div class="education-fixed-module">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-two">编辑</el-button>
        </div>
        <div class="top-field">
            <div class="wrapper">
                <div :style="styleBgImageStr(0)" class="top-left-field">
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
                <div :style="styleBgImageStr(1)" class="top-right-field">
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
                <div :style="styleBgImageStr(5)" class="bottom-field-item">
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
        <edit-programme :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeDialog"></edit-programme>
        <edit-programme-subject :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeSubjectDialog"></edit-programme-subject>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import EditProgramme from '../add_edit_module/EditProgramme';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
import _ from 'lodash';
export default {
    name: 'PartyFixedModule',
    components: {
        EditProgramme,
        EditProgrammeSubject
    },
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
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
    data() {
        return {
            squareIndex: 0,
            layoutItemType: '',
            allowResolutions: []
        };
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

.education-fixed-module {
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
                @include toggleBtn();
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
                            @include toggleBtn();
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
                @include toggleBtn();
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
    .wrapper {
        .btn-style-two {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
</style>
