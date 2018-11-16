<template>
    <div class="error-page-container">
    </div>
</template>
<script>
    export default {
        name: 'ErrorNotFound',
        data() {
            return {};
        },
        methods: {}
    };
</script>
<style scoped lang="less">
.error-page-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('../../assets/img/404.jpg');
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
}
</style>
