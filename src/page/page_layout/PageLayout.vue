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
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" @click="saveLayoutHandler">保存</el-button>
            <el-button class="btn-style-three" @click="clearLayoutHandler">清除修改</el-button>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import _ from 'lodash';
import FixedLayout from './FixedLayout';
export default {
    name: 'PageLayout',
    components: {
        FixedLayout
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
                let {id, layoutTemplate} = res.data[0];
                if (parseInt(navbarId) === 0) {
                    this.$router.push({ name: 'PageLayout', params: {navbarId: id} });
                    this.activeId = id;
                } else {
                    this.activeId = navbarId;
                }
                this.layoutTemplate = layoutTemplate;
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
            navbarList: 'pageLayout/navbarList'
        }),
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
        ...mapActions({
            getNavbarList: 'pageLayout/getNavbarList',
            savePageLayoutByNavbarId: 'pageLayout/savePageLayoutByNavbarId'
        }),
        async init() {
            try {
                let {navbarId} = this.$route.params;
                let res = await this.getNavbarList();
                if (res && res.code === 0) {
                    let {id, layoutTemplate} = res.data[0];
                    if (parseInt(navbarId) === 0) {
                        this.$router.push({ name: 'PageLayout', params: {navbarId: id} });
                        this.activeId = id;
                    } else {
                        this.activeId = navbarId;
                    }
                    this.layoutTemplate = layoutTemplate;
                    this.$nextTick(() => {
                        this.setNavBarWidth();
                    });
                }
            } catch (err) {
                console.log(err);
            }
        },
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
        clearLayoutHandler() {}
    }
};
</script>
<style lang="scss" scoped>
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
</style>
