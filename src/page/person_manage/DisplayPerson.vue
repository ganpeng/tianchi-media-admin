<!--显示人物-->
<template>
    <person-detail :person="person" :status='1'></person-detail>
</template>
<script>
    import PersonDetail from './PersonDetail';
    export default {
        name: 'DisplayPerson',
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
