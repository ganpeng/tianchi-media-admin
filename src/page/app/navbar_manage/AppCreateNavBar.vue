<!--2.0添加栏目组件-->
<template>
    <div>
        <div class="content-title">添加栏目</div>
        <div class="seperator-line"></div>
        <app-nav-bar-form
            status="CREATE">
        </app-nav-bar-form>
    </div>
</template>

<script>
    import AppNavBarForm from './AppNavBarForm';
    export default {
        name: 'AppCreateNavNar',
        components: { AppNavBarForm }
    };
</script>

<style lang="scss" scoped>

</style>
