<!--编辑轮播频道的组件-->
<template>
    <div>
        <div class="content-title">编辑轮播频道</div>
        <carousel-channel-form
            status="EDIT_CHANNEL">
        </carousel-channel-form>
    </div>
</template>

<script>
    import CarouselChannelForm from './CarouselChannelForm';

    export default {
        name: 'EditCarouselChannel',
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
