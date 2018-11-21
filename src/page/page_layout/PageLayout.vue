<template>
    <div class="page-layout-container">
        <div class="columns-container">
            <ul class="columns-list clearfix">
                <li
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
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
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
                    this.activeId = id;
                } else {
                    this.activeId = navbarId;
                }
                this.layoutTemplate = layoutTemplate;
                this.getPageLayoutByNavbarId(this.activeId);
            }
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            navbarList: 'pageLayout/navbarList'
        })
    },
    methods: {
        ...mapActions({
            getNavbarList: 'pageLayout/getNavbarList',
            getPageLayoutByNavbarId: 'pageLayout/getPageLayoutByNavbarId'
        }),
        columnsTabChangeHandler(id, layoutTemplate) {
            this.activeId = id;
            this.layoutTemplate = layoutTemplate;
            this.$router.push({ name: 'PageLayout', params: {navbarId: id} });
            this.getPageLayoutByNavbarId(this.activeId);
        }
    }
};
</script>
<style lang="scss" scoped>
.columns-list {
    .columns-item {
        float: left;
        padding: 0 20px;
        margin: 10px 0;
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
</style>
