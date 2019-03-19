<!--新建轮播插播的组件-->
<template>
    <div>
        <div class="content-title">添加轮播插播</div>
        <inter-cut-form
            status="CREATE_INTER_CUT">
        </inter-cut-form>
    </div>
</template>

<script>
    import InterCutForm from './InterCutForm';

    export default {
        name: 'CreateInterCut',
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
