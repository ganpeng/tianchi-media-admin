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
                    <span class="person-name">{{getPersonName(0)}}</span>
                </div>
            </div>
            <div class="wrapper">
                <div @click="gotoPersonDetail(1)" :style="styleBgImageStr(1)" class="field pointer">
                    <span class="person-name">{{getPersonName(1)}}</span>
                </div>
            </div>
            <div class="wrapper">
                <div @click="gotoPersonDetail(2)" :style="styleBgImageStr(2)" class="field pointer">
                    <span class="person-name">{{getPersonName(2)}}</span>
                </div>
            </div>
            <div class="wrapper">
                <div @click="gotoPersonDetail(3)" :style="styleBgImageStr(3)" class="field pointer">
                    <span class="person-name">{{getPersonName(3)}}</span>
                </div>
            </div>
            <div class="wrapper">
                <div @click="gotoPersonDetail(4)" :style="styleBgImageStr(4)" class="field pointer">
                    <span class="person-name">{{getPersonName(4)}}</span>
                </div>
            </div>
            <div class="wrapper">
                <div @click="gotoPersonDetail(5)" :style="styleBgImageStr(5)" class="field pointer">
                    <span class="person-name">{{getPersonName(5)}}</span>
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
            layout: 'pageLayout/layout',
            getNavbarNameById: 'pageLayout/getNavbarNameById',
            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId'
        }),
        layoutItem() {
            return (squareIndex) => {
                return this.getLayoutItemByNavbarId(this.navbarId, this.index, squareIndex);
            };
        },
        getIconImageUri() {
            return (obj) => {
                return _.get(obj, 'iconImage.uri');
            };
        },
        styleBgImageStr() {
            return (squareIndex) => {
                let uri = _.get(this.layoutItem(squareIndex), 'coverImage.uri');
                let height = _.get(this.layoutItem(squareIndex), 'coverImage.height');
                let bgStr = `background-image: url(${uri})`;
                if (parseInt(height) === 280) {
                    bgStr = `background-image: url(${uri});padding-bottom: 107.2963%;background-color: transparent;`;
                }
                return bgStr;
            };
        },
        getPersonName() {
            return (squareIndex) => {
                let name = _.get(this.layoutItem(squareIndex), 'name');
                return name;
            }
        }
    },
    methods: {
        ...mapMutations({
            deleteLayoutDataByIndex: 'pageLayout/deleteLayoutDataByIndex',
            saveLayoutToStore: 'pageLayout/saveLayoutToStore',
            insertLayoutDataByIndex: 'pageLayout/insertLayoutDataByIndex'
        }),
        addLayout(type) {
            let {navbarId} = this.$route.params;
            this.$util.layoutCommand({navbarId, index: this.index, type, router: this.$router});
        },
        editHandler() {
            let {navbarId} = this.$route.params;
            this.$router.push({ name: 'PersonModule', params: {navbarId, index: this.index, operator: 'edit'} });
        },
        deleteHandler() {
            let {navbarId} = this.$route.params;
            this.$util.deleteLayoutItemHandler({navbarId, index: this.index});
        },
        gotoPersonDetail(squareIndex) {
            let {navbarId} = this.$route.params;
            let id = _.get(this.layout, `${navbarId}.data.${this.index}.layoutItemMultiList.${squareIndex}.id`);
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
                }
            }
        }
        .wrapper + .wrapper {
            margin-left: 2%;
        }
    }
}
</style>
