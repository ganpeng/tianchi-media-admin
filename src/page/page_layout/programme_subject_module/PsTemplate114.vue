<template>
    <div class="mixed114-container">
        <div v-if="!isEdit" class="header layout-square-header">
            <div class="left">
                <img class="icon" :src="getIconImageUri(item)"/>
                <span class="title">{{item.title}}</span>
            </div>
            <div class="right">
                <el-dropdown
                    @command="addLayout($event)" placement="bottom">
                    <el-button class="btn-style-five">
                        <svg-icon icon-class="add"></svg-icon>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="PROGRAMME">节目专题</el-dropdown-item>
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
            <div class="wrapper">
                <div :style="styleBgImageStr(0)" class="left-field">
                    <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                    <dropdown-btn
                        v-if="isEdit"
                        :addShuffleLayout="addShuffleLayout(0)"
                    ></dropdown-btn>
                </div>
            </div>
            <div class="wrapper">
                <div class="right-field">
                    <div :style="styleBgImageStr(1)" class="right-top-field">
                        <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, index, 1)"></corner-mark>
                        <dropdown-btn
                            v-if="isEdit"
                            :addShuffleLayout="addShuffleLayout(1)"
                        ></dropdown-btn>
                    </div>
                    <div class="right-bottom-field">
                        <div class="wrapper">
                            <div :style="styleBgImageStr(2)" class="right-bottom-field-item">
                                <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, index, 2)"></corner-mark>
                                <dropdown-btn
                                    v-if="isEdit"
                                    :addShuffleLayout="addShuffleLayout(2)"
                                ></dropdown-btn>
                            </div>
                        </div>
                        <div class="wrapper">
                            <div :style="styleBgImageStr(3)" class="right-bottom-field-item">
                                <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, index, 3)"></corner-mark>
                                <dropdown-btn
                                    v-if="isEdit"
                                    :addShuffleLayout="addShuffleLayout(3)"
                                ></dropdown-btn>
                            </div>
                        </div>
                        <div class="wrapper">
                            <div :style="styleBgImageStr(4)" class="right-bottom-field-item">
                                <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, index, 4)"></corner-mark>
                                <dropdown-btn
                                    v-if="isEdit"
                                    :addShuffleLayout="addShuffleLayout(4)"
                                ></dropdown-btn>
                            </div>
                        </div>
                        <div class="wrapper">
                            <div :style="styleBgImageStr(5)" class="right-bottom-field-item">
                                <corner-mark :cornerMark="getLayoutItemCornerMark(navbarId, index, 5)"></corner-mark>
                                <dropdown-btn
                                    v-if="isEdit"
                                    :showAll="programmeList.length > 6"
                                    :addShuffleLayout="addShuffleLayout(5)"
                                ></dropdown-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <programme-dialog
            :squareIndex="squareIndex"
            :programmeList="programmeList"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeDialog">
        ></programme-dialog>
        <all-dialog
            :squareIndex="squareIndex"
            :programmeList="programmeList"
            :allowResolutions="allowResolutions"
            ref="allDialog">
        ></all-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import DropdownBtn from './DropdownBtn';
import ProgrammeDialog from './ProgrammeDialog';
import AllDialog from './AllDialog';
import CornerMark from '../CornerMark';
export default {
    name: 'Mixed114',
    components: {
        DropdownBtn,
        ProgrammeDialog,
        AllDialog,
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
        },
        programmeList: {
            type: Array,
            default: () => []
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
                        this.allowResolutions = [{width: 560, height: 730}];
                        break;
                    case 1:
                        this.allowResolutions = [{width: 1160, height: 300}];
                        break;
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                        this.allowResolutions = [{width: 260, height: 380}];
                        break;
                    default:
                        throw new Error('squarIndex索引错误');
                }
                switch (layoutItemType) {
                    case 'PROGRAMME':
                        this.$refs.selectProgrammeDialog.showDialog();
                        break;
                    case 'ALL':
                        this.$refs.allDialog.showDialog();
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
            this.$router.push({ name: 'ProgrammeSubjectModule', params: {navbarId, index: this.index, operator: 'edit'} });
        },
        deleteHandler() {
            let {navbarId} = this.$route.params;
            this.deleteLayoutDataByIndex({navbarId, index: this.index});
            this.saveLayoutToStore();
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
.mixed114-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        .wrapper {
            &:first-child {
                width: 31.8181%;
                .left-field {
                    @include paddingBg(130.3571%);
                }
            }
            &:last-child {
                flex: 1;
                margin-left: 2%;
                .right-field {
                    display: flex;
                    flex-direction: column;
                    .right-top-field {
                        @include paddingBg(25.2620%);
                    }
                    .right-bottom-field {
                        display: flex;
                        flex: 1;
                        margin-top: 2.6%;
                        .wrapper {
                            flex: 1;
                            .right-bottom-field-item {
                                @include paddingBg(150%);
                            }
                        }
                        .wrapper + .wrapper {
                            margin-left: 2.5%;
                        }
                    }
                }
            }
        }
    }
}
</style>
