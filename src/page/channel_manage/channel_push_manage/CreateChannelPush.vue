<!--新建直播推流的组件-->
<template>
    <div>
        <div class="content-title">添加直播推流</div>
        <channel-push-form
            status="CREATE_CHANNEL_PUSH">
        </channel-push-form>
    </div>
</template>

<script>
    import ChannelPushForm from './ChannelPushForm';

    export default {
        name: 'CreateChannelPush',
        components: {
            ChannelPushForm
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<style lang="scss" scoped>

</style>
