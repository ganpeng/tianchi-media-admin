<template>
    <div class="mixeds6-container">
        <div class="header layout-square-header">
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
                <div @click="gotoPersonDetail(0)" :style="styleBgImageStr(0)" class="field pointer">
                    <span class="person-name my-ellipsis">{{getPersonName(0)}}</span>
                </div>
            </div>
            <div class="wrapper">
                <div @click="gotoPersonDetail(1)" :style="styleBgImageStr(1)" class="field pointer">
                    <span class="person-name my-ellipsis">{{getPersonName(1)}}</span>
                </div>
            </div>
            <div class="wrapper">
                <div @click="gotoPersonDetail(2)" :style="styleBgImageStr(2)" class="field pointer">
                    <span class="person-name my-ellipsis">{{getPersonName(2)}}</span>
                </div>
            </div>
            <div class="wrapper">
                <div @click="gotoPersonDetail(3)" :style="styleBgImageStr(3)" class="field pointer">
                    <span class="person-name my-ellipsis">{{getPersonName(3)}}</span>
                </div>
            </div>
            <div class="wrapper">
                <div @click="gotoPersonDetail(4)" :style="styleBgImageStr(4)" class="field pointer">
                    <span class="person-name my-ellipsis">{{getPersonName(4)}}</span>
                </div>
            </div>
            <div class="wrapper">
                <div @click="gotoPersonDetail(5)" :style="styleBgImageStr(5)" class="field pointer">
                    <span class="person-name my-ellipsis">{{getPersonName(5)}}</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import _ from 'lodash';
export default {
    name: 'Mixeds6',
    props: {
        item: {
            type: Object,
            default: () => {}
        },
        index: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {};
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
        },
        getPersonName() {
            return (squareIndex) => {
                let name = _.get(this.activeLayout, `${this.index}.layoutItemMultiList.${squareIndex}.name`);
                return name;
            };
        }
    },
    methods: {
        ...mapMutations({}),
        addLayout(type) {
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
            let {navbarId} = this.$route.params;
            let id = _.get(this.activeLayout, `${this.index}.id`);
            this.$router.push({ name: 'PersonModule', params: {navbarId, index: this.index, operator: 'edit'}, query: {id} });
        },
        deleteHandler() {
            let id = _.get(this.activeLayout, `${this.index}.id`);
            this.$util.deleteLayoutItemHandler(id);
        },
        gotoPersonDetail(squareIndex) {
            let id = _.get(this.activeLayout, `${this.index}.layoutItemMultiList.${squareIndex}.id`);
            this.$router.push({ name: 'DisplayPerson', params: { id } });
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
            border-radius: 50%;
            .field {
                @include paddingBg(100%);
                border-radius: 50%;
                .person-name {
                    position: absolute;
                    left: 50%;
                    bottom: -20px;
                    transform: translateX(-50%);
                    width: 100%;
                }
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
}
</style>
