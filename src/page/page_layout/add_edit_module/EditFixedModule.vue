<template>
    <div class="edit-fixed-module-container">
        <div class="content-title">编辑固定模块</div>
        <div class="seperator-line"></div>
        <fixed-layout
            :isEdit="true"
            :layoutTemplate="getLayoutTemplateByNavbarId(navbarId)"
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
            navbarId: this.$route.params.navbarId
        };
    },
    created() {
        this.getNavbarList();
    },
    computed: {
        ...mapGetters({
            getLayoutTemplateByNavbarId: 'pageLayout/getLayoutTemplateByNavbarId'
        })
    },
    methods: {
        ...mapActions({
            getNavbarList: 'pageLayout/getNavbarList'
        })
    }
};
</script>
<style lang="scss" scoped>
</style>
