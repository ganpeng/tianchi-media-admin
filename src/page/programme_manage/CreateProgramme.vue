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
            // 重置当前节目的所有数据
            this.resetProgramme();
            this.resetCurrentProgramme();
            // 重置人物的所有数据
            this.resetPerson();
            // 重置节目视频的所有数据
            this.resetProgrammeVideoState();
            this.resetCurrentProgrammeVideoObj();
        },
        methods: {
            ...mapMutations({
                resetProgramme: 'programme/resetProgramme',
                resetCurrentProgramme: 'programme/resetCurrentProgramme',
                resetPerson: 'person/resetPerson',
                resetProgrammeVideoState: 'programmeVideo/resetProgrammeVideoState',
                resetCurrentProgrammeVideoObj: 'programme/resetCurrentProgrammeVideoObj'
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
