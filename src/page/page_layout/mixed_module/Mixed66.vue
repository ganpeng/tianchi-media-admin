<template>
    <div class="mixed66-container">
        <div v-if="!isEdit" class="header layout-square-header">
            <div class="left">
                <img v-if="getIconImageUri(item)" class="icon" :src="getIconImageUri(item)"/>
                <span class="title">{{item.title}}</span>
            </div>
            <div class="right">
                <el-dropdown
                    @command="addLayout($event)" placement="bottom">
                    <el-button class="btn-style-five">
                        <svg-icon icon-class="add"></svg-icon>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="PROGRAMME_SUBJECT">节目专题</el-dropdown-item>
                        <el-dropdown-item command="FIGURE_SUBJECT">人物专题</el-dropdown-item>
                        <el-dropdown-item command="FIGURE">人物模块</el-dropdown-item>
                        <el-dropdown-item command="SPECIAL">特别模块</el-dropdown-item>
                        <el-dropdown-item command="SHUFFLE">混排模块</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button @click="editHandler" class="btn-style-five">
                    <svg-icon icon-class="edit"></svg-icon>
                </el-button>
                <span @click="deleteHandler" class="delete-btn one">
                    <svg-icon icon-class="delete_btn"></svg-icon>
                </span>
            </div>
        </div>
        <div class="content-field">
            <div class="top-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(0)" class="field">
                        <corner-mark :squareIndex="0" :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(0)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(1)" class="field">
                        <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, index, 1)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(1)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(2)" class="field">
                        <corner-mark :squareIndex="2" :cornerMark="getLayoutItemCornerMark(navbarId, index, 2)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(2)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(3)" class="field">
                        <corner-mark :squareIndex="3" :cornerMark="getLayoutItemCornerMark(navbarId, index, 3)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(3)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(4)" class="field">
                        <corner-mark :squareIndex="4" :cornerMark="getLayoutItemCornerMark(navbarId, index, 4)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(4)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(5)" class="field">
                        <corner-mark :squareIndex="5" :cornerMark="getLayoutItemCornerMark(navbarId, index, 5)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(5)"
                        ></shuffle-btn>
                    </div>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(6)" class="field">
                        <corner-mark :squareIndex="6" :cornerMark="getLayoutItemCornerMark(navbarId, index, 6)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(6)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(7)" class="field">
                        <corner-mark :squareIndex="7" :cornerMark="getLayoutItemCornerMark(navbarId, index, 7)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(7)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(8)" class="field">
                        <corner-mark :squareIndex="8" :cornerMark="getLayoutItemCornerMark(navbarId, index, 8)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(8)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(9)" class="field">
                        <corner-mark :squareIndex="9" :cornerMark="getLayoutItemCornerMark(navbarId, index, 9)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(9)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(10)" class="field">
                        <corner-mark :squareIndex="10" :cornerMark="getLayoutItemCornerMark(navbarId, index, 10)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(10)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(11)" class="field">
                        <corner-mark :squareIndex="11" :cornerMark="getLayoutItemCornerMark(navbarId, index, 11)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(11)"
                        ></shuffle-btn>
                    </div>
                </div>
            </div>
        </div>
        <edit-programme
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeDialog">
        </edit-programme>
        <edit-programme-subject
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeSubjectDialog">
        </edit-programme-subject>
        <edit-programme-video
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeVideoDialog">
        </edit-programme-video>
        <link-dialog
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectLinkDialog">
        ></link-dialog>

        <!--  新增加的部分 -->
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

        <!--  2.2.0 新增 -->
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
import ShuffleBtn from './ShuffleBtn';
import EditProgramme from '../add_edit_module/EditProgramme';
import EditProgrammeSubject from '../add_edit_module/EditProgrammeSubject';
import EditProgrammeVideo from '../add_edit_module/EditProgrammeVideo';
import LinkDialog from '../add_edit_module/LinkDialog';
import CornerMark from '../CornerMark';
//  新增加的部分
import PersonSubjectDialog from '../add_edit_module/PersonSubjectDialog';
import EditFilter from '../add_edit_module/EditFilter';
import ChannelDialog from '../add_edit_module/ChannelDialog';

