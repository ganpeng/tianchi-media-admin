<!--新建套餐的组件-->
<template>
    <div>
        <div class="content-title">添加套餐</div>
        <combo-form
            status="CREATE_COMBO">
        </combo-form>
    </div>
</template>

<script>
    import ComboForm from './components/ComboForm';

    export default {
        name: 'CreateCombo',
        components: {
            ComboForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
