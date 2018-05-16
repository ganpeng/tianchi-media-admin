<!-- 编辑节目 -->
<template>
    <programme-detail :status="2"></programme-detail>
</template>
<script>
    import { mapActions } from 'vuex';
    import ProgrammeDetail from './ProgrammeDetail';

    export default {
        name: 'EditProgramme',
        components: {
            ProgrammeDetail
        },
        created() {
            let {id} = this.$route.params;
            this.getProgramme(id);
        },
        methods: {
            ...mapActions({
                getProgramme: 'programme/getProgramme'
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
