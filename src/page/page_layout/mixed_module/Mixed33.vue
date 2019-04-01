<template>
    <div class="mixed33-container">
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
                        <el-dropdown
                            v-if="isEdit"
                            class="my-el-dropdown"
                            @command="addShuffleLayout($event, 0)" placement="bottom">
                            <el-button class="my-add-cycle">
                                <svg-icon icon-class="add"></svg-icon>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="CHANNEL">筛选</el-dropdown-item>
                                <el-dropdown-item command="LINK">网页</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(1)" class="top-middle-field">
                        <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                        <el-dropdown
                            v-if="isEdit"
                            class="my-el-dropdown"
                            @command="addShuffleLayout($event, 1)" placement="bottom">
                            <el-button class="my-add-cycle">
                                <svg-icon icon-class="add"></svg-icon>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="CHANNEL">筛选</el-dropdown-item>
                                <el-dropdown-item command="LINK">网页</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(2)" class="top-right-field">
                        <corner-mark :squareIndex="2" :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                        <el-dropdown
                            v-if="isEdit"
                            class="my-el-dropdown"
                            @command="addShuffleLayout($event, 2)" placement="bottom">
                            <el-button class="my-add-cycle">
                                <svg-icon icon-class="add"></svg-icon>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="CHANNEL">筛选</el-dropdown-item>
                                <el-dropdown-item command="LINK">网页</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
            <div class="bottom-field">
                <div class="wrapper">
                    <div :style="styleBgImageStr(3)" class="bottom-left-field">
                        <corner-mark :squareIndex="3" :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                        <el-dropdown
                            v-if="isEdit"
                            class="my-el-dropdown"
                            @command="addShuffleLayout($event, 3)" placement="bottom">
                            <el-button class="my-add-cycle">
                                <svg-icon icon-class="add"></svg-icon>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="CHANNEL">筛选</el-dropdown-item>
                                <el-dropdown-item command="LINK">网页</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(4)" class="bottom-middle-field">
                        <corner-mark :squareIndex="4" :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                        <el-dropdown
                            v-if="isEdit"
                            class="my-el-dropdown"
                            @command="addShuffleLayout($event, 4)" placement="bottom">
                            <el-button class="my-add-cycle">
                                <svg-icon icon-class="add"></svg-icon>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="CHANNEL">筛选</el-dropdown-item>
                                <el-dropdown-item command="LINK">网页</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
                <div class="wrapper">
                    <div :style="styleBgImageStr(5)" class="bottom-right-field">
                        <corner-mark :squareIndex="5" :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                        <el-dropdown
                            v-if="isEdit"
                            class="my-el-dropdown"
                            @command="addShuffleLayout($event, 5)" placement="bottom">
                            <el-button class="my-add-cycle">
                                <svg-icon icon-class="add"></svg-icon>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="CHANNEL">筛选</el-dropdown-item>
                                <el-dropdown-item command="LINK">网页</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
        </div>
        <edit-filter
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectFilterDialog">
        ></edit-filter>

        <!-- 新增部分 -->
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
import EditFilter from '../add_edit_module/EditFilter';
import CornerMark from '../CornerMark';
//  新增部分
import LinkDialog from '../add_edit_module/LinkDialog';
export default {
    name: 'Mixed33',
    components: {
        ShuffleBtn,
        EditFilter,
        CornerMark,
        //  新增
        LinkDialog
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
            allowResolutions: [{width: 560, height: 222}]
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
        addShuffleLayout(command, squareIndex) {
            this.squareIndex = squareIndex;
            if (command === 'LINK') {
                this.$refs.selectLinkDialog.showDialog(command);
            } else {
                this.$refs.selectFilterDialog.showDialog();
            }
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
.mixed33-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        .top-field {
            display: flex;
            margin-bottom: 2%;
            .wrapper {
                flex: 1;
                .top-left-field,
                .top-middle-field,
                .top-right-field {
                    @include paddingBg(39.8809%);
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
                .bottom-left-field,
                .bottom-middle-field,
                .bottom-right-field {
                    @include paddingBg(39.8809%);
                }
            }
            .wrapper + .wrapper {
                margin-left: 2%;
            }
        }
        .my-el-dropdown {
            position: absolute;
            top: 2px;
            right: 10px;
        }
    }
}
</style>
