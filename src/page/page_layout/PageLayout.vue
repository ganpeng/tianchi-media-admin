<template>
    <div class="page-layout-container">
        <div class="columns-container">
            <ul class="columns-list clearfix">
                <li
                    v-for="(navbar) in navbarList"
                    :key="navbar.id"
                    @click="columnsTabChangeHandler(navbar.id)"
                    :class="['columns-item', activeId === navbar.id ? 'active' : '']">
                    {{navbar.name}}
                </li>
            </ul>
        </div>
        <div class="seperator-line"></div>
        <div class="page-layout-content">
            <!-- <recommend-fixed-module></recommend-fixed-module> -->
            <!-- <news-fixed-module></news-fixed-module> -->
            <!-- <child-fixed-module></child-fixed-module> -->
            <!-- <teleplay-fixed-module></teleplay-fixed-module> -->
            <!-- <movie-fixed-module></movie-fixed-module> -->
            <!-- <mixed114></mixed114> -->
            <!-- <mixed23></mixed23> -->
            <!-- <mixed32></mixed32> -->
            <!-- <mixed26></mixed26> -->
            <!-- <mixed33></mixed33> -->
            <!-- <mixed4></mixed4> -->
            <!-- <mixed66></mixed66> -->
            <!-- <mixeds6></mixeds6> -->
            <!-- <person-module></person-module> -->
        </div>
    </div>
</template>
<script>
// import RecommendFixedModule from './fixed_module/RecommendFixedModule';
// import NewsFixedModule from './fixed_module/NewsFixedModule';
// import ChildFixedModule from './fixed_module/ChildFixedModule';
// import TeleplayFixedModule from './fixed_module/TeleplayFixedModule';
// import MovieFixedModule from './fixed_module/MovieFixedModule';
// import Mixed114 from './mixed_module/Mixed114';
// import Mixed32 from './mixed_module/Mixed32';
// import Mixed23 from './mixed_module/Mixed23';
// import Mixed26 from './mixed_module/Mixed26';
// import Mixed33 from './mixed_module/Mixed33';
// import Mixed4 from './mixed_module/Mixed4';
// import Mixed66 from './mixed_module/Mixed66';
// import Mixeds6 from './mixed_module/Mixeds6';
// import PersonModule from './add_edit_module/PersonModule';
import {mapGetters, mapActions} from 'vuex';
export default {
    name: 'PageLayout',
    components: {
        // RecommendFixedModule,
        // ChildFixedModule,
        // TeleplayFixedModule,
        // MovieFixedModule
        // NewsFixedModule
        // Mixed114
        // Mixed23
        // Mixed32
        // Mixed26
        // Mixed33
        // Mixed4
        // Mixed66
        // Mixeds6
        // PersonModule
    },
    data() {
        return {
            activeId: ''
        };
    },
    async created() {
        try {
            let res = await this.getNavbarList();
            if (res && res.code === 0) {
                let {id} = res.data[0];
                this.activeId = id;
                this.getPageLayoutByNavbarId(id);
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
        columnsTabChangeHandler(id) {
            this.activeId = id;
            this.getPageLayoutByNavbarId(id);
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
