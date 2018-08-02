<!--页脚组件-->
<template>
    <div class="container">
        <small>2018 ©北京天驰传媒股份有限公司</small>
        <small>地址：北京市东三环中路9号富尔大厦3302/3304</small>
    </div>
</template>

<script>
    export default {
        name: 'VFooter'
    };
</script>

<style scoped lang="scss">
    .container {
        line-height: 64px;
        width: 100%;
        background: url("../../assets/img/footer_bg.png");
    }

    small {
        font-size: $loginFontColor;
    }

    small:first-child {
        margin-right: 148px;
    }

</style>
