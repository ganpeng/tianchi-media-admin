<template>
    <div id="page-layout-container" class="app-page-layout-container">
        <div id="top"></div>
        <div style="width: 1200px;overflow: hidden;" class="container-wrapper">
            <div class="columns-container wrapper" ref="wrapperBox">
                <ul class="columns-list clearfix content">
                    <li
                        :style="navbarStyle(navbar)"
                        v-for="(navbar) in navbarList"
                        :key="navbar.id"
                        @click="columnsTabChangeHandler(navbar)"
                        :class="['columns-item', activeId === navbar.id ? 'active' : '']">
                        {{navbar.name}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="page-layout-content">
            <fixed-layout
                :layoutTemplate="'M_FS_1'"
            ></fixed-layout>
            <other-layout
                v-for="(item, index) in getNotFixedListByNavbarId"
                :key="index"
                :item="item"
                :index="index + 1"
                :renderType="item.renderType"
                :layoutTemplate="item.layoutTemplate"
            ></other-layout>
            <div id="bottom"></div>
        </div>
        <div class="fixed-btn-container">
            <el-dropdown @command="addLayout($event)" placement="bottom">
                <el-button class="btn-style-two contain-svg-icon">
                    <svg-icon icon-class="add"></svg-icon>&nbsp;&nbsp;添加
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="SHUFFLE">混排模块</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button @click="showSortViewHandler" :class="['layout-sort-btn', 'btn-style-three', layoutList.length <= 0 && 'disabled']">
                <svg-icon icon-class="sort"></svg-icon>&nbsp;&nbsp;排序
            </el-button>
        </div>
        <div class="scroll-btn-container">
            <a class="top-btn" href="#" v-scroll-to="{el: '#top', offset: -50}">
                <i class="el-icon-arrow-up"></i>
            </a>
            <a class="bottom-btn" href="#" v-scroll-to="'#bottom'">
                <i class="el-icon-arrow-down"></i>
            </a>
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
import BScroll from 'better-scroll';

import FixedLayout from './FixedLayout';
import OtherLayout from './OtherLayout';

export default {
    name: 'AppPageLayout',
    components: { draggable, FixedLayout, OtherLayout },
    data() {
        return {
            activeId: '',
            navbarId: '',
            sortView: false
        };
    },
    async mounted() {
        let content = document.querySelector('.content');
        content.addEventListener('scroll', this.toggleTopBottomBtns.bind(this), false);
    },
    async created() {
        try {
            let {navbarId} = this.$route.params;
            this.navbarId = navbarId;
            let res = await this.getAppNavbarList();
            await this.getAppLayoutByNavbarId(navbarId);
            if (res && res.code === 0) {
                this.activeId = navbarId;
                await this.$nextTick();
                this.setNavBarWidth();

                new BScroll(this.$refs.wrapperBox, {  // eslint-disable-line
                    click: true,
                    scrollX: true,
                    eventPassthrough: 'vertical'
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            navbarList: 'appPageLayout/navbarList',
            //  2.3.0 新增
            activeLayout: 'appPageLayout/activeLayout'
        }),
        getNotFixedListByNavbarId() {
            let {navbarId} = this.$route.params;
            if (navbarId === 0) {
                return [];
            } else {
                return this.activeLayout.filter((item, index) => index > 0);
            }
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
                if (_.isArray(this.activeLayout)) {
                    return this.activeLayout.filter((item, index) => index > 0);
                } else {
                    return [];
                }
            },
            set(list) {
                let layout = [this.activeLayout[0], ...list];
                this.setActiveLayout({layout});
            }
        }
    },
    methods: {
        ...mapMutations({
            //  2.3.0 新增的部分
            setActiveLayout: 'appPageLayout/setActiveLayout'
        }),
        ...mapActions({
            getAppNavbarList: 'appPageLayout/getAppNavbarList',
            //  2.3.0 新增的部分
            getAppLayoutByNavbarId: 'appPageLayout/getAppLayoutByNavbarId'
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
        async columnsTabChangeHandler(navbar) {
            try {
                this.setActiveLayout({layout: []});
                this.activeId = navbar.id;
                this.$router.push({ name: 'AppPageLayout', params: {navbarId: navbar.id} });
                await this.getAppLayoutByNavbarId(navbar.id);
            } catch (err) {
                console.log(err);
            }
        },
        addLayout(type) {
            let {navbarId} = this.$route.params;
            let index = this.activeLayout.length;
            switch (type) {
                case 'SHUFFLE':
                    this.$router.push({name: 'AppShuffleModule', params: {navbarId, index, operator: 'add'}});
                    break;
                default:
                    throw new Error('类型错误');
            }
        },
        async sortedSaveHandler() {
            try {
                let layoutBlockSortVoList = this.activeLayout.map((item, index) => {
                    return {
                        layoutBlockId: item.id,
                        sort: index
                    };
                });
                let res = await this.$service.sortAppLayoutBlock(layoutBlockSortVoList);
                if (res && res.code === 0) {
                    this.$message.success('模块排序保存成功');
                    this.closeSortViewHandler();
                }
            } catch (err) {
                console.log(err);
            }
        },
        closeSortViewHandler() {
            this.sortView = false;
        },
        showSortViewHandler() {
            if (!this.$authority.isHasAuthority('content:layoutBlock:sort')) {
                return;
            }

            if (this.layoutList.length > 0) {
                this.sortView = !this.sortView;
            }
        },
        toggleTopBottomBtns() {
            let content = document.querySelector('.content');
            let topBtn = document.querySelector('.top-btn');
            let bottomBtn = document.querySelector('.bottom-btn');
            let isBottom = content.scrollHeight - content.scrollTop === content.clientHeight;
            let isTop = content.scrollTop === 0;
            if (topBtn && bottomBtn) {
                if (isBottom) {
                    topBtn.style.display = 'block';
                    bottomBtn.style.display = 'none';
                }

                if (isTop) {
                    topBtn.style.display = 'none';
                    bottomBtn.style.display = 'block';
                }

                if (!isTop && !isBottom) {
                    topBtn.style.display = 'block';
                    bottomBtn.style.display = 'block';
                }
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
        &:hover {
            background-color: $mainBtnHover;
        }
    }
}

.layout-sort-btn {
    &.el-button {
        color: #1989FA;
        .svg-icon {
            fill: #1989FA;
        }
    }
}

.container-wrapper {
    width: 1200px;
    margin: 0 auto;
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
}

.app-page-layout-container {
    // width: 1200px;
    margin: 0 auto;
    position: relative;
    .layout-sort {
        position: fixed;
        right: 0;
        bottom: 0;
        top: 60px;
        width: 280px;
        background: linear-gradient(-90deg, rgba(51,68,99,0.90) 0%, rgba(22,28,40,0.90) 100%);
        z-index: 10;
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

.scroll-btn-container {
    position: fixed;
    bottom: 10px;
    right: 10px;
    a {
        display: block;
        width: 40px;
        height: 40px;
        background: rgba(65,74,93,0.90);
        box-shadow: 0 2px 10px 0 rgba(0,0,0,0.50);
        border-radius: 20px;
        &:first-child {
            margin-bottom: 10px;
        }
        &:hover {
            background: #0062C4;
        }
        i {
            color: #A3D0FD;
            font-size: 28px;
            line-height: 40px;
        }
    }
}
</style>
<style lang="scss">
.delete-btn {
    .svg-icon {
        fill: #C35757;
    }
    &:hover {
        .svg-icon {
            fill: #D0021B;
        }
    }
}
</style>
