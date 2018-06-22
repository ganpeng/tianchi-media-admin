<!--新增人物-->
<template>
    <person-detail :status='0'></person-detail>
</template>
<script>
    import PersonDetail from './PersonDetail';
    export default {
        name: 'CreatePerson',
        components: { PersonDetail }
    };
</script>
<style lang="less" scoped>
</style>
