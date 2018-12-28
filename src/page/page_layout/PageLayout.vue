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
                    <el-dropdown-item command="PROGRAMME_SUBJECT">节目专题</el-dropdown-item>
                    <el-dropdown-item command="FIGURE_SUBJECT">人物专题</el-dropdown-item>
                    <el-dropdown-item command="FIGURE">人物模块</el-dropdown-item>
                    <el-dropdown-item command="SPECIAL">特别模块</el-dropdown-item>
                    <el-dropdown-item command="SHUFFLE">混排模块</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <div class="center-btn">
                <el-button class="btn-style-two" @click="saveLayoutHandler">保存</el-button>
                <el-button v-if="getLayoutChangedByNavbarId" class="btn-style-three" @click="clearLayoutHandler">清除修改</el-button>
            </div>

            <el-button @click="showSortViewHandler" :class="['my-add-cycle', layoutList.length <= 0 && 'disabled']">
                <svg-icon icon-class="sort"></svg-icon>
            </el-button>
        </div>
        <transition name="slide-fade">
            <div v-if="sortView" class="layout-sort">
                <div class="header">
                    模块排序
                </div>
                <span @click="closeSortViewHandler" class="delete-btn one close-sort-view-btn">
                    <svg-icon icon-class="delete_btn"></svg-icon>
                </span>
                <div class="layout-sort-list-wrapper">
                    <ul class="index-list">
                        <li v-for="(item, index) in layoutList" :key="index" class="index-item">
                            <span class="index">{{index + 1}}</span>
                        </li>
                    </ul>
                    <draggable element="ul" class="sortable-list" v-model="layoutList">
                        <li v-for="(item, index) in layoutList" :key="index" class="sortable-item">
                            <p class="title">{{item.title}}</p>
                        </li>
                    </draggable>
                </div>
                <div v-if="layoutList.length > 0" class="save-sort">
                    <el-button
                        @click="sortedSaveHandler"
                        class="btn-style-two">
                        确定
                    </el-button>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import FixedLayout from './FixedLayout';
import OtherLayout from './OtherLayout';
import init from '../../util/init';

