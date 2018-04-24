<!--显示人物-->
<template>
    <person-detail :status='1'></person-detail>
</template>
<script>
    import PersonDetail from './PersonDetail';
    export default {
        name: 'DisplayPerson',
        components: {
            PersonDetail
        }
    };
</script>
<style lang="less" scoped>
</style>
