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
            this.resetCurrentProgramme();
            // 重置人物的所有数据
            this.resetPerson();
        },
        methods: {
            ...mapMutations({
                resetProgramme: 'programme/resetProgramme',
                resetCurrentProgramme: 'programme/resetCurrentProgramme',
                resetPerson: 'person/resetPerson'
            })
        }
    };
</script>
<style lang="less" scoped>
</style>
