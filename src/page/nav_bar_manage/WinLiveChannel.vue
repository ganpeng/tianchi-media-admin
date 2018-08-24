<!--内容管理-栏目管理-布局直播窗口组件-->
<template>
    <div class="ab-center win-live">
        <img src="~assets/img/live_win.png">
        <span>点击设置 / 查看</span>
        <label>直播频道
            {{liveChannelList[0] && liveChannelList[0].liveChannel ?
            liveChannelList[0].liveChannel.name : ''}}
        </label>
    </div>
</template>

<script>

    export default {
        name: 'WinLiveChannel',
        props: {
            liveChannelList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {};
        }
    };
</script>

<style lang="scss" scoped>

    .win-live {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: $dynamicGray;
        img {
            display: block;
            margin-bottom: 10px;
            width: 52px;
        }
        span {
            margin-bottom: 10px;
            font-size: $largerFontSize;
            color: $baseBlue;
        }
        label {
            color: $baseAsideColor;
            font-size: $largerFontSize;
        }
    }

</style>
