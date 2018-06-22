<!--显示人物-->
<template>
    <div>
        <person-detail :status='1'></person-detail>
    </div>
</template>
<script>
    import PersonDetail from './PersonDetail';
    export default {
        name: 'DisplayPerson',
        components: { PersonDetail }
    };
</script>
<style lang="less" scoped>
</style>