//  2.2.0新增
import SubjectVideo from '../add_edit_module/SubjectVideo';
export default {
    name: 'Mxied66',
    components: {
        ShuffleBtn,
        EditProgramme,
        EditProgrammeSubject,
        EditProgrammeVideo,
        LinkDialog,
        CornerMark,
        //  新增加的部分
        EditFilter,
        PersonSubjectDialog,
        ChannelDialog,

        //  2.2.0新增
        SubjectVideo
    },
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        index: {
            type: Number,
            default: 0
        },
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            navbarId: '',
            squareIndex: 0,
            layoutItemType: '',
            allowResolutions: [{width: 260, height: 380}, {width: 240, height: 350}]
        };
    },
    created() {
        let {navbarId} = this.$route.params;
        this.navbarId = navbarId;
    },
    computed: {
        ...mapGetters({
            getLayoutItemCornerMark: 'pageLayout/getLayoutItemCornerMark',

            //  2.3.0新增
            activeLayout: 'pageLayout/getActiveLayout'
        }),
        getIconImageUri() {
            return (obj) => {
                return _.get(obj, 'iconImage.uri');
            };
        },
        styleBgImageStr() {
            return (squareIndex) => {
                let url = _.get(this.activeLayout, `${this.index}.layoutItemMultiList.${squareIndex}.coverImage.uri`);
                let bgStr = `background-image: url(${url})`;
                return bgStr;
            };
        }
    },
    methods: {
        ...mapMutations({}),
        addShuffleLayout(squareIndex) {
            return (layoutItemType) => {
                if (!this.$authority.isHasAuthority('content:layoutBlock:add')) {
                    return;
                }
                this.squareIndex = squareIndex;
                this.layoutItemType = layoutItemType;
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
                        throw new Error('类型错误');
                }
            };
        },
        addLayout(type) {
            if (!this.$authority.isHasAuthority('content:layoutBlock:add')) {
                return;
            }
            let {navbarId} = this.$route.params;
            let id = _.get(this.activeLayout, `${this.index}.id`);
            switch (type) {
                case 'SHUFFLE':
                    this.$router.push({name: 'ShuffleModule', params: {navbarId, index: this.index, operator: 'add'}, query: {id}});
                    break;
                case 'FIGURE':
                    this.$router.push({name: 'PersonModule', params: {navbarId, index: this.index, operator: 'add'}, query: {id}});
                    break;
                case 'SPECIAL':
                    this.$router.push({name: 'EditSpecialModule', params: {navbarId, index: this.index, operator: 'add'}, query: {id}});
                    break;
                case 'FIGURE_SUBJECT':
                    this.$router.push({name: 'PersonSubjectModule', params: {navbarId, index: this.index, operator: 'add'}, query: {id}});
                    break;
                case 'PROGRAMME_SUBJECT':
                    this.$router.push({name: 'ProgrammeSubjectModule', params: {navbarId, index: this.index, operator: 'add'}, query: {id}});
                    break;
                default:
                    throw new Error('类型错误');
            }
        },
        editHandler() {
            if (!this.$authority.isHasAuthority('content:layoutBlock:put')) {
                return;
            }
            let {navbarId} = this.$route.params;
            let id = _.get(this.activeLayout, `${this.index}.id`);
            this.$router.push({ name: 'ShuffleModule', params: {navbarId, index: this.index, operator: 'edit'}, query: {id} });
        },
        deleteHandler() {
            if (!this.$authority.isHasAuthority('content:layoutBlock:put')) {
                return;
            }
            let id = _.get(this.activeLayout, `${this.index}.id`);
            this.$util.deleteLayoutItemHandler(id);
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
.mixed66-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                flex: 1;
                .field {
                    @include paddingBg(150%);
                }
            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
                .field {
                    @include paddingBg(150%);
                }
            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
        }
    }
}
</style>
