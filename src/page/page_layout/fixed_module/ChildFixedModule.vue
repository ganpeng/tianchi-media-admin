<template>
    <div class="child-fixed-module">
        <div class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-two">编辑</el-button>
        </div>
        <div class="content-field">
            <div class="wrapper">
                <div class="left-field"></div>
            </div>
            <div class="wrapper middle-wrapper">
                <div :style="styleBgImageStr(0)" class="middle-field">
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
        <div v-if="isEdit" class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveHandler">保存</el-button>
        </div>
        <edit-programme :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeDialog"></edit-programme>
        <edit-programme-subject :squareIndex="squareIndex" :allowResolutions="allowResolutions" ref="selectProgrammeSubjectDialog"></edit-programme-subject>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import EditProgramme from '../add_edit_module/EditProgramme';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
export default {
    name: 'ChildFixedModule',
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
        selectProgrammeVideo(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectProgrammeVideoDialog.showDialog();
        },
        selectFilter(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.$refs.selectFilterDialog.showDialog();
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
.child-fixed-module {
    .btn-field {
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
                .btn-wrapper {
                    @include btnWrapper();
                }
            }
            .middle-field {
                @include paddingBg(63%);
                .btn-wrapper {
                    @include btnWrapper();
                }
            }
            .right-field {
                @include paddingBg(100%);
                .btn-wrapper {
                    @include btnWrapper();
                }
            }
        }
    }
}
</style>
