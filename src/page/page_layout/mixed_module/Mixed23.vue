<template>
    <div class="mixed23-container">
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
                    <div :style="styleBgImageStr(0)" class="top-left-field">
                        <corner-mark :squareIndex="0" :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(0)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(1)" class="top-right-field">
                        <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, index, 1)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(1)"
                        ></shuffle-btn>
                    </div>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(2)" class="bottom-left-field">
                        <corner-mark :squareIndex="2" :cornerMark="getLayoutItemCornerMark(navbarId, index, 2)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(2)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(3)" class="bottom-middle-field">
                        <corner-mark :squareIndex="3" :cornerMark="getLayoutItemCornerMark(navbarId, index, 3)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(3)"
                        ></shuffle-btn>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(4)" class="bottom-right-field">
                        <corner-mark :squareIndex="4" :cornerMark="getLayoutItemCornerMark(navbarId, index, 4)"></corner-mark>
                        <shuffle-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(4)"
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
export default {
    name: 'Mixed23',
    components: {
        ShuffleBtn,
        EditProgramme,
        EditProgrammeSubject,
        EditProgrammeVideo,
        LinkDialog,
        CornerMark
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
            allowResolutions: []
        };
    },
    created() {
        let {navbarId} = this.$route.params;
        this.navbarId = navbarId;
    },
    computed: {
        ...mapGetters({
            getLayoutDataByNavbarId: 'pageLayout/getLayoutDataByNavbarId',
            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId',
            getLayoutItemCornerMark: 'pageLayout/getLayoutItemCornerMark'
        }),
        getIconImageUri() {
            return (obj) => {
                return _.get(obj, 'iconImage.uri');
            };
        },
        layoutItem() {
            return (squareIndex) => {
                return this.getLayoutItemByNavbarId(this.navbarId, this.index, squareIndex);
            };
        },
        styleBgImageStr() {
            return (squareIndex) => {
                let uri = _.get(this.layoutItem(squareIndex), 'coverImage.uri');
                let bgStr = `background-image: url(${uri})`;
                return bgStr;
            };
        }
    },
    methods: {
        ...mapMutations({
            deleteLayoutDataByIndex: 'pageLayout/deleteLayoutDataByIndex',
            saveLayoutToStore: 'pageLayout/saveLayoutToStore',
            insertLayoutDataByIndex: 'pageLayout/insertLayoutDataByIndex'
        }),
        addShuffleLayout(squareIndex) {
            return (layoutItemType) => {
                this.squareIndex = squareIndex;
                this.layoutItemType = layoutItemType;
                switch (squareIndex) {
                    case 0:
                    case 1:
                        this.allowResolutions = [{width: 860, height: 260}];
                        break;
                    case 2:
                    case 3:
                    case 4:
                        this.allowResolutions = [{width: 560, height: 300}];
                        break;
                    default:
                        throw new Error('squarIndex索引错误');
                }
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
                    case 'CHANNEL':
                        break;
                    default:
                        throw new Error('layoutItemType类型错误');
                }
            };
        },
        addLayout(type) {
            let {navbarId} = this.$route.params;
            this.$util.layoutCommand({navbarId, index: this.index, type, router: this.$router});
        },
        editHandler() {
            let {navbarId} = this.$route.params;
            this.$router.push({ name: 'ShuffleModule', params: {navbarId, index: this.index, operator: 'edit'} });
        },
        deleteHandler() {
            let {navbarId} = this.$route.params;
            this.$util.deleteLayoutItemHandler({navbarId, index: this.index});
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
.mixed23-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
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
                    @include paddingBg(30.2325%);
                }
            }
        }
        .bottom-field {
            display: flex;
            .wrapper {
                flex: 1;
            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
            .bottom-left-field,
            .bottom-middle-field,
            .bottom-right-field {
                @include paddingBg(53.5714%);
            }
        }
    }
}
</style>
