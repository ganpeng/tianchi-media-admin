<!-- 显示节目 -->
<template>
    <programme-detail :status="1"></programme-detail>
</template>
<script>
    import { mapActions } from 'vuex';
    import ProgrammeDetail from './ProgrammeDetail';

    export default {
        name: 'DisplayProgramme',
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
