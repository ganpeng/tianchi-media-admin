<template>
    <div id="force-rest-container">
        <modify-password :force='true'></modify-password>
    </div>
</template>

<script>
    import ModifyPassword from '../personal_center/ModifyPassword';

    export default {
        name: 'ForceResetPassword',
        components: {
            ModifyPassword
        },
        data() {
            return {};
        },
        mounted() {

        },
        methods: {}
    };
</script>

<style scoped lang="scss">

    #force-rest-container {
        padding-left: 50px;
        padding-top: 30px;
        height: 100%;
        width: 100%;
        background-color: #1A2233;
    }

</style>
