<template>
    <div class="mixedsn-container">
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
            <div v-for="(item, index) in getLayoutItemMultiList" :key="index" class="wrapper">
                <div :style="styleBgImageStr(index)" class="field">
                    <corner-mark :squareIndex="index"></corner-mark>
                    <div v-if="isEdit" class="shuffle-btn-container">
                        <el-dropdown
                            @command="editFilterLayout($event, index)" placement="bottom">
                            <el-button class="my-add-cycle">
                                <svg-icon icon-class="add"></svg-icon>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="PROGRAMME">筛选</el-dropdown-item>
                                <el-dropdown-item command="LINK">网页</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
            <div v-if="isEdit" @click="addFilterLayout" key="999" class="wrapper add-btn">
                <div class="field">
                    <i class="el-icon-plus"></i>
                </div>
            </div>
        </div>
        <edit-filter
            :isAdd="isAdd"
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectFilterDialog">
        </edit-filter>
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
import EditFilter from '../add_edit_module/EditFilter';
import CornerMark from '../CornerMark';
//  新增部分
import LinkDialog from '../add_edit_module/LinkDialog';
export default {
    name: 'Mixedsn',
    components: {
        EditFilter,
        CornerMark,
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
            isAdd: false,
            navbarId: '',
            squareIndex: 0,
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
        getLayoutItemMultiList() {
            return _.get(this.activeLayout, `${this.index}.layoutItemMultiList`);
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
            deleteLayoutDataByIndex: 'pageLayout/deleteLayoutDataByIndex',
            saveLayoutToStore: 'pageLayout/saveLayoutToStore',
            insertLayoutDataByIndex: 'pageLayout/insertLayoutDataByIndex'
        }),
        editFilterLayout(command, squareIndex) {
            this.isAdd = false;
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
        addFilterLayout() {
            this.isAdd = true;
            this.$refs.selectFilterDialog.showDialog('FILTER');
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
.mixedsn-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        display: flex;
        flex-wrap: wrap;
        .wrapper {
            width: 15%;
            // flex: 0.166666;
            cursor: pointer;
            margin-bottom: 2%;
            .field {
                @include paddingBg(100%);
            }
            i {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 20px;
                color: #3E495E;
            }
            .shuffle-btn-container {
                position: absolute;
                right: 10px;
                top: 2px;
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
        .wrapper {
            &:nth-of-type(6n + 1) {
                margin-left: 0;
            }
        }
        .add-btn {
            border: 1px solid #3E495E;
            border-radius: 8px;
            &:hover {
                border-color: $mainColor;
                i {
                    color: $mainColor;
                }
            }
        }
    }
}
</style>
