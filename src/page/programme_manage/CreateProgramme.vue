<!--添加节目-->
<template>
    <programme-detail :status="0"></programme-detail>
</template>
<script>
    import { mapMutations } from 'vuex';
    import ProgrammeDetail from './ProgrammeDetail';

    export default {
        name: 'CreateProgramme',
        components: {
            ProgrammeDetail
        },
        created() {
            this.resetProgramme();
        },
        methods: {
            ...mapMutations({
                resetProgramme: 'programme/resetProgramme'
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
