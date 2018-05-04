<!--编辑人物-->
<template>
    <person-detail :person="person" :status='2'></person-detail>
</template>
<script>
    import PersonDetail from './PersonDetail';
    export default {
        name: 'EditPerson',
        components: {
            PersonDetail
        },
        data() {
            return {
                person: {}
            };
        },
        mounted() {
            let {id} = this.$route.params;
            this.$service.getPersonInfo({id})
                .then((res) => {
                    if (res && res.code === 0) {
                        this.person = res.data;
                    }
                });
        }
    };
</script>
<style lang="less" scoped>
</style>
