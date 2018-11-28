<!--新建轮播频道的组件-->
<template>
    <div>
        <div class="content-title">添加轮播频道</div>
        <carousel-channel-form
            status="CREATE_CHANNEL">
        </carousel-channel-form>
    </div>
</template>

<script>
    import CarouselChannelForm from './CarouselChannelForm';

    export default {
        name: 'CreateCarouselChannel',
        components: {
            CarouselChannelForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
