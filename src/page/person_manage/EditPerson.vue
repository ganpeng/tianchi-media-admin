<!--编辑人物-->
<template>
    <person-detail :status='2'></person-detail>
</template>
<script>
    import { mapActions } from 'vuex';
    import PersonDetail from './PersonDetail';
    export default {
        name: 'EditPerson',
        components: {
            PersonDetail
        },
        created() {
            let {id} = this.$route.params;
            this.getPerson(id);
        },
        methods: {
            ...mapActions({
                getPerson: 'person/getPerson'
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
