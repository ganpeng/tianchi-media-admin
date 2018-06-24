<!-- 显示节目 -->
<template>
    <programme-detail :status="1"></programme-detail>
</template>
<script>
    import { mapActions, mapMutations } from 'vuex';
    import ProgrammeDetail from './ProgrammeDetail';

    export default {
        name: 'DisplayProgramme',
        components: {
            ProgrammeDetail
        },
        created() {
            let {id} = this.$route.params;
            this.getProgrammeAndGetProgrammeCategory(id)
                .then((res) => {
                    this.getProgrammeVideoListById(id);
                    if (res[0] && res[0].code === 0) {
                        this.getFeatureVideoList({id: id, pageSize: res[0].data.featureVideoCount});
                    }
                });
        },
        methods: {
            ...mapMutations({}),
            ...mapActions({
                getProgramme: 'programme/getProgramme',
                getProgrammeVideoListById: 'programme/getProgrammeVideoListById',
                getProgrammeAndGetProgrammeCategory: 'programme/getProgrammeAndGetProgrammeCategory',
                getFeatureVideoList: 'programme/getFeatureVideoList'
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
