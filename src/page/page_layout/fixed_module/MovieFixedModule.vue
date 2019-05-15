<template>
    <div class="movie-fixed-module-container">
        <div v-if="!isEdit" class="btn-field text-right">
            <el-button @click="editFixedModuleHandler" class="btn-style-five">
                <svg-icon icon-class="edit"></svg-icon>
            </el-button>
        </div>
        <div class="content-field">
            <div class="top-field">
                <div id="movie-top-left-field" :style="styleBgImageStr(movieActiveIndex)" class="wrapper">
                    <corner-mark :squareIndex="movieActiveIndex" :cornerMark="getLayoutItemCornerMark(navbarId, 0, movieActiveIndex)"></corner-mark>
                </div>
                <div class="wrapper middle-wrapper">
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
                            <shuffle-btn
                                v-if="isEdit"
                                class="movie-add-btn"
                                :addShuffleLayout="addShuffleLayout(0)"
                            ></shuffle-btn>
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
                            <shuffle-btn
                                v-if="isEdit"
                                class="movie-add-btn"
                                :addShuffleLayout="addShuffleLayout(1)"
                            ></shuffle-btn>
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
                            <shuffle-btn
                                v-if="isEdit"
                                class="movie-add-btn"
                                :addShuffleLayout="addShuffleLayout(2)"
                            ></shuffle-btn>
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
                            <shuffle-btn
                                v-if="isEdit"
                                class="movie-add-btn"
                                :addShuffleLayout="addShuffleLayout(3)"
                            ></shuffle-btn>
                        </div>
                    </div>
                </div>
                <div :style="styleBgImageStr(4)" class="wrapper">
                    <corner-mark :squareIndex="4" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 4)"></corner-mark>
                    <shuffle-btn
                        v-if="isEdit"
                        :addShuffleLayout="addShuffleLayout(4)"
                    ></shuffle-btn>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(5)" class="bottom-left-field">
                        <corner-mark :squareIndex="5" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 5)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(5)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(6)" class="bottom-right-field">
                        <corner-mark :squareIndex="6" :cornerMark="getLayoutItemCornerMark(navbarId, 0, 6)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(6)"
                        ></shuffle-btn>
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
import ProgrammeWithout4StepDialog from '../add_edit_module/ProgrammeWithout4StepDialog';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
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
    name: 'MovieFixedModule',
    components: {
        ProgrammeWithout4StepDialog,
        EditProgrammeSubject,
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
            movieActiveIndex: 0,
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
        },
        getLayoutItemValueByKey() {
            return (key, squareIndex) => {
                return _.get(this.activeLayout, `0.layoutItemMultiList.${squareIndex}.${key}`);
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
            let {navbarId} = this.$route.params;
            let id = _.get(this.activeLayout, '0.id');
            this.$router.push({ name: 'EditFixedModule', params: {navbarId, index: 0}, query: {id} });
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
            this.$refs.selectLinkDialog.showDialog('LINK');
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
        async saveHandler() {
            try {
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
                    width: 56.5909%;
                    @include paddingBg(26.8181%);
                }
                &:nth-child(2) {
                    width: 21.5909%;
                    margin-right: 2%;
                    margin-left: 0.2727%;
                    @include paddingBg(26.8181%);
                }
                &:last-child {
                    width: 19.4318%;
                    @include paddingBg(26.8181%);
                }
                .top-middle-field {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    width: 100%;
                    height: 100%;
                    background-color: red;
                    .top-middle-field-item {
                        // @include paddingBg(30.5263%);
                        @include paddingBg(29%);
                        cursor: pointer;
                        color: #6F7480;
                        border-radius: 0;
                        & + .top-middle-field-item {
                            margin-top: 2%;
                        }
                        &:hover {
                            border: 1px solid #1989FA;
                        }
                        &.active {
                            color: #fff;
                            background-color: #293550;
                            border: 1px solid #1989FA;
                        }
                    }
                }
            }
            .middle-wrapper {
                background-color: transparent!important;
                border: none!important;
            }
            .movie-text-info {
                position: absolute;
                top: 50%;
                left: 20px;
                text-align: left;
                width: 90%;
                transform: translateY(-50%);
                .movie-name {
                    font-size: 20px;
                    text-overflow:ellipsis;
                    overflow:hidden;
                    white-space:nowrap;
                }
                .movie-desc {
                    font-size: 16px;
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
                }
            }
        }
    }
}
</style>
