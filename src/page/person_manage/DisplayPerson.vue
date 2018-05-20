<!--显示人物-->
<template>
    <div>
        <person-detail :status='1'></person-detail>
    </div>
</template>
<script>
    import { mapActions, mapMutations } from 'vuex';
    import PersonDetail from './PersonDetail';
    export default {
        name: 'DisplayPerson',
        components: {
            PersonDetail
        },
        created() {
            let {id} = this.$route.params;
            this.resetPerson();
            this.getPerson(id);
        },
        methods: {
            ...mapActions({
                getPerson: 'person/getPerson'
            }),
            ...mapMutations({
                resetPerson: 'person/resetPerson'
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
