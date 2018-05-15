<!--新增人物-->
<template>
    <person-detail :status='0'></person-detail>
</template>
<script>
    import { mapMutations } from 'vuex';
    import PersonDetail from './PersonDetail';
    export default {
        name: 'CreatePerson',
        components: {
            PersonDetail
        },
        created() {
            this.resetPerson();
        },
        methods: {
            ...mapMutations({
                resetPerson: 'person/resetPerson'
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
