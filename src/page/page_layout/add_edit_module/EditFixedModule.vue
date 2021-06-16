<template>
    <div class="edit-fixed-module-container">
        <div class="content-title">{{editTitle}}</div>
        <div class="seperator-line"></div>
        <fixed-layout
            :isEdit="true"
            :layoutTemplate="layoutTemplate"
        ></fixed-layout>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import FixedLayout from '../FixedLayout';
export default {
    name: 'EditFixedModule',
    components: {
        FixedLayout
    },
    data() {
        return {
            navbarId: '',
            layoutTemplate: ''
        };
    },
    async created() {
        try {
            let {navbarId} = this.$route.params;
            let {id} = this.$route.query;
            this.navbarId = navbarId;
            await this.getNavbarList();
            await this.getLayoutByNavbarId(navbarId);
            this.layoutTemplate = this.getLayoutTemplateByNavbarId(id);
        } catch (err) {
            console.log(err);
        }
    },
    computed: {
        ...mapGetters({
            getLayoutTemplateByNavbarId: 'pageLayout/getLayoutTemplateByNavbarId'
        }),
        editTitle() {
            return this.layoutTemplate === 'FS_9' ? '编辑我的' : '编辑固定模块';
        }
    },
    methods: {
        ...mapActions({
            getNavbarList: 'pageLayout/getNavbarList',
            //  2.3.0 新增的部分
            getLayoutByNavbarId: 'pageLayout/getLayoutByNavbarId'
        })
    }
};
</script>
<style lang="scss" scoped>
</style>
