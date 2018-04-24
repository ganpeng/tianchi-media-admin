<!--编辑人物-->
<template>
    <person-detail :status='2'></person-detail>
</template>
<script>
    import PersonDetail from './PersonDetail';
    export default {
        name: 'EditPerson',
        components: {
            PersonDetail
        }
    };
</script>
<style lang="less" scoped>
</style>
