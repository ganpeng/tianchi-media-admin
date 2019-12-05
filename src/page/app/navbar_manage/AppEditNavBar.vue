<!--2.0编辑栏目组件-->
<template>
    <div>
        <div class="content-title">编辑栏目</div>
        <div class="seperator-line"></div>
        <app-nav-bar-form
            status="EDIT">
        </app-nav-bar-form>
    </div>
</template>

<script>
    import AppNavBarForm from './AppNavBarForm';

    export default {
        name: 'AppEditNavNar',
        components: { AppNavBarForm }
    };
</script>

<style lang="scss" scoped>

</style>
