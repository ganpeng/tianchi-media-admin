<!-- 编辑节目 -->
<template>
    <programme-detail :status="2"></programme-detail>
</template>
<script>
    import { mapActions, mapMutations } from 'vuex';
    import ProgrammeDetail from './ProgrammeDetail';

    export default {
        name: 'EditProgramme',
        components: {
            ProgrammeDetail
        },
        created() {
            let {id} = this.$route.params;
            this.resetCurrentProgramme();
            this.getProgrammeAndGetProgrammeCategory(id)
                .then(() => {
                    this.getProgrammeVideoListById(id);
                });
        },
        methods: {
            ...mapMutations({
                resetCurrentProgramme: 'programme/resetCurrentProgramme'
            }),
            ...mapActions({
                getProgramme: 'programme/getProgramme',
                getProgrammeVideoListById: 'programme/getProgrammeVideoListById',
                getProgrammeAndGetProgrammeCategory: 'programme/getProgrammeAndGetProgrammeCategory'
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
