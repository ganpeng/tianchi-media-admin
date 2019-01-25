<template>
    <div class="mixed4-container">
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
                <div :style="styleBgImageStr(0)" class="field-1">
                    <corner-mark :squareIndex="0" :cornerMark="getLayoutItemCornerMark(navbarId, index, 0)"></corner-mark>
                    <dropdown-btn
                        v-if="isEdit"
                        :addShuffleLayout="addShuffleLayout(0)"
                    ></dropdown-btn>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(1)" class="field-2">
                    <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, index, 1)"></corner-mark>
                    <dropdown-btn
                        v-if="isEdit"
                        :addShuffleLayout="addShuffleLayout(1)"
                    ></dropdown-btn>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(2)" class="field-3">
                    <corner-mark :squareIndex="2" :cornerMark="getLayoutItemCornerMark(navbarId, index, 2)"></corner-mark>
                    <dropdown-btn
                        v-if="isEdit"
                        :addShuffleLayout="addShuffleLayout(2)"
                    ></dropdown-btn>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(3)" class="field-4">
                    <corner-mark :squareIndex="3" :cornerMark="getLayoutItemCornerMark(navbarId, index, 3)"></corner-mark>
                    <dropdown-btn
                        v-if="isEdit"
                        :addShuffleLayout="addShuffleLayout(3)"
                    ></dropdown-btn>
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
    name: 'Mixed4',
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
            allowResolutions: [{width: 410, height: 615}]
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
                switch (layoutItemType) {
                    case 'PROGRAMME':
                        this.$refs.selectProgrammeDialog.showDialog('PROGRAMME');
                        break;
                    case 'ALL':
                        this.$refs.allDialog.showDialog('ALL');
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
.mixed4-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        .wrapper {
            flex: 1;
            .field-1,
            .field-2,
            .field-3,
            .field-4 {
                @include paddingBg(150.4065%);
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
}
</style>
