<!--2.0编辑栏目组件-->
<template>
    <div>
        <div class="content-title">编辑栏目</div>
        <div class="seperator-line"></div>
        <nav-bar-form
            status="EDIT">
        </nav-bar-form>
    </div>
</template>

<script>
    import NavBarForm from './NavBarForm';

    export default {
        name: 'AppEditNavNar',
        components: {
            NavBarForm
        }
    };
</script>

<style lang="scss" scoped>

</style>
