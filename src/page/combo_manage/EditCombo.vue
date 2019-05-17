<!--编辑套餐的组件-->
<template>
    <div>
        <div class="content-title">编辑套餐</div>
        <combo-form
            status="EDIT_COMBO">
        </combo-form>
    </div>
</template>

<script>
    import ComboForm from './components/ComboForm';

    export default {
        name: 'EditCombo',
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
