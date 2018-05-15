<!--显示人物-->
<template>
    <div>
        <person-detail :status='1'></person-detail>
    </div>
</template>
<script>
    import { mapActions } from 'vuex';
    import PersonDetail from './PersonDetail';
    export default {
        name: 'DisplayPerson',
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
