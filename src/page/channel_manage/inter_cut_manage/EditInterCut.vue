<!--编辑轮播插播的组件-->
<template>
    <div>
        <div class="content-title">编辑轮播插播</div>
        <inter-cut-form
            status="EDIT_INTER_CUT">
        </inter-cut-form>
    </div>
</template>

<script>
    import InterCutForm from './InterCutForm';

    export default {
        name: 'EditInterCut',
        components: {
            InterCutForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
