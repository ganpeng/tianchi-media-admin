<!--编辑直播推流的组件-->
<template>
    <div>
        <div class="content-title">编辑直播推流</div>
        <channel-push-form
            status="EDIT_CHANNEL_PUSH">
        </channel-push-form>
    </div>
</template>

<script>
    import ChannelPushForm from './ChannelPushForm';

    export default {
        name: 'EditChannelPush',
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
