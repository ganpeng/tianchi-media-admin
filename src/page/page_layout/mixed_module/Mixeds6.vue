<template>
    <div class="mixeds6-container">
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
            <div class="wrapper">
                <div :style="styleBgImageStr(0)" class="field">
                    <corner-mark :squareIndex="0" :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                    <shuffle-btn
                        v-if="isEdit"
                        :onlyChannel="false"
                        :hasChannel="true"
                        :addShuffleLayout="addShuffleLayout(0)"
                    ></shuffle-btn>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(1)" class="field">
                    <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, index, 1)"></corner-mark>
                    <shuffle-btn
                        v-if="isEdit"
                        :onlyChannel="false"
                        :hasChannel="true"
                        :addShuffleLayout="addShuffleLayout(1)"
                    ></shuffle-btn>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(2)" class="field">
                    <corner-mark :squareIndex="2" :cornerMark="getLayoutItemCornerMark(navbarId, index, 2)"></corner-mark>
                    <shuffle-btn
                        v-if="isEdit"
                        :onlyChannel="false"
                        :hasChannel="true"
                        :addShuffleLayout="addShuffleLayout(2)"
                    ></shuffle-btn>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(3)" class="field">
                    <corner-mark :squareIndex="3" :cornerMark="getLayoutItemCornerMark(navbarId, index, 3)"></corner-mark>
                    <shuffle-btn
                        v-if="isEdit"
                        :onlyChannel="false"
                        :hasChannel="true"
                        :addShuffleLayout="addShuffleLayout(3)"
                    ></shuffle-btn>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(4)" class="field">
                    <corner-mark :squareIndex="4" :cornerMark="getLayoutItemCornerMark(navbarId, index, 4)"></corner-mark>
                    <shuffle-btn
                        v-if="isEdit"
                        :onlyChannel="false"
                        :hasChannel="true"
                        :addShuffleLayout="addShuffleLayout(4)"
                    ></shuffle-btn>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(5)" class="field">
                    <corner-mark :squareIndex="5" :cornerMark="getLayoutItemCornerMark(navbarId, index, 5)"></corner-mark>
                    <shuffle-btn
                        v-if="isEdit"
                        :onlyChannel="false"
                        :hasChannel="true"
                        :addShuffleLayout="addShuffleLayout(5)"
                    ></shuffle-btn>
                </div>
            </div>
        </div>
        <channel-dialog
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectChannelDialog">
        ></channel-dialog>
        <!-- 新增 -->
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
import ChannelDialog from '../add_edit_module/ChannelDialog';
import CornerMark from '../CornerMark';
//  新增加的部分
import EditFilter from '../add_edit_module/EditFilter';
//  新增部分
import LinkDialog from '../add_edit_module/LinkDialog';
export default {
    name: 'Mixeds6',
    components: {
        ShuffleBtn,
        ChannelDialog,
        CornerMark,
        //  新增加的部分
        EditFilter,

        // 2.2.0新增
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
            layoutItemType: '',
            allowResolutions: [{width: 260, height: 260}]
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
        ...mapMutations({
            deleteLayoutDataByIndex: 'pageLayout/deleteLayoutDataByIndex'
        }),
        addShuffleLayout(squareIndex) {
            return (layoutItemType) => {
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
                    case 'CHANNEL':
                        this.$refs.selectChannelDialog.showDialog('CHANNEL');
                        break;
                        //  新增加的部分
                    case 'FILTER':
                        this.$refs.selectFilterDialog.showDialog();
                        break;
                    default:
                        throw new Error('类型错误');
                }
            };
        },
        addLayout(type) {
            let {navbarId} = this.$route.params;
            this.$util.layoutCommand({navbarId, index: this.index, type, router: this.$router});
        },
        editHandler() {
            let {navbarId} = this.$route.params;
            let id = _.get(this.activeLayout, `${this.index}.id`);
            this.$router.push({ name: 'ShuffleModule', params: {navbarId, index: this.index, operator: 'edit'}, query: {id} });
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
.mixeds6-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        .wrapper {
            flex: 1;
            .field {
                @include paddingBg(100%);
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
}
</style>
