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
                .then((res) => {
                    this.getProgrammeVideoListById(id);
                    if (res[0] && res[0].code === 0) {
                        this.getVideoFeatureList({id: id, pageSize: res[0].data.featureVideoCount});
                    }
                });
        },
        methods: {
            ...mapMutations({
                resetCurrentProgramme: 'programme/resetCurrentProgramme'
            }),
            ...mapActions({
                getProgramme: 'programme/getProgramme',
                getProgrammeVideoListById: 'programme/getProgrammeVideoListById',
                getProgrammeAndGetProgrammeCategory: 'programme/getProgrammeAndGetProgrammeCategory',
                getVideoFeatureList: 'programmeVideo/getVideoFeatureList'
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
