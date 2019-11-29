<!--2.0添加栏目组件-->
<template>
    <div>
        <div class="content-title">添加栏目</div>
        <div class="seperator-line"></div>
        <nav-bar-form
            status="CREATE">
        </nav-bar-form>
    </div>
</template>

<script>
    import NavBarForm from './NavBarForm';

    export default {
        name: 'AppCreateNavNar',
        components: {
            NavBarForm
        }
    };
</script>

<style lang="scss" scoped>

</style>
