<template>
    <div class="movie-fixed-module-container">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-five">
                <svg-icon icon-class="edit"></svg-icon>
            </el-button>
        </div>
        <div class="content-field">
            <div class="top-field">
                <div id="movie-top-left-field" class="wrapper">
                    <div :style="styleBgImageStr(movieActiveIndex)" class="top-left-field">
                        <corner-mark :squareIndex="movieActiveIndex" :cornerMark="getLayoutItemCornerMark(navbarId, 0, movieActiveIndex)"></corner-mark>
                    </div>
                </div>
                <div class="wrapper">
                    <div class="top-middle-field">
                        <div @click.stop="changeMovieActiveIndex(0)" :class="['top-middle-field-item', movieActiveIndex === 0 ? 'active' : '']">
                            <div class="movie-text-info">
                                <p class="movie-name">
                                    {{getLayoutItemValueByKey('name', 0)}}
                                </p>
                                <p class="movie-desc">
                                    {{getLayoutItemValueByKey('desc', 0)}}
                                </p>
                            </div>
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click.stop="selectProgramme(0)" class="btn-style-two btn130">
                                    选择节目
                                </el-button>
                                <el-button @click.stop="selectProgrammeSubject(0)" class="btn-style-two btn130">
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
                        <div @click.stop="changeMovieActiveIndex(1)" :class="['top-middle-field-item', movieActiveIndex === 1 ? 'active' : '']">
                            <div class="movie-text-info">
                                <p class="movie-name">
                                    {{getLayoutItemValueByKey('name', 1)}}
                                </p>
                                <p class="movie-desc">
                                    {{getLayoutItemValueByKey('desc', 1)}}
                                </p>
                            </div>
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click.stop="selectProgramme(1)" class="btn-style-two btn130">
                                    选择节目
                                </el-button>
                                <el-button @click.stop="selectProgrammeSubject(1)" class="btn-style-two btn130">
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
                        <div @click.stop="changeMovieActiveIndex(2)" :class="['top-middle-field-item', movieActiveIndex === 2 ? 'active' : '']">
                            <div class="movie-text-info">
                                <p class="movie-name">
                                    {{getLayoutItemValueByKey('name', 2)}}
                                </p>
                                <p class="movie-desc">
                                    {{getLayoutItemValueByKey('desc', 2)}}
                                </p>
                            </div>
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click.stop="selectProgramme(2)" class="btn-style-two btn130">
                                    选择节目
                                </el-button>
                                <el-button @click.stop="selectProgrammeSubject(2)" class="btn-style-two btn130">
                                    选择节目专题
                                </el-button>
                                <el-button @click="selectProgrammeVideo(2)" class="btn-style-two btn130">
                                    选择视频
                                </el-button>
                                <el-button @click="selectLink(2)" class="btn-style-two btn130">
                                    选择网页
                                </el-button>
                            </div>
                        </div>
                        <div @click.stop="changeMovieActiveIndex(3)" :class="['top-middle-field-item', movieActiveIndex === 3 ? 'active' : '']">
                            <div class="movie-text-info">
                                <p class="movie-name">
                                    {{getLayoutItemValueByKey('name', 3)}}
                                </p>
                                <p class="movie-desc">
                                    {{getLayoutItemValueByKey('desc', 3)}}
                                </p>
                            </div>
                            <div v-if="isEdit" class="btn-wrapper">
                                <el-button @click.stop="selectProgramme(3)" class="btn-style-two btn130">
                                    选择节目
                                </el-button>
                                <el-button @click.stop="selectProgrammeSubject(3)" class="btn-style-two btn130">
                                    选择节目专题
                                </el-button>
                                <el-button @click="selectProgrammeVideo(3)" class="btn-style-two btn130">
                                    选择视频
                                </el-button>
                                <el-button @click="selectLink(3)" class="btn-style-two btn130">
                                    选择网页
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(4)" class="top-right-field">
                        <corner-mark :squareIndex="4" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 4)"></corner-mark>
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="selectProgramme(4)" class="btn-style-two btn130">
                                选择节目
                            </el-button>
                            <el-button @click="selectProgrammeSubject(4)" class="btn-style-two btn130">
                                选择节目专题
                            </el-button>
                            <el-button @click="selectProgrammeVideo(4)" class="btn-style-two btn130">
                                选择视频
                            </el-button>
                            <el-button @click="selectLink(4)" class="btn-style-two btn130">
                                选择网页
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(5)" class="bottom-left-field">
                        <corner-mark :squareIndex="5" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 5)"></corner-mark>
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="selectProgramme(5)" class="btn-style-two btn130">
                                选择节目
                            </el-button>
                            <el-button @click="selectProgrammeSubject(5)" class="btn-style-two btn130">
                                选择节目专题
                            </el-button>
                            <el-button @click="selectProgrammeVideo(5)" class="btn-style-two btn130">
                                选择视频
                            </el-button>
                            <el-button @click="selectLink(5)" class="btn-style-two btn130">
                                选择网页
                            </el-button>
                        </div>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(6)" class="bottom-right-field">
                        <corner-mark :squareIndex="6" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 6)"></corner-mark>
                        <div v-if="isEdit" class="btn-wrapper">
                            <el-button @click="selectProgramme(6)" class="btn-style-two btn130">
                                选择节目
                            </el-button>
                            <el-button @click="selectProgrammeSubject(6)" class="btn-style-two btn130">
                                选择节目专题
                            </el-button>
                            <el-button @click="selectProgrammeVideo(6)" class="btn-style-two btn130">
                                选择视频
                            </el-button>
                            <el-button @click="selectLink(6)" class="btn-style-two btn130">
                                选择网页
                            </el-button>
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
    name: 'MovieFixedModule',
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
            movieActiveIndex: 0,
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
        getLayoutItemValueByKey() {
            return (key, squareIndex) => {
                return _.get(this.layout, `${this.navbarId}.data.0.layoutItemMultiList.${squareIndex}.${key}`);
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
            this.$refs.selectProgrammeDialog.showDialog('PROGRAMME');
        },
        selectProgrammeSubject(squareIndex) {
            this.squareIndex = squareIndex;
            this.setAllowResolutions(this.squareIndex);
            this.setMovieActiveIndex(this.squareIndex);
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
            this.$refs.selectLinkDialog.showDialog('Link');
        },
        //  新增结束
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
    width: 130px;
    .el-button {
        font-size: 12px;
        margin-top: 5px;
        margin-left: 0;
        height: 24px;
        line-height: 24px;
    }
}
.movie-fixed-module-container {
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
                        cursor: pointer;
                        .btn-wrapper {
                            display: none;
                            @include btnWrapper();
                        }
                        &:hover {
                            background-color: $mainColor;
                            // border: 1px solid #1989FA;
                            .btn-wrapper {
                                display: block;
                            }
                        }
                        &.active {
                            background-color: $mainColor;
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
                        // border: 1px solid #1989FA;
                        .btn-wrapper {
                            display: block;
                        }
                    }
                }
            }
            .movie-text-info {
                position: absolute;
                top: 50%;
                left: 20px;
                text-align: left;
                width: 90%;
                transform: translateY(-50%);
                .movie-name {
                    color: #fff;
                    font-size: 30px;
                    text-overflow:ellipsis;
                    overflow:hidden;
                    white-space:nowrap;
                }
                .movie-desc {
                    color: #f1f1f1;
                    font-size: 24px;
                    text-overflow:ellipsis;
                    overflow:hidden;
                    white-space:nowrap;
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
                        // border: 1px solid #1989FA;
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