export default {
    name: 'PageLayout',
    components: {
        FixedLayout,
        OtherLayout,
        draggable
    },
    data() {
        return {
            activeId: '',
            layoutTemplate: '',
            sortView: false
        };
    },
    async mounted() {
        init();
    },
    async created() {
        try {
            let {navbarId} = this.$route.params;
            let res = await this.getNavbarList();
            if (res && res.code === 0) {
                let navbar = this.navbarList.find((navbar) => navbar.id === navbarId);
                this.activeId = navbarId;
                this.layoutTemplate = navbar ? navbar.layoutTemplate : '';
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
                if (this.layout && this.layout[navbarId] && this.layout[navbarId].data) {
                    return this.layout[navbarId].data.filter((item, index) => {
                        return index > 0;
                    });
                } else {
                    return [];
                }
            }
        },
        getLayoutChangedByNavbarId() {
            let {navbarId} = this.$route.params;
            return _.get(this.layout, `${navbarId}.changed`);
        },
        getLayoutRenderTypeByNavbarId() {
            let {navbarId} = this.$route.params;
            return _.get(this.layout, `${navbarId}.renderType`);
        },
        getLayoutTemplateByNavbarId() {
            let {navbarId} = this.$route.params;
            return _.get(this.layout, `${navbarId}.layoutTemplate`);
        },
        navbarStyle() {
            return (navbar) => {
                if (navbar.image) {
                    let {uri, width, height} = _.get(navbar, 'image');
                    let newWidth = parseInt(width) * 42 / height;
                    return `width: ${newWidth}px;height: 62px;background-image: url(${uri});background-repeat: no-repeat;background-position: center center;background-size: auto 50%`;
                } else {
                    return '';
                }
            };
        },
        layoutList: {
            get() {
                let {navbarId} = this.$route.params;
                let data = _.get(this.layout, `${navbarId}.data`);
                if (_.isArray(data)) {
                    return data.filter((item, index) => index > 0);
                } else {
                    return [];
                }
            },
            set(list) {
                let {navbarId} = this.$route.params;
                this.updateSortedList({navbarId, list});
            }
        }
    },
    methods: {
        ...mapMutations({
            insertLayoutDataByIndex: 'pageLayout/insertLayoutDataByIndex',
            updateLayout: 'pageLayout/updateLayout',
            saveLayoutToStore: 'pageLayout/saveLayoutToStore',
            saveLayoutToRemoteServer: 'pageLayout/saveLayoutToRemoteServer',
            toggleChangedByNavbarId: 'pageLayout/toggleChangedByNavbarId',
            updateSortedList: 'pageLayout/updateSortedList'
        }),
        ...mapActions({
            getNavbarList: 'pageLayout/getNavbarList',
            getPageLayoutByNavbarId: 'pageLayout/getPageLayoutByNavbarId',
            savePageLayoutByNavbarId: 'pageLayout/savePageLayoutByNavbarId'
        }),
        setNavBarWidth() {
            let columnsItem = document.querySelectorAll('.columns-item');
            let columnsList = document.querySelector('.columns-list');
            let width = Array.from(columnsItem).reduce((res, curr) => {
                res = res + curr.offsetWidth + 10;
                return res;
            }, 0);
            columnsList.style.width = `${width + 20}px`;
        },
        async columnsTabChangeHandler(id, layoutTemplate) {
            this.activeId = id;
            this.layoutTemplate = layoutTemplate;
            this.$router.push({ name: 'PageLayout', params: {navbarId: id} });
        },
        async saveLayoutHandler() {
            try {
                let {navbarId} = this.$route.params;
                let res = await this.savePageLayoutByNavbarId(this.activeId);
                if (res && res.code === 0) {
                    if (navbarId) {
                        this.saveLayoutToRemoteServer({navbarId, data: res.data});
                    }
                    this.$message.success('保存成功');
                }
            } catch (err) {
                console.log(err);
            }
        },
        async clearLayoutHandler() {
            try {
                let {navbarId} = this.$route.params;
                let res = await this.getPageLayoutByNavbarId(navbarId);
                if (res && res.code === 0) {
                    this.toggleChangedByNavbarId({
                        navbarId,
                        data: res.data
                    });
                }
            } catch (err) {
                console.log(err);
            }
        },
        addLayout(type) {
            let {navbarId} = this.$route.params;
            let index = _.get(this.layout, `${navbarId}.data.length`);
            // let index = this.layout[navbarId].data.length;
            this.$util.layoutCommand({navbarId, index, type, router: this.$router});
        },
        sortedSaveHandler() {
            let {navbarId} = this.$route.params;
            this.saveLayoutToStore(navbarId);
            this.$message.success('模块排序保存成功');
            this.closeSortViewHandler();
        },
        closeSortViewHandler() {
            this.sortView = false;
        },
        showSortViewHandler() {
            if (this.layoutList.length > 0) {
                this.sortView = !this.sortView;
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
    &::-webkit-scrollbar {
        display: none;
    }
    .columns-list {
        .columns-item {
            float: left;
            padding: 0 20px;
            text-align: center;
            margin-right: 10px;
            height: 62px;
            line-height: 62px;
            font-size: 24px;
            color: #6F7480;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            &.active {
                color: #fff;
                border-bottom-color: $mainColor;
            }
            &:hover {
                color: #fff;
                border-bottom-color: $mainColor;
            }
        }
    }
}
.fixed-btn-container {
    display: flex;
    justify-content: space-around;
}

.page-layout-container {
    position: relative;
    .layout-sort {
        position: fixed;
        right: 0;
        bottom: 0;
        top: 60px;
        width: 280px;
        background: linear-gradient(-90deg, rgba(51,68,99,0.90) 0%, rgba(22,28,40,0.90) 100%);
        .header {
            height: 102px;
            line-height: 102px;
            color: #fff;
            font-size: 24px;
        }
        .layout-sort-list-wrapper {
            display: flex;
            position: absolute;
            top: 102px;
            bottom: 80px;
            left: 0;
            right: 0;
            overflow-y: scroll;
            padding-right: 20px;
            .sortable-list {
                flex: 1;
            }
        }
        .index-list {
            .index-item {
                display: flex;
                height: 30px;;
                line-height: 30px;
                margin-bottom: 15px;
                .index {
                    display: inline-block;
                    color: #fff;
                    width: 50px;
                    font-size: 20px;
                    background: rgba(0, 0, 0, 0);
                }
            }
        }
        .sortable-item {
            display: flex;
            height: 30px;;
            line-height: 30px;
            margin-bottom: 15px;
            background: #2A3040;
            border-radius: 4px;
            cursor: pointer;
            .title {
                flex: 1;
                border: 1px solid #637497;
                border-radius: 4px;
                font-size: 14px;
                color: #fff;
                &:hover {
                    border: 1px solid #0062C4;
                }
            }
        }
        .save-sort {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            padding: 0 20px;
            .el-button {
                width: 100%;
            }
        }
        .close-sort-view-btn {
            position: absolute;
            right: 10px;
            top: 32px;
            .svg-icon {
            }
        }
        .sortable-drag {
            background-color: #0062C4;
            border: 1px solid #0062C4;
        }
    }
}

.slide-fade-enter-active {
    transition: all .3s ease;
}

.slide-fade-leave-active {
    transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(280px);
    opacity: 0;
}
</style>
