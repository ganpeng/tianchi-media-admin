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
                    <add-btn
                        v-if="isEdit"
                        :addLayoutItem="addLayoutItem(0)"
                    ></add-btn>
                </div>
                <div :style="styleBgImageStr(1)" class="field-1">
                    <corner-mark :squareIndex="1" :cornerMark="getLayoutItemCornerMark(navbarId, index, 1)"></corner-mark>
                    <add-btn
                        v-if="isEdit"
                        :addLayoutItem="addLayoutItem(1)"
                    ></add-btn>
                </div>
                <div :style="styleBgImageStr(2)" class="field-1">
                    <corner-mark :squareIndex="2" :cornerMark="getLayoutItemCornerMark(navbarId, index, 2)"></corner-mark>
                    <add-btn
                        v-if="isEdit"
                        :addLayoutItem="addLayoutItem(2)"
                    ></add-btn>
                </div>
            </div>
            <div class="wrapper">
                <div :style="styleBgImageStr(3)" class="field-1">
                    <corner-mark :squareIndex="3" :cornerMark="getLayoutItemCornerMark(navbarId, index, 3)"></corner-mark>
                    <add-btn
                        v-if="isEdit"
                        :addLayoutItem="addLayoutItem(3)"
                    ></add-btn>
                </div>
                <div :style="styleBgImageStr(4)" class="field-1">
                    <corner-mark :squareIndex="4" :cornerMark="getLayoutItemCornerMark(navbarId, index, 4)"></corner-mark>
                    <add-btn
                        v-if="isEdit"
                        :addLayoutItem="addLayoutItem(4)"
                    ></add-btn>
                </div>
                <div :style="styleBgImageStr(5)" class="field-1">
                    <corner-mark :squareIndex="5" :cornerMark="getLayoutItemCornerMark(navbarId, index, 5)"></corner-mark>
                    <add-btn
                        v-if="isEdit"
                        :addLayoutItem="addLayoutItem(5)"
                    ></add-btn>
                </div>
            </div>
        </div>
        <add-programme
            :squareIndex="squareIndex"
            :allowResolutions="allowResolutions"
            ref="selectProgrammeDialog">
        </add-programme>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
import AddBtn from '../AddBtn';
import AddProgramme from '../add_edit_module/AddProgramme';
import CornerMark from '@/page/page_layout/CornerMark';
export default {
    name: 'Mixed33',
    components: { AddBtn, AddProgramme, CornerMark },
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
            allowResolutions: [{width: 384, height: 561}]
        };
    },
    created() {
        let {navbarId} = this.$route.params;
        this.navbarId = navbarId;
    },
    computed: {
        ...mapGetters({
            getLayoutItemCornerMark: 'appPageLayout/getLayoutItemCornerMark',
            //  2.3.0新增
            activeLayout: 'appPageLayout/activeLayout'
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
        addLayoutItem(squareIndex) {
            if (!this.$authority.isHasAuthority('content:layoutBlock:add')) {
                return;
            }
            return (layoutItemType) => {
                this.squareIndex = squareIndex;
                this.layoutItemType = layoutItemType;
                switch (layoutItemType) {
                    case 'PROGRAMME':
                        this.$refs.selectProgrammeDialog.showDialog('PROGRAMME');
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
                    this.$router.push({name: 'AppShuffleModule', params: {navbarId, index: this.index, operator: 'add'}, query: {id}});
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
            this.$router.push({ name: 'AppShuffleModule', params: {navbarId, index: this.index, operator: 'edit'}, query: {id} });
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
.mixed4-container {
    .header {
        margin: 40px 0 10px 0;
    }
    .content-field {
        width: 996px;
        .wrapper {
            display: flex;
            margin-bottom: 1.8%;
            .field-1 {
                flex: 1;
                @include paddingBg(44.97%);
            }
            .field-1 + .field-1 {
                margin-left: 1.8%;
            }
        }
    }
}
</style>
