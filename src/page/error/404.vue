<template>
    <div class="error-page-container">
        <svg-icon icon-class="404_new"></svg-icon>
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
    background-color: #1A2233;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
    .svg-icon {
        width: 100%;
        height: 100%;
    }
}
</style>
