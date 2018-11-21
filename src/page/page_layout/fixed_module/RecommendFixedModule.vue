<template>
    <div class="recommend-fixed-module-container">
        <div class="module-row-one">
            <div class="btn-field text-right">
                <el-button v-if="!isEdit" @click="editFixedModuleHandler" class="btn-style-two">编辑</el-button>
            </div>
            <div class="content-field">
                <div class="left-field-wrapper">
                    <div class="left-field">
                        <div v-if="isEdit" class="btn-wrapper">
                            <p class="text">设置直播频道</p>
                            <el-button @click="selectChannel" class="btn-style-two">
                                选择
                            </el-button>
                        </div>
                    </div>
                </div>
                <div class="right-field-wrapper">
                    <div class="right-top-field"></div>
                    <div :style="styleBgImageStr(0)" class="right-bottom-field">
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="selectProgramme(0)" class="btn-style-two">
                                选择新闻节目
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="module-row-two">
            <div class="btn-field text-right">
                <el-button v-if="!isEdit" @click="editFixedModuleHandler" class="btn-style-two">编辑</el-button>
            </div>
            <div class="content-field">
                <div class="top-field">
                    <div class="wrapper">
                        <div :style="styleBgImageStr(1)" class="top-left-field">
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
                        <div :style="styleBgImageStr(2)" class="top-right-field">
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
                <div class="bottom-field">
                    <div class="wrapper">
                        <div :style="styleBgImageStr(3)" class="bottom-left-field">
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
                        <div :style="styleBgImageStr(4)" class="bottom-middle-field">
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
        </div>
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <edit-programme :squareIndex="squareIndex" ref="selectProgrammeDialog"></edit-programme>
        <edit-programme-subject :squareIndex="squareIndex" ref="selectProgrammeSubjectDialog"></edit-programme-subject>
    </div>
</template>
<script>
import _ from 'lodash';
import {mapGetters, mapMutations} from 'vuex';
import EditProgramme from '../add_edit_module/EditProgramme';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
export default {
    name: 'RecommendFixedModule',
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
            squareIndex: 0
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
        selectChannel() {},
        selectProgramme(squareIndex) {
            this.squareIndex = squareIndex;
            if (this.squareIndex === 0) {
                this.$refs.selectProgrammeDialog.showDialog('NEWS');
            } else {
                this.$refs.selectProgrammeDialog.showDialog();
            }
        },
        selectProgrammeSubject(squareIndex) {
            this.squareIndex = squareIndex;
            this.$refs.selectProgrammeSubjectDialog.showDialog();
        },
        selectFilter(squareIndex) {
            this.squareIndex = squareIndex;
            this.$refs.selectFilterDialog.showDialog();
        },
        saveHandler() {
            let {navbarId} = this.$route.params;
            this.saveLayoutToStore();
            this.$message.success('保存成功');
            this.$router.push({ name: 'PageLayout', params: {navbarId} });
        }
    }
};
</script>
<style lang="scss" scoped>
@mixin paddingBg($paddingNum) {
    height: 0;
    padding-bottom: $paddingNum;
    background: #2A3040;
    border-radius: 8px;
}
.recommend-fixed-module-container {
    .btn-field {
        margin: 40px 0 10px 0;
    }
    .module-row-one {
        .content-field {
            display: flex;
            .left-field-wrapper {
                width: 66.0535%;
                margin-right: 2%;
                .left-field {
                    position: relative;
                    @include paddingBg(56%);
                    .btn-wrapper {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        .text {
                            font-size: 24px;
                            color: #6F7480;
                            height: 46px;
                            line-height: 46px;
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
                }
                .right-bottom-field {
                    position: relative;
                    @include paddingBg(39.7368%);
                    .btn-wrapper {
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
                    position: relative;
                    @include paddingBg(50.94%);
                    .btn-wrapper {
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
                    position: relative;
                    @include paddingBg(53.54%);
                    .btn-wrapper {
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
                }
            }
        }
    }
}
</style>
