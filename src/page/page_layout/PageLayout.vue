<template>
    <div class="page-layout-container">
        <div class="columns-container">
            <ul class="columns-list clearfix">
                <li
                    :style="navbarStyle(navbar)"
                    v-for="(navbar) in navbarList"
                    :key="navbar.id"
                    @click="columnsTabChangeHandler(navbar.id, navbar.layoutTemplate)"
                    :class="['columns-item', activeId === navbar.id ? 'active' : '']">
                    {{navbar.name}}
                </li>
            </ul>
        </div>
        <div class="seperator-line"></div>
        <div class="page-layout-content">
            <fixed-layout
                :layoutTemplate="layoutTemplate"
            ></fixed-layout>
            <other-layout
                v-for="(item, index) in getNotFixedListByNavbarId"
                :key="index"
                :item="item"
                :index="index + 1"
                :renderType="item.renderType"
                :layoutTemplate="item.layoutTemplate"
            ></other-layout>
        </div>
        <div class="fixed-btn-container">
            <el-dropdown
                @command="addLayout($event)" placement="bottom">
                <el-button class="my-add-cycle">
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
            <div class="center-btn">
                <el-button class="btn-style-two" @click="saveLayoutHandler">保存</el-button>
                <el-button class="btn-style-three" @click="clearLayoutHandler">清除修改</el-button>
            </div>
            <el-button class="my-add-cycle">
                <svg-icon icon-class="sort"></svg-icon>
            </el-button>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import FixedLayout from './FixedLayout';
import OtherLayout from './OtherLayout';
export default {
    name: 'PageLayout',
    components: {
        FixedLayout,
        OtherLayout
    },
    data() {
        return {
            activeId: '',
            layoutTemplate: ''
        };
    },
    async created() {
        try {
            let {navbarId} = this.$route.params;
            let res = await this.getNavbarList();
            if (res && res.code === 0) {
                if (parseInt(navbarId) === 0) {
                    let {id, layoutTemplate} = res.data[0];
                    this.$router.push({ name: 'PageLayout', params: {navbarId: id} });
                    this.activeId = id;
                    this.layoutTemplate = layoutTemplate;
                } else {
                    let navbar = this.navbarList.find((navbar) => navbar.id === navbarId);
                    this.activeId = navbarId;
                    this.layoutTemplate = navbar ? navbar.layoutTemplate : '';
                }
                //  重新跟新本地数据到vuex中
                this.updateLayout();
                this.$nextTick(() => {
                    this.setNavBarWidth();
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            layout: 'pageLayout/layout',
            navbarList: 'pageLayout/navbarList',
            getNavbarNameById: 'pageLayout/getNavbarNameById'
        }),
        getNotFixedListByNavbarId() {
            let {navbarId} = this.$route.params;
            if (navbarId === 0) {
                return [];
            } else {
                if (this.layout[navbarId].data) {
                    return this.layout[navbarId].data.filter((item, index) => {
                        return index > 0;
                    });
                }
            }
        },
        getLayoutRenderTypeByNavbarId() {
            let {navbarId} = this.$route.params;
            return this.layout[navbarId].renderType;
        },
        getLayoutTemplateByNavbarId() {
            let {navbarId} = this.$route.params;
            return this.layout[navbarId].layoutTemplate;
        },
        navbarStyle() {
            return (navbar) => {
                if (navbar.image) {
                    let {uri, width, height} = _.get(navbar, 'image');
                    return `width: ${width}px;height: ${height}px;background: url(${uri}) no-repeat center center;`;
                } else {
                    return '';
                }
            };
        }
    },
    methods: {
        ...mapMutations({
            insertLayoutDataByIndex: 'pageLayout/insertLayoutDataByIndex',
            updateLayout: 'pageLayout/updateLayout',
            saveLayoutToStore: 'pageLayout/saveLayoutToStore'
        }),
        ...mapActions({
            getNavbarList: 'pageLayout/getNavbarList',
            savePageLayoutByNavbarId: 'pageLayout/savePageLayoutByNavbarId'
        }),
        setNavBarWidth() {
            let columnsItem = document.querySelectorAll('.columns-item');
            let columnsList = document.querySelector('.columns-list');
            let width = Array.from(columnsItem).reduce((res, curr) => {
                res = res + curr.offsetWidth + 10;
                return res;
            }, 0);
            columnsList.style.width = `${width}px`;
        },
        columnsTabChangeHandler(id, layoutTemplate) {
            this.activeId = id;
            this.layoutTemplate = layoutTemplate;
            this.$router.push({ name: 'PageLayout', params: {navbarId: id} });
        },
        async saveLayoutHandler() {
            try {
                let res = await this.savePageLayoutByNavbarId(this.activeId);
                if (res && res.code === 0) {
                    this.$message.success('保存成功');
                }
            } catch (err) {
                console.log(err);
            }
        },
        clearLayoutHandler() {},
        addLayout(type) {
            let {navbarId} = this.$route.params;
            let index = this.layout[navbarId].data.length;
            switch (type) {
                case 'SHUFFLE':
                    this.$router.push({ name: 'PersonModule', params: {navbarId, index, operator: 'add'} });
                    break;
                case 'FIGURE':
                    let layoutData = {
                        layoutTemplate: 'LT_F_6',
                        navBarId: navbarId,
                        navBarName: this.getNavbarNameById(navbarId),
                        subjectId: '',
                        iconImage: {},
                        title: '',
                        renderType: 'FIGURE',
                        layoutItemMultiList: []
                    };
                    this.insertLayoutDataByIndex({navbarId, index, layoutData});
                    this.saveLayoutToStore();
                    this.$router.push({ name: 'PersonModule', params: {navbarId, index, operator: 'add'} });
                    break;
                case 'SPECIAL':
                    this.$router.push({ name: 'EditSpecialModule', params: {navbarId, index, operator: 'add'} });
                    break;
                case 'FIGURE_SUBJECT':
                    this.$router.push({ name: 'PersonModule', params: {navbarId, index, operator: 'add'} });
                    break;
                case 'PROGRAMME':
                    this.$router.push({ name: 'PersonModule', params: {navbarId, index, operator: 'add'} });
                    break;
                case 'PROGRAMME_SUBJECT':
                    this.$router.push({ name: 'PersonModule', params: {navbarId, index, operator: 'add'} });
                    break;
                default:
                    throw new Error('类型错误');
            }
        }
    }
};
</script>
<style lang="scss" scoped>
.my-add-cycle {
    &.el-button {
        width: 30px;
        height: 30px;
        border-radius: 30px;
        min-width: 0;
        background-color: $mainBtn;
        border: none;
        .svg-icon {
            fill: #fff;
        }
        &:hover {
            background-color: $mainBtnHover;
        }
    }
}
.columns-container {
    overflow-x: scroll;
    .columns-list {
        .columns-item {
            float: left;
            padding: 0 20px;
            text-align: center;
            margin: 10px 0;
            margin-right: 10px;
            height: 42px;
            line-height: 42px;
            font-size: 24px;
            color: #6F7480;
            cursor: pointer;
            &.active {
                color: #fff;
            }
            &:hover {
                color: #fff;
            }
        }
    }
}
.fixed-btn-container {
    display: flex;
    justify-content: space-around;
}
</style>
