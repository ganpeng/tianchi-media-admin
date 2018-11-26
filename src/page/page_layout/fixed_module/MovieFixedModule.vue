<template>
    <div class="movie-fixed-module-container">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-two">编辑</el-button>
        </div>
        <div class="content-field">
            <div class="top-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(movieActiveIndex)" class="top-left-field"></div>
                </div>
                <div class="wrapper">
                    <div class="top-middle-field">
                        <div @click.stop="changeMovieActiveIndex(0)" class="top-middle-field-item">
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click.stop="selectProgramme(0)" class="btn-style-two">
                                    选择节目
                                </el-button>
                                <br />
                                <el-button @click.stop="selectProgrammeSubject(0)" class="btn-style-two">
                                    选择节目专题
                                </el-button>
                            </div>
                        </div>
                        <div @click.stop="changeMovieActiveIndex(1)" class="top-middle-field-item">
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click.stop="selectProgramme(1)" class="btn-style-two">
                                    选择节目
                                </el-button>
                                <br />
                                <el-button @click.stop="selectProgrammeSubject(1)" class="btn-style-two">
                                    选择节目专题
                                </el-button>
                            </div>
                        </div>
                        <div @click.stop="changeMovieActiveIndex(2)" class="top-middle-field-item">
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click.stop="selectProgramme(2)" class="btn-style-two">
                                    选择节目
                                </el-button>
                                <br />
                                <el-button @click.stop="selectProgrammeSubject(2)" class="btn-style-two">
                                    选择节目专题
                                </el-button>
                            </div>
                        </div>
                        <div @click.stop="changeMovieActiveIndex(3)" class="top-middle-field-item">
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click.stop="selectProgramme(3)" class="btn-style-two">
                                    选择节目
                                </el-button>
                                <br />
                                <el-button @click.stop="selectProgrammeSubject(3)" class="btn-style-two">
                                    选择节目专题
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(4)" class="top-right-field">
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
            <div class="bottom-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(5)" class="bottom-left-field">
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
                    <div :style="styleBgImageStr(6)" class="bottom-right-field">
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
    name: 'MovieFixedModule',
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
            movieActiveIndex: 0,
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
            this.setMovieActiveIndex(this.squareIndex);
            this.$refs.selectProgrammeDialog.showDialog();
        },
        selectProgrammeVideo(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.setMovieActiveIndex(this.squareIndex);
            this.$refs.selectProgrammeVideoDialog.showDialog();
        },
        changeMovieActiveIndex(index) {
            this.movieActiveIndex = index;
        },
        setMovieActiveIndex(index) {
            if (index === 0 || index === 1 || index === 2 || index === 3) {
                this.movieActiveIndex = index;
            }
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
                case 1:
                case 2:
                case 3:
                    this.allowResolutions = [{width: 996, height: 472}];
                    break;
                case 4:
                    this.allowResolutions = [{width: 342, height: 472}];
                    break;
                case 5:
                case 6:
                    this.allowResolutions = [{width: 860, height: 260}];
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
    border: 1px solid #2A3040;
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
.movie-fixed-module-container {
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
                    width: 56.1904%;
                }
                &:nth-child(2) {
                    width: 22.8571%;
                    margin: 0 0.47619%;
                }
                &:last-child {
                    width: 20%;
                }
                .top-left-field {
                    @include paddingBg(54.2372%);
                }
                .top-middle-field {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 100%;
                    height: 100%;
                    .top-middle-field-item {
                        @include paddingBg(32%);
                        .btn-wrapper {
                            display: none;
                            @include btnWrapper();
                        }
                        &:hover {
                            border: 1px solid #1989FA;
                            .btn-wrapper {
                                display: block;
                            }
                        }
                    }
                }
                .top-right-field {
                    @include paddingBg(152.3809%);
                    .btn-wrapper {
                        display: none;
                        @include btnWrapper();
                    }
                    &:hover {
                        border: 1px solid #1989FA;
                        .btn-wrapper {
                            display: block;
                        }
                    }
                }
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
                &:first-child {
                    margin-right: 2%;
                }
                .bottom-left-field,
                .bottom-right-field {
                    @include paddingBg(30.6201%);
                    .btn-wrapper {
                        display: none;
                        @include btnWrapper();
                    }
                    &:hover {
                        border: 1px solid #1989FA;
                        .btn-wrapper {
                            display: block;
                        }
                    }
                }
            }
        }
    }
}
</style>
