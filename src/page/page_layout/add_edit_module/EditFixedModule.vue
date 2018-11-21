<template>
    <div class="edit-fixed-module-container">
        <div class="content-title">编辑固定模块</div>
        <div class="seperator-line"></div>
        <fixed-layout
            :isEdit="true"
            :layoutTemplate="layoutTemplate"
        ></fixed-layout>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex';
import _ from 'lodash';
import FixedLayout from '../FixedLayout';
export default {
    name: 'EditFixedModule',
    components: {
        FixedLayout
    },
    data() {
        return {};
    },
    created() {
        let {navbarId} = this.$route.params;
        this.getPageLayoutByNavbarId(navbarId);
    },
    computed: {
        ...mapGetters({
            pageLayoutList: 'pageLayout/pageLayoutList'
        }),
        layoutTemplate() {
            return this.pageLayoutList[0] ? _.get(this.pageLayoutList[0], 'layoutTemplate') : '';
        }
    },
    methods: {
        ...mapActions({
            getPageLayoutByNavbarId: 'pageLayout/getPageLayoutByNavbarId'
        })
    }
};
</script>
<style lang="scss" scoped>
</style>
